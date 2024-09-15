import { doc, deleteDoc } from "firebase/firestore";
import { FIREBASE_AUTH, FIREBASE_DB } from "../firebaseConfig";

export const removeLike = async (postId: string) => {
  const userId = FIREBASE_AUTH.currentUser?.uid as string;
  if (!userId) {
    return;
  }
  const postRef = doc(FIREBASE_DB, "users", userId, "likesPosts", postId);
  const deletePost = await deleteDoc(postRef);
  return deletePost;
};