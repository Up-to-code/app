import { getDoc, doc, collection, getDocs } from "firebase/firestore";
import { FIREBASE_AUTH, FIREBASE_DB } from "../firebaseConfig";

export const getFriends = async () => {
  const uid = FIREBASE_AUTH.currentUser?.uid;
  if (!uid) {
    throw new Error("User not authenticated");
  }

  try {
    const friendsCollection = collection(FIREBASE_DB, "users", uid, "friends");
    const friendsSnapshot = await getDocs(friendsCollection);
    
    const friendsList = friendsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return friendsList;
  } catch (error) {
    console.error("Error fetching friends:", error);
    throw error;
  }
};
