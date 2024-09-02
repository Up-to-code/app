import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import LogoImage from "../assets/images/logo.png";
import { router } from "expo-router";

interface HeaderProps {
  title: string;
  leftIcon?: keyof typeof Ionicons.glyphMap | null;
  rightIcon?: keyof typeof Ionicons.glyphMap | null;
  onLeftPress?: () => void;
  onRightPress?: () => void;
  logo?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  title,
  leftIcon,
  rightIcon,
  onLeftPress,
  onRightPress,
  logo,
}) => {
  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <View style={styles.container}>
        {leftIcon ? (
          <TouchableOpacity onPress={onLeftPress} style={styles.iconContainer}>
            <Ionicons name={leftIcon} size={24} color="#1DA1F2" />
          </TouchableOpacity>
        ) : null}
        {logo ? (
          <Image source={LogoImage} style={styles.logo} resizeMode="contain" />
        ) : (
          <Text style={styles.title}>{title}</Text>
        )}
        {rightIcon ? (
          <>
            <View style={styles.iconContainer_right}>
              <TouchableOpacity
                onPress={onRightPress}
                style={styles.iconContainer}
              >
                <Ionicons name={rightIcon} size={24} color="#1DA1F2" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {
                router.push("/notification")
              }} style={styles.iconContainer}>
                <Ionicons name={"notifications"} size={24} color="#1DA1F2" />
              </TouchableOpacity>
            </View>
          </>
        ) : null}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#FFFFFF",
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 50,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E1E8ED",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#14171A",
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 30,
    height: 30,
  },
  iconContainer_right: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default Header;
