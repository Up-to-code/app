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
  I18nManager,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { FIREBASE_AUTH, FIREBASE_DB } from "@/lib/firebase/firebaseConfig";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { FlashList } from "@shopify/flash-list";
import { getUserData } from "@/lib/firebase/getUsers";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";

interface Message {
  id: string;
  text: string;
  createdAt: Timestamp;
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
      if (typeof id === "string") {
        const userData = await getUserData(id);
        setProfileImage(userData?.profileImage ?? null);
        setUserName(userData?.name ?? null);
      }
    }
    fetchData();
  }, [id]);

  const fetchMessages = useCallback(() => {
    if (!user || typeof id !== "string") return;

    const messagesRef = collection(FIREBASE_DB, "chats", chatId, "messages");
    const q = query(messagesRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const messagesList = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const data = doc.data() as Omit<Message, "id">;
          return {
            id: doc.id,
            ...data,
          };
        })
      );
      setMessages(messagesList);
      setLoading(false);
    });

    return unsubscribe;
  }, [id, user, chatId]);

  useEffect(() => {
    const unsubscribe = fetchMessages();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [fetchMessages]);

  const handleSendMessage = async () => {
    if (!user || typeof id !== "string" || newMessage.trim() === "") return;

    const messagesRef = collection(FIREBASE_DB, "chats", chatId, "messages");
    await addDoc(messagesRef, {
      text: newMessage,
      createdAt: Timestamp.now(),
      userId: user.uid,
      userName: user.displayName || "",
      profileImage: user.photoURL || "",
    });

    setNewMessage("");
  };

  const renderItem = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageContainer,
        item.userId === user?.uid ? styles.sentMessage : styles.receivedMessage,
      ]}
    >
      <Text
        style={[
          styles.messageText,
          item.userId === user?.uid ? styles.sentMessageText : styles.receivedMessageText
        ]}
      >
        {item.text}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          disabled={loading}
          onPress={() => {
            if (loading) return;
            Keyboard.dismiss();
            router.back();
          }}
          delayPressIn={loading ? 1000 : 0}
          hitSlop={20}
          style={styles.backButton}
        >
          <Ionicons name={I18nManager.isRTL ? "arrow-forward" : "arrow-back"} size={24} color="#0084ff" />
        </TouchableOpacity>
        <Image
          source={{ uri: profileImage || "https://via.placeholder.com/50" }}
          style={styles.headerImage}
        />
        <Text style={styles.headerTitle}>{userName || "Chat"}</Text>
      </View>
 
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.messagesContainer}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0084ff" />
          </View>
        ) : messages.length > 0 ? (
          <FlashList
            ref={listRef}
            data={messages}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            estimatedItemSize={100}
            inverted
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
            placeholder="Type a message..."
            placeholderTextColor="#8E8E93"
            multiline
            scrollEnabled
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSendMessage}
            disabled={newMessage.trim() === ""}
          >
            <Ionicons name="send" size={24} color={newMessage.trim() === "" ? "#8E8E93" : "#0084ff"} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    backgroundColor: "#F5F5F5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
    backgroundColor: "#FFFFFF",
  },
  backButton: {
    marginRight: 15,
    marginLeft: I18nManager.isRTL ? 15 : 0,
  },
  headerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 15,
    marginLeft: I18nManager.isRTL ? 0 : 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    textAlign: I18nManager.isRTL ? "right" : "left",
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  messageContainer: {
    padding: 12,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 20,
    maxWidth: "80%",
  },
  sentMessage: {
    alignSelf: I18nManager.isRTL ? "flex-start" : "flex-end",
    backgroundColor: "#0084ff",
  },
  receivedMessage: {
    alignSelf: I18nManager.isRTL ? "flex-end" : "flex-start",
    backgroundColor: "#FFFFFF",
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  sentMessageText: {
    color: "#FFFFFF",
  },
  receivedMessageText: {
    color: "#000000",
  },
  inputContainer: {
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
    padding: 10,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
    alignItems: "center",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 20,
    padding: 10,
    paddingLeft: I18nManager.isRTL ? 10 : 15,
    paddingRight: I18nManager.isRTL ? 15 : 10,
    backgroundColor: "#F5F5F5",
    color: "#000",
    maxHeight: 100,
    textAlign: I18nManager.isRTL ? "right" : "left",
  },
  sendButton: {
    marginLeft: I18nManager.isRTL ? 0 : 10,
    marginRight: I18nManager.isRTL ? 10 : 0,
    justifyContent: "center",
    alignItems: "center",
    width: 40,
    height: 40,
  },
  listContent: {
    paddingVertical: 15,
  },
  noMessagesContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noMessagesText: {
    fontSize: 16,
    color: "#8E8E93",
    textAlign: I18nManager.isRTL ? "right" : "left",
  },
});

export default ChatScreen;
