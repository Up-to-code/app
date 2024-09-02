import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ListRenderItem,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  getWhitelist,
  removeFromWhitelist,
} from "@/lib/firebase/notificationServices";
import { FIREBASE_AUTH } from "@/lib/firebase/firebaseConfig";
import { getUserData } from "@/lib/firebase/getUsers";
import { acceptFriend } from "@/lib/firebase/friendsServes/acceptFriend";
 
interface WhitelistItem {
  id: string;
  name: string;
  profileImage: string;
}

const WhitelistScreen = () => {
  const [whitelist, setWhitelist] = useState<WhitelistItem[]>([]);

  const fetchWhitelist = async () => {
    const user = FIREBASE_AUTH.currentUser;
    if (user) {
      try {
        const whitelistData = await getWhitelist(user.uid);
        const updatedWhitelist = await Promise.all(
          whitelistData.map(async (item) => {
            const userData = await getUserData(item.id);
            return {
              id: item.id,
              name: userData.name,
              profileImage: userData.profileImage,
            };
          })
        );
        setWhitelist(updatedWhitelist);
      } catch (error) {
        console.error("Error fetching whitelist:", error);
        Alert.alert("Error", "Failed to fetch whitelist. Please try again.");
      }
    }
  };

  useEffect(() => {
    fetchWhitelist();
  }, []);

  const handleRemoveFromWhitelist = async (itemId: string, itemName: string) => {
    const user = FIREBASE_AUTH.currentUser;
    if (user) {
      Alert.alert(
        "Remove from Whitelist",
        `Are you sure you want to remove ${itemName} from your whitelist?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Remove",
            style: "destructive",
            onPress: async () => {
              try {
                await removeFromWhitelist(user.uid, itemId);
                setWhitelist((prev) => prev.filter((item) => item.id !== itemId));
              } catch (error) {
                console.error("Error removing from whitelist:", error);
                Alert.alert("Error", "Failed to remove from whitelist. Please try again.");
              }
            },
          },
        ]
      );
    }
  };

  const handleAddFriend = async (itemId: string, itemName: string) => {
    const user = FIREBASE_AUTH.currentUser;
    if (user) {
      Alert.alert(
        "Add Friend",
        `Do you want to add ${itemName} as a friend?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Add",
            onPress: async () => {
              try {
                await acceptFriend(itemId).then(()=>{
                   
                });
                Alert.alert("Success", `${itemName} has been added as a friend.`);
              } catch (error) {
                console.error("Error adding friend:", error);
                Alert.alert("Error", "Failed to add friend. Please try again.");
              }
            },
          },
        ]
      );
    }
  };

  const renderWhitelistItem: ListRenderItem<WhitelistItem> = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.userInfo}>
        <Image source={{ uri: item.profileImage }} style={styles.itemImage} />
        <Text style={styles.itemName}>{item.name}</Text>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity
          onPress={() => handleRemoveFromWhitelist(item.id, item.name)}
          style={styles.removeButton}
        >
          <Ionicons name="close-circle-outline" size={24} color="#FF3B30" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleAddFriend(item.id, item.name)}
          style={styles.addFriendButton}
        >
          <Text style={styles.addFriendText}>Add Friend</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#1DA1F2" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Whitelist</Text>
      </View>
      <FlatList
        data={whitelist}
        renderItem={renderWhitelistItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <>
            <Text style={styles.sectionTitle}>Whitelist</Text>
            {whitelist.length === 0 && (
              <Text style={styles.emptyText}>Your whitelist is empty.</Text>
            )}
          </>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E1E8ED",
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#14171A",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#14171A",
    padding: 15,
    backgroundColor: "#F5F8FA",
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E1E8ED",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  itemName: {
    fontSize: 16,
    color: "#14171A",
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  removeButton: {
    padding: 5,
    marginRight: 10,
  },
  addFriendButton: {
    backgroundColor: "#1DA1F2",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  addFriendText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    color: "#657786",
  },
});

export default WhitelistScreen;
