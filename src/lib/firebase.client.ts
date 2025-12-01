import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

let app: FirebaseApp;

export const getFirebaseApp = () => {
  if (!getApps().length) {
    console.log('initializeApp');

    app = initializeApp({
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
    });
  }
  return app!;
};

export const auth = () => getAuth(getFirebaseApp());
export const db = () => getFirestore(getFirebaseApp());

export const logout = async () => {
  const authentication = auth();
  await signOut(authentication);
};