import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "./firebase.config";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  startAfter,
  Timestamp,
  updateDoc,
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
export const updateBrandInFirebase = async (id, oldName, newName) => {
  const brandsCollection = collection(db, "brands");
  const usersCollection = collection(db, "users");

  // Check if the new name already exists in the brands collection
  const brandsSnapshot = await getDocs(brandsCollection);
  const existingBrand = brandsSnapshot.docs.find(
    (doc) => doc.id !== id && doc.data().name.toLowerCase() === newName.toLowerCase()
  );

  if (existingBrand) {
    throw new Error("Brand name already exists!");
  }

  // Step 1: Update the brand name in the 'brands' collection
  const brandRef = doc(db, "brands", id);
  await updateDoc(brandRef, { name: newName });

  // Step 2: Find users who have this brand name in their 'brands' array
  const usersSnapshot = await getDocs(usersCollection);
  
  const usersToUpdate = usersSnapshot.docs.filter((userDoc) => {
    const userBrands = userDoc.data().brand || [];
    console.log(userBrands);
    return userBrands.includes(oldName);
  });

  // Step 3: Update users' brand arrays
  for (const userDoc of usersToUpdate) {

    const userRef = doc(db, "users", userDoc.id);
    console.log(userRef);
    
    const updatedBrands = userDoc.data().brand.map((brand) =>
      brand === oldName ? newName : brand
    );

    await updateDoc(userRef, { brand: updatedBrands });
  }
};

export const deleteBrandFromFirestore = async (id, brandNamesToDelete) => {
  const brandsCollection = collection(db, "brands");
  const usersCollection = collection(db, "users");

  // Step 1: Find the brand document and delete it
  const brandRef = doc(db, "brands", id);
  await deleteDoc(brandRef);
  console.log('brandNamesToDelete:', brandNamesToDelete);
  // Step 2: Find all users who have any of the brand names to be deleted in their brands array
  const usersSnapshot = await getDocs(usersCollection);
  const usersToUpdate = usersSnapshot.docs.filter((userDoc) => {
    const userBrands = userDoc.data().brand || []; 
    console.log(userBrands);
    return userBrands.some((brand) => brandNamesToDelete.includes(brand));
  });

  console.log(usersToUpdate);
  
  // Step 3: Update users' brand arrays to remove any of the brands to delete
  for (const userDoc of usersToUpdate) {
    const userRef = doc(db, "users", userDoc.id);

    // Remove all matching brands from the user's brand array
    const updatedBrands = userDoc.data().brand.filter((brand) => !brandNamesToDelete.includes(brand));
    

    await updateDoc(userRef, { brand: updatedBrands });
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
