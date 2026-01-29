import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addToCart } from "@/store/slices/cartSlice";
import { FoodItem } from "@/store/slices/foodSlice";
import { CartItem } from "@/store/slices/cartSlice";
import { mockFoodItems } from "@/data/mockFoodData";

export default function FoodDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const [foodItem, setFoodItem] = useState<FoodItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSides, setSelectedSides] = useState<string[]>([]);
  const [selectedDrinks, setSelectedDrinks] = useState<string[]>([]);
  const [selectedExtras, setSelectedExtras] = useState<{ name: string; price: number }[]>([]);
  const [removedIngredients, setRemovedIngredients] = useState<string[]>([]);

  useEffect(() => {
    const item = mockFoodItems.find((item) => item.id === id);
    setFoodItem(item || null);
  }, [id]);

  if (!foodItem) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Food item not found</Text>
      </SafeAreaView>
    );
  }

  const calculateTotal = () => {
    const basePrice = foodItem.price * quantity;
    const extrasPrice = selectedExtras.reduce((sum, extra) => sum + extra.price, 0) * quantity;
    return basePrice + extrasPrice;
  };

  const handleAddToCart = () => {
    const cartItem: CartItem = {
      id: foodItem.id,
      name: foodItem.name,
      price: foodItem.price,
      image: foodItem.image,
      quantity,
      sides: selectedSides,
      drinks: selectedDrinks,
      extras: selectedExtras,
      optionalIngredients: removedIngredients,
    };
    dispatch(addToCart(cartItem));
    router.back();
  };

  const toggleSide = (sideName: string) => {
    if (selectedSides.includes(sideName)) {
      setSelectedSides(selectedSides.filter((s) => s !== sideName));
    } else {
      if (foodItem.sides && selectedSides.length < 2) {
        setSelectedSides([...selectedSides, sideName]);
      }
    }
  };

  const toggleDrink = (drinkName: string) => {
    if (selectedDrinks.includes(drinkName)) {
      setSelectedDrinks(selectedDrinks.filter((d) => d !== drinkName));
    } else {
      setSelectedDrinks([...selectedDrinks, drinkName]);
    }
  };

  const toggleExtra = (extra: { name: string; price: number }) => {
    if (selectedExtras.some((e) => e.name === extra.name)) {
      setSelectedExtras(selectedExtras.filter((e) => e.name !== extra.name));
    } else {
      setSelectedExtras([...selectedExtras, extra]);
    }
  };

  const toggleIngredient = (ingredientName: string) => {
    if (removedIngredients.includes(ingredientName)) {
      setRemovedIngredients(removedIngredients.filter((i) => i !== ingredientName));
    } else {
      setRemovedIngredients([...removedIngredients, ingredientName]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>

        <Image source={foodItem.image} style={styles.foodImage} resizeMode="cover" />

        <View style={styles.content}>
          <Text style={styles.foodName}>{foodItem.name}</Text>
          <Text style={styles.foodDescription}>{foodItem.description}</Text>
          <Text style={styles.foodPrice}>R{foodItem.price}</Text>

          {/* Sides Selection */}
          {foodItem.sides && foodItem.sides.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Choose Sides (Select up to 2)
              </Text>
              {foodItem.sides.map((side) => (
                <TouchableOpacity
                  key={side.name}
                  style={[
                    styles.optionButton,
                    selectedSides.includes(side.name) && styles.optionButtonActive,
                  ]}
                  onPress={() => toggleSide(side.name)}
                  disabled={
                    !selectedSides.includes(side.name) && selectedSides.length >= 2
                  }
                >
                  <Text
                    style={[
                      styles.optionText,
                      selectedSides.includes(side.name) && styles.optionTextActive,
                    ]}
                  >
                    {side.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Drinks Selection */}
          {foodItem.drinks && foodItem.drinks.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Choose Drink</Text>
              {foodItem.drinks.map((drink) => (
                <TouchableOpacity
                  key={drink.name}
                  style={[
                    styles.optionButton,
                    selectedDrinks.includes(drink.name) && styles.optionButtonActive,
                  ]}
                  onPress={() => toggleDrink(drink.name)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selectedDrinks.includes(drink.name) && styles.optionTextActive,
                    ]}
                  >
                    {drink.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Extras Selection */}
          {foodItem.extras && foodItem.extras.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Extras (Add-ons)</Text>
              {foodItem.extras.map((extra) => (
                <TouchableOpacity
                  key={extra.name}
                  style={[
                    styles.optionButton,
                    selectedExtras.some((e) => e.name === extra.name) &&
                      styles.optionButtonActive,
                  ]}
                  onPress={() => toggleExtra(extra)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selectedExtras.some((e) => e.name === extra.name) &&
                        styles.optionTextActive,
                    ]}
                  >
                    {extra.name} (+R{extra.price})
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Optional Ingredients */}
          {foodItem.optionalIngredients &&
            foodItem.optionalIngredients.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Remove Ingredients</Text>
                {foodItem.optionalIngredients.map((ingredient) => (
                  <TouchableOpacity
                    key={ingredient.name}
                    style={[
                      styles.optionButton,
                      removedIngredients.includes(ingredient.name) &&
                        styles.optionButtonActive,
                    ]}
                    onPress={() => toggleIngredient(ingredient.name)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        removedIngredients.includes(ingredient.name) &&
                          styles.optionTextActive,
                      ]}
                    >
                      Remove {ingredient.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

          {/* Quantity */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quantity</Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Image
                  source={require("@/assets/icons/minus-black.png")}
                  style={styles.quantityIcon}
                />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => setQuantity(quantity + 1)}
              >
                <Image
                  source={require("@/assets/icons/add-black.png")}
                  style={styles.quantityIcon}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Footer with Add to Cart */}
      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalAmount}>R{calculateTotal().toFixed(2)}</Text>
        </View>
        <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
          <Text style={styles.addToCartButtonText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  scrollView: {
    flex: 1,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  backButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  foodImage: {
    width: "100%",
    height: 300,
  },
  content: {
    padding: 20,
  },
  foodName: {
    fontSize: 28,
    fontWeight: "700",
    color: "#2C2C2E",
    marginBottom: 10,
  },
  foodDescription: {
    fontSize: 16,
    color: "#8E8E93",
    marginBottom: 15,
    lineHeight: 24,
  },
  foodPrice: {
    fontSize: 24,
    fontWeight: "700",
    color: "#CD7112",
    marginBottom: 30,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2C2C2E",
    marginBottom: 15,
  },
  optionButton: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#E5E5E5",
  },
  optionButtonActive: {
    borderColor: "#CD7112",
    backgroundColor: "#FFF5F2",
  },
  optionText: {
    fontSize: 16,
    color: "#2C2C2E",
  },
  optionTextActive: {
    color: "#CD7112",
    fontWeight: "600",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  quantityButton: {
    padding: 10,
  },
  quantityIcon: {
    width: 24,
    height: 24,
  },
  quantityText: {
    fontSize: 24,
    fontWeight: "700",
    marginHorizontal: 30,
    color: "#2C2C2E",
  },
  footer: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  totalLabel: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2C2C2E",
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: "700",
    color: "#CD7112",
  },
  addToCartButton: {
    backgroundColor: "#CD7112",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
  },
  addToCartButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
});


