# CMS - Restaurant Admin Dashboard

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `CMS` directory with your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**To get your Supabase credentials:**
1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Copy the "Project URL" and "anon public" key

**Example:**
```env
VITE_SUPABASE_URL=https://yujwhmjlhajzkkoixunl.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### 3. Run the Development Server

```bash
npm run dev
```

The CMS will be available at `http://localhost:5173` (or the port shown in the terminal).

### 4. Build for Production

```bash
npm run build
```

## Features

- **Dashboard**: View statistics, charts, and recent orders
- **Food Items**: Manage menu items (add, edit, delete)
- **Orders**: View and update order status
- **Restaurant Info**: Manage restaurant information

## Troubleshooting

### Nothing is displaying

1. **Check if `.env` file exists** in the `CMS` directory
2. **Verify environment variables** are set correctly
3. **Check browser console** for any error messages
4. **Restart the dev server** after creating/updating `.env` file

### Supabase Connection Errors

- Ensure your Supabase URL and Anon Key are correct
- Check that your Supabase project is active
- Verify that Row Level Security (RLS) policies allow access
