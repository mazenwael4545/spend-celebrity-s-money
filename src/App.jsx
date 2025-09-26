import "./App.scss";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./pages/Main";
import Products from "./pages/Products";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import ProtectedRoute from "./helpers/ProtectedRoute";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/products" element={<Products />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/admin-panel" element={<Admin />} />
        </Route>
        <Route
          path="*"
          element={<h1 style={{ textAlign: "center" }}>404 not found</h1>}
        />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
