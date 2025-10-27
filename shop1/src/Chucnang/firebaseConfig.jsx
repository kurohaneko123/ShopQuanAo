// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";

// 🔥 Thay bằng config thật của bạn trong Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyAp4iooJBk0KfYJ0zX5AKWE6F__HjDsoCY",
  authDomain: "horizon-bffc2.firebaseapp.com",
  projectId: "horizon-bffc2",
  storageBucket: "horizon-bffc2.appspot.com",
  messagingSenderId: "1046599064979",
  appId: "1:1046599064979:web:6dc4a4aa64f072a1fa1c66",
  measurementId: "G-CVHFM073F8",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
// 👉 lưu phiên vào localStorage để reload vẫn còn đăng nhập
setPersistence(auth, browserLocalPersistence);

export { auth, provider };
