import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, Text, View, Image, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { getFriends } from '@/lib/firebase/friendsServes/getfriends';
import { getUserData } from '@/lib/firebase/getUsers';
import { router } from 'expo-router';
import verification_icon from "@/assets/images/checkmark.png";
interface ChatItem {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  profileImage: string;
  verification: boolean;
}

const ChatListScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [chatData, setChatData] = useState<ChatItem[]>([]);

  const fetchFriends = useCallback(async () => {
    try {
      const friendIds = await getFriends();
      const friendsList = await Promise.all(friendIds.map(async (friendId) => {
        const userData = await getUserData(friendId.id);
        return {
          id: friendId.id, // Ensure friendId is a string
          name: userData.name,
          lastMessage: userData.lastMessage || '',
          time: userData.time || '',
          profileImage: userData.profileImage || 'https://via.placeholder.com/50',
        } as ChatItem;
      }));
      setChatData(friendsList);
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  }, []);

  useEffect(() => {
    fetchFriends();
  }, [fetchFriends]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchFriends();
    setRefreshing(false);
  }, [fetchFriends]);

  const renderChatItem = ({ item }: { item: ChatItem }) => (
    <TouchableOpacity style={styles.chatItem} key={item.id} onPress={() => router.push(`/chat/${item.id}`)}>
      <Image source={{ uri: item.profileImage }} style={styles.avatar} />
      <View style={styles.chatInfo}>
        <View className='flex flex-row items-center justify-between'>
          <Text style={styles.chatName}>{item.name}</Text>
           {
            item.verification ? (
              <Image source={verification_icon} className='w-4 h-4' />
            ) : null
           }
        </View>
        
        <Text style={styles.lastMessage}>{item.lastMessage}</Text>
      </View>
      <Text style={styles.chatTime}>{item.time}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlashList
        data={chatData}
        renderItem={renderChatItem}
        estimatedItemSize={80}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
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
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  chatInfo: {
    flex: 1,
  },
  chatName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  lastMessage: {
    fontSize: 14,
    color: 'gray',
  },
  chatTime: {
    fontSize: 12,
    color: 'gray',
    marginLeft: 10,
  },
  statusBar: {
    padding: 10,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  statusButton: {
    backgroundColor: '#f0f2f5',
    borderRadius: 20,
  },
  statusButtonText: {
    color: '#000',
  },
});

export default ChatListScreen;
