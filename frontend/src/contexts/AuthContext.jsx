// frontend/src/contexts/AuthContext.jsx

import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    token: null,
    role: null,
    user: null
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const userData = localStorage.getItem('user');
    
    try {
      if (token && userData) {
        const user = JSON.parse(userData);
        setAuthState({
          token,
          role: role || user?.role || null,
          user
        });
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
      localStorage.clear();
    }
  }, []);

  const login = async (responseData) => {
    if (!responseData?.token || !responseData?.user?.id) {
      console.error("Invalid login response:", responseData);
      throw new Error("Invalid login response from server");
    }
    
    const role = responseData.user.role || 'user';
    
    localStorage.setItem("token", responseData.token);
    localStorage.setItem("user", JSON.stringify(responseData.user));
    localStorage.setItem("role", role);
    
    setAuthState({
      token: responseData.token,
      role: role,
      user: responseData.user
    });
  };

  const logout = () => {
    localStorage.clear();
    setAuthState({ token: null, role: null, user: null });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);