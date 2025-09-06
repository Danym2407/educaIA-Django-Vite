import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Al montar, si hay token, carga el perfil
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      fetchProfile(token);
    }
  }, []);

  // Carga el perfil del usuario autenticado
  const fetchProfile = async (token) => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/auth/profile/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('No autorizado');
      const profileData = await res.json();
      setUser({
        email: profileData.email,
        created_at: profileData.created_at,
      });
      setProfile(profileData);
    } catch (error) {
      setUser(null);
      setProfile(null);
      localStorage.removeItem('authToken');
    }
    setLoading(false);
  };

  // LOGIN
  const signIn = async (email, password) => {
    setLoading(true);
    const response = await fetch('http://localhost:8000/api/auth/login/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: email, password }), // SimpleJWT espera username
    });
    if (!response.ok) {
      setLoading(false);
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Credenciales inválidas');
    }
    const data = await response.json();
    localStorage.setItem('authToken', data.access);
    await fetchProfile(data.access);
    setLoading(false);
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
    // Puedes pedir confirmación por email, o iniciar sesión automáticamente si lo deseas
  };

  // LOGOUT
  const signOut = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    setProfile(null);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, profile, loading, isAuthenticated, signIn, signUp, signOut, fetchProfile }}>
      {children}
    </AuthContext.Provider>
  );
};