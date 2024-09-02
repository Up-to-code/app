import { collection, deleteDoc, doc, getDocs, orderBy, query } from "firebase/firestore";
import { FIREBASE_DB } from "./firebaseConfig";

async function getWhitelist(userId: string) {
  try {
    const notificationRef = collection(
      FIREBASE_DB,
      "users",
      userId,
      "whitelist"
    );
    const getWhitelistQuery = query(
      notificationRef,
      orderBy("addedAt", "desc")
    );
    const querySnapshot = await getDocs(getWhitelistQuery);
    const whitelist = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
      };
    });
    return whitelist;
  } catch (error) {
    console.error("Error fetching whitelist:", error);
    return [];
  }
}

export { getWhitelist };

async function removeFromWhitelist(userId: string, itemId: string) {

    try {
        const whitelistRef = collection(FIREBASE_DB, "users", userId, "whitelist");
        const docRef = doc(whitelistRef, itemId);
        await deleteDoc(docRef);
    } catch (error) {
        console.error("Error removing from whitelist:", error);
    }
}

export { removeFromWhitelist };

