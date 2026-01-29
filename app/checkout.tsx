import { orderService } from "@/services/supabase/orders";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearCart } from "@/store/slices/cartSlice";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert, SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

export default function CheckoutScreen() {
  const dispatch = useAppDispatch();
  const { items, total } = useAppSelector((state) => state.cart);
  const { user } = useAppSelector((state) => state.auth);
  const [deliveryAddress, setDeliveryAddress] = useState(
    user?.address || ""
  );

  const [loading, setLoading] = useState(false);

  const handlePlaceOrder = async () => {
    if (!user) {
      Alert.alert("Error", "Please login to place an order");
      router.push("/login");
      return;
    }

    if (!deliveryAddress) {
      Alert.alert("Error", "Please enter a delivery address");
      return;
    }

    if (items.length === 0) {
      Alert.alert("Error", "Your cart is empty");
      return;
    }

    setLoading(true);
    try {
      await orderService.createOrder(
        user.uid,
        items,
        total,
        deliveryAddress,
        {
          name: user.name,
          email: user.email,
          contact: user.contactNumber,
        }
      );
      dispatch(clearCart());
      Alert.alert("Success", "Order placed successfully!");
      router.replace("/(tabs)/cart");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Checkout</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter delivery address"
            value={deliveryAddress}
            onChangeText={setDeliveryAddress}
            multiline
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <View style={styles.cardContainer}>
            <Text style={styles.cardText}>
              {user?.cardDetails?.cardNumber || "No card on file"}
            </Text>
            <TouchableOpacity>
              <Text style={styles.changeCardText}>Change</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          {items.map((item) => (
            <View key={item.id} style={styles.orderItem}>
              <Text style={styles.orderItemName}>{item.name}</Text>
              <Text style={styles.orderItemQuantity}>x{item.quantity}</Text>
              <Text style={styles.orderItemPrice}>
                R{(item.price * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalAmount}>R{total.toFixed(2)}</Text>
        </View>
        <TouchableOpacity 
          style={[styles.placeOrderButton, loading && styles.placeOrderButtonDisabled]} 
          onPress={handlePlaceOrder}
          disabled={loading}
        >
          <Text style={styles.placeOrderButtonText}>
            {loading ? "Placing Order..." : "Place Order"}
          </Text>
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
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2C2C2E",
    padding: 20,
  },
  section: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2C2C2E",
    marginBottom: 15,
  },
  input: {
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: "top",
  },
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    padding: 15,
    borderRadius: 12,
  },
  cardText: {
    fontSize: 16,
    color: "#2C2C2E",
  },
  changeCardText: {
    fontSize: 16,
    color: "#CD7112",
    fontWeight: "600",
  },
  orderItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  orderItemName: {
    flex: 1,
    fontSize: 16,
    color: "#2C2C2E",
  },
  orderItemQuantity: {
    fontSize: 16,
    color: "#8E8E93",
    marginHorizontal: 10,
  },
  orderItemPrice: {
    fontSize: 16,
    fontWeight: "600",
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
  placeOrderButton: {
    backgroundColor: "#CD7112",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
  },
  placeOrderButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
  placeOrderButtonDisabled: {
    opacity: 0.6,
  },
});


