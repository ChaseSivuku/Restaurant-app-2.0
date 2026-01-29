# CMS Troubleshooting Guide

## Nothing is Displaying

If the CMS shows a blank page, check the following:

### 1. Check Browser Console
Open your browser's developer tools (F12) and check the Console tab for errors.

### 2. Verify Environment Variables
- Make sure `.env` file exists in the `CMS` directory
- Variables must start with `VITE_` prefix
- Restart the dev server after creating/updating `.env`

### 3. Check if React is Loading
Look for console messages:
- "React app starting..." should appear
- "Environment check:" should show your Supabase config status

### 4. Common Issues

#### Blank White Page
- **Cause**: JavaScript error preventing render
- **Fix**: Check browser console for errors
- **Check**: Verify all imports are correct

#### Configuration Required Message
- **Cause**: Missing or incorrect environment variables
- **Fix**: 
  1. Create/update `CMS/.env` file
  2. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
  3. Restart dev server

#### CSS Not Loading (No Styling)
- **Cause**: Tailwind CSS not processing
- **Fix**: 
  1. Check `postcss.config.js` exists
  2. Check `tailwind.config.js` exists
  3. Verify `index.css` imports Tailwind directives
  4. Restart dev server

#### Routing Not Working
- **Cause**: React Router configuration issue
- **Fix**: Check that routes are properly nested in `App.tsx`

### 5. Debug Steps

1. **Check Network Tab**: Verify all files are loading (no 404s)
2. **Check Console**: Look for JavaScript errors
3. **Check Elements**: Verify `<div id="root">` exists in HTML
4. **Check Environment**: Console should log environment check
5. **Try Hard Refresh**: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

### 6. Manual Test

Add this to `App.tsx` temporarily to test if React is working:

```tsx
function App() {
  return <div style={{ padding: '20px' }}>React is working!</div>;
}
```

If this displays, React is working and the issue is elsewhere.

### 7. Restart Everything

1. Stop the dev server (Ctrl+C)
2. Delete `node_modules` and `package-lock.json` (optional)
3. Run `npm install`
4. Run `npm run dev`
5. Hard refresh browser (Ctrl+Shift+R)


