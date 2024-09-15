import React, { useState, useCallback } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  collection,
  query as firestoreQuery,
  where,
  getDocs,
  limit,
} from "firebase/firestore";
import { FIREBASE_AUTH, FIREBASE_DB } from "@/lib/firebase/firebaseConfig";
import { SafeAreaView } from "react-native-safe-area-context";
import RenderUserItem from "@/components/UserItem";
import { User } from "@/app/types/user";
import { debounce } from "lodash";

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const uid = FIREBASE_AUTH.currentUser?.uid;

  const handleSearch = useCallback(
    debounce(async (query: string) => {
      if (query.length > 0) {
        setIsLoading(true);
        try {
          const usersRef = collection(FIREBASE_DB, "users");
          const q = firestoreQuery(
            usersRef,
            where("name", ">=", query),
            where("name", "<=", query + "\uf8ff"),
            limit(20)
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
                verification_type: userData.verification_type || "",
              });
            }
          });

          setSearchResults(results);
        } catch (error) {
          console.error("Error searching users:", error);
          setSearchResults([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSearchResults([]);
        setIsLoading(false);
      }
    }, 300),
    [uid]
  );

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
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
            onChangeText={(text) => {
              setSearchQuery(text);
              handleSearch(text);
            }}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <Ionicons name="close-circle" size={20} color="#657786" />
            </TouchableOpacity>
          )}
        </View>
        {isLoading ? (
          <ActivityIndicator style={styles.loader} size="large" color="#1DA1F2" />
        ) : (
          <FlatList
            data={searchResults}
            renderItem={({ item }) => <RenderUserItem item={item} />}
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
        )}
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
  clearButton: {
    padding: 5,
  },
  listContainer: {
    flexGrow: 1,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    color: "#657786",
    fontSize: 16,
  },
  loader: {
    marginTop: 20,
  },
});

export default SearchScreen;
