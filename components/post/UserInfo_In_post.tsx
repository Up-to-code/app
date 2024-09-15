import React, { useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import verification_icon from "@/assets/images/checkmark.png";
import user_icon from "@/assets/images/user.png";
import verification_icon_gold from "@/assets/images/verification_icon_gold.png";
import { getUserData } from "@/lib/firebase/getUsers";
import { FIREBASE_AUTH } from "@/lib/firebase/firebaseConfig";
import { router } from "expo-router";
import Menu_Component from "./Manu";
import { useSharedValue } from "react-native-reanimated";

interface UserInfoProps {
  userid: string;
  imageURL: string | undefined;
  Postid: string;
}

const UserInfo: React.FC<UserInfoProps> = ({ userid, imageURL, Postid }) => {
  const userData = useSharedValue<any>({});
  const user = FIREBASE_AUTH.currentUser;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getUserData(userid);
        // Remove any cash-related data
        const { cash, balance, ...restData } = data;
        userData.value = restData;
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [userid]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.userInfoContainer}
        onPress={() => {
          if (user?.uid === userid) {
            router.push(`/profile`);
          } else {
            router.push(`/Friend/${userid}`);
          }
        }}
      >
        <View style={styles.userImageContainer}>
          <Image
            source={
              userData.value.profileImage
                ? { uri: userData.value.profileImage }
                : user_icon
            }
            style={styles.profileImage}
          />
          {userData.value.verification && (
            <Image
              source={
                userData.value.verification_type === "gold"
                  ? verification_icon_gold
                  : verification_icon
              }
              style={styles.verificationIcon}
            />
          )}
        </View>
        <Text style={styles.userName}>{userData.value.name}</Text>
      </TouchableOpacity>
      {user?.uid === userid && (
        <Menu_Component Postid={Postid} imageURL={imageURL} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  userInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  userImageContainer: {
    position: "relative",
    marginRight: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  verificationIcon: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 16,
    height: 16,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#14171A",
  },
  optionsButton: {
    padding: 5,
    transform: [{ rotate: "90deg" }],
  },
});

export default UserInfo;
