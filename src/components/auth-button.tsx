// src/components/auth-button.tsx
'use client';

import React from 'react';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { LogIn, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/firebase/config';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

export function AuthButton() {
  const { user } = useAuth(); // Removed loading as it's handled in AuthProvider
  const { toast } = useToast();

  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast({
        title: 'Signed In',
        description: 'Successfully signed in with Google.',
      });
    } catch (error) {
      console.error('Error signing in with Google:', error);
      toast({
        title: 'Sign In Error',
        description: 'Could not sign in with Google. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast({
        title: 'Signed Out',
        description: 'You have been signed out.',
      });
    } catch (error) {
      console.error('Error signing out:', error);
       toast({
         title: 'Sign Out Error',
         description: 'Could not sign out. Please try again.',
         variant: 'destructive',
       });
    }
  };

  // Loading state is now handled by the AuthProvider wrapper

  return user ? (
    <Button variant="ghost" onClick={handleSignOut} aria-label="Sign Out">
      <LogOut className="mr-2 h-4 w-4" />
      Sign Out
    </Button>
  ) : (
    <Button variant="ghost" onClick={handleSignIn} aria-label="Sign in with Google">
       {/* Optional: Add a Google Icon here if desired */}
      <LogIn className="mr-2 h-4 w-4" />
      Sign in with Google
    </Button>
  );
}
