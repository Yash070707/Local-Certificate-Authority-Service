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
    console.log("Saving token:", token);  // Debugging log
    console.log("Saving username:", user?.username); // Debugging log

    if (!token || !user?.username) {
        console.error("Login failed: Missing token or username");
        return;
    }

    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("username", user.username);
    localStorage.setItem("user", JSON.stringify(user));
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

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);