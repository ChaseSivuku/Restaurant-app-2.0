#!/usr/bin/env node

/**
 * Script to upload food images to Supabase storage and add metadata to database
 * 
 * Usage: node scripts/upload-food-items.js
 * 
 * Requirements:
 * - .env file in root with EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY
 * - Storage bucket named 'food-images' in Supabase (must be public)
 * - Categories table must exist
 */

import { createClient } from '@supabase/supabase-js';
import { readdir, readFile } from 'fs/promises';
import { join, extname, basename } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Get Supabase credentials
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Error: Missing Supabase credentials in .env file');
  console.error('Required: EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);
const STORAGE_BUCKET = 'food-images';
const FOOD_IMAGES_DIR = join(rootDir, 'assets', 'images', 'food');

// Category mapping based on filename patterns
const categorizeItem = (filename) => {
  const lower = filename.toLowerCase();
  
  // Drinks
  if (lower.includes('coffee') || lower.includes('cappuccino') || lower.includes('latte') || 
      lower.includes('macha') || lower.includes('frappe') || lower.includes('juice') ||
      lower.includes('lemonade') || lower.includes('cola') || lower.includes('pepsi') ||
      lower.includes('cooler') || lower.includes('cocktail')) {
    return 'Drinks';
  }
  
  // Alcohol
  if (lower.includes('beer') || lower.includes('heineken') || lower.includes('bloody') ||
      lower.includes('margarita') || lower.includes('daquiri') || lower.includes('negroni') ||
      lower.includes('monster') || lower.includes('sapphire') || lower.includes('colada')) {
    return 'Alcohol';
  }
  
  // Desserts
  if (lower.includes('cake') || lower.includes('pie') || lower.includes('donut') ||
      lower.includes('brownie') || lower.includes('biscuit') || lower.includes('cream') ||
      lower.includes('scones') || lower.includes('eggs-dessert') || lower.includes('blaze')) {
    return 'Desserts';
  }
  
  // Starters
  if (lower.includes('platter') || lower.includes('skewers') || lower.includes('samosa') ||
      lower.includes('strips') || lower.includes('chips') && !lower.includes('burger') && !lower.includes('chicken-and')) {
    return 'Starters';
  }
  
  // Mains (default)
  return 'Mains';
};

// Generate food name from filename
const generateFoodName = (filename) => {
  // Remove extension and common suffixes
  let name = basename(filename, extname(filename))
    .replace(/-removebg-preview/gi, '')
    .replace(/removebg-preview/gi, '')
    .replace(/pexels-[^-]+-/gi, '')
    .replace(/-/g, ' ')
    .trim();
  
  // Capitalize first letter of each word
  name = name.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
  
  // Fix common issues
  name = name.replace(/\bAnd\b/gi, 'and');
  name = name.replace(/\bWith\b/gi, 'with');
  
  return name;
};

// Generate description from name
const generateDescription = (name) => {
  const descriptions = {
    'burger': 'Juicy burger served with fresh ingredients',
    'pizza': 'Delicious pizza with premium toppings',
    'chicken': 'Tender chicken prepared to perfection',
    'pasta': 'Fresh pasta with rich, flavorful sauce',
    'ramen': 'Authentic ramen with savory broth',
    'taco': 'Crispy tacos filled with fresh ingredients',
    'sushi': 'Fresh sushi prepared by expert chefs',
    'stew': 'Hearty stew cooked to perfection',
    'coffee': 'Rich, aromatic coffee',
    'cake': 'Decadent cake made with premium ingredients',
    'pie': 'Homemade pie with fresh ingredients',
  };
  
  const lower = name.toLowerCase();
  for (const [key, desc] of Object.entries(descriptions)) {
    if (lower.includes(key)) {
      return desc;
    }
  }
  
  return `Delicious ${name.toLowerCase()} made with fresh, quality ingredients`;
};

// Generate price based on category and item
const generatePrice = (category, name) => {
  const lower = name.toLowerCase();
  
  // Alcohol - higher prices
  if (category === 'Alcohol') {
    if (lower.includes('beer') || lower.includes('heineken')) return 35;
    if (lower.includes('cocktail') || lower.includes('daquiri') || lower.includes('margarita')) return 85;
    return 65;
  }
  
  // Desserts
  if (category === 'Desserts') {
    if (lower.includes('cake')) return 75;
    if (lower.includes('pie')) return 65;
    return 45;
  }
  
  // Drinks
  if (category === 'Drinks') {
    if (lower.includes('coffee') || lower.includes('latte') || lower.includes('cappuccino')) return 35;
    if (lower.includes('juice') || lower.includes('cooler')) return 25;
    return 20;
  }
  
  // Starters
  if (category === 'Starters') {
    if (lower.includes('platter')) return 95;
    if (lower.includes('skewers')) return 75;
    return 45;
  }
  
  // Mains
  if (lower.includes('burger')) return 85;
  if (lower.includes('pizza')) return 95;
  if (lower.includes('ramen') || lower.includes('pasta')) return 75;
  if (lower.includes('chicken') && !lower.includes('strips')) return 65;
  if (lower.includes('stew')) return 75;
  if (lower.includes('taco')) return 55;
  if (lower.includes('sushi')) return 125;
  
  return 65; // Default price
};

// Get or create category
async function getOrCreateCategory(categoryName) {
  // Check if category exists
  const { data: existing } = await supabase
    .from('categories')
    .select('id')
    .eq('name', categoryName)
    .single();
  
  if (existing) {
    return existing.id;
  }
  
  // Create category
  const { data: newCategory, error } = await supabase
    .from('categories')
    .insert({ name: categoryName })
    .select('id')
    .single();
  
  if (error) {
    console.error(`❌ Error creating category ${categoryName}:`, error.message);
    throw error;
  }
  
  console.log(`✅ Created category: ${categoryName}`);
  return newCategory.id;
}

// Upload image to Supabase storage
async function uploadImage(filePath, fileName) {
  try {
    const fileData = await readFile(filePath);
    const fileExt = extname(fileName);
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(sanitizedFileName, fileData, {
        contentType: `image/${fileExt.slice(1)}`,
        upsert: true, // Overwrite if exists
      });
    
    if (error) {
      console.error(`❌ Error uploading ${fileName}:`, error.message);
      return null;
    }
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(sanitizedFileName);
    
    return urlData.publicUrl;
  } catch (error) {
    console.error(`❌ Error reading file ${fileName}:`, error.message);
    return null;
  }
}

// Create menu item in database
async function createMenuItem(itemData) {
  const { data, error } = await supabase
    .from('menu_items')
    .insert(itemData)
    .select('id, name')
    .single();
  
  if (error) {
    console.error(`❌ Error creating menu item ${itemData.name}:`, error.message);
    return null;
  }
  
  return data;
}

// Main function
async function main() {
  console.log('🚀 Starting food items upload...\n');
  
  // Check if storage bucket exists
  const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
  if (bucketError) {
    console.error('❌ Error accessing storage:', bucketError.message);
    process.exit(1);
  }
  
  const bucketExists = buckets?.some(b => b.name === STORAGE_BUCKET);
  if (!bucketExists) {
    console.error(`❌ Storage bucket '${STORAGE_BUCKET}' does not exist!`);
    console.error('Please create it in Supabase Dashboard > Storage');
    process.exit(1);
  }
  
  console.log(`✅ Storage bucket '${STORAGE_BUCKET}' found\n`);
  
  // Read all image files
  let files;
  try {
    files = await readdir(FOOD_IMAGES_DIR);
    files = files.filter(f => /\.(png|jpg|jpeg|webp)$/i.test(f));
  } catch (error) {
    console.error(`❌ Error reading directory ${FOOD_IMAGES_DIR}:`, error.message);
    process.exit(1);
  }
  
  console.log(`📁 Found ${files.length} image files\n`);
  
  // Process each file
  const results = {
    success: 0,
    failed: 0,
    skipped: 0,
  };
  
  for (const file of files) {
    const filePath = join(FOOD_IMAGES_DIR, file);
    const categoryName = categorizeItem(file);
    const name = generateFoodName(file);
    const description = generateDescription(name);
    const price = generatePrice(categoryName, name);
    
    console.log(`\n📦 Processing: ${name}`);
    console.log(`   Category: ${categoryName}`);
    console.log(`   Price: R${price}`);
    
    try {
      // Get or create category
      const categoryId = await getOrCreateCategory(categoryName);
      
      // Check if item already exists
      const { data: existing } = await supabase
        .from('menu_items')
        .select('id')
        .eq('name', name)
        .single();
      
      if (existing) {
        console.log(`   ⏭️  Skipped: Item already exists`);
        results.skipped++;
        continue;
      }
      
      // Upload image
      console.log(`   📤 Uploading image...`);
      const imageUrl = await uploadImage(filePath, file);
      
      if (!imageUrl) {
        console.log(`   ❌ Failed to upload image`);
        results.failed++;
        continue;
      }
      
      console.log(`   ✅ Image uploaded: ${imageUrl}`);
      
      // Create menu item
      const menuItem = {
        name,
        description,
        price,
        category_id: categoryId,
        image_url: imageUrl,
        available: true,
        side_options: [],
        drink_options: [],
        extras: [],
        ingredients: [],
      };
      
      const created = await createMenuItem(menuItem);
      
      if (created) {
        console.log(`   ✅ Menu item created: ${created.name}`);
        results.success++;
      } else {
        results.failed++;
      }
    } catch (error) {
      console.error(`   ❌ Error:`, error.message);
      results.failed++;
    }
  }
  
  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 Upload Summary:');
  console.log(`   ✅ Success: ${results.success}`);
  console.log(`   ⏭️  Skipped: ${results.skipped}`);
  console.log(`   ❌ Failed: ${results.failed}`);
  console.log('='.repeat(50));
}

// Run the script
main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});


