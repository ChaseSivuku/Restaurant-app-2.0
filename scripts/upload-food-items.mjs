#!/usr/bin/env node

/**
 * Script to upload food images to Supabase storage and add metadata to database
 * 
 * Usage: node scripts/upload-food-items.mjs
 * 
 * Requirements:
 * - .env file in root with EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY
 * - Storage bucket named 'menu-images' in Supabase (must be public)
 * - Categories table must exist
 */

import { createClient } from '@supabase/supabase-js';
import { readdir, readFile } from 'fs/promises';
import { join, extname, basename } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
import { existsSync } from 'fs';

// Load environment variables
const envPath = join(dirname(fileURLToPath(import.meta.url)), '..', '.env');
if (existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  dotenv.config();
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Get Supabase credentials (check both naming conventions)
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
// Service role key is needed for bucket creation (optional)
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Error: Missing Supabase credentials in .env file');
  console.error('Required: SUPABASE_URL and SUPABASE_ANON_KEY (or EXPO_PUBLIC_* versions)');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);
// Create admin client if service key is available
const supabaseAdmin = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;
const STORAGE_BUCKET = 'menu-images';
const FOOD_IMAGES_DIR = join(rootDir, 'assets', 'images', 'food');

// Category mapping based on filename patterns
const categorizeItem = (filename) => {
  const lower = filename.toLowerCase();
  
  // Drinks
  if (lower.includes('coffee') || lower.includes('cappuccino') || lower.includes('latte') || 
      lower.includes('macha') || lower.includes('frappe') || lower.includes('juice') ||
      lower.includes('lemonade') || lower.includes('cola') || lower.includes('pepsi') ||
      lower.includes('cooler') || lower.includes('cocktail') && !lower.includes('bloody')) {
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
      (lower.includes('strips') && !lower.includes('chicken-and')) ||
      (lower.includes('chips') && !lower.includes('burger') && !lower.includes('chicken-and'))) {
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
    .replace(/\(1\)/gi, '')
    .replace(/-/g, ' ')
    .trim();
  
  // Capitalize first letter of each word
  name = name.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
  
  // Fix common issues
  name = name.replace(/\bAnd\b/gi, 'and');
  name = name.replace(/\bWith\b/gi, 'with');
  name = name.replace(/\bOn\b/gi, 'on');
  name = name.replace(/\bTop\b/gi, '');
  name = name.replace(/\s+/g, ' ').trim();
  
  return name;
};

// Generate description from name
const generateDescription = (name) => {
  const descriptions = {
    'burger': 'Juicy burger served with fresh ingredients and crispy fries',
    'pizza': 'Delicious pizza with premium toppings and melted cheese',
    'chicken': 'Tender chicken prepared to perfection with herbs and spices',
    'pasta': 'Fresh pasta with rich, flavorful sauce and premium ingredients',
    'ramen': 'Authentic ramen with savory broth and fresh noodles',
    'taco': 'Crispy tacos filled with fresh ingredients and flavorful sauces',
    'sushi': 'Fresh sushi prepared by expert chefs with premium fish',
    'stew': 'Hearty stew cooked to perfection with tender meat and vegetables',
    'coffee': 'Rich, aromatic coffee made from premium beans',
    'cake': 'Decadent cake made with premium ingredients and fresh cream',
    'pie': 'Homemade pie with fresh ingredients and flaky crust',
    'skewers': 'Tender meat skewers marinated in special spices',
    'platter': 'Generous platter with a variety of delicious items',
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
  // Use admin client if available (bypasses RLS), otherwise use regular client
  const dbClient = supabaseAdmin || supabase;
  
  // Check if category exists
  const { data: existing, error: selectError } = await dbClient
    .from('categories')
    .select('id')
    .eq('name', categoryName)
    .maybeSingle();
  
  if (existing) {
    return existing.id;
  }
  
  // Create category
  const { data: newCategory, error } = await dbClient
    .from('categories')
    .insert({ name: categoryName })
    .select('id')
    .single();
  
  if (error) {
    console.error(`❌ Error creating category ${categoryName}:`, error.message);
    throw error;
  }
  
  console.log(`   ✅ Created category: ${categoryName}`);
  return newCategory.id;
}

// Upload image to Supabase storage
async function uploadImage(filePath, fileName) {
  try {
    const fileData = await readFile(filePath);
    const fileExt = extname(fileName);
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    
    // Use admin client if available (bypasses RLS), otherwise use regular client
    const storageClient = supabaseAdmin || supabase;
    
    const { data, error } = await storageClient.storage
      .from(STORAGE_BUCKET)
      .upload(sanitizedFileName, fileData, {
        contentType: `image/${fileExt.slice(1)}`,
        upsert: true, // Overwrite if exists
      });
    
    if (error) {
      console.error(`   ❌ Error uploading ${fileName}:`, error.message);
      return null;
    }
    
    // Get public URL (can use either client for this)
    const { data: urlData } = storageClient.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(sanitizedFileName);
    
    return urlData.publicUrl;
  } catch (error) {
    console.error(`   ❌ Error reading file ${fileName}:`, error.message);
    return null;
  }
}

// Create menu item in database
async function createMenuItem(itemData) {
  // Use admin client if available (bypasses RLS), otherwise use regular client
  const dbClient = supabaseAdmin || supabase;
  
  const { data, error } = await dbClient
    .from('menu_items')
    .insert(itemData)
    .select('id, name')
    .single();
  
  if (error) {
    console.error(`   ❌ Error creating menu item ${itemData.name}:`, error.message);
    return null;
  }
  
  return data;
}

// Main function
async function main() {
  console.log('🚀 Starting food items upload...\n');
  
  if (supabaseAdmin) {
    console.log('✅ Using service role key - will bypass RLS policies\n');
  } else {
    console.log('⚠️  Using anon key - RLS policies apply');
    console.log('💡 Tip: Add SUPABASE_SERVICE_ROLE_KEY to .env to bypass RLS\n');
  }
  
  // Try to verify bucket exists by attempting to list files (or just proceed)
  // Note: anon key may not have permission to list buckets, but can still upload to public buckets
  console.log(`📦 Using storage bucket: '${STORAGE_BUCKET}'\n`);
  console.log('💡 Note: If uploads fail, ensure the bucket exists and is set to PUBLIC\n');
  
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
      
      // Check if item already exists (use admin client if available)
      const dbClient = supabaseAdmin || supabase;
      const { data: existing } = await dbClient
        .from('menu_items')
        .select('id')
        .eq('name', name)
        .maybeSingle();
      
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
      
      console.log(`   ✅ Image uploaded`);
      
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

