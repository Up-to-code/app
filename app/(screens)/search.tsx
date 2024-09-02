import React, { useState } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  collection,
  query as firestoreQuery,
  where,
  getDocs,
} from "firebase/firestore";
import { FIREBASE_AUTH, FIREBASE_DB } from "@/lib/firebase/firebaseConfig";
import { SafeAreaView } from "react-native-safe-area-context";
import { matchChars } from "@/lib/matchChars";
import verification_icon from "@/assets/images/checkmark.png";
import { router } from "expo-router";

interface User {
  id: string;
  name: string;
  profileImage: string;
  userName: string;
  bio: string;
  verification: boolean;
}

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const uid = FIREBASE_AUTH.currentUser?.uid;

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length > 0) {
      try {
        const usersRef = collection(FIREBASE_DB, "users");
        const q = firestoreQuery(
          usersRef,
          where("name", ">=", query),
          where("name", "<=", query + "\uf8ff")
        );
        const querySnapshot = await getDocs(q);

        const results: User[] = [];
        querySnapshot.forEach((doc) => {
          const userData = doc.data() as User;
          if (userData.id !== uid) {
            results.push({
              id: doc.id,
              name: userData.name,
              userName: userData.userName || "",
              profileImage:
                userData.profileImage || "https://via.placeholder.com/50",
              bio: userData.bio || "",
              verification: userData.verification || false,
            });
          }
        });

        setSearchResults(results);
      } catch (error) {
        console.error("Error searching users:", error);
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
    }
  };

  const renderUserItem = ({ item }: { item: User }) => (
    <TouchableOpacity 
      style={styles.userItem}  
      onPress={() => {
        router.push(`/Friend/${item.id}`);
      }}
    >
      <Image source={{ uri: item.profileImage }} style={styles.profileImage} />
      <View style={styles.userInfo}>
        <View style={styles.nameContainer}>
          <Text style={styles.userName}>{item.name}</Text>
          {item.verification && (
            <Image source={verification_icon} style={styles.verifiedIcon} />
          )}
        </View>
        <Text style={styles.userBio}>{matchChars(10, item.bio)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.searchBar}>
          <Ionicons
            name="search"
            size={20}
            color="#657786"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search Twitter"
            placeholderTextColor="#657786"
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
        <FlatList
          data={searchResults}
          renderItem={renderUserItem}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              {searchQuery
                ? "No results found"
                : "Try searching for people, topics, or keywords"}
            </Text>
          }
          contentContainerStyle={styles.listContainer}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5FE",
    borderRadius: 25,
    margin: 10,
    paddingHorizontal: 15,
    height: 50,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#14171A",
  },
  listContainer: {
    flexGrow: 1,
  },
  userItem: {
    flexDirection: "row",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E1E8ED",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  userInfo: {
    justifyContent: "center",
    flex: 1,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  userName: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#14171A",
    marginBottom: 2,
  },
  verifiedIcon: {
    width: 16,
    height: 16,
    marginLeft: 5,
  },
  userBio: {
    color: "#14171A",
    fontSize: 14,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    color: "#657786",
    fontSize: 16,
  },
});

export default SearchScreen;
