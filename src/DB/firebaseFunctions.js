import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "./firebase.config";
import { addDoc, collection, doc, getDoc, getDocs, limit, orderBy, query, serverTimestamp, setDoc, startAfter } from "firebase/firestore";


export const getLoggedInUserUID = () => {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        resolve(user.uid); // Agar user logged in hai to UID return karo
      } else {
        resolve(null); // Agar koi user login nahi hai to null return karo
      }
    }, reject);
  });
};

export const signUpUser = async (name, email, password, role, brand) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const userRef = doc(db, "users", user.uid);
        const userData = {
            uid: user.uid,
            name,
            email,
            role,
            brand: brand || [],
            createdAt: serverTimestamp(), // Firebase special object
        };

        await setDoc(userRef, userData);

        // Fetch the saved data to get a valid timestamp
        const savedUser = await getDoc(userRef);
        const userFinalData = { id: savedUser.id, ...savedUser.data() };

        return { userData: userFinalData, error: null }; // ✅ This now includes a serializable timestamp
    } catch (error) {
        return { userData: null, error: error.message };
    }
};

export const loginWithFirebase = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error; 
  }
};
  export const createService = async (serviceName) => {
    try {
      const docRef = await addDoc(collection(db, "services"), {
        name: serviceName,
        createdAt: serverTimestamp(),   
      });
  
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error("Error adding service:", error);
      return { success: false, error: error.message };
    }
  };


  export const fetchUsers = async () => {
    const usersCollection = collection(db, "users");
    const usersSnapshot = await getDocs(usersCollection);
  
    const users = usersSnapshot.docs.map((doc) => {
      const { createdAt, ...filteredData } = doc.data(); // Remove createdAt
      return {
        id: doc.id,
        ...filteredData,
      };
    });
  
    return { users, lastDoc: usersSnapshot.docs[usersSnapshot.docs.length - 1] || null };
  };