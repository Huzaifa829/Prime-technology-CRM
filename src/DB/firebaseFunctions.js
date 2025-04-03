import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "./firebase.config";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  startAfter,
  Timestamp,
  where,
} from "firebase/firestore";

export const getLoggedInUserUID = () => {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(
      auth,
      (user) => {
        if (user) {
          resolve(user.uid); // Agar user logged in hai to UID return karo
        } else {
          resolve(null); // Agar koi user login nahi hai to null return karo
        }
      },
      reject
    );
  });
};

export const signUpUser = async (name, email, password, role, brand) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    const userRef = doc(db, "users", user.uid);
    const userData = {
      uid: user.uid,
      name,
      email,
      role,
      brand: brand || [],
      createdAt:new Date(),
      password,
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
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Firestore se user ka extra data retrieve karna
  const userDocRef = doc(db, "users", user.uid);
  const userDocSnap = await getDoc(userDocRef);

  return userDocSnap.exists()
    ? { ...userDocSnap.data() } // Firebase auth data + Firestore data
    : null; // Default role if Firestore data is missing
};

export const createService = async (serviceName) => {
  try {
    const docRef = await addDoc(collection(db, "services"), {
      name: serviceName,
      createdAt: new Date(),
    });

    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error adding service:", error);
    return { success: false, error: error.message };
  }
};
export const createBrand = async (brandName) => {
  try {
    // Query to check if the brand already exists
    const q = query(collection(db, "brands"), where("name", "==", brandName));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return { success: false, error: "Brand already exists!" };
    }

    // Timestamp before saving to avoid overriding
    const timestamp = new Date();

    // Create a new brand
    const docRef = await addDoc(collection(db, "brands"), {
      name: brandName,
      createdAt: timestamp,
    });

    // Ensure correct return of ID
    const brandData = {
      id: docRef.id,
      name: brandName,
      createdAt: timestamp,
    };

    console.log("Created brand:", brandData); // Debugging log

    return { success: true, data: brandData };
  } catch (error) {
    console.error("Error creating brand:", error);
    return { success: false, error: error.message };
  }
};

export const getAllBrands = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "brands"));
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt, // ✅ Convert Timestamp to ISO string
      };
    });
  } catch (error) {
    throw new Error("Failed to fetch brands: " + error.message);
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

  return {
    users,
    lastDoc: usersSnapshot.docs[usersSnapshot.docs.length - 1] || null,
  };
};
