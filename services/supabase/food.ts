import { supabase } from '@/lib/supabase';
import { FoodItem } from '@/store/slices/foodSlice';
import { getFoodImage } from '@/utils/imageMapper';

// Helper to parse JSON fields from database
const parseJsonField = (field: any): any[] => {
  if (!field) return [];
  if (Array.isArray(field)) return field;
  if (typeof field === 'string') {
    try {
      return JSON.parse(field);
    } catch {
      return [];
    }
  }
  return [];
};

// Helper to get category name from category_id
const getCategoryName = async (categoryId: string | null): Promise<string> => {
  if (!categoryId) return 'Other';
  const { data } = await supabase
    .from('categories')
    .select('name')
    .eq('id', categoryId)
    .single();
  return data?.name || 'Other';
};

export const foodService = {
  async getAllFoodItems(): Promise<FoodItem[]> {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*, categories(name)')
      .eq('available', true)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return Promise.all(data.map(async (item: any) => {
      const categoryName = item.categories?.name || await getCategoryName(item.category_id);
      
      // Mark items as "new" if created within the last 7 days
      const createdAt = item.created_at ? new Date(item.created_at) : null;
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const isNew = createdAt && createdAt > sevenDaysAgo;
      
      return {
        id: item.id,
        name: item.name,
        description: item.description || '',
        price: item.price,
        image: getFoodImage(item.name, item.image_url),
        category: categoryName,
        isNew: isNew || false,
        sides: parseJsonField(item.side_options) || [],
        drinks: parseJsonField(item.drink_options) || [],
        extras: parseJsonField(item.extras) || [],
        optionalIngredients: parseJsonField(item.ingredients) || [],
      };
    }));
  },

  async getFoodItemById(id: string): Promise<FoodItem | null> {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*, categories(name)')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return null;

    const categoryName = data.categories?.name || await getCategoryName(data.category_id);

    // Mark items as "new" if created within the last 7 days
    const createdAt = data.created_at ? new Date(data.created_at) : null;
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const isNew = createdAt && createdAt > sevenDaysAgo;

    return {
      id: data.id,
      name: data.name,
      description: data.description || '',
      price: data.price,
      image: getFoodImage(data.name, data.image_url),
      category: categoryName,
      isNew: isNew || false,
      sides: parseJsonField(data.side_options) || [],
      drinks: parseJsonField(data.drink_options) || [],
      extras: parseJsonField(data.extras) || [],
      optionalIngredients: parseJsonField(data.ingredients) || [],
    };
  },

  async createFoodItem(item: Omit<FoodItem, 'id'>) {
    // First, get or create category
    let categoryId: string | null = null;
    if (item.category) {
      const { data: category } = await supabase
        .from('categories')
        .select('id')
        .eq('name', item.category)
        .single();
      
      if (category) {
        categoryId = category.id;
      } else {
        // Create category if it doesn't exist
        const { data: newCategory } = await supabase
          .from('categories')
          .insert({ name: item.category })
          .select('id')
          .single();
        if (newCategory) categoryId = newCategory.id;
      }
    }

    const { data, error } = await supabase
      .from('menu_items')
      .insert({
        name: item.name,
        description: item.description,
        price: item.price,
        category_id: categoryId,
        available: true,
        image_url: typeof item.image === 'object' && 'uri' in item.image ? item.image.uri : null,
        side_options: item.sides || [],
        drink_options: item.drinks || [],
        extras: item.extras || [],
        ingredients: item.optionalIngredients || [],
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateFoodItem(id: string, updates: Partial<FoodItem>) {
    let categoryId: string | null = null;
    if (updates.category) {
      const { data: category } = await supabase
        .from('categories')
        .select('id')
        .eq('name', updates.category)
        .single();
      
      if (category) {
        categoryId = category.id;
      } else {
        const { data: newCategory } = await supabase
          .from('categories')
          .insert({ name: updates.category })
          .select('id')
          .single();
        if (newCategory) categoryId = newCategory.id;
      }
    }

    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (updates.name) updateData.name = updates.name;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.price !== undefined) updateData.price = updates.price;
    if (categoryId !== null) updateData.category_id = categoryId;
    if (updates.image && typeof updates.image === 'object' && 'uri' in updates.image) {
      updateData.image_url = updates.image.uri;
    }
    if (updates.sides) updateData.side_options = updates.sides;
    if (updates.drinks) updateData.drink_options = updates.drinks;
    if (updates.extras) updateData.extras = updates.extras;
    if (updates.optionalIngredients) updateData.ingredients = updates.optionalIngredients;

    const { data, error } = await supabase
      .from('menu_items')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteFoodItem(id: string) {
    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};

