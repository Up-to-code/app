import { collection, query, orderBy, limit, startAfter, getDocs, DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { FIREBASE_DB } from "@/lib/firebase/firebaseConfig";

export const getPosts = async (startAfterDoc: QueryDocumentSnapshot<DocumentData> | null = null, pageSize: number = 10) => {
  try {
    const postsCollection = collection(FIREBASE_DB, "posts");
    let postsQuery = query(
      postsCollection,
      orderBy("createdAt", "desc"),
      limit(pageSize)
    );

    if (startAfterDoc) {
      postsQuery = query(
        postsCollection,
        orderBy("createdAt", "desc"),
        startAfter(startAfterDoc),
        limit(pageSize)
      );
    }

    const querySnapshot = await getDocs(postsQuery);
    const posts = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

    return {
      posts,
      lastVisible,
      hasMore: querySnapshot.docs.length === pageSize
    };
  } catch (error) {
    console.error("Error fetching posts: ", error);
    throw error;
  }
};
