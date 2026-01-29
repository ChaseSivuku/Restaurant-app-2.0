import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { orderService } from '@/services/supabase/orders';
import { foodService } from '@/services/supabase/food';
import { supabase } from '@/lib/supabase';

const fetchDashboardData = async () => {
  const [orders, foodItems, users] = await Promise.all([
    orderService.getAllOrders(),
    foodService.getAllFoodItems(),
    supabase.from('profiles').select('id'),
  ]);

  const totalRevenue = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);

  // Group orders by day
  const ordersByDayMap = new Map<string, { orders: number; revenue: number }>();
  orders.forEach(order => {
    if (!order.created_at) return;
    const date = new Date(order.created_at);
    const dayKey = date.toLocaleDateString('en-US', { weekday: 'short' });
    const existing = ordersByDayMap.get(dayKey) || { orders: 0, revenue: 0 };
    ordersByDayMap.set(dayKey, {
      orders: existing.orders + 1,
      revenue: existing.revenue + (order.total_amount || 0),
    });
  });

  const ordersByDay = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => {
    const data = ordersByDayMap.get(day) || { orders: 0, revenue: 0 };
    return { day, ...data };
  });

  // Group food items by category
  const categoryMap = new Map<string, number>();
  foodItems.forEach(item => {
    const categoryName = item.category_name || 'Other';
    const count = categoryMap.get(categoryName) || 0;
    categoryMap.set(categoryName, count + 1);
  });

  const ordersByCategory = Array.from(categoryMap.entries()).map(([name, value], idx) => ({
    name,
    value,
    color: ['#CD7112', '#E88A3A', '#F5A962', '#FFB88C'][idx % 4],
  }));

  const recentOrders = orders.slice(0, 5).map(order => ({
    id: order.id,
    total: order.total_amount || 0,
    status: order.order_status || 'pending',
    date: order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A',
    customer: order.user_name || order.user_email || `User ${order.user_id.substring(0, 8)}`,
  }));

  return {
    stats: {
      totalOrders: orders.length,
      totalRevenue,
      totalFoodItems: foodItems.length,
      activeUsers: users.data?.length || 0,
    },
    ordersByDay,
    ordersByCategory,
    recentOrders,
  };
};

const Dashboard = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard'],
    queryFn: fetchDashboardData,
  });

  if (isLoading) {
    return <div className="text-center py-12">Loading dashboard data...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Dashboard</h2>
          <p className="text-red-600 mb-4">{error instanceof Error ? error.message : 'Unknown error occurred'}</p>
          <p className="text-sm text-gray-600">
            Please check your Supabase configuration in the .env file.
          </p>
        </div>
      </div>
    );
  }

  const stats = data?.stats || {
    totalOrders: 0,
    totalRevenue: 0,
    totalFoodItems: 0,
    activeUsers: 0,
  };
  const ordersByDay = data?.ordersByDay || [];
  const ordersByCategory = data?.ordersByCategory || [];
  const recentOrders = data?.recentOrders || [];

  const statCards = [
    { label: 'Total Orders', value: stats.totalOrders, icon: '/icons/total-orders.png', color: 'bg-blue-500' },
    { label: 'Total Revenue', value: `R${stats.totalRevenue?.toLocaleString()}`, icon: '/icons/revenue.png', color: 'bg-green-500' },
    { label: 'Food Items', value: stats.totalFoodItems, icon: '/icons/food-items.png', color: 'bg-orange-500' },
    { label: 'Active Users', value: stats.activeUsers, icon: '/icons/active-users.png', color: 'bg-purple-500' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-800 mt-2">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-full flex items-center justify-center`}>
                <img src={stat.icon} alt={stat.label} className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Orders by Day */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Orders by Day</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ordersByDay}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="orders" fill="#CD7112" name="Orders" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Trend */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Revenue Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={ordersByDay}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#CD7112" strokeWidth={2} name="Revenue (R)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Orders by Category */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Orders by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={ordersByCategory}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {ordersByCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Orders</h2>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="border-b pb-4 last:border-0">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-800">{order.id}</p>
                    <p className="text-sm text-gray-600">{order.customer}</p>
                    <p className="text-xs text-gray-500">{order.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">R{order.total.toFixed(2)}</p>
                    <span className={`text-xs px-2 py-1 rounded ${
                      order.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

