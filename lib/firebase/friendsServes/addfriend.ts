import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { FIREBASE_AUTH, FIREBASE_DB } from "../firebaseConfig";

export const addFriend = async (friendId: string) => {
  const uid = FIREBASE_AUTH.currentUser?.uid;
  if (!uid) {
    throw new Error("User not authenticated");
  }
  const friendDoc = doc(FIREBASE_DB, "users", friendId, "whitelist", uid);
  await setDoc(friendDoc, {
    id: uid,
    addedAt: serverTimestamp()
  });
};
