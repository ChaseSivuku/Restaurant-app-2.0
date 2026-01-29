import { supabase } from '@/lib/supabase';
import { CartItem } from '@/store/slices/cartSlice';

export interface Order {
  id: string;
  user_id: string;
  items: CartItem[];
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
  async createOrder(
    userId: string,
    items: CartItem[],
    total: number,
    deliveryAddress: string,
    userInfo?: { name?: string; email?: string; contact?: string },
    paymentMethod?: string
  ) {
    const { data, error } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        items: items as any,
        total_amount: total,
        order_status: 'pending',
        payment_status: 'pending',
        payment_method: paymentMethod || null,
        delivery_address: deliveryAddress,
        user_name: userInfo?.name || null,
        user_email: userInfo?.email || null,
        user_contact: userInfo?.contact || null,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getOrdersByUser(userId: string): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as Order[];
  },

  async getAllOrders(): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as Order[];
  },

  async updateOrderStatus(orderId: string, status: string) {
    const { data, error } = await supabase
      .from('orders')
      .update({
        order_status: status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updatePaymentStatus(orderId: string, paymentStatus: string) {
    const { data, error } = await supabase
      .from('orders')
      .update({
        payment_status: paymentStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

