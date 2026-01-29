// Map food item names to local image assets
const imageMap: Record<string, any> = {
  'Beef Cake filled with Chips': require('@/assets/images/food.png'),
  'Cheeseburger and Chips': require('@/assets/images/food/cheeseburger-and-chips.png'),
  'Chicken Strips': require('@/assets/images/food/chicken-strips.png'),
  'Chocolate Donut': require('@/assets/images/food/chocolate-donut.png'),
  'Lemonade Cooler': require('@/assets/images/food/lemonade-cooler.png'),
  'Chicken and Chips': require('@/assets/images/food/chicken-and-chips.png'),
  'Double Double Burger and Chips': require('@/assets/images/food/double-double-burger-and-chips.png'),
  'Black Forest Cake': require('@/assets/images/food/black-forest-cake.png'),
  'Cheese Cake': require('@/assets/images/food/cheese-cake.png'),
  'Chocolate Mint Brownie': require('@/assets/images/food/chocolate-mint-brownie.png'),
  'Devil\'s Head Fish': require('@/assets/images/food/devil\'s-head-fish.png'),
  'Fruit Cocktail': require('@/assets/images/food/fruit-cocktail.png'),
  'Irish Monster': require('@/assets/images/food/irish-monster.png'),
  'Maguarita': require('@/assets/images/food/maguarita.png'),
  'Meat Platter on a Stick': require('@/assets/images/food/meat-platter-on-a-stick.png'),
  'Negroni': require('@/assets/images/food/negroni.png'),
  'Paperoni Pizza': require('@/assets/images/food/paperoni-pizza.png'),
  'Ramen Noodle Soup': require('@/assets/images/food/ramen-noodle-soup.png'),
  'Speckled Eggs Dessert': require('@/assets/images/food/speckled-eggs-dessert.png'),
  'Strawberry Daquiri': require('@/assets/images/food/Strawberry-daquiri.png'),
  'Watermelon Cooler': require('@/assets/images/food/watermelon-cooler.png'),
  'Chips': require('@/assets/images/food/chips.png'),
};

export const getFoodImage = (name: string, imageUrl?: string | null): any => {
  // If there's a Supabase image URL, use it
  if (imageUrl) {
    return { uri: imageUrl };
  }
  
  // Otherwise, try to find a local image
  const localImage = imageMap[name];
  if (localImage) {
    return localImage;
  }
  
  // Fallback to default food image
  return require('@/assets/images/food.png');
};

