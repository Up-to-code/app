import { doc, setDoc } from "firebase/firestore";
import { FIREBASE_AUTH, FIREBASE_DB } from "../firebaseConfig";

export const addLike = async (postId: string) => {
  const userId = FIREBASE_AUTH.currentUser?.uid as string;
  if (!userId) {
    return;
  }
  const postRef = doc(FIREBASE_DB, "users", userId, "likesPosts", postId);
  const postDoc = await setDoc(postRef, {
    isLiked: true,
    postId: postId,
  });
};