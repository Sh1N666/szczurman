import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import { fetchPublicKey } from "./background"

const provider = new GoogleAuthProvider();
const auth = getAuth();

export async function loginUser() {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    console.log(`✅ Zalogowano: ${user.displayName}`);

    const browserId = navigator.userAgent;
    const publicKey = await fetchPublicKey(user.uid, browserId);

    if (!publicKey) {
      console.error("⛔ Klucz publiczny nie pasuje! Logowanie przerwane.");
      return null;
    }

    console.log("🔓 Klucz publiczny poprawny – dostęp do zasobów przyznany!");
    return user;
  } catch (error) {
    console.error("❌ Błąd logowania:", error);
    return null;
  }
}
