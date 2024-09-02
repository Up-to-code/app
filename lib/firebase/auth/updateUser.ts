import { doc, updateDoc } from "firebase/firestore";
import { FIREBASE_DB } from "../firebaseConfig";


const updateUser = async (userId: string, updatedData: any) => {
  const userDoc = doc(FIREBASE_DB, "users", userId);
  await updateDoc(userDoc, updatedData);
};

export default updateUser;