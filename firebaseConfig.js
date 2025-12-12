import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import {
  getReactNativePersistence,
  initializeAuth,
} from "firebase/auth";

import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAyG8HU-u1zJgsxm_affYT7YisixW1MY2Q",
  authDomain: "mycredentials-a8c33.firebaseapp.com",
  projectId: "mycredentials-a8c33",
  storageBucket: "mycredentials-a8c33.firebasestorage.app",  
  messagingSenderId: "551055784382",
  appId: "1:551055784382:web:0308c2d5a6bdef86e9a1ef"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// FIX: Enable persistent login for React Native
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);
export const storage = getStorage(app);

export default firebaseConfig;
