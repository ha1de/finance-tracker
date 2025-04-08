import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

function App() {
  // Basic auth check using localStorage
  const isAuthenticated = !!localStorage.getItem("authToken");

  return (
    <>
      <nav
        style={{
          marginBottom: "20px",
          borderBottom: "1px solid #ccc",
          paddingBottom: "10px",
        }}
      >
        <Link to="/" style={{ marginRight: "10px" }}>
          Dashboard
        </Link>
        {!isAuthenticated && (
          <Link to="/login" style={{ marginRight: "10px" }}>
            Login
          </Link>
        )}
        {!isAuthenticated && <Link to="/register">Register</Link>}
      </nav>

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<DashboardPage />} />
        </Route>

        {/* Catch-all visus 404 */}
        <Route path="*" element={<h2>Page Not Found</h2>} />
      </Routes>
    </>
  );
}

export default App;
