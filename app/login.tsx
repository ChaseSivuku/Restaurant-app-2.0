import { authService } from "@/services/supabase/auth";
import { useAppDispatch } from "@/store/hooks";
import { login } from "@/store/slices/authSlice";
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Login</Text>
        <Text style={styles.subtitle}>Welcome back!</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity 
          style={[styles.loginButton, loading && styles.loginButtonDisabled]} 
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.loginButtonText}>{loading ? "Logging in..." : "Login"}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.registerLink}
          onPress={() => router.push("/register")}
        >
          <Text style={styles.registerLinkText}>
            Don't have an account? Register
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  content: {
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#2C2C2E",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#8E8E93",
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2C2C2E",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  loginButton: {
    backgroundColor: "#CD7112",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 10,
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
  registerLink: {
    marginTop: 20,
    alignItems: "center",
  },
  registerLinkText: {
    color: "#CD7112",
    fontSize: 16,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
});


