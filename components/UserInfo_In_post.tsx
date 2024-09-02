import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import verification_icon from "@/assets/images/checkmark.png";
import user_icon from "@/assets/images/user.png";
import verification_icon_gold from "@/assets/images/verification_icon_gold.png";
interface UserInfoProps {
  userData: {
    profileImage: string | null;
    name: string | null;
    verification: boolean;
    verification_type: "gold" | "blue" | "gray";
  };
}

const UserInfo: React.FC<UserInfoProps> = ({ userData }) => {
  return (
    <View style={styles.userInfo}>
      <View style={styles.userImageContainer}>
        <Image
          source={userData.profileImage ? { uri: userData.profileImage } : user_icon}
          style={styles.profileImage}
        />
        {userData.verification && (
          <Image source={(userData.verification_type === "gold") ? verification_icon_gold : verification_icon}
         
          className="w-6 h-6 absolute bottom-[-2px] right-[-4px] " />
        )}
      </View>
      <Text style={styles.userName}>{userData.name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  userImageContainer: {
    position: "relative",
    marginRight: 10,
  },
  profileImage: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
  },
  verificationIcon: {
    position: "absolute",
    bottom: -5,
    right: -5,
    width: 15,
    height: 15,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#14171A",
  },
});

export default UserInfo;
