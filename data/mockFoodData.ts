import { FoodItem } from "@/store/slices/foodSlice";

export const mockFoodItems: FoodItem[] = [
  {
    id: "1",
    name: "Beef Cake filled with Chips",
    description: "Delicious beef cake layered with crispy chips, served with fresh parsley and lime",
    price: 175,
    image: require("@/assets/images/food.png"),
    category: "Mains",
    isNew: true,
    sides: [
      { name: "Pap", price: 0 },
      { name: "Chips", price: 0 },
      { name: "Salad", price: 0 },
    ],
    drinks: [
      { name: "Coke", price: 0 },
      { name: "Sprite", price: 0 },
      { name: "Water", price: 0 },
    ],
    extras: [
      { name: "Extra Chips", price: 25 },
      { name: "Extra Sauce", price: 10 },
      { name: "Extra Salad", price: 15 },
    ],
    optionalIngredients: [
      { name: "Lettuce", canRemove: true },
      { name: "Tomato", canRemove: true },
      { name: "Onion", canRemove: true },
    ],
  },
  {
    id: "2",
    name: "Cheeseburger and Chips",
    description: "Classic cheeseburger with crispy chips",
    price: 120,
    image: require("@/assets/images/food/cheeseburger-and-chips.png"),
    category: "Mains",
    sides: [
      { name: "Chips", price: 0 },
      { name: "Onion Rings", price: 0 },
    ],
    drinks: [
      { name: "Coke", price: 0 },
      { name: "Milkshake", price: 0 },
    ],
    extras: [
      { name: "Extra Cheese", price: 15 },
      { name: "Bacon", price: 20 },
    ],
  },
  {
    id: "3",
    name: "Chicken Strips",
    description: "Crispy chicken strips served with dipping sauce",
    price: 95,
    image: require("@/assets/images/food/chicken-strips.png"),
    category: "Starter",
    sides: [
      { name: "Chips", price: 0 },
      { name: "Coleslaw", price: 0 },
    ],
    extras: [
      { name: "Extra Sauce", price: 10 },
    ],
  },
  {
    id: "4",
    name: "Chocolate Donut",
    description: "Freshly baked chocolate glazed donut",
    price: 35,
    image: require("@/assets/images/food/chocolate-donut.png"),
    category: "Dessert",
    extras: [
      { name: "Extra Glaze", price: 5 },
    ],
  },
  {
    id: "5",
    name: "Lemonade Cooler",
    description: "Refreshing lemonade with mint",
    price: 45,
    image: require("@/assets/images/food/lemonade-cooler.png"),
    category: "Drinks",
  },
];


