import { getApps, initializeApp } from "firebase/app"
import { GoogleAuthProvider, getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"
 
const clientCredentials = {
    apiKey: "AIzaSyBMwcBnpRMEyU4J1Cn0H5RLA-DuqfJIqQo",
    authDomain: "szczurman-f3101.firebaseapp.com",
    projectId: "szczurman-f3101",
    storageBucket: "szczurman-f3101.firebasestorage.app",
    messagingSenderId: "637512015068",
    appId: "1:637512015068:web:eff8b393cf1d882d0fa819",
    measurementId: "G-CGXRYD3M7X"
}
 
let firebase_app
 
// Check if firebase app is already initialized to avoid creating new app on hot-reloads
if (!getApps().length) {
  firebase_app = initializeApp(clientCredentials)
} else {
  firebase_app = getApps()[0]
}
 
export const storage = getStorage(firebase_app)
export const auth = getAuth(firebase_app)
export const db = getFirestore(firebase_app)
export const googleAuth = new GoogleAuthProvider()
 
export default firebase_app