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

export const getUserData = async (userId: string): Promise<UserData | null> => {
  try {
    const userDoc = doc(FIREBASE_DB, "users", userId);
    const userSnapshot = await getDoc(userDoc);

    if (userSnapshot.exists()) {
      const userData = userSnapshot.data() as UserData;

      // Ensure all optional fields have default values if missing, handle possible 'null' values
      return {
        ...userData,
        name: userData.name || "Anonymous", // Default to "Anonymous" if name is missing
        profileImage: userData.profileImage || "", // Ensure profileImage is always a string, fallback to empty string
        bio: userData.bio ?? "No bio available", // Ensure bio is always a string, fallback if missing
        posts: userData.posts ?? 0, // Ensure posts is a number, fallback if missing
        followers: userData.followers ?? 0, // Ensure followers is a number, fallback if missing
        following: userData.following ?? 0, // Ensure following is a number, fallback if missing
      };
    } else {
      console.log("User not found");
      return null; // Return null if the user document doesn't exist
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw new Error(`Failed to fetch user data for userId: ${userId}`); // Throw a more descriptive error
  }
};
