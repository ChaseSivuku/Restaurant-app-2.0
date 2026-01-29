# Script to generate Supabase TypeScript types
# Usage: .\scripts\generate-types.ps1

# Read .env file to get project URL
$envContent = Get-Content .env -ErrorAction SilentlyContinue
$supabaseUrl = $envContent | Select-String "EXPO_PUBLIC_SUPABASE_URL" | ForEach-Object { ($_ -split "=")[1].Trim() }

if ($supabaseUrl) {
    # Extract project reference from URL (format: https://xxxxx.supabase.co)
    $projectRef = ($supabaseUrl -replace "https://", "" -replace ".supabase.co", "").Trim()
    
    Write-Host "Generating types for project: $projectRef"
    
    # Generate types using Supabase CLI
    npx supabase gen types typescript --project-id $projectRef > types/database.types.ts
    
    Write-Host "Types generated successfully in types/database.types.ts"
} else {
    Write-Host "Error: Could not find EXPO_PUBLIC_SUPABASE_URL in .env file"
    Write-Host "Please ensure your .env file contains: EXPO_PUBLIC_SUPABASE_URL=your_url"
}

