import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { useAppDispatch } from "@/store/hooks";
import { login } from "@/store/slices/authSlice";
import { authService } from "@/services/supabase/auth";

export default function RegisterScreen() {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    contactNumber: "",
    address: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!formData.email || !formData.password || !formData.name || !formData.surname) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      await authService.signUp(formData.email, formData.password, {
        name: formData.name,
        surname: formData.surname,
        contactNumber: formData.contactNumber,
        address: formData.address,
        cardDetails: {
          cardNumber: formData.cardNumber,
          expiryDate: formData.expiryDate,
          cvv: formData.cvv,
          cardholderName: formData.cardholderName,
        },
      });
      const user = await authService.getCurrentUser();
      if (user) {
        dispatch(login(user));
        router.replace("/(tabs)");
      } else {
        Alert.alert("Error", "Registration successful but failed to load profile");
      }
    } catch (error: any) {
      Alert.alert("Registration Failed", error.message || "An error occurred");
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
        <Text style={styles.pageTitle}>Sign up</Text>

        {/* White Form Panel */}
        <View style={styles.formPanel}>
          {/* Header */}
          <Text style={styles.headerTitle}>Let's get you Signed up</Text>
          <Text style={styles.headerSubtitle}>
            Provide your details below to create an account and get started
          </Text>

          {/* Input Fields */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Name:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Surname:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your surname"
              value={formData.surname}
              onChangeText={(text) => setFormData({ ...formData, surname: text })}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
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
              value={formData.password}
              onChangeText={(text) => setFormData({ ...formData, password: text })}
              secureTextEntry
              placeholderTextColor="#999"
            />
          </View>

          {/* Buttons */}
          <TouchableOpacity
            style={[styles.signUpButton, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={styles.signUpButtonText}>
              {loading ? "Signing up..." : "Sign Up"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Already have an account?{" "}
              <Text
                style={styles.footerLink}
                onPress={() => router.push("/login")}
              >
                Sign in
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
    marginBottom: 24,
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
  signUpButton: {
    backgroundColor: "#88B746",
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 12,
  },
  signUpButtonText: {
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
