# Generating Supabase TypeScript Types

To generate types directly from your Supabase database, use one of these methods:

## Method 1: Using Project Reference (Recommended)

If you have your Supabase project URL in `.env`, extract the project reference and run:

```bash
# Extract project ref from URL (e.g., https://abcdefgh.supabase.co -> abcdefgh)
npx supabase gen types typescript --project-id YOUR_PROJECT_REF > types/database.types.ts
```

## Method 2: Using Project URL Directly

```bash
npx supabase gen types typescript --project-id $(grep EXPO_PUBLIC_SUPABASE_URL .env | cut -d '=' -f2 | sed 's|https://||' | sed 's|.supabase.co||') > types/database.types.ts
```

## Method 3: Manual with Project Reference

1. Get your project reference from Supabase dashboard (Settings > General > Reference ID)
2. Run:
```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_REF > types/database.types.ts
```

## Method 4: Using the Script

I've created a PowerShell script that reads from your `.env` file:

```powershell
.\scripts\generate-types.ps1
```

## Note

The types I created manually should work, but generating them from Supabase ensures they match your exact database schema, including any custom columns, relationships, or types you've added.

