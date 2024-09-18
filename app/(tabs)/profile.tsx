import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { FIREBASE_AUTH } from "@/lib/firebase/firebaseConfig";
import { getUserData } from "@/lib/firebase/getUsers";
import { router } from "expo-router";
import verification_icon from "@/assets/images/verification64.png";
import user_icon from "@/assets/images/user.png"; // Local fallback image

const ProfileScreen = () => {
  const user = FIREBASE_AUTH.currentUser;

  const [userData, setUserData] = useState({
    name: "Anonymous",
    profileImage: "",
    bio: "No bio available",
    posts: 0,
    FriendCount: 0,
    verification: false,
    verification_type: "gray",
    backgroundImage: "",
  });

  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Error handling

  // Fetch user data function
  const fetchUserData = async () => {
    if (user) {
      try {
        const data = await getUserData(user.uid);
        if (data) {
          setUserData({
            name: data.name || "Anonymous",
            profileImage: data.profileImage || "", // Allow empty string fallback
            bio: data.bio || "No bio available",
            posts: data.postCount || 0,
            FriendCount: data.FriendCount || 0,
            verification: data.verification || false,
            verification_type: data.verification_type || "gray",
            backgroundImage: data.backgroundImage || "", // Allow empty string fallback
          });
        } else {
          console.log("No user data found, using default values");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Unable to fetch user data.");
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]); // Only refetch when `user` changes

  // Refresh control
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchUserData().finally(() => setRefreshing(false)); // Ensure refresh ends
  }, [user]);

  const handleEditProfile = () => {
    router.push("/editProfile");
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.headerContainer}>
            {userData.backgroundImage ? (
              <ImageBackground
                source={{ uri: userData.backgroundImage }}
                style={styles.headerBackground}
              >
                <View style={styles.headerOverlay} />
              </ImageBackground>
            ) : (
              <View style={styles.headerBackground}>
                <View style={styles.headerOverlay} />
              </View>
            )}

            <View style={styles.profileImageContainer}>
              {userData.profileImage ? (
                <Image
                  style={styles.profileImage}
                  source={{ uri: userData.profileImage }}
                />
              ) : (
                <Image style={styles.profileImage} source={user_icon} /> // Fallback to local image
              )}
            </View>
          </View>

          <View style={styles.contentContainer}>
            <View style={styles.nameContainer}>
              <Text style={styles.name}>{userData.name}</Text>
              {userData.verification && (
                <Image
                  source={verification_icon}
                  style={styles.verificationIcon}
                />
              )}
            </View>
            <Text style={styles.bio}>{userData.bio}</Text>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{userData.FriendCount}</Text>
                <Text style={styles.statLabel}>Friends</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{userData.posts}</Text>
                <Text style={styles.statLabel}>Posts</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.editButton}
              onPress={handleEditProfile}
            >
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  headerContainer: {
    height: 200,
    position: "relative",
  },
  headerBackground: {
    height: "100%",
    width: "100%",
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  profileImageContainer: {
    position: "absolute",
    bottom: -50,
    left: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  contentContainer: {
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000000",
    marginRight: 5,
  },
  verificationIcon: {
    width: 20,
    height: 20,
  },
  bio: {
    fontSize: 16,
    color: "#666666",
    marginBottom: 15,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 20,
  },
  statItem: {
    marginRight: 20,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000000",
  },
  statLabel: {
    fontSize: 14,
    color: "#666666",
  },
  editButton: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  editButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
});

export default ProfileScreen;
