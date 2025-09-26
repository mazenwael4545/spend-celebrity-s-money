import { Outlet, Navigate } from "react-router-dom";
import { auth } from "../config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import './protectedRoute.scss'

const ProtectedRoute = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribe to auth state changes once
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
      setLoading(false); // stop loading once we know
    });

    // Cleanup on unmount
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="loader"></div>; // or a spinner
  }

  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;