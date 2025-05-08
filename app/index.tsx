import { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

export default function Index() {
  const { user, initializing } = useAuth();

  // While initializing auth, don't redirect yet
  if (initializing) {
    return null;
  }

  // If user is authenticated, redirect to home screen
  // If not authenticated, redirect to login screen
  if (user) {
    return <Redirect href="/(tabs)" />;
  } else {
    return <Redirect href="/auth/login" />;
  }
}