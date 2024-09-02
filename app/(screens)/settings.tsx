import React, { useState } from "react";
import {
  View,
  Text,
  Switch,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { logout } from "@/lib/firebase/auth/logout";

const SettingsScreen = () => {
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);
  const [isDarkModeEnabled, setIsDarkModeEnabled] = useState(false);
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);

  const toggleNotifications = () =>
    setIsNotificationsEnabled((previousState) => !previousState);
  const toggleDarkMode = () =>
    setIsDarkModeEnabled((previousState) => !previousState);
  const handleLogout = () => {
    setIsLogoutModalVisible(true);
  };
  const confirmLogout = () => {
    setIsLogoutModalVisible(false);
    logout();
  };
  const cancelLogout = () => {
    setIsLogoutModalVisible(false);
  };

  return (
    <SafeAreaView
      style={[styles.container, isDarkModeEnabled && styles.darkContainer]}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons
            name="arrow-back"
            size={24}
            color={isDarkModeEnabled ? "white" : "black"}
          />
        </TouchableOpacity>
        <Text
          style={[
            styles.headerTitle,
            isDarkModeEnabled && styles.darkHeaderTitle,
          ]}
        >
          Settings
        </Text>
      </View>
      <View style={styles.settingItem}>
        <Text
          style={[
            styles.settingText,
            isDarkModeEnabled && styles.darkSettingText,
          ]}
        >
          Notifications
        </Text>
        <Switch
          value={isNotificationsEnabled}
          onValueChange={toggleNotifications}
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isNotificationsEnabled ? "#f5dd4b" : "#f4f3f4"}
        />
      </View>
      <View style={styles.settingItem}>
        <Text
          style={[
            styles.settingText,
            isDarkModeEnabled && styles.darkSettingText,
          ]}
        >
          Dark Mode
        </Text>
        <Switch
          value={isDarkModeEnabled}
          onValueChange={toggleDarkMode}
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isDarkModeEnabled ? "#f5dd4b" : "#f4f3f4"}
        />
      </View>
      <TouchableOpacity style={styles.logoutButtonContainer} onPress={handleLogout}>
        <Text
          style={[
            styles.logoutText,
            isDarkModeEnabled && styles.darkSettingText,
          ]}
        >
          Logout  
        </Text>
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={isLogoutModalVisible}
        onRequestClose={cancelLogout}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Logout</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to logout?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={cancelLogout}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.logoutButton]}
                onPress={confirmLogout}
              >
                <Text style={styles.logoutButtonText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  darkContainer: {
    backgroundColor: "#000",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
    color: "black",
    fontFamily: "Cairo-Bold",
  },
  darkHeaderTitle: {
    color: "white",
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  settingText: {
    fontSize: 16,
    color: "black",
    fontFamily: "Cairo-Bold",
  },
  darkSettingText: {
    color: "white",
  },
  logoutText: {
    fontSize: 24,
    color: "#ff7b7b",
    fontFamily: "Cairo-Bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    fontFamily: "Cairo-Bold",
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
    fontFamily: "Cairo-Bold",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#ccc",
    marginRight: 10,
  },
  logoutButton: {
    backgroundColor: "#ff7b7b",
  },
  cancelButtonText: {
    color: "white",
    fontWeight: "bold",
    fontFamily: "Cairo-Bold",
  },
  logoutButtonText: {
    color: "white",
    fontWeight: "bold",
    fontFamily: "Cairo-Bold",
  },
  logoutButtonContainer: {
    marginTop: 20,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
});

export default SettingsScreen;