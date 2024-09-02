import { doc, deleteDoc } from "firebase/firestore";
import { FIREBASE_AUTH, FIREBASE_DB } from "../firebaseConfig";

export const  removeFriend = async (friendId: string) => {
    const uid = FIREBASE_AUTH.currentUser?.uid;
    if (!uid) {
      throw new Error("User not authenticated");
    }
    const friendDoc = doc(FIREBASE_DB, "users", uid, "friends", friendId);
    await deleteDoc(friendDoc);
};

export const removeFromWhitelist = async (friendId: string) => {
    const uid = FIREBASE_AUTH.currentUser?.uid;
    if (!uid) {
      throw new Error("User not authenticated");
    }
    const friendDoc = doc(FIREBASE_DB, "users", uid, "whitelist", friendId);
    await deleteDoc(friendDoc);
};
