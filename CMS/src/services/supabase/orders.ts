import { supabaseWrite } from '@/lib/supabase';

export interface Order {
  id: string;
  user_id: string;
  items: any;
  total_amount: number;
  order_status: string | null;
  payment_method: string | null;
  payment_status: string | null;
  delivery_address: string;
  user_name: string | null;
  user_email: string | null;
  user_contact: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export const orderService = {
  async getAllOrders(): Promise<Order[]> {
    const { data, error } = await supabaseWrite
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      const msg = [error.message, (error as any).details, (error as any).hint].filter(Boolean).join(' ');
      throw new Error(msg || 'Failed to load orders');
    }
    return (data || []) as Order[];
  },

  async updateOrderStatus(orderId: string, status: string) {
    const { data, error } = await supabaseWrite
      .from('orders')
      .update({
        order_status: status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId)
      .select()
      .single();

    if (error) {
      const msg = [error.message, (error as any).details, (error as any).hint].filter(Boolean).join(' ');
      throw new Error(msg || 'Failed to update order status');
    }
    return data;
  },

  async updatePaymentStatus(orderId: string, paymentStatus: string) {
    const { data, error } = await supabaseWrite
      .from('orders')
      .update({
        payment_status: paymentStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId)
      .select()
      .single();

    if (error) {
      const msg = [error.message, (error as any).details, (error as any).hint].filter(Boolean).join(' ');
      throw new Error(msg || 'Failed to update payment status');
    }
    return data;
  },
};

