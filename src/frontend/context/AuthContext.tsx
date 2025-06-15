import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
// import * as SecureStore from 'expo-secure-store';
import { API_URL } from '@/constants/config';

interface AuthContextType {
  user: any;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  updateUser: (newUserData: object) => void;
}

const AuthContext = createContext<AuthContextType>(null!);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        // Check if user is logged in
        const response = await axios.get(new URL('auth/profile', API_URL).href, {
          withCredentials: true
        });
        setUser(response.data);
      } catch (error) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await axios.post(new URL('auth/login', API_URL).href, {
      email,
      password
    }, {
      withCredentials: true
    });
    setUser(response.data);
  };

  const register = async (name: string, email: string, password: string) => {
    const response = await axios.post(new URL('auth/register', API_URL).href, {
      name,
      email,
      password
    }, {
      withCredentials: true
    });
    setUser(response.data);
  };

  const logout = async () => {
    await axios.post(new URL('auth/logout', API_URL).href, {}, {
      withCredentials: true
    });
    setUser(null);
  };

  const updateUser = (newUserData: object) => {
    setUser(currentUser => ({
      ...currentUser,
      ...newUserData,
    }));
  };

  const value = { user, isLoading, login, logout, register, updateUser };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
