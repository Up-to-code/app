import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { collection, query, where, getDocs, orderBy, DocumentData } from 'firebase/firestore';
import { FIREBASE_DB, FIREBASE_AUTH } from '@/lib/firebase/firebaseConfig';
import Post, { PostProps } from '@/components/Post';
import { FlashList } from '@shopify/flash-list';

const GetUserPosts = () => {
  const [posts, setPosts] = useState<PostProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserPosts = async () => {
      const user = FIREBASE_AUTH.currentUser;
      if (!user) {
        console.error('No user logged in');
        setLoading(false);
        return;
      }

      try {
        const userPostsRef = collection(FIREBASE_DB, 'users', user.uid, 'posts');
        const q = query(userPostsRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);

        const postPromises = querySnapshot.docs.map(async (doc) => {
          const postRef = collection(FIREBASE_DB, 'posts');
          const postQuery = query(postRef, where('__name__', '==', doc.data().postId));
          const postSnapshot = await getDocs(postQuery);
          
          if (!postSnapshot.empty) {
            const postData = postSnapshot.docs[0].data() as DocumentData;
            return {
              id: doc.data().postId,
              content: postData.content,
              imageUrl: postData.imageUrl,
              createdAt: postData.createdAt,
              likes: postData.likes,
              userId: postData.userId,
              onLike: () => {}, // Placeholder function, replace with actual like functionality
            } as PostProps;
          }
          return null;
        });

        const postResults = await Promise.all(postPromises);
        setPosts(postResults.filter((post): post is PostProps => post !== null));
      } catch (error) {
        console.error('Error fetching user posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, []);

  if (loading) {
    return <Text>Loading posts...</Text>;
  }

  if (posts.length === 0) {
    return <Text>No posts found.</Text>;
  }

  return (
    <View style={styles.container}>
      <FlashList
        data={posts}
        renderItem={({ item }) => <Post {...item} />}
        estimatedItemSize={200}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default GetUserPosts;
