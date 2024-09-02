import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";

import {
  getUserData,
  uploadImage,
  updateUserProfile,
} from "@/lib/firebase/Serves";
import { FIREBASE_AUTH } from "@/lib/firebase/firebaseConfig";
import { router } from "expo-router";

const EditProfileScreen = () => {
  const user = FIREBASE_AUTH.currentUser;
  const [userForEdit, setUserForEdit] = useState<any | null>({
    name: "",
    profileImage: "",
    bio: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userData = await getUserData(user.uid);
          setUserForEdit(userData);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [user]);

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets[0].uri) {
      setUserForEdit({ ...userForEdit, profileImage: result.assets[0].uri });
    }
  };

  const handleSave = async () => {
    if (user) {
      setLoading(true);
      try {
        let imageUrl = userForEdit.profileImage;
        if (userForEdit.profileImage.startsWith("file://")) {
          imageUrl = await uploadImage(userForEdit.profileImage, user.uid);
        }
        await updateUserProfile(user.uid, {
          name: userForEdit.name,
          profileImage: imageUrl,
          bio: userForEdit.bio,
          email: userForEdit.email,
        }).then(()=> router.back());
        // You might want to add navigation back to the profile screen here
      } catch (error) {
        console.error("Error updating profile:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <TouchableOpacity
          onPress={handleImagePick}
          style={styles.imageContainer}
        >
          {userForEdit.profileImage ? (
            <Image
              source={{ uri: userForEdit.profileImage }}
              style={styles.profileImage}
            />
          ) : (
            <View style={styles.placeholderImage}>
              <Text>Tap to add image</Text>
            </View>
          )}
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          value={userForEdit.name}
          onChangeText={(text) =>
            setUserForEdit({ ...userForEdit, name: text })
          }
          placeholder="Enter your name"
        />
        <TextInput
          style={styles.input}
          value={userForEdit.email}
          onChangeText={(text) =>
            setUserForEdit({ ...userForEdit, email: text })
          }
          placeholder="Enter your email"
          keyboardType="email-address"
        />
        <TextInput
          style={[styles.input, styles.bioInput]}
          value={userForEdit.bio}
          onChangeText={(text) => setUserForEdit({ ...userForEdit, bio: text })}
          placeholder="Enter your bio"
          multiline
        />
        <TouchableOpacity
          style={styles.button}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>Save Changes</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  placeholderImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#e1e1e1",
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  bioInput: {
    height: 100,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#4267B2",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default EditProfileScreen;
