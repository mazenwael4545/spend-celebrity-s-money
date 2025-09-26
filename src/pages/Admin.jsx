// TODO: seperate the login form in a login.jsx file [✅]
// TODO: create the Products initial data and apply the firebase CRUD functions []

import { useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import "./admin.scss";
import { useNavigate } from "react-router-dom";
import CharactersTab from "../components/CharactersAdmin";
import ProductsTab from "../components/ProductsAdmin";

const Admin = () => {
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState("characters");
  const navigate = useNavigate();
  const [user, setUser] = useState(null)

  const signOutUser = async () => {
    try {
      setLoading(true);
      await signOut(auth);
    } catch (err) {
      console.log(`error signing out : ${err.message}`);
    } finally {
      setLoading(false);
      navigate('/')
    }
  };

  onAuthStateChanged(auth, (currentUser)=> {
    if(currentUser) {
      navigate('/admin-panel');
      setUser(currentUser)
    }else{
      navigate('/login');
      setUser(null)
    }
  })

  return (
    <div className="dashboard" dir="rtl">
      {/* main admin dashboard */}
      <h1>مرحبا بك في لوحة التحكم</h1>
      <h1>{user?.email}</h1>
      <div className="tabs-buttons">
        <button onClick={() => setSelectedTab("characters")} style={{textDecoration: selectedTab === "characters" ? "underline": null}}>الشخصيات</button>
        <span style={{ color: "#4ca771" }}>|</span>
        <button onClick={() => setSelectedTab("products")} style={{textDecoration: selectedTab === "products" ? "underline": null}}>المنتجات</button>
      </div>
      <div className="tab-content">
        {selectedTab == "characters" ? <CharactersTab /> : <ProductsTab />}
      </div>
      <button className="logout" onClick={signOutUser}>
        {loading ? (<div className="loader"></div>) : "logout"}
      </button>
    </div>
  );
};

export default Admin;
