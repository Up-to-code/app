import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { getUserData } from "@/lib/firebase/getUsers";
import { addFriend } from "@/lib/firebase/friendsServes/addfriend";
import { removeFriend } from "@/lib/firebase/friendsServes/removeFriend";
import { acceptFriend } from "@/lib/firebase/friendsServes/acceptFriend";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import user_icon from "@/assets/images/user.png";
import { getFiend } from "@/lib/firebase/friendsServes/getFiend";
import Button from "@/components/ui/Button";
type FriendStatus = "none" | "pending" | "friend";

const FriendScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [userData, setUserData] = useState<any | null>(null);
  const [friendStatus, setFriendStatus] = useState<FriendStatus>("none");
  const [loading, setLoading] = useState(false);
  const [isFriendLoading, setIsFriendLoding] = useState(false);
  useEffect(() => {
    const fetchUserData = async () => {
      if (typeof id !== "string") return;
      try {
        const data = await getUserData(id);
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [id]);

  useEffect(() => {
    const fetchFriendStatus = async () => {
      console.log("id", id);
      setIsFriendLoding(true);
      if (typeof id !== "string") return;
      try {
        const friendStatus_id = await getFiend(id);
         if (friendStatus_id) {
          setFriendStatus("friend");
        }
      } catch (error) {
        console.error("Error fetching friend status:", error);
      } finally {
        setIsFriendLoding(false);
      }
    };
    fetchFriendStatus();
  }, [id]);

  const handleAddFriend = async () => {
    if (typeof id !== "string") return;
    try {
      await addFriend(id);
      setFriendStatus("pending");
    } catch (error) {
      console.error("Error adding friend:", error);
    }
  };

  const handleRemoveFriend = async () => {
    if (typeof id !== "string") return;
    try {
      await removeFriend(id);
      setFriendStatus("none");
    } catch (error) {
      console.error("Error removing friend:", error);
    }
  };

  const handleAcceptFriend = async () => {
    if (typeof id !== "string") return;
    try {
      await acceptFriend(id);
      setFriendStatus("friend");
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };

  if (!userData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1DA1F2" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#1DA1F2" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{userData.name}</Text>
        </View>
        <View style={styles.profileImage}>
          {userData.profileImage ? (
            <Image
              source={{ uri: userData.profileImage }}
              style={styles.UserImage}
            />
          ) : (
            <Image source={user_icon} style={styles.UserImage} />
          )}
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.name}>{userData.name}</Text>
          <Text style={styles.bio}>{userData.bio}</Text>
          <View style={styles.statsContainer}>
            <Text style={styles.statsText}>
              <Text style={styles.statsBold}>250</Text> Following
            </Text>
            <Text style={styles.statsText}>
              <Text style={styles.statsBold}>1.2K</Text> Followers
            </Text>
          </View>
        </View>
 
      {
        isFriendLoading ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <>
            {friendStatus === "none" && (
              <TouchableOpacity
                style={styles.button}
                onPress={handleAddFriend}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.buttonText}>Add Friend</Text>
                )}
              </TouchableOpacity>
            )}
            {friendStatus === "pending" && (
              <TouchableOpacity
                style={[styles.button, styles.pendingButton]}
                onPress={handleAcceptFriend}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.buttonText}>Pending</Text>
                )}
              </TouchableOpacity>
            )}
            {friendStatus === "friend" && (
              <Button
                className="bg-zinc-700"
                activeOpacity={0.8}
                onPress={() => router.push(`/chat/${id}`)}
                title="Chat"
              />
            )}
          </>
        )
      }

         
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F0F0F0",
    borderRadius: 20,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E1E8ED",
  },
  backButton: {
    padding: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 20,
  },
  profileImage: {
    width: Dimensions.get("screen").width - 20,
    height: 150,
    resizeMode: "cover",
    borderRadius: 20,
    backgroundColor: "#373737",
    position: "relative",
    marginBottom: 40,
    marginHorizontal: 10,
  },
  UserImage: {
    width: 80,
    height: 80,
    resizeMode: "cover",
    borderRadius: 100,
    maxHeight: 150,
    maxWidth: 150,
    position: "absolute",
    bottom: -40,
    left: 10,
  },
  userInfo: {
    padding: 15,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
  },
  username: {
    fontSize: 15,
    color: "#657786",
    marginBottom: 10,
  },
  bio: {
    fontSize: 16,
    marginBottom: 15,
  },
  statsContainer: {
    flexDirection: "row",
    marginBottom: 15,
  },
  statsText: {
    marginRight: 20,
    color: "#657786",
  },
  statsBold: {
    fontWeight: "bold",
    color: "#14171A",
  },
  button: {
    backgroundColor: "#1DA1F2",
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
    marginHorizontal: 15,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  pendingButton: {
    backgroundColor: "#AAB8C2",
  },
  followingButton: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#1DA1F2",
  },
  followingButtonText: {
    color: "#1DA1F2",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default FriendScreen;
