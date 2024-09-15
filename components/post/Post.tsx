import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  I18nManager,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Timestamp } from "firebase/firestore";
import { addLike } from "@/lib/firebase/postServices/addlike";
import { removeLike } from "@/lib/firebase/postServices/removeLike";
import { likePost } from "@/lib/firebase/Services";
import { checkIfILike } from "@/lib/firebase/postServices/chickIfILike";
import UserInfo from "./UserInfo_In_post";
import BodyPost from "../BodyPost";
import Time from "./Time";
import YoutubeImage from "./youtube_Image";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";

export interface PostProps {
  id: string;
  userId: string;
  content: string;
  imageUrl?: string;
  createdAt: Timestamp;
  likes: number;
  youtubeUrl?: string;
  thamnil?: {
    default: { url: string; width: number; height: number; };
    medium: { url: string; width: number; height: number; };
    high: { url: string; width: number; height: number; };
  };
}

const Post: React.FC<PostProps> = ({
  id,
  userId,
  content,
  imageUrl,
  createdAt,
  likes,
  youtubeUrl,
  thamnil,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(likes);
  const scale = useSharedValue(1);

  useEffect(() => {
    setLikesCount(likes);
    checkIfILike(id).then(setIsLiked).catch(console.error);
  }, [id, likes]);

  const handleLike = async () => {
    try {
      if (isLiked) {
        await removeLike(id);
        setLikesCount((prev) => prev - 1);
      } else {
        await addLike(id);
        await likePost(id);
        setLikesCount((prev) => prev + 1);
      }
      setIsLiked(!isLiked);
      scale.value = withSpring(1.2, {}, () => {
        scale.value = withSpring(1);
      });
    } catch (error) {
      console.error("Error handling like:", error);
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <UserInfo userid={userId} imageURL={imageUrl} Postid={id} />
      </View>
      <BodyPost content={content} />
      {imageUrl && (
        <Image source={{ uri: imageUrl }} style={styles.postImage} />
      )}
      {youtubeUrl && (
        <YoutubeImage youtubeUrl={youtubeUrl} thumbnail={thamnil as any} />
      )}
      <View style={styles.timeContainer}>
        <Time timestamp={createdAt} />
      </View>
      <View style={styles.actions}>
        <Animated.View style={animatedStyle}>
          <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
            <Ionicons
              name={isLiked ? "heart" : "heart-outline"}
              size={24}
              color={isLiked ? "#f35757" : "#333"}
            />
            <Text style={styles.actionText}>{likesCount}</Text>
          </TouchableOpacity>
        </Animated.View>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="chatbubble-outline" size={24} color="#333" />
          <Text style={styles.actionText}>تعليق</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="arrow-redo-outline" size={24} color="#333" />
          <Text style={styles.actionText}>إعادة نشر</Text>
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
    borderBottomWidth: 1,
    borderBottomColor: "#e1e8ed",
  },
  header: {
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 15,
    marginVertical: 10,
  },
  timeContainer: {
    alignSelf: 'flex-start',
    marginBottom: 5,
  },
  actions: {
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  actionButton: {
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
    alignItems: "center",
  },
  actionText: {
    marginLeft: I18nManager.isRTL ? 0 : 5,
    marginRight: I18nManager.isRTL ? 5 : 0,
    fontSize: 14,
    color: "#333",
  },
});

export default Post;
