import { useAppSelector } from "@/store/hooks";
import { router } from "expo-router";
import React from "react";
import {
    Dimensions,
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const landingBackground = require("@/assets/icons/landing-background.png");
const fullLogo = require("@/assets/icons/full-logo.png");

export default function LandingScreen() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const handleStartOrdering = () => {
    if (isAuthenticated) {
      router.replace("/(tabs)");
    } else {
      router.push("/login");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Background Image */}
        <Image
          source={landingBackground}
          style={styles.backgroundImage}
          resizeMode="cover"
        />

        {/* Content Overlay */}
        <View style={styles.overlay}>
          {/* Logo in Center */}
          <View style={styles.logoContainer}>
            <Image
              source={fullLogo}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* Start Ordering Button */}
          <TouchableOpacity
            style={styles.startButton}
            onPress={handleStartOrdering}
            activeOpacity={0.8}
          >
            <Text style={styles.startButtonText}>Start Ordering</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
    position: "relative",
  },
  backgroundImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    position: "absolute",
    top: 0,
    left: 0,
  },
  overlay: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  logoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  logo: {
    width: 200,
    height: 200,
    maxWidth: "80%",
  },
  startButton: {
    backgroundColor: "#88B746",
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 25,
    minWidth: 200,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  startButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
});

