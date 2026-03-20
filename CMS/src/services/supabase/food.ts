import { supabaseWrite } from '@/lib/supabase';

export interface FoodItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category_id: string | null;
  category_name?: string;
  image_url: string | null;
  available: boolean | null;
  side_options: any;
  drink_options: any;
  extras: any;
  ingredients: any;
  created_at: string | null;
  updated_at: string | null;
}

export const foodService = {
  async getAllFoodItems(): Promise<FoodItem[]> {
    const { data, error } = await supabaseWrite
      .from('menu_items')
      .select('*, categories(name)')
      .order('created_at', { ascending: false });

    if (error) {
      const msg = [error.message, (error as any).details, (error as any).hint].filter(Boolean).join(' ');
      throw new Error(msg || 'Failed to load food items');
    }
    return (data || []).map((item: any) => ({
      ...item,
      category_name: item.categories?.name || null,
    }));
  },

  async getFoodItemById(id: string): Promise<FoodItem | null> {
    const { data, error } = await supabaseWrite
      .from('menu_items')
      .select('*, categories(name)')
      .eq('id', id)
      .single();

    if (error) {
      const msg = [error.message, (error as any).details, (error as any).hint].filter(Boolean).join(' ');
      throw new Error(msg || 'Failed to load food item');
    }
    if (!data) return null;
    
    return {
      ...data,
      category_name: data.categories?.name || null,
    };
  },

  async createFoodItem(item: Omit<FoodItem, 'id' | 'created_at' | 'updated_at' | 'category_name'>) {
    const { data, error } = await supabaseWrite
      .from('menu_items')
      .insert({
        name: item.name,
        description: item.description,
        price: item.price,
        category_id: item.category_id,
        available: item.available ?? true,
        image_url: item.image_url,
        side_options: item.side_options || [],
        drink_options: item.drink_options || [],
        extras: item.extras || [],
        ingredients: item.ingredients || [],
      })
      .select('*, categories(name)')
      .single();

    if (error) {
      const msg = [error.message, (error as any).details, (error as any).hint].filter(Boolean).join(' ');
      throw new Error(msg || 'Failed to create food item');
    }
    return {
      ...data,
      category_name: data.categories?.name || null,
    };
  },

  async updateFoodItem(id: string, updates: Partial<FoodItem>) {
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (updates.name) updateData.name = updates.name;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.price !== undefined) updateData.price = updates.price;
    if (updates.category_id !== undefined) updateData.category_id = updates.category_id;
    if (updates.available !== undefined) updateData.available = updates.available;
    if (updates.image_url !== undefined) updateData.image_url = updates.image_url;
    if (updates.side_options !== undefined) updateData.side_options = updates.side_options;
    if (updates.drink_options !== undefined) updateData.drink_options = updates.drink_options;
    if (updates.extras !== undefined) updateData.extras = updates.extras;
    if (updates.ingredients !== undefined) updateData.ingredients = updates.ingredients;

    const { data, error } = await supabaseWrite
      .from('menu_items')
      .update(updateData)
      .eq('id', id)
      .select('*, categories(name)')
      .single();

    if (error) {
      const msg = [error.message, (error as any).details, (error as any).hint].filter(Boolean).join(' ');
      throw new Error(msg || 'Failed to update food item');
    }
    return {
      ...data,
      category_name: data.categories?.name || null,
    };
  },

  async deleteFoodItem(id: string) {
    const { error } = await supabaseWrite
      .from('menu_items')
      .delete()
      .eq('id', id);

    if (error) {
      const msg = [error.message, (error as any).details, (error as any).hint].filter(Boolean).join(' ');
      throw new Error(msg || 'Failed to delete food item');
    }
  },
};

