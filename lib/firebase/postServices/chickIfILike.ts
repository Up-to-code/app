import { doc, getDoc } from "firebase/firestore";
import { FIREBASE_AUTH, FIREBASE_DB } from "../firebaseConfig";

export const checkIfILike = async (postId: string) => {
  const userId = FIREBASE_AUTH.currentUser?.uid as string;
  if (!userId) {
    return false;
  }
  const postRef = doc(FIREBASE_DB, "users", userId, "likesPosts", postId);
  const postDoc = await getDoc(postRef);
  if (postDoc.exists()) {
    const postData = postDoc.data();
    return postData.isLiked;
  }
  return false;
};
