import { Slot, usePathname, useRouter } from "expo-router";
import React from "react";
import { StyleSheet, View, TouchableOpacity, I18nManager } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const Header = () => {
  const router = useRouter();

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons
          name={I18nManager.isRTL ? "arrow-forward" : "arrow-back"}
          size={24}
          color="#1DA1F2"
        />
      </TouchableOpacity>
    </View>
  );
};

const Layout = () => {
  const pathname = usePathname();
  return (
    <>
      {pathname === "/editProfile" && (
        <SafeAreaView style={styles.container} edges={["top"]}>
          <Header />
        </SafeAreaView>
      )}
      <View style={styles.content}>
        <Slot />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E1E8ED",
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 20,
    color: "#14171A",
  },
});

export default Layout;
