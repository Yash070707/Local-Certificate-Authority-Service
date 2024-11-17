import React, { createContext, useState, useContext } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./Login";
import Admin from "./Admin";
import User from "./User";
import "./App.css"

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  const login = (role) => {
    setIsAuthenticated(true);
    setUserRole(role);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, login, logout }}>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/admin"
            element={
              isAuthenticated && userRole === 'admin' ? <Admin /> : <Navigate to="/" />
            }
          />
          <Route
            path="/user"
            element={
              isAuthenticated && userRole === 'user' ? <User /> : <Navigate to="/" />
            }
          />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}