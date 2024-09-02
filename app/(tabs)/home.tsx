import   { useState, useEffect, useCallback } from 'react';
import { StyleSheet,  ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';

import Post, { PostProps } from '@/components/Post';
import { getPosts } from '@/lib/firebase/postServes/getPost';
 
const HomeScreen = () => {
    const [posts, setPosts] = useState<PostProps[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
    const [hasMore, setHasMore] = useState(true);

    const fetchPosts = async (startAfter: QueryDocumentSnapshot<DocumentData> | null = null) => {
        try {
            const { posts: newPosts, lastVisible: newLastVisible, hasMore: newHasMore } = await getPosts(startAfter);
            setPosts(prevPosts => startAfter ? [...prevPosts, ...newPosts as PostProps[]] : newPosts as PostProps[]);
            setLastVisible(newLastVisible);
            setHasMore(newHasMore);
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

 

    const renderPost = ({ item }: { item: PostProps }) => (
        <Post {...item}   />
    );

    const loadMorePosts = () => {
        if (hasMore && !loading) {
            fetchPosts(lastVisible);
        }
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setLastVisible(null);
        setHasMore(true);
        fetchPosts();
    }, []);

    if (loading && posts.length === 0) {
        return (
            <SafeAreaView style={styles.container}>
                <ActivityIndicator size="large" color="#4267B2" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <FlashList
                data={posts}
                renderItem={renderPost}
                estimatedItemSize={300}
                keyExtractor={(item) => item.id}
                onEndReached={loadMorePosts}
                onEndReachedThreshold={0.5}
                ListFooterComponent={() => hasMore && <ActivityIndicator size="small" color="#4267B2" />}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={["#4267B2"]}
                    />
                }
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});

export default HomeScreen;
