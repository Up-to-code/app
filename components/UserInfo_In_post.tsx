import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import verification_icon from "@/assets/images/checkmark.png";
import user_icon from "@/assets/images/user.png";

interface UserInfoProps {
  userData: {
    profileImage: string | null;
    name: string | null;
    verification: boolean;
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
          <Image source={verification_icon} style={styles.verificationIcon} />
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
  },
});

export default UserInfo;
