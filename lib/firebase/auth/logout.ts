import { FIREBASE_AUTH } from "@/lib/firebase/firebaseConfig"; // Adjust the import as needed

export const logout = async () => {
  try {
    await FIREBASE_AUTH.signOut();
    console.log("User logged out successfully!");
  } catch (e) {
    console.error("Error logging out: ", e);
    throw e;
  }
};
