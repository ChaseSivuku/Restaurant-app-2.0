import { authService } from "@/services/supabase/auth";
import { useAppDispatch } from "@/store/hooks";
import { login } from "@/store/slices/authSlice";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from "react-native";

const signInIcon = require("@/assets/icons/sign-in-icon.png");

export default function LoginScreen() {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      await authService.signIn(email, password);
      const user = await authService.getCurrentUser();
      if (user) {
        dispatch(login(user));
        router.back();
      } else {
        Alert.alert("Error", "Failed to load user profile");
      }
    } catch (error: any) {
      Alert.alert("Login Failed", error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  const handleExplore = () => {
    router.replace("/(tabs)");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Title */}
        <Text style={styles.pageTitle}>Sign in</Text>

        {/* White Form Panel */}
        <View style={styles.formPanel}>
          {/* Header */}
          <Text style={styles.headerTitle}>Welcome back Sign in</Text>
          <Text style={styles.headerSubtitle}>
            Provide your details below and get ready to order
          </Text>

          {/* Icon */}
          <View style={styles.iconContainer}>
            <Image source={signInIcon} style={styles.icon} resizeMode="contain" />
          </View>

          {/* Input Fields */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor="#999"
            />
          </View>

          {/* Buttons */}
          <TouchableOpacity
            style={[styles.signInButton, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.signInButtonText}>
              {loading ? "Signing in..." : "Sign in"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Don't have an account?{" "}
              <Text
                style={styles.footerLink}
                onPress={() => router.push("/register")}
              >
                Sign up
              </Text>
            </Text>
            <Text style={styles.footerText}>
              Or{" "}
              <Text
                style={styles.footerLink}
                onPress={handleExplore}
              >
                explore
              </Text>
              {" "}without signing in
            </Text>
          </View>
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
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  pageTitle: {
    fontSize: 48,
    fontWeight: "300",
    color: "#999999",
    marginBottom: 20,
    textAlign: "left",
  },
  formPanel: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#999999",
    marginBottom: 32,
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  icon: {
    width: 120,
    height: 120,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    color: "#000000",
  },
  signInButton: {
    backgroundColor: "#88B746",
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 12,
  },
  signInButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    backgroundColor: "#000000",
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 20,
  },
  cancelButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  footer: {
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: "#999999",
  },
  footerLink: {
    color: "#88B746",
    fontWeight: "600",
  },
});
