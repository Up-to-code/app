import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  setDoc,
  updateDoc,
  increment,
} from "firebase/firestore";
import { FIREBASE_DB, FIREBASE_STORAGE } from "@/lib/firebase/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const createPost = async (
  userId: string,
  content: string,
  imageUri?: string
) => {
  try {
    let imageUrl = null;

    if (imageUri) {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const imageRef = ref(FIREBASE_STORAGE, `postImages/${Date.now()}`);
      await uploadBytes(imageRef, blob);
      imageUrl = await getDownloadURL(imageRef);
    }

    const postData = {
      userId,
      content,
      imageUrl,
      createdAt: serverTimestamp(),
      likes: 0,
    };

    const docRef = await addDoc(collection(FIREBASE_DB, "posts"), postData);
    await updateUserPostCount(userId, docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error creating post: ", error);
    throw error;
  }
};
export const createPostWithYouTube = async (
  userId: string,
  content: string,
  youtubeUrl: string,
  thamnil?: {
    default: {
      url: string;
      width: number;
      height: number;
    };
    medium: {
      url: string;
      width: number;
      height: number;
    };
    high: {
      url: string;
      width: number;
      height: number;
    };
  }
) => {
  try {
    const postData = {
      userId,
      content,
      youtubeUrl,
      thamnil,
      createdAt: serverTimestamp(),
      likes: 0,
    };

    const docRef = await addDoc(collection(FIREBASE_DB, "posts"), postData);
    await updateUserPostCount(userId, docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error creating post: ", error);
    throw error;
  }
};

const updateUserPostCount = async (userId: string, postId: string) => {
  try {
    const userPostsRef = doc(FIREBASE_DB, "users", userId, "posts", postId);
    await setDoc(userPostsRef, { createdAt: serverTimestamp(), postId });

    const userRef = doc(FIREBASE_DB, "users", userId);
    await updateDoc(userRef, {
      postCount: increment(1),
    });
  } catch (error) {
    console.error("Error updating user post count: ", error);
    throw error;
  }
};
