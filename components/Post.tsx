import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { DocumentData, Timestamp } from "firebase/firestore";
import { getUserData } from "@/lib/firebase/getUsers";
import { chickIfILike } from "@/lib/firebase/postServes/chickIfILike";
import { addLike } from "@/lib/firebase/postServes/addlike";
import { removeLike } from "@/lib/firebase/postServes/removeLike";
import { likePost } from "@/lib/firebase/Serves";
import verification_icon from "@/assets/images/checkmark.png";
import user_icon from "@/assets/images/user.png";
import { router } from "expo-router";
import { user } from "@/lib/store/user";
import UserInfo from "./UserInfo_In_post";
export interface PostProps {
  id: string;
  userId: string;
  content: string;
  imageUrl?: string;
  createdAt: Timestamp;
  likes: number;
  onLike: () => void;
}

const Post: React.FC<PostProps> = ({
  id,
  userId,
  content,
  imageUrl,
  createdAt,
  likes,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const formattedDate = createdAt.toDate().toLocaleString();
  const [likes_, setLikes] = useState(likes);
  const [userData, setUserData] = useState<DocumentData | null>({
    profileImage: null,
    name: null,
    verification: false,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const fetchedUserData = await getUserData(userId);
        setUserData(fetchedUserData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const checkLikeStatus = async () => {
      const likeStatus = await chickIfILike(id);
      setIsLiked(likeStatus);
    };

    fetchUserData();
    checkLikeStatus();
  }, [id, userId]);

  const handleLike = async () => {
    try {
      if (isLiked) {
        await removeLike(id);
        setLikes((prevLikes) => prevLikes - 1);
      } else {
        await addLike(id);
        await likePost(id);
        setLikes((prevLikes) => prevLikes + 1);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error("Error handling like:", error);
    }
  };

  return (
    <View style={styles.container}>
      {user?.uid === userId ? (
        <TouchableOpacity
          onPress={() => {
            router.push(`/profile`);
          }}
          style={styles.editButton}
          className="absolute top-0 right-5"
        >
          <Ionicons name="pencil" size={20} color="#007AFF" />
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      ) : null}
      <TouchableOpacity
        onPress={() => {
          if (user?.uid === userId) {
            router.push(`/profile`);
          } else {
            router.push(`/Friend/${userId}`);
          }
        }}
      >
        <UserInfo
          userData={
            userData as {
              profileImage: string | null;
              name: string | null;
              verification: boolean;
            }
          }
        />
      </TouchableOpacity>
      <Text style={styles.content}>{content}</Text>
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.postImage} />
      ) : null}
      <View style={styles.stats}>
        <Text style={styles.statsText}>{likes_} Likes</Text>
        <Text style={styles.statsText}>{formattedDate}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
          <Ionicons
            name={isLiked ? "heart" : "heart-outline"}
            size={24}
            color={isLiked ? "#f35757" : "#333"}
          />
          <Text style={[styles.actionText, isLiked && styles.likedText]}>
            {isLiked ? "Liked" : "Like"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    marginBottom: 10,
    padding: 15,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  userImageContainer: {
    position: "relative",
    marginRight: 10,
  },
  profileImage: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
  },
  verificationIcon: {
    position: "absolute",
    bottom: -5,
    right: -5,
    width: 25,
    height: 25,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  content: {
    fontSize: 16,
    marginBottom: 10,
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  statsText: {
    color: "gray",
    fontSize: 12,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-start",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 10,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionText: {
    marginLeft: 5,
    color: "#333",
  },
  likedText: {
    color: "#f35757",
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  editButtonText: {
    marginLeft: 5,
    color: "#007AFF",
  },
});

export default Post;
