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
  Alert,
} from "react-native";
 import * as ImagePicker from "expo-image-picker";
import {
  getUserData,
  uploadImage,
  updateUserProfile,
} from "@/lib/firebase/Services";
import { FIREBASE_AUTH } from "@/lib/firebase/firebaseConfig";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const EditProfileScreen = () => {
  const user = FIREBASE_AUTH.currentUser;
  const [userForEdit, setUserForEdit] = useState({
    name: "",
    profileImage: "",
    backgroundImage: "",
    bio: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userData = await getUserData(user.uid);
          setUserForEdit({
            name: userData.name || "",
            profileImage: userData.profileImage || "",
            backgroundImage: userData.backgroundImage || "",
            bio: userData.bio || "",
            email: userData.email || "",
          });
        } catch (error) {
          console.error("Error fetching user data:", error);
          Alert.alert("Error", "Failed to fetch user data. Please try again.");
        }
      }
    };
    fetchUserData();
  }, [user]);

  const handleImagePick = async (type: "profile" | "background") => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: type === "profile" ? [1, 1] : [16, 9],
        quality: 1,
      });

      if (!result.canceled && result.assets[0].uri) {
        setUserForEdit({
          ...userForEdit,
          [type === "profile" ? "profileImage" : "backgroundImage"]: result.assets[0].uri,
        });
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image. Please try again.");
    }
  };

  const handleSave = async () => {
    if (user) {
      setLoading(true);
      try {
        let imageUrl = userForEdit.profileImage;
        let bgImageUrl = userForEdit.backgroundImage;
        if (userForEdit.profileImage.startsWith("file://")) {
          imageUrl = await uploadImage(
            userForEdit.profileImage,
            `${user.uid}_profile`
          );
        }
        if (userForEdit.backgroundImage.startsWith("file://")) {
          bgImageUrl = await uploadImage(
            userForEdit.backgroundImage,
            `${user.uid}_background`
          );
        }
        await updateUserProfile(user.uid, {
          ...userForEdit,
          profileImage: imageUrl,
          backgroundImage: bgImageUrl,
        });
        Alert.alert("Success", "Profile updated successfully");
        router.back();
      } catch (error) {
        console.error("Error updating profile:", error);
        Alert.alert("Error", "Failed to update profile. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    
      <ScrollView>
        <View style={styles.imageContainer}>
          <TouchableOpacity onPress={() => handleImagePick("background")} style={styles.backgroundImageContainer}>
            {userForEdit.backgroundImage ? (
              <Image
                source={{ uri: userForEdit.backgroundImage }}
                style={styles.backgroundImage}
              />
            ) : (
              <View style={[styles.backgroundImage, styles.placeholderBackground]} />
            )}
            <View style={styles.cameraIconContainer}>
              <Ionicons name="camera" size={24} color="#fff" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleImagePick("profile")}
            style={styles.profileImageContainer}
          >
            {userForEdit.profileImage ? (
              <Image
                source={{ uri: userForEdit.profileImage }}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.profileImage} />
            )}
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.input}
          value={userForEdit.name}
          onChangeText={(text) =>
            setUserForEdit({ ...userForEdit, name: text })
          }
          placeholder="Name"
        />
        <TextInput
          style={styles.input}
          value={userForEdit.email}
          onChangeText={(text) =>
            setUserForEdit({ ...userForEdit, email: text })
          }
          placeholder="Email"
          keyboardType="email-address"
        />
        <TextInput
          style={[styles.input, styles.bioInput]}
          value={userForEdit.bio}
          onChangeText={(text) => setUserForEdit({ ...userForEdit, bio: text })}
          placeholder="Bio"
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
  
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  imageContainer: {
    position: "relative",
    alignItems: "center",
    marginBottom: 50,
  },
  backgroundImageContainer: {
    width: "100%",
    height: 150,
    position: "relative",
  },
  backgroundImage: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
  },
  placeholderBackground: {
    backgroundColor: "#E1E1E1",
  },
  cameraIconContainer: {
    position: "absolute",
    right: 10,
    bottom: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 8,
  },
  profileImageContainer: {
    position: "absolute",
    bottom: -50,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#fff",
  },
  input: {
    borderBottomWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginHorizontal: 20,
    marginBottom: 15,
  },
  bioInput: {
    height: 80,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default EditProfileScreen;
