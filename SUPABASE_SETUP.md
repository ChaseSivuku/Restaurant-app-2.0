# Supabase Setup Guide

## Environment Variables

Create a `.env` file in the root directory with your Supabase credentials:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

For the CMS, create a `.env` file in the `CMS` directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Database Schema

Run these SQL commands in your Supabase SQL Editor to create the required tables:

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  surname TEXT NOT NULL,
  contact_number TEXT NOT NULL,
  address TEXT NOT NULL,
  card_details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own data
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (auth.uid() = id);

-- Policy: Users can update their own data
CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);
```

### Food Items Table
```sql
CREATE TABLE food_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  is_new BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE food_items ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can read food items
CREATE POLICY "Food items are viewable by everyone" ON food_items
  FOR SELECT USING (true);

-- Policy: Only authenticated users can insert (for admin)
CREATE POLICY "Authenticated users can insert food items" ON food_items
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Policy: Only authenticated users can update (for admin)
CREATE POLICY "Authenticated users can update food items" ON food_items
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Policy: Only authenticated users can delete (for admin)
CREATE POLICY "Authenticated users can delete food items" ON food_items
  FOR DELETE USING (auth.role() = 'authenticated');
```

### Orders Table
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  items JSONB NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  delivery_address TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own orders
CREATE POLICY "Users can read own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can create their own orders
CREATE POLICY "Users can create own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Admins can read all orders (you may want to add an admin role check)
CREATE POLICY "Admins can read all orders" ON orders
  FOR SELECT USING (true);

-- Policy: Admins can update order status
CREATE POLICY "Admins can update orders" ON orders
  FOR UPDATE USING (true);
```

## Storage Setup

1. Go to Storage in your Supabase dashboard
2. Create a bucket named `food-images`
3. Set it to public
4. Upload your food images there
5. Get the public URL and use it in the `image_url` field of food items

## Authentication Setup

1. Go to Authentication > Settings in Supabase
2. Enable Email provider
3. Configure email templates if needed
4. Set up email confirmation (optional for development)

## Next Steps

1. Create your `.env` files with Supabase credentials
2. Run the SQL commands above to create tables
3. Set up storage bucket for images
4. Start adding food items through the CMS or directly in Supabase
5. Test authentication flow

