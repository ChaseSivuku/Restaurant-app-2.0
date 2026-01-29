import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { foodService } from '@/services/supabase/food';
import type { FoodItem } from '@/services/supabase/food';
import { supabase } from '@/lib/supabase';

const FoodItems = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Mains',
    price: 0,
    is_new: false,
    image_url: '',
  });
  const queryClient = useQueryClient();

  const { data: foodItems = [], isLoading } = useQuery({
    queryKey: ['foodItems'],
    queryFn: () => foodService.getAllFoodItems(),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await foodService.deleteFoodItem(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['foodItems'] });
    },
  });

  const handleEdit = (item: FoodItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || '',
      category: item.category_name || 'Mains',
      price: item.price,
      is_new: false, // Not in schema, keeping for form compatibility
      image_url: item.image_url || '',
    });
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      description: '',
      category: 'Mains',
      price: 0,
      is_new: false,
      image_url: '',
    });
    setIsModalOpen(true);
  };

  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      // First, get or create category
      const { data: category } = await supabase
        .from('categories')
        .select('id')
        .eq('name', data.category)
        .single();
      
      let categoryId: string | null = null;
      if (category) {
        categoryId = category.id;
      } else {
        const { data: newCategory } = await supabase
          .from('categories')
          .insert({ name: data.category })
          .select('id')
          .single();
        if (newCategory) categoryId = newCategory.id;
      }

      const itemData = {
        name: data.name,
        description: data.description || null,
        price: data.price,
        category_id: categoryId,
        available: true,
        image_url: data.image_url || null,
        side_options: [],
        drink_options: [],
        extras: [],
        ingredients: [],
      };

      if (editingItem) {
        return foodService.updateFoodItem(editingItem.id, itemData);
      } else {
        return foodService.createFoodItem(itemData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['foodItems'] });
      setIsModalOpen(false);
      setEditingItem(null);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading food items...</div>;
  }

  if (deleteMutation.isError || saveMutation.isError) {
    const error = deleteMutation.error || saveMutation.error;
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <h2 className="text-xl font-semibold text-red-800 mb-2">Error</h2>
          <p className="text-red-600">{error instanceof Error ? error.message : 'Unknown error occurred'}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Food Items</h1>
        <button
          onClick={handleAdd}
          className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg font-semibold transition-colors"
        >
          + Add Food Item
        </button>
      </div>

      {/* Food Items Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {foodItems.map((item: FoodItem) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{item.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {item.category_name || 'Other'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  R{item.price.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {item.available ? (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Available
                    </span>
                  ) : (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                      Unavailable
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEdit(item)}
                    className="text-primary hover:text-primary-dark mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {editingItem ? 'Edit Food Item' : 'Add Food Item'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Mains">Mains</option>
                  <option value="Starter">Starter</option>
                  <option value="Dessert">Dessert</option>
                  <option value="Drinks">Drinks</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL (Supabase Storage)
                </label>
                <input
                  type="text"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_new}
                  onChange={(e) => setFormData({ ...formData, is_new: e.target.checked })}
                  className="mr-2"
                />
                <label className="text-sm font-medium text-gray-700">
                  Mark as New
                </label>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveMutation.isPending}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50"
                >
                  {saveMutation.isPending ? 'Saving...' : editingItem ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodItems;

