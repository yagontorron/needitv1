import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

interface AuthContextProps {
  user: User | null;
  initializing: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  googleSignIn: () => Promise<void>;
  appleSignIn: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  initializing: true,
  login: async () => {},
  register: async () => {},
  googleSignIn: async () => {},
  appleSignIn: async () => {},
  logout: async () => {},
  updateUserProfile: async () => {},
});

// Mock data for demo purposes - would be replaced with actual auth implementation
const mockUser: User = {
  id: '1',
  email: 'user@example.com',
  displayName: 'John Doe',
  photoURL: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  createdAt: Date.now(),
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const checkUserSession = async () => {
      try {
        let userJson;
        if (Platform.OS === 'web') {
          userJson = localStorage.getItem('user');
        } else {
          userJson = await SecureStore.getItemAsync('user');
        }
        
        if (userJson) {
          setUser(JSON.parse(userJson));
        }
      } catch (error) {
        console.error('Error checking user session:', error);
      } finally {
        setInitializing(false);
      }
    };

    checkUserSession();
  }, []);

  const persistUser = async (userData: User) => {
    const userJson = JSON.stringify(userData);
    
    if (Platform.OS === 'web') {
      localStorage.setItem('user', userJson);
    } else {
      await SecureStore.setItemAsync('user', userJson);
    }
  };

  const clearPersistedUser = async () => {
    if (Platform.OS === 'web') {
      localStorage.removeItem('user');
    } else {
      await SecureStore.deleteItemAsync('user');
    }
  };

  const login = async (email: string, password: string) => {
    // For demo purposes, just log in with mock user
    // In a real app, this would call your authentication API
    await new Promise(resolve => setTimeout(resolve, 1000));
    setUser(mockUser);
    await persistUser(mockUser);
  };

  const register = async (email: string, password: string, displayName: string) => {
    // For demo purposes, create user with provided info
    // In a real app, this would call your registration API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      ...mockUser,
      email,
      displayName,
    };
    
    setUser(newUser);
    await persistUser(newUser);
  };

  const googleSignIn = async () => {
    // In a real app, this would integrate with Google Sign-In
    await new Promise(resolve => setTimeout(resolve, 1000));
    setUser(mockUser);
    await persistUser(mockUser);
  };

  const appleSignIn = async () => {
    // In a real app, this would integrate with Apple Sign-In
    await new Promise(resolve => setTimeout(resolve, 1000));
    setUser(mockUser);
    await persistUser(mockUser);
  };

  const logout = async () => {
    // For demo purposes, just clear the user
    // In a real app, this would call your logout API
    setUser(null);
    await clearPersistedUser();
  };

  const updateUserProfile = async (data: Partial<User>) => {
    // For demo purposes, just update the user
    // In a real app, this would call your update profile API
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      await persistUser(updatedUser);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        initializing,
        login,
        register,
        googleSignIn,
        appleSignIn,
        logout,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);