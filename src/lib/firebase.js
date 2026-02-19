import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const readEnv = (key) => {
  const value = import.meta.env[key];

  if (typeof value !== "string") {
    return "";
  }

  const trimmed = value.trim();
  return trimmed.replace(/^['"]|['"]$/g, "");
};

const firebaseConfig = {
  apiKey: readEnv("VITE_FIREBASE_API_KEY"),
  authDomain: readEnv("VITE_FIREBASE_AUTH_DOMAIN"),
  projectId: readEnv("VITE_FIREBASE_PROJECT_ID"),
  appId: readEnv("VITE_FIREBASE_APP_ID"),
  messagingSenderId: readEnv("VITE_FIREBASE_MESSAGING_SENDER_ID"),
};

const requiredFirebaseFields = [
  firebaseConfig.apiKey,
  firebaseConfig.authDomain,
  firebaseConfig.projectId,
  firebaseConfig.appId,
];

const hasFirebaseConfig = requiredFirebaseFields.every(
  (field) => typeof field === "string" && field.length > 0
);

const firebaseApp = hasFirebaseConfig
  ? getApps().length
    ? getApp()
    : initializeApp(firebaseConfig)
  : null;

const auth = firebaseApp ? getAuth(firebaseApp) : null;
const googleProvider = auth ? new GoogleAuthProvider() : null;

export { auth, googleProvider, hasFirebaseConfig };
