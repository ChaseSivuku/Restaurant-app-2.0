import React from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from "react-native";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { router } from "expo-router";

export default function ProfileScreen() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Profile</Text>
        {!isAuthenticated ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Please login to view your profile</Text>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => router.push("/login")}
            >
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.profileContainer}>
            <View style={styles.profileSection}>
              <Text style={styles.label}>Name</Text>
              <Text style={styles.value}>{user?.name} {user?.surname}</Text>
            </View>
            <View style={styles.profileSection}>
              <Text style={styles.label}>Email</Text>
              <Text style={styles.value}>{user?.email}</Text>
            </View>
            <View style={styles.profileSection}>
              <Text style={styles.label}>Contact Number</Text>
              <Text style={styles.value}>{user?.contactNumber}</Text>
            </View>
            <View style={styles.profileSection}>
              <Text style={styles.label}>Address</Text>
              <Text style={styles.value}>{user?.address}</Text>
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => router.push("/edit-profile")}
            >
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
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
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: "#FF6B35",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  profileContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 20,
  },
  profileSection: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: "#8E8E93",
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    color: "#2C2C2E",
    fontWeight: "600",
  },
  editButton: {
    backgroundColor: "#FF6B35",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 10,
  },
  editButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});


