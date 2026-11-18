import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, GithubAuthProvider, type Auth } from "firebase/auth";

// ─── Firebase web config ──────────────────────────────────────────────────────
// These values are PUBLIC and safe to commit. Get them from the Firebase console:
//   Project settings → General → Your apps → SDK setup and configuration → Config
const firebaseConfig = {
  apiKey: "AIzaSyCcqS_nXaf49VqnYcyZ2IZCSFv5MrQVyCM",
  authDomain: "synkron-497817.firebaseapp.com",
  projectId: "synkron-497817",
  storageBucket: "synkron-497817.firebasestorage.app",
  messagingSenderId: "203057390124",
  appId: "1:203057390124:web:4287a3efd54ade4d68e789",
  measurementId: "G-P5B8FVKKX4"
};

// Lazy init so Firebase Auth (a browser-only API) is never touched during SSR.
let app: FirebaseApp | undefined;
let authInstance: Auth | undefined;

export function getFirebaseAuth(): Auth {
  if (!app) app = getApps().length ? getApps()[0]! : initializeApp(firebaseConfig);
  if (!authInstance) authInstance = getAuth(app);
  return authInstance;
}

export const githubProvider = new GithubAuthProvider();

// Initialize Firebase
