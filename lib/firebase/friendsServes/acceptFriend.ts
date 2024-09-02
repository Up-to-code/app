import { doc, setDoc, serverTimestamp, writeBatch } from "firebase/firestore";
import { FIREBASE_AUTH, FIREBASE_DB } from "../firebaseConfig";
import { removeFromWhitelist } from "./removeFriend";

export const acceptFriend = async (friendId: string): Promise<boolean> => {
  const uid = FIREBASE_AUTH.currentUser?.uid;
  if (!uid) {
    throw new Error("User not authenticated");
  }

  const batch = writeBatch(FIREBASE_DB);

  try {
    // Add friend to current user's friends list
    const friendDoc = doc(FIREBASE_DB, "users", uid, "friends", friendId);
    batch.set(friendDoc, {
      id: friendId,
      addedAt: serverTimestamp(),
    });

    // Add current user to friend's friends list
    const meDoc = doc(FIREBASE_DB, "users", friendId, "friends", uid);
    batch.set(meDoc, {
      id: uid,
      addedAt: serverTimestamp(),
    });

    // Commit the batch
    await batch.commit();

    // Remove from whitelist after successful friend addition
    await removeFromWhitelist(friendId);

    return true;
  } catch (error) {
    console.error("Error accepting friend:", error);
    return false;
  }
};
