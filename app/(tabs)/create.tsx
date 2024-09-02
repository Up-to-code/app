import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import Button from '@/components/ui/Button';
import { Ionicons } from '@expo/vector-icons';
import { createPost } from '@/lib/firebase/createpost';
import { FIREBASE_AUTH } from '@/lib/firebase/firebaseConfig';
 
const CreatePostScreen = () => {
  const [postText, setPostText] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const user = FIREBASE_AUTH.currentUser;

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handlePost = async () => {
    if (!user) {
      console.error('User not authenticated');
      return;
    }

    setIsLoading(true);
    try {
      await createPost(user.uid, postText, image as string);
      console.log('Post created successfully');
      // Reset form after successful post
      setPostText('');
      setImage(null);
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TextInput
          style={styles.input}
          multiline
          placeholder="What's on your mind?"
          placeholderTextColor="#888"
          value={postText}
          onChangeText={setPostText}
          editable={!isLoading}
        />
        {image && <Image source={{ uri: image }} style={styles.image} />}
        <View style={styles.actionButtons}>
          <TouchableOpacity onPress={pickImage} style={styles.actionButton} disabled={isLoading}>
            <Ionicons name="image-outline" size={24} color="#4267B2" />
          </TouchableOpacity>
        </View>
        {isLoading ? (
          <ActivityIndicator size="large" color="#4267B2" style={styles.loader} />
        ) : (
          <Button
            title="Create Post"
            onPress={handlePost}
            style={styles.createPostButton}
            disabled={isLoading}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  postButton: {
    backgroundColor: '#f0f2f5',
    borderRadius: 20,
  },
  postButtonText: {
    color: '#000',
  },
  scrollContent: {
    padding: 20,
  },
  input: {
    minHeight: 120,
    fontSize: 18,
    textAlignVertical: 'top',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    color: '#000',
  },
  image: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
    borderRadius: 12,
    marginBottom: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: '#F0F2F5',
    padding: 10,
    borderRadius: 50,
  },
  createPostButton: {
    marginTop: 20,
  },
  loader: {
    marginTop: 20,
  },
});

export default CreatePostScreen;
