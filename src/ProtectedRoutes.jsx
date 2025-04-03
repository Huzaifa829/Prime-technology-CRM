import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./DB/firebase.config";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "./Redux-config/reducers/authSlice";

const ProtectedRoutes = ({ component, role }) => {
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        try {
          const docRef = doc(db, "users", authUser.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const userData = { uid: authUser.uid, ...docSnap.data() };
            const formattedUserData = {
                ...userData,
                createdAt: userData.createdAt ? userData.createdAt.toDate().toISOString() : null, // Convert to string
              };
            
              dispatch(setUser(formattedUserData));
          }
        } catch (error) {
          console.error("Error getting document:", error);
        }
      } else {
        navigate("/"); // User logged out, redirect to home/login
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, dispatch, navigate]);

  if (loading) return <h1>Loading...</h1>;

  // Role check karna
  if (!user || (role && user.role !== role)) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <h1 className="text-xl font-bold text-red-600">
          ❌ Aap is page ko access nahi kar sakte. Apne admin se baat karein.
        </h1>
      </div>
    );
  }

  return component;
};

export default ProtectedRoutes;
