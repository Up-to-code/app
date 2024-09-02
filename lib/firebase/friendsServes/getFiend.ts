import { FIREBASE_AUTH, FIREBASE_DB } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const getFiend = async (userId: string) => {
  const user = FIREBASE_AUTH.currentUser;
    const GetFriend = await getDoc(
    doc(FIREBASE_DB, "users", user?.uid as string, "friends", userId)
  );
  console.log("GetFriend", GetFriend.data());
  if (GetFriend.data()) {
    return true;
  } else {
    return false;
  }
};

export { getFiend };
