import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: null,
    userId: null,
    role: null,
    loading: true,
  });

  useEffect(() => {
    const token = localStorage.getItem('ksep_token');
    const userId = localStorage.getItem('ksep_userId');
    const role = localStorage.getItem('ksep_role');
    
    setAuth({
      token,
      userId: userId ? parseInt(userId, 10) : null,
      role,
      loading: false,
    });
  }, []);

  const login = (token, id, role) => {
    localStorage.setItem('ksep_token', token);
    localStorage.setItem('ksep_userId', id.toString());
    localStorage.setItem('ksep_role', role);
    setAuth({
      token,
      userId: id,
      role,
      loading: false,
    });
  };

  const logout = () => {
    localStorage.removeItem('ksep_token');
    localStorage.removeItem('ksep_userId');
    localStorage.removeItem('ksep_role');
    setAuth({
      token: null,
      userId: null,
      role: null,
      loading: false,
    });
    // Redirect to login page
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {!auth.loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
