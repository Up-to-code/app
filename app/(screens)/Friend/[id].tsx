import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  I18nManager,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { getUserData } from "@/lib/firebase/getUsers";
import { addFriend } from "@/lib/firebase/friendsServes/addfriend";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import user_icon from "@/assets/images/user.png";
import { getFiend } from "@/lib/firebase/friendsServes/getFiend";
import verification_icon from "@/assets/images/verification64.png";
import verification_icon_gold from "@/assets/images/verification_icon_gold.png";
import { Colors } from "@/constants/Colors";

type FriendStatus = "none" | "pending" | "friend";

const FriendScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [userData, setUserData] = useState<any | null>(null);
  const [friendStatus, setFriendStatus] = useState<FriendStatus>("none");
  const [loading, setLoading] = useState(false);
  const [isFriendLoading, setIsFriendLoading] = useState(false);

  const fetchUserData = useCallback(async () => {
    if (typeof id !== "string") return;
    try {
      const data = await getUserData(id);
      setUserData(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }, [id]);

  const fetchFriendStatus = useCallback(async () => {
    if (typeof id !== "string") return;
    setIsFriendLoading(true);
    try {
      const friendStatus_id = await getFiend(id);
      if (friendStatus_id) {
        setFriendStatus("friend");
      }
    } catch (error) {
      console.error("Error fetching friend status:", error);
    } finally {
      setIsFriendLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchUserData();
    fetchFriendStatus();
  }, [fetchUserData, fetchFriendStatus]);

  const handleAddFriend = async () => {
    if (typeof id !== "string") return;
    setLoading(true);
    try {
      await addFriend(id);
      setFriendStatus("pending");
    } catch (error) {
      console.error("Error adding friend:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChat = () => {
    if (typeof id !== "string") return;
    router.push(`/chat/${id}`);
  };

  if (!userData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.light.twitter.blue} />
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
            <Ionicons name={I18nManager.isRTL ? "arrow-forward" : "arrow-back"} size={24} color={Colors.light.twitter.blue} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{userData.name}</Text>
          <View style={styles.headerPlaceholder} />
        </View>
        
        <View style={styles.coverImageContainer}>
          <Image 
            source={{ uri: userData.backgroundImage || 'https://via.placeholder.com/500x200' }}
            style={styles.coverImage}
          />
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: userData.profileImage || user_icon }}
              style={styles.profileImage}
            />
          </View>
        </View>
        
        <View style={styles.userInfo}>
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{userData.name}</Text>
            {userData.verification && (
              <Image 
                source={userData.verification_type === "gold" ? verification_icon_gold : verification_icon} 
                style={styles.verifiedIcon} 
              />
            )}
          </View>
          <Text style={styles.bio}>{userData.bio}</Text>
        </View>

        {isFriendLoading ? (
          <ActivityIndicator size="small" color={Colors.light.twitter.blue} style={styles.loader} />
        ) : (
          <View style={styles.buttonContainer}>
            {friendStatus === "none" && (
              <TouchableOpacity
                style={styles.button}
                onPress={handleAddFriend}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color={Colors.light.background} />
                ) : (
                  <Text style={styles.buttonText}>Follow</Text>
                )}
              </TouchableOpacity>
            )}
 
            {friendStatus === "friend" && (
              <>
                <TouchableOpacity
                  style={[styles.button, styles.chatButton]}
                  activeOpacity={0.8}
                  onPress={handleChat}
                >
                  <Text style={[styles.buttonText, styles.chatButtonText]}>Chat</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
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
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.twitter.extraLightGray,
  },
  backButton: {
    padding: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    textAlign: 'center',
    color: Colors.light.text,
  },
  headerPlaceholder: {
    width: 44,  // Same width as the back button
  },
  coverImageContainer: {
    position: 'relative',
    height: 150,
  },
  coverImage: {
    width: '100%',
    height: '100%',
    resizeMode: "cover",
  },
  profileImageContainer: {
    position: 'absolute',
    bottom: -50,
    [I18nManager.isRTL ? 'right' : 'left']: 15,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: Colors.light.background,
  },
  userInfo: {
    marginTop: 60,
    padding: 15,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.light.text,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
  verifiedIcon: {
    width: 20,
    height: 20,
    marginLeft: 5,
    marginRight: I18nManager.isRTL ? 5 : 0,
  },
  bio: {
    fontSize: 16,
    marginTop: 10,
    color: Colors.light.twitter.darkGray,
    fontFamily: "Cairo-Regular",
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    paddingHorizontal: 15,
  },
  button: {
    flex: 1,
    backgroundColor: Colors.light.twitter.blue,
    padding: 12,
    borderRadius: 30,
    alignItems: "center",
    marginHorizontal: 5,
  },
  buttonText: {
    color: Colors.light.background,
    fontSize: 16,
    fontWeight: "bold",
  },
  pendingButton: {
    backgroundColor: Colors.light.background,
    borderWidth: 1,
    borderColor: Colors.light.twitter.blue,
  },
  pendingButtonText: {
    color: Colors.light.twitter.blue,
  },
  followingButton: {
    backgroundColor: Colors.light.background,
    borderWidth: 1,
    borderColor: Colors.light.twitter.blue,
  },
  followingButtonText: {
    color: Colors.light.twitter.blue,
  },
  chatButton: {
    backgroundColor: Colors.light.twitter.blue,
  },
  chatButtonText: {
    color: Colors.light.background,
  },
  loader: {
    marginVertical: 20,
  },
});

export default FriendScreen;