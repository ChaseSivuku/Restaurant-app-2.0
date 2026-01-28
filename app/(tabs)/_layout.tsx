import { Tabs } from "expo-router";
import { Image } from "react-native";
import { HapticTab } from "@/components/haptic-tab";
import { useAppSelector } from "@/store/hooks";

export default function TabLayout() {
  const cartItems = useAppSelector((state) => state.cart.items);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#FF6B35",
        tabBarInactiveTintColor: "#8E8E93",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused
                  ? require("@/assets/icons/home-active.png")
                  : require("@/assets/icons/home-inactive.png")
              }
              style={{ width: 24, height: 24 }}
              resizeMode="contain"
            />
          ),
          tabBarButton: (props) => <HapticTab {...props} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarBadge: cartItems.length > 0 ? cartItems.length : undefined,
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused
                  ? require("@/assets/icons/cart-active.png")
                  : require("@/assets/icons/cart-inactive.png")
              }
              style={{ width: 24, height: 24 }}
              resizeMode="contain"
            />
          ),
          tabBarButton: (props) => <HapticTab {...props} />,
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: "Orders",
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused
                  ? require("@/assets/icons/order-food-active.png")
                  : require("@/assets/icons/order-food-inactive.png")
              }
              style={{ width: 24, height: 24 }}
              resizeMode="contain"
            />
          ),
          tabBarButton: (props) => <HapticTab {...props} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused
                  ? require("@/assets/icons/user-tab-active.png")
                  : require("@/assets/icons/user-tab-inactive.png")
              }
              style={{ width: 24, height: 24 }}
              resizeMode="contain"
            />
          ),
          tabBarButton: (props) => <HapticTab {...props} />,
        }}
      />
    </Tabs>
  );
}


