import React from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { useAppSelector } from "@/store/hooks";

export default function OrdersScreen() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Orders</Text>
        {!isAuthenticated ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Please login to view your orders
            </Text>
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No orders yet</Text>
            <Text style={styles.emptySubtext}>
              Your order history will appear here
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2C2C2E",
    marginBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    color: "#8E8E93",
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#8E8E93",
  },
});


