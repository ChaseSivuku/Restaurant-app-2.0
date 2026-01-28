import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setFoodItems, setSelectedCategory, setSearchQuery } from "@/store/slices/foodSlice";
import { mockFoodItems } from "@/data/mockFoodData";
import { router } from "expo-router";

export default function HomeScreen() {
  const dispatch = useAppDispatch();
  const { items, categories, selectedCategory, searchQuery } = useAppSelector(
    (state) => state.food
  );

  useEffect(() => {
    dispatch(setFoodItems(mockFoodItems));
  }, [dispatch]);

  const filteredItems =
    selectedCategory === "All"
      ? items
      : items.filter((item) => item.category === selectedCategory);

  const featuredItem = filteredItems.find((item) => item.isNew) || filteredItems[0];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      {/* Top Section with Search */}
      <View style={styles.topSection}>
        <View style={styles.searchContainer}>
          <View style={styles.brandContainer}>
            <Text style={styles.brandText}>
              <Text style={styles.brandOrange}>Ntally</Text>{" "}
              <Text style={styles.brandGreen}>Foods</Text>
            </Text>
            <Image
              source={require("@/assets/icons/dot.png")}
              style={styles.leafIcon}
            />
          </View>
          <View style={styles.searchBar}>
            <TextInput
              style={styles.searchInput}
              placeholder="eg: egg breakfast"
              placeholderTextColor="#8E8E93"
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
        {featuredItem && (
          <TouchableOpacity
            style={styles.featuredCard}
            onPress={() => router.push(`/food-detail/${featuredItem.id}` as any)}
          >
            {featuredItem.isNew && (
              <View style={styles.newTag}>
                <Text style={styles.newTagText}>New</Text>
              </View>
            )}
            <Image
              source={featuredItem.image}
              style={styles.foodImage}
              resizeMode="contain"
            />
            <View style={styles.foodInfo}>
              <Text style={styles.foodName}>{featuredItem.name}</Text>
              <Text style={styles.foodDescription}>{featuredItem.description}</Text>
              <TouchableOpacity
                style={styles.orderButton}
                onPress={() => router.push(`/food-detail/${featuredItem.id}` as any)}
              >
                <Text style={styles.orderButtonText}>Order R{featuredItem.price}</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}

        {/* Other Food Items */}
        <View style={styles.otherItemsContainer}>
          <Text style={styles.sectionTitle}>More Items</Text>
          {filteredItems
            .filter((item) => item.id !== featuredItem?.id)
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
    paddingTop: 10,
    paddingBottom: 15,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  brandContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  brandText: {
    fontSize: 20,
    fontWeight: "700",
  },
  brandOrange: {
    color: "#FF6B35",
  },
  brandGreen: {
    color: "#4CAF50",
  },
  leafIcon: {
    width: 16,
    height: 16,
    marginLeft: 5,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    height: 48,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  searchIcon: {
    width: 20,
    height: 20,
  },
  categoriesContainer: {
    marginTop: 15,
  },
  categoriesContent: {
    paddingHorizontal: 20,
    gap: 10,
  },
  categoryButton: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  categoryButtonActive: {
    backgroundColor: "#FF6B35",
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
  featuredCard: {
    backgroundColor: "#FF6B35",
    borderRadius: 20,
    margin: 20,
    padding: 20,
    minHeight: 400,
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
    height: 250,
    marginBottom: 15,
  },
  foodInfo: {
    alignItems: "center",
  },
  foodName: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  foodDescription: {
    color: "#FFFFFF",
    fontSize: 14,
    marginBottom: 20,
    textAlign: "center",
    opacity: 0.9,
  },
  orderButton: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 25,
  },
  orderButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "700",
  },
  otherItemsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2C2C2E",
    marginBottom: 15,
  },
  foodItemCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    marginBottom: 15,
    flexDirection: "row",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  foodItemImage: {
    width: 120,
    height: 120,
  },
  foodItemInfo: {
    flex: 1,
    padding: 15,
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
    color: "#FF6B35",
  },
});

