'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getUserRole } from '@/lib/user-utils';
import { 
  signInWithGoogle as googleSignIn, 
  signInWithEmail as emailSignIn, 
  signUpWithEmail as emailSignUp, 
  logOut 
} from '@/lib/firebase-auth';

export interface UserProfile {
  name?: string;
  email?: string;
  branch?: string;
  year?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  role: string | null;
  isAdmin: boolean;
  roleError: string | null;
  signInWithGoogle: () => Promise<any>;
  signInWithEmail: (email: string, pass: string) => Promise<any>;
  signUpWithEmail: (email: string, pass: string, name?: string) => Promise<any>;
  signOut: () => Promise<void>;
  retryFetchRole: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
  role: null,
  isAdmin: false,
  roleError: null,
  signInWithGoogle: async () => {},
  signInWithEmail: async () => {},
  signUpWithEmail: async () => {},
  signOut: async () => {},
  retryFetchRole: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);
  const [roleError, setRoleError] = useState<string | null>(null);

  const fetchUserRole = async (userId: string) => {
    setRoleError(null);
    try {
      const userRole = await getUserRole(userId);
      setRole(userRole);
    } catch (error: any) {
      console.error('Error fetching user role:', error);
      setRoleError('Failed to load user role.');
      setRole(null);
    }
  };

  const retryFetchRole = () => {
    if (user) {
      fetchUserRole(user.uid);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        setUserProfile({
          name: user.displayName || user.email?.split('@')[0] || 'Student',
          email: user.email || '',
          branch: 'Electrical Eng',
          year: '1st Year',
          role: 'student'
        });
        await fetchUserRole(user.uid);
      } else {
        setUserProfile(null);
        setRole(null);
        setRoleError(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    role,
    isAdmin: role === 'admin',
    roleError,
    signInWithGoogle: googleSignIn,
    signInWithEmail: emailSignIn,
    signUpWithEmail: emailSignUp,
    signOut: logOut,
    retryFetchRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
