import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import FoodItems from './pages/FoodItems';
import Orders from './pages/Orders';
import RestaurantInfo from './pages/RestaurantInfo';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  // Check if Supabase is configured
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  // Debug: Log environment variables (remove in production)
  console.log('Environment check:', {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseKey,
    urlLength: supabaseUrl?.length || 0,
    keyLength: supabaseKey?.length || 0,
  });

  if (!supabaseUrl || !supabaseKey) {
  return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Configuration Required</h1>
          <p className="text-gray-600 mb-4">
            Please configure your Supabase credentials in the <code className="bg-gray-100 px-2 py-1 rounded">.env</code> file.
          </p>
          <div className="bg-gray-50 p-4 rounded mb-4">
            <p className="text-sm font-mono text-gray-700 mb-2">Required variables:</p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• VITE_SUPABASE_URL</li>
              <li>• VITE_SUPABASE_ANON_KEY</li>
            </ul>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> After creating/updating the .env file, you must restart the dev server.
            </p>
      </div>
          <p className="text-sm text-gray-500">
            Create a <code className="bg-gray-100 px-2 py-1 rounded">.env</code> file in the CMS directory 
            with your Supabase credentials. See <code className="bg-gray-100 px-2 py-1 rounded">.env.example</code> for reference.
          </p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="food-items" element={<FoodItems />} />
            <Route path="orders" element={<Orders />} />
            <Route path="restaurant-info" element={<RestaurantInfo />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
