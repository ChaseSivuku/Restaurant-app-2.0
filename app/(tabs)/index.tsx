import { foodService } from "@/services/supabase/food";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setFoodItems, setSearchQuery, setSelectedCategory } from "@/store/slices/foodSlice";
import { router } from "expo-router";
import React, { useEffect } from "react";
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Import logo
const logoImage = require("@/assets/icons/logo-text-background(1).png");

export default function HomeScreen() {
  const dispatch = useAppDispatch();
  const { items, categories, selectedCategory, searchQuery } = useAppSelector(
    (state) => state.food
  );

  useEffect(() => {
    const loadFoodItems = async () => {
      try {
        const items = await foodService.getAllFoodItems();
        dispatch(setFoodItems(items));
      } catch (error) {
        console.error('Error loading food items:', error);
        // Fallback to empty array on error
        dispatch(setFoodItems([]));
      }
    };
    loadFoodItems();
  }, [dispatch]);

  const filteredItems =
    selectedCategory === "All"
      ? items
      : items.filter((item) => item.category === selectedCategory);

  // Featured items: prioritize new items, then show first few items from Mains category, or first few items overall
  const newItems = items.filter((item) => item.isNew);
  const mainItems = items.filter((item) => item.category === 'Mains' && !item.isNew).slice(0, 3);
  const featuredItems = newItems.length > 0 
    ? newItems.slice(0, 5) // Show up to 5 new items
    : mainItems.length > 0 
      ? mainItems // Show main items if no new items
      : items.slice(0, 3); // Fallback: show first 3 items

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      {/* Top Section with Search */}
      <View style={styles.topSection}>
        <View style={styles.searchContainer}>
          <View style={styles.brandContainer}>
            <Image
              source={logoImage}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <View style={styles.searchBar}>
            <TextInput
              style={styles.searchInput}
              placeholder="eg: egg breakfast"
              placeholderTextColor="#666666"
              value={searchQuery}
              onChangeText={(text) => dispatch(setSearchQuery(text))}
            />
            <Image
              source={require("@/assets/icons/search-black.png")}
              style={styles.searchIcon}
            />
          </View>
        </View>

        {/* Category Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
          contentContainerStyle={styles.categoriesContent}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.categoryButtonActive,
              ]}
              onPress={() => dispatch(setSelectedCategory(category))}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category && styles.categoryTextActive,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Horizontal Carousel of Featured Items */}
        {featuredItems.length > 0 && (
          <View style={styles.carouselContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              pagingEnabled
              snapToInterval={SCREEN_WIDTH - 32}
              snapToAlignment="start"
              decelerationRate="fast"
              contentContainerStyle={styles.carouselContent}
            >
              {featuredItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.featuredCard, { width: SCREEN_WIDTH - 32 }]}
                  onPress={() => router.push(`/food-detail/${item.id}` as any)}
                  activeOpacity={0.9}
                >
                  {item.isNew && (
                    <View style={styles.newTag}>
                      <Text style={styles.newTagText}>New</Text>
                    </View>
                  )}
                  <Image
                    source={item.image}
                    style={styles.foodImage}
                    resizeMode="contain"
                  />
                  <View style={styles.foodInfo}>
                    <Text style={styles.foodName}>{item.name}</Text>
                    <Text style={styles.foodDescription}>{item.description}</Text>
                    <TouchableOpacity
                      style={styles.orderButton}
                      onPress={() => router.push(`/food-detail/${item.id}` as any)}
                    >
                      <Text style={styles.orderButtonText}>Order R{item.price}</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Other Food Items */}
        <View style={styles.otherItemsContainer}>
          <Text style={styles.sectionTitle}>More Items</Text>
          {filteredItems
            .filter((item) => !featuredItems.some((fi) => fi.id === item.id))
            .map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.foodItemCard}
                onPress={() => router.push(`/food-detail/${item.id}` as any)}
              >
                <Image
                  source={item.image}
                  style={styles.foodItemImage}
                  resizeMode="cover"
                />
                <View style={styles.foodItemInfo}>
                  <Text style={styles.foodItemName}>{item.name}</Text>
                  <Text style={styles.foodItemDescription} numberOfLines={2}>
                    {item.description}
                  </Text>
                  <Text style={styles.foodItemPrice}>R{item.price}</Text>
                </View>
              </TouchableOpacity>
            ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  topSection: {
    backgroundColor: "#2C2C2E",
    paddingTop: 8,
    paddingBottom: 12,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  brandContainer: {
    alignItems: "flex-start",
    marginBottom: 15,
  },
  logo: {
    width: 140,
    height: 36,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    height: 44,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#000000",
    fontWeight: "500",
    padding: 0,
  },
  searchIcon: {
    width: 20,
    height: 20,
  },
  categoriesContainer: {
    marginTop: 15,
  },
  categoriesContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryButton: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  categoryButtonActive: {
    backgroundColor: "#CD7112",
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2C2C2E",
  },
  categoryTextActive: {
    color: "#FFFFFF",
  },
  content: {
    flex: 1,
  },
  carouselContainer: {
    marginVertical: 16,
  },
  carouselContent: {
    paddingHorizontal: 16,
    gap: 16,
  },
  featuredCard: {
    backgroundColor: "#CD7112",
    borderRadius: 16,
    marginRight: 16,
    padding: 16,
    minHeight: 360,
    maxHeight: 400,
    position: "relative",
  },
  newTag: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "#4CAF50",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    zIndex: 1,
  },
  newTagText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  foodImage: {
    width: "100%",
    height: 220,
    marginBottom: 12,
  },
  foodInfo: {
    alignItems: "flex-start",
  },
  foodName: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 6,
    textAlign: "left",
    width: "100%",
  },
  foodDescription: {
    color: "#FFFFFF",
    fontSize: 13,
    marginBottom: 16,
    textAlign: "left",
    opacity: 0.9,
    width: "100%",
    lineHeight: 18,
  },
  orderButton: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 32,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  orderButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "700",
  },
  otherItemsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2C2C2E",
    marginBottom: 12,
  },
  foodItemCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: "row",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  foodItemImage: {
    width: 100,
    height: 100,
  },
  foodItemInfo: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  foodItemName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2C2C2E",
    marginBottom: 5,
  },
  foodItemDescription: {
    fontSize: 12,
    color: "#8E8E93",
    marginBottom: 8,
  },
  foodItemPrice: {
    fontSize: 18,
    fontWeight: "700",
    color: "#CD7112",
  },
});

