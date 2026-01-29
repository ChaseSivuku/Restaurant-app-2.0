import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { useAppDispatch } from "@/store/hooks";
import { login } from "@/store/slices/authSlice";
import { User } from "@/store/slices/authSlice";

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

  const handleRegister = () => {
    // Placeholder registration - will be replaced with Supabase later
    const mockUser: User = {
      uid: "mock-uid-" + Date.now(),
      name: formData.name,
      surname: formData.surname,
      email: formData.email,
      contactNumber: formData.contactNumber,
      address: formData.address,
      cardDetails: {
        cardNumber: formData.cardNumber,
        expiryDate: formData.expiryDate,
        cvv: formData.cvv,
        cardholderName: formData.cardholderName,
      },
    };
    dispatch(login(mockUser));
    router.replace("/(tabs)");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Register</Text>
        <Text style={styles.subtitle}>Create your account</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Surname</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your surname"
            value={formData.surname}
            onChangeText={(text) => setFormData({ ...formData, surname: text })}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Contact Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your contact number"
            value={formData.contactNumber}
            onChangeText={(text) =>
              setFormData({ ...formData, contactNumber: text })
            }
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your address"
            value={formData.address}
            onChangeText={(text) => setFormData({ ...formData, address: text })}
            multiline
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Card Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter card number"
            value={formData.cardNumber}
            onChangeText={(text) =>
              setFormData({ ...formData, cardNumber: text })
            }
            keyboardType="numeric"
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
            <Text style={styles.label}>Expiry Date</Text>
            <TextInput
              style={styles.input}
              placeholder="MM/YY"
              value={formData.expiryDate}
              onChangeText={(text) =>
                setFormData({ ...formData, expiryDate: text })
              }
            />
          </View>
          <View style={[styles.inputContainer, { flex: 1 }]}>
            <Text style={styles.label}>CVV</Text>
            <TextInput
              style={styles.input}
              placeholder="CVV"
              value={formData.cvv}
              onChangeText={(text) => setFormData({ ...formData, cvv: text })}
              keyboardType="numeric"
              secureTextEntry
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Cardholder Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter cardholder name"
            value={formData.cardholderName}
            onChangeText={(text) =>
              setFormData({ ...formData, cardholderName: text })
            }
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter password"
            value={formData.password}
            onChangeText={(text) =>
              setFormData({ ...formData, password: text })
            }
            secureTextEntry
          />
        </View>

        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.registerButtonText}>Register</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginLink}
          onPress={() => router.back()}
        >
          <Text style={styles.loginLinkText}>Already have an account? Login</Text>
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
  row: {
    flexDirection: "row",
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
  registerButton: {
    backgroundColor: "#CD7112",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 10,
  },
  registerButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
  loginLink: {
    marginTop: 20,
    alignItems: "center",
  },
  loginLinkText: {
    color: "#CD7112",
    fontSize: 16,
  },
});


