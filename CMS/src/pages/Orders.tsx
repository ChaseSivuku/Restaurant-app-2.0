import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '@/services/supabase/orders';
import type { Order } from '@/services/supabase/orders';

const Orders = () => {
  const queryClient = useQueryClient();
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: () => orderService.getAllOrders(),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: string }) =>
      orderService.updateOrderStatus(orderId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading orders...</div>;
  }

  if (updateStatusMutation.isError) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Orders</h2>
          <p className="text-red-600">
            {updateStatusMutation.error instanceof Error 
              ? updateStatusMutation.error.message 
              : 'Unknown error occurred'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Orders</h1>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Items
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order: Order) => (
              <tr key={order.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{order.id}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {order.user_name || `User: ${order.user_id}`}
                  </div>
                  {order.user_email && (
                    <div className="text-sm text-gray-500">{order.user_email}</div>
                  )}
                  {order.user_contact && (
                    <div className="text-sm text-gray-500">{order.user_contact}</div>
                  )}
                  <div className="text-sm text-gray-400 mt-1">{order.delivery_address}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {Array.isArray(order.items) ? (
                      order.items.map((item: any, idx: number) => (
                        <div key={idx}>{item.name} x{item.quantity}</div>
                      ))
                    ) : (
                      <div>Items data</div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                  R{order.total_amount.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.order_status || 'pending')}`}>
                    {order.order_status || 'pending'}
                  </span>
                  {order.payment_status && (
                    <div className="text-xs text-gray-500 mt-1">
                      Payment: {order.payment_status}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-primary hover:text-primary-dark mr-4">
                    View
                  </button>
                  {order.order_status === 'pending' && (
                    <button 
                      className="text-green-600 hover:text-green-900"
                      onClick={() => updateStatusMutation.mutate({ orderId: order.id, status: 'completed' })}
                    >
                      Complete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;

