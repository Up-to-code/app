import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Text, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import Button from '@/components/ui/Button';
import { Ionicons } from '@expo/vector-icons';
import { createPost, createPostWithYouTube } from '@/lib/firebase/createpost';
import { FIREBASE_AUTH } from '@/lib/firebase/firebaseConfig';
import { getThumbnail, ThumbnailData } from '@/lib/getThumbnail';

const CreatePostScreen = () => {
  const [postText, setPostText] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const user = FIREBASE_AUTH.currentUser;
  const [youTubeVideo, setYouTubeVideo] = useState<{
    url: string;
    thumbnail: ThumbnailData | null;
    isYouTubeVideo: boolean;
    isOpen: boolean;
  } | null>(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setYouTubeVideo(null);
    }
  };

  const handlePost = async () => {
    if (!user) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }
    if (!postText.trim() && !image && !youTubeVideo?.url) {
      Alert.alert('Error', 'Please add some content to your post');
      return;
    }

    setIsLoading(true);
    try {
      if (youTubeVideo?.url && youTubeVideo.thumbnail) {
        await createPostWithYouTube(user.uid, postText, youTubeVideo.url, youTubeVideo.thumbnail);
      } else {
        await createPost(user.uid, postText, image || undefined);
      }
       
      Alert.alert('Success', 'Post created successfully');
      setPostText('');
      setImage(null);
      setYouTubeVideo(null);
    } catch (error) {
      console.error('Error creating post:', error);
      Alert.alert('Error', 'Failed to create post. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const extractAndProcessYouTubeUrl = async () => {
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const match = postText.match(urlRegex);
      if (match) {
        const url = match[0];
        try {
          setIsLoading(true);
          const thumbnailData = await getThumbnail(url);
          if (thumbnailData.error) {
            console.error('Error fetching thumbnail:', thumbnailData.error);
          } else {
            setYouTubeVideo({
              url,
              thumbnail: thumbnailData.thumbnail,
              isYouTubeVideo: true,
              isOpen: true,
            });
            setImage(null);
            setPostText(postText.replace(url, '').trim());
          }
        } catch (error) {
          console.error('Error processing YouTube URL:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    extractAndProcessYouTubeUrl();
  }, [postText]);

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
        {youTubeVideo?.thumbnail?.high && (
          <Image
            source={{ uri: youTubeVideo.thumbnail.high.url }}
            style={styles.youtubeThumbnail}
          />
        )}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            onPress={() => {
              pickImage();
              setYouTubeVideo(null);
            }} 
            style={styles.actionButton} 
            disabled={isLoading}
          >
            <Ionicons name="image-outline" size={24} color="#4267B2" />
            <Text style={styles.actionButtonText}>Add Image</Text>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <ActivityIndicator size="large" color="#4267B2" style={styles.loader} />
        ) : (
          <Button
            title="Create Post"
            onPress={handlePost}
            style={styles.createPostButton}
            disabled={isLoading || (!postText.trim() && !image && !youTubeVideo?.url)}
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
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F2F5',
    padding: 10,
    borderRadius: 12,
  },
  actionButtonText: {
    marginLeft: 10,
    color: '#4267B2',
    fontSize: 16,
  },
  createPostButton: {
    marginTop: 20,
  },
  loader: {
    marginTop: 20,
  },
  youtubeThumbnail: {
    width: '100%',
    height: 200,
    marginBottom: 20,
  },
});

export default CreatePostScreen;