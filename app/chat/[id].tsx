import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { FIREBASE_AUTH, FIREBASE_DB } from "@/lib/firebase/firebaseConfig";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { FlashList } from "@shopify/flash-list";
import { getUserData } from "@/lib/firebase/getUsers";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";

interface Message {
  id: string;
  text: string;
  createdAt: Date;
  userId: string;
  userName: string;
  profileImage: string;
}

const ChatScreen: React.FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const user = FIREBASE_AUTH.currentUser;
  const chatId = [id, user?.uid].sort().join("_");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const listRef = useRef<FlashList<Message>>(null);

  useEffect(() => {
    async function fetchData() {
      const userData = await getUserData(id);
      setProfileImage(userData?.profileImage);
      setUserName(userData?.name);
    }
    fetchData();
  }, [user]);

  const fetchMessages = useCallback(() => {
    if (!user || typeof id !== "string") return;

    const messagesRef = collection(FIREBASE_DB, "chats", chatId, "messages");
    const q = query(messagesRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const messagesList = (await Promise.all(
        snapshot.docs.map(async (doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
          } as Message;
        })
      )) as Message[];
      setMessages(messagesList);
      setLoading(false);
    });

    return unsubscribe;
  }, [id, user, chatId]);

  useEffect(() => {
    const unsubscribe = fetchMessages();
    return () => unsubscribe && unsubscribe();
  }, [fetchMessages]);

  const handleSendMessage = async () => {
    if (!user || typeof id !== "string" || newMessage.trim() === "") return;

    const messagesRef = collection(FIREBASE_DB, "chats", chatId, "messages");
    await addDoc(messagesRef, {
      text: newMessage,
      createdAt: new Date(),
      userId: user.uid,
    });

    setNewMessage("");
    listRef.current?.scrollToEnd({ animated: true });
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        listRef.current?.scrollToEnd({ animated: true });
      }
    );
    return () => {
      keyboardDidShowListener.remove();
    };
  }, []);

  useEffect(() => {
    if (!loading) {
      if (messages.length > 0) {
        setTimeout(() => {
          listRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    }
  }, [loading, messages]);
  const BackRef = useRef<TouchableOpacity>(null);
  const renderItem = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageContainer,
        item.userId === user?.uid ? styles.sentMessage : styles.receivedMessage,
      ]}
    >
      <Text style={styles.messageUser}>
        {user?.uid === item.userId ? "You" : userName}
      </Text>
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          disabled={loading}
          onPress={() => {
            if (loading) return;
            BackRef.current?.blur();
            Keyboard.dismiss();
            router.back();
          }}
          delayPressIn={loading ? 1000 : 0}
          hitSlop={1000}
          style={styles.backButton}
          ref={BackRef}
        >
          <Ionicons name="arrow-back" size={24} color="#1DA1F2" />
        </TouchableOpacity>
        <Image
          source={{ uri: profileImage || "https://via.placeholder.com/50" }}
          style={styles.headerImage}
        />
        <Text style={styles.headerTitle}>{userName || "Chat"}</Text>
      </View>
 
      <View style={styles.messagesContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#1DA1F2" />
          </View>
        ) : messages.length > 0 ? (
          <FlashList
            ref={listRef}
            data={messages}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            estimatedItemSize={100}
          />
        ) : (
          <View style={styles.noMessagesContainer}>
            <Text style={styles.noMessagesText}>No messages yet</Text>
          </View>
        )}
 
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type a message"
            placeholderTextColor="#657786"
            multiline={true}
            scrollEnabled={true}
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSendMessage}
          >
            <Ionicons name="send" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E1E8ED",
  },
  backButton: {
    marginRight: 10,
  },
  headerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#14171A",
  },
  messagesContainer: {
    flex: 1,
  },
  messagesList: {
    flex: 1,
  },
  messageContainer: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    maxWidth: "80%",
  },
  sentMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#c6c9f8",
  },
  receivedMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#f1f1f1",
  },
  messageUser: {
    fontWeight: "bold",
    color: "#0b293b",
  },
  messageText: {
    marginTop: 5,
    color: "#14171A",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#E1E8ED",
    backgroundColor: "#F5F8FA",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E1E8ED",
    borderRadius: 25,
    padding: 10,
    paddingLeft: 15,
    backgroundColor: "#e5e5e5",
    color: "#14171A",
    maxHeight: 60,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: "#1DA1F2",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    maxHeight: 60,
  },
  listContent: {
    padding: 10,
  },
  noMessagesContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noMessagesText: {
    fontSize: 16,
    color: "#657786",
  },
});

export default ChatScreen;
