import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "@/components/ui/Button";
import { FIREBASE_AUTH } from "@/lib/firebase/firebaseConfig";
import { getUserData } from "@/lib/firebase/getUsers";
import { router } from "expo-router";
import GetUserPosts from "@/components/GetUserPosts";
import verification_icon from "@/assets/images/verification64.png";
import user_icon from "@/assets/images/user.png";

const ProfileScreen = () => {
  const user = FIREBASE_AUTH.currentUser;
  const [userData, setUserData] = useState({
    name: "",
    profileImage: "",
    bio: "",
    posts: 0,
    FriendCount: 0,
    verification: false,
  });
  const [refreshing, setRefreshing] = useState(false);

  const fetchUserData = async () => {
    if (user) {
      try {
        const data = await getUserData(user.uid);
        setUserData({
          name: data.name || "Anonymous",
          profileImage: data.profileImage || "",
          bio: data.bio || "No bio available",
          posts: data.postCount || 0,
          FriendCount: data.FriendCount || 0,
          verification: data.verification || false,
        });
        console.log(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [user]);

  const handleEditProfile = () => {
    router.push("/editProfile");
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchUserData().then(() => setRefreshing(false));
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <View style={styles.profileImageContainer}>
            {userData.profileImage ? (
              <Image
                style={styles.profileImage}
                source={{ uri: userData.profileImage }}
              />
            ) : (
              <Image source={user_icon} style={styles.profileImage} />
            )}
            {userData.verification && (
              <Image
                source={verification_icon}
                style={styles.verificationIcon}
              />
            )}
          </View>

          <Text style={styles.name}>{userData.name}</Text>
          <Text style={styles.bio}>{userData.bio}</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userData.posts}</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userData.FriendCount}</Text>
            <Text style={styles.statLabel}>Friends</Text>
          </View>
        </View>

        <Button
          title="Edit Profile"
          onPress={handleEditProfile}
          style={styles.editButton}
        />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.sectionContent}>{userData.bio}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Posts</Text>
          <GetUserPosts />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
  },
  profileImageContainer: {
    position: "relative",
    marginBottom: 10,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  verificationIcon: {
    position: "absolute",
    bottom: 5,
    right: 5,
    width: 40,
    height: 40,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  bio: {
    fontSize: 16,
    color: "gray",
    textAlign: "center",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 20,
    backgroundColor: "white",
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 14,
    color: "gray",
  },
  editButton: {
    margin: 20,
  },
  section: {
    backgroundColor: "white",
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  sectionContent: {
    fontSize: 16,
    color: "gray",
  },
});

export default ProfileScreen;
