import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView, ActivityIndicator } from "react-native";
import { useAppSelector } from "@/store/hooks";
import { orderService, Order } from "@/services/supabase/orders";

export default function OrdersScreen() {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && user) {
      const loadOrders = async () => {
        try {
          const userOrders = await orderService.getOrdersByUser(user.uid);
          setOrders(userOrders);
        } catch (error) {
          console.error('Error loading orders:', error);
        } finally {
          setLoading(false);
        }
      };
      loadOrders();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#CD7112" />
        </View>
      </SafeAreaView>
    );
  }

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
        ) : orders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No orders yet</Text>
            <Text style={styles.emptySubtext}>
              Your order history will appear here
            </Text>
          </View>
        ) : (
          <ScrollView>
            {orders.map((order) => (
              <View key={order.id} style={styles.orderCard}>
                <View style={styles.orderHeader}>
                  <Text style={styles.orderId}>{order.id}</Text>
                  <Text style={[styles.orderStatus, styles[`status${order.status}`]]}>
                    {order.status}
                  </Text>
                </View>
                <Text style={styles.orderDate}>
                  {new Date(order.created_at).toLocaleDateString()}
                </Text>
                <Text style={styles.orderTotal}>Total: R{order.total.toFixed(2)}</Text>
                <Text style={styles.orderAddress}>{order.delivery_address}</Text>
              </View>
            ))}
          </ScrollView>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  orderCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  orderId: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2C2C2E",
  },
  orderStatus: {
    fontSize: 12,
    fontWeight: "600",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statuspending: {
    backgroundColor: "#FFF3CD",
    color: "#856404",
  },
  statuscompleted: {
    backgroundColor: "#D4EDDA",
    color: "#155724",
  },
  statuscancelled: {
    backgroundColor: "#F8D7DA",
    color: "#721C24",
  },
  orderDate: {
    fontSize: 14,
    color: "#8E8E93",
    marginBottom: 4,
  },
  orderTotal: {
    fontSize: 18,
    fontWeight: "700",
    color: "#CD7112",
    marginBottom: 4,
  },
  orderAddress: {
    fontSize: 14,
    color: "#2C2C2E",
  },
});


