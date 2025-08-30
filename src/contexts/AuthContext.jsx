import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // LOGIN
  const signIn = async (email, password) => {
    setLoading(true);
    const response = await fetch('http://localhost:8000/api/auth/login/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    setLoading(false);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Credenciales inválidas');
    }
    const data = await response.json();
    localStorage.setItem('authToken', data.token);
    setUser(data.user || { email }); // Ajusta según tu backend
  };

  // REGISTRO
  const signUp = async (email, password, fullName) => {
    setLoading(true);
    const response = await fetch('http://localhost:8000/api/auth/register/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, full_name: fullName }),
    });
    setLoading(false);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'No se pudo registrar');
    }
    // Puedes guardar el token o pedir confirmación por email según tu backend
  };

  // LOGOUT
  const signOut = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};