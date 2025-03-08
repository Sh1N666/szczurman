import { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState(""); // 🔴 Stan do przechowywania błędów

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset błędu przed nową próbą

    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      console.error("❌ Authentication error:", error.message);
      handleAuthError(error.code);
    }
  };

  // 🔴 Funkcja mapująca błędy Firebase na czytelne komunikaty
  const handleAuthError = (errorCode) => {
    switch (errorCode) {
      case "auth/invalid-email":
        setError("❌ Nieprawidłowy format adresu e-mail.");
        break;
      case "auth/user-not-found":
        setError("❌ Użytkownik nie istnieje. Zarejestruj się.");
        break;
      case "auth/wrong-password":
        setError("❌ Nieprawidłowe hasło. Spróbuj ponownie.");
        break;
      case "auth/email-already-in-use":
        setError("❌ Ten e-mail jest już zarejestrowany.");
        break;
      case "auth/weak-password":
        setError("❌ Hasło jest za słabe (minimum 6 znaków).");
        break;
      case "auth/too-many-requests":
        setError("❌ Za dużo prób logowania. Spróbuj później.");
        break;
      case "auth/invalid-credential":
        setError("❌ Nieprawidłowe dane logowania.");
        break;
      default:
        setError("❌ Wystąpił błąd. Spróbuj ponownie.");
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>{isRegistering ? "Rejestracja" : "Logowanie"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Hasło"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">{isRegistering ? "Zarejestruj się" : "Zaloguj się"}</button>
      </form>

      {/* 🔴 Wyświetlanie komunikatu błędu */}
      {error && <p style={{ color: "red", marginTop: 10 }}>{error}</p>}

      <button onClick={() => setIsRegistering(!isRegistering)}>
        {isRegistering ? "Masz konto? Zaloguj się" : "Nie masz konta? Zarejestruj się"}
      </button>
    </div>
  );
};

export default Login;
