/**
 * Firebase Auth Service Implementation
 */

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  GoogleAuthProvider,
  signInWithCredential,
} from 'firebase/auth';
import { FIREBASE_AUTH } from '../../../firebaseconfig';
import { IAuthService } from '../interface';

export class FirebaseAuthService implements IAuthService {
  async signIn(email: string, password: string): Promise<any> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        FIREBASE_AUTH,
        email,
        password
      );
      console.log('Sign in successful');
      return userCredential.user;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  }

  async signUp(email: string, password: string): Promise<any> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        FIREBASE_AUTH,
        email,
        password
      );
      console.log('Sign up successful');
      return userCredential.user;
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  }

  async signOut(): Promise<void> {
    try {
      await firebaseSignOut(FIREBASE_AUTH);
      console.log('Sign out successful');
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }

  async signInWithGoogleCredential(idToken: string): Promise<any> {
    try {
      const credential = GoogleAuthProvider.credential(idToken);
      const userCredential = await signInWithCredential(FIREBASE_AUTH, credential);
      console.log('Google sign in successful');
      return userCredential.user;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  }

  getCurrentUser(): any {
    return FIREBASE_AUTH.currentUser;
  }

  onAuthStateChanged(callback: (user: any) => void): () => void {
    return firebaseOnAuthStateChanged(FIREBASE_AUTH, callback);
  }
}
