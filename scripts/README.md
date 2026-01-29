# Upload Food Items Script

This script uploads all food images from `assets/images/food` to Supabase storage and creates menu items in the database.

## Prerequisites

1. **Supabase Storage Bucket**: Create a bucket named `food-images` in your Supabase dashboard
   - Go to Storage > Create Bucket
   - Name: `food-images`
   - Make it **PUBLIC** (important!)

2. **Environment Variables**: Ensure your `.env` file in the root directory has:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Database Tables**: Ensure these tables exist:
   - `categories` table
   - `menu_items` table

## Usage

Run the script from the project root:

```bash
npm run upload-food-items
```

Or directly:

```bash
node scripts/upload-food-items.mjs
```

## What the Script Does

1. **Reads all images** from `assets/images/food/` directory
2. **Categorizes items** based on filename patterns:
   - **Drinks**: coffee, juice, cola, etc.
   - **Alcohol**: beer, cocktails, margarita, etc.
   - **Desserts**: cake, pie, donut, etc.
   - **Starters**: platter, skewers, samosa, etc.
   - **Mains**: burgers, pizza, pasta, etc. (default)
3. **Generates names** from filenames (removes suffixes, capitalizes)
4. **Generates descriptions** based on item type
5. **Sets prices** based on category and item type
6. **Uploads images** to Supabase storage bucket
7. **Creates categories** if they don't exist
8. **Creates menu items** in the database

## Features

- ✅ Automatically categorizes items
- ✅ Generates reasonable prices
- ✅ Skips items that already exist (by name)
- ✅ Creates categories automatically
- ✅ Provides detailed progress output
- ✅ Shows summary at the end

## Output

The script will show:
- Progress for each item
- Success/failure status
- Final summary with counts

Example output:
```
🚀 Starting food items upload...

✅ Storage bucket 'food-images' found

📁 Found 55 image files

📦 Processing: Cheeseburger and Chips
   Category: Mains
   Price: R85
   📤 Uploading image...
   ✅ Image uploaded
   ✅ Menu item created: Cheeseburger and Chips

...

📊 Upload Summary:
   ✅ Success: 50
   ⏭️  Skipped: 3
   ❌ Failed: 2
```

## Troubleshooting

### "Storage bucket 'food-images' does not exist"
- Create the bucket in Supabase Dashboard > Storage
- Make sure it's set to PUBLIC

### "Missing Supabase credentials"
- Check your `.env` file exists in the root directory
- Verify variable names: `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`

### "Error creating menu item"
- Check that the `menu_items` table exists
- Verify RLS policies allow inserts
- Check that `categories` table exists

### Images not displaying
- Ensure the storage bucket is PUBLIC
- Check the image URLs in the database
- Verify the bucket name matches exactly: `food-images`


