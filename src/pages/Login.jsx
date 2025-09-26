import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { auth } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import "./login.scss"
// TODO: DIRECT THE USER TO THE ADMIN DASHBOARD IF THE LOGIN IS SUCCESSFUL [✅]
// TODO: ADD A LOADER WHEN THE USER CLICKS THE LOGIN BUTTON []

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()

  const signIn = async () => {
    if (email && password) {
      try {
        setLoading(true);
        await signInWithEmailAndPassword(auth, email, password);
      } catch (err) {
        console.log(`error signing in : ${err.message}`);
      } finally {
        setLoading(false);
        navigate('/admin-panel')
        setEmail("");
        setPassword("");
      }
    } else {
      alert('fill the input and press "login"');
    }
  };


  return (
    <div className="login">
      <div className="form">
        <h2>Login to the admin dashboard</h2>
        <input
          type="text"
          placeholder="Email..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password..."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={signIn}>{loading ? (<div className="loader"></div>) : (<span>Login</span>)}</button>
      </div>
    </div>
  );
};

export default Login;
