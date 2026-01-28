import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isNew?: boolean;
  sides?: { name: string; price: number }[];
  drinks?: { name: string; price: number }[];
  extras?: { name: string; price: number }[];
  optionalIngredients?: { name: string; canRemove: boolean }[];
}

interface FoodState {
  items: FoodItem[];
  categories: string[];
  selectedCategory: string;
  searchQuery: string;
}

const initialState: FoodState = {
  items: [],
  categories: ['All', 'Mains', 'Starter', 'Dessert', 'Drinks'],
  selectedCategory: 'All',
  searchQuery: '',
};

const foodSlice = createSlice({
  name: 'food',
  initialState,
  reducers: {
    setFoodItems: (state, action: PayloadAction<FoodItem[]>) => {
      state.items = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
  },
});

export const { setFoodItems, setSelectedCategory, setSearchQuery } = foodSlice.actions;
export default foodSlice.reducer;


