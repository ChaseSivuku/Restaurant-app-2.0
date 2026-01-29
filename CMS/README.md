# Restaurant CMS Admin Dashboard

A modern admin dashboard for managing restaurant operations, built with React, Vite, and Tailwind CSS.

## Features

- **Dashboard**: Analytics and data visualization with charts
- **Food Items Management**: Add, edit, and delete food items
- **Orders Management**: View and manage customer orders
- **Restaurant Information**: Update restaurant details and opening hours

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Router DOM
- TanStack Query (React Query)
- Recharts (for charts)
- Axios (for API calls)

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
CMS/
├── src/
│   ├── components/
│   │   └── Layout.tsx       # Main layout with sidebar navigation
│   ├── pages/
│   │   ├── Dashboard.tsx    # Analytics dashboard with charts
│   │   ├── FoodItems.tsx    # Food items management
│   │   ├── Orders.tsx       # Orders management
│   │   └── RestaurantInfo.tsx # Restaurant information management
│   ├── App.tsx              # Main app component with routing
│   ├── main.tsx             # Entry point
│   └── index.css            # Tailwind CSS imports
├── tailwind.config.js       # Tailwind configuration
└── package.json
```

## API Integration

Currently, the dashboard uses mock data. To integrate with your backend:

1. Update the API functions in each page component
2. Configure your API base URL
3. Add authentication if needed
4. Replace mock data with actual API calls

## Next Steps

- Connect to Supabase backend
- Add authentication
- Implement real API calls
- Add image upload for food items
- Add more analytics and reporting features
