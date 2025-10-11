// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, googleProvider, db } from "../firebase"; // ✅ import db
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
  updateProfile
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"; // ✅ import Firestore methods

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return unsubscribe;
  }, []);

  const signup = (email, password, fullName) => {
    return createUserWithEmailAndPassword(auth, email, password).then(async (userCredential) => {
      // Set display name
      await updateProfile(userCredential.user, { displayName: fullName });

      // ✅ Send email verification
      await sendEmailVerification(userCredential.user);

      // ✅ Create an initial Firestore progress doc
      await setDoc(doc(db, "users", userCredential.user.uid), {
        completed: 0,
        experience: 0,
        level: 1,
        streak: 0,
        completedSkills: []
      });

      return userCredential;
    });
  };

  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);

  const signInWithGoogle = async () => {
    const res = await signInWithPopup(auth, googleProvider);
    
    // ✅ Ensure Google users also get a progress doc if it doesn’t exist
    await setDoc(doc(db, "users", res.user.uid), {
      completed: 0,
      experience: 0,
      level: 1,
      streak: 0,
      completedSkills: []
    }, { merge: true });

    setUser(res.user);
    return res.user;
  };

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, signup, login, signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
