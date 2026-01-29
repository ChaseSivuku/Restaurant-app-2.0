import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

// Mock data - replace with actual API calls
const fetchDashboardData = async () => {
  // Simulate API call
  return {
    stats: {
      totalOrders: 1247,
      totalRevenue: 187450,
      totalFoodItems: 25,
      activeUsers: 342,
    },
    ordersByDay: [
      { day: 'Mon', orders: 45, revenue: 6750 },
      { day: 'Tue', orders: 52, revenue: 7800 },
      { day: 'Wed', orders: 48, revenue: 7200 },
      { day: 'Thu', orders: 61, revenue: 9150 },
      { day: 'Fri', orders: 78, revenue: 11700 },
      { day: 'Sat', orders: 95, revenue: 14250 },
      { day: 'Sun', orders: 88, revenue: 13200 },
    ],
    ordersByCategory: [
      { name: 'Mains', value: 45, color: '#CD7112' },
      { name: 'Starters', value: 20, color: '#E88A3A' },
      { name: 'Desserts', value: 15, color: '#F5A962' },
      { name: 'Drinks', value: 20, color: '#FFB88C' },
    ],
    recentOrders: [
      { id: 'ORD-001', customer: 'John Doe', total: 175, status: 'Completed', date: '2024-01-28' },
      { id: 'ORD-002', customer: 'Jane Smith', total: 120, status: 'Pending', date: '2024-01-28' },
      { id: 'ORD-003', customer: 'Bob Johnson', total: 95, status: 'Completed', date: '2024-01-27' },
    ],
  };
};

const Dashboard = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: fetchDashboardData,
  });

  if (isLoading) {
    return <div className="text-center py-12">Loading dashboard data...</div>;
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
    { label: 'Total Orders', value: stats.totalOrders, icon: '📦', color: 'bg-blue-500' },
    { label: 'Total Revenue', value: `R${stats.totalRevenue?.toLocaleString()}`, icon: '💰', color: 'bg-green-500' },
    { label: 'Food Items', value: stats.totalFoodItems, icon: '🍔', color: 'bg-orange-500' },
    { label: 'Active Users', value: stats.activeUsers, icon: '👥', color: 'bg-purple-500' },
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
              <div className={`${stat.color} p-3 rounded-full text-2xl`}>
                {stat.icon}
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
                    <p className="font-semibold text-gray-800">R{order.total}</p>
                    <span className={`text-xs px-2 py-1 rounded ${
                      order.status === 'Completed' 
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

