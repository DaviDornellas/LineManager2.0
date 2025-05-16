import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types"; // 👈 importe PropTypes

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  return <AuthContext.Provider value={{ user, setUser }}> {children} </AuthContext.Provider>;
};

// ✅ Validação com PropTypes
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);
