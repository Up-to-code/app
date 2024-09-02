import { doc, getDoc } from "firebase/firestore";
import { FIREBASE_DB } from "@/lib/firebase/firebaseConfig";

interface UserData {
  name: string;
  profileImage: string;
  bio?: string;
  posts?: number;
  followers?: number;
  following?: number;
  [key: string]: any; // Allow for any additional fields
}

export const getUserData = async (userId: string): Promise<UserData> => {
  try {
    const userDoc = doc(FIREBASE_DB, "users", userId);
    const userSnapshot = await getDoc(userDoc);

    if (userSnapshot.exists()) {
      const userData = userSnapshot.data() as UserData;
      return {
        ...userData,
        name: userData.name || "",
        profileImage: userData.profileImage || "",
      
      };
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};
