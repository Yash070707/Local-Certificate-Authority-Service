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
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (token && role) {
      setAuthState({ token, role, user });
    }
  }, []);

  const login = (token, user, role) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('user', JSON.stringify(user));
    setAuthState({ token, role, user });
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