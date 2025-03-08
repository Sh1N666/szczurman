import { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      handleAuthError(error.code);
    }
  };

  const handleAuthError = (errorCode) => {
    switch (errorCode) {
      case "auth/invalid-email":
        setError("Nieprawidłowy format adresu e-mail.");
        break;
      case "auth/user-not-found":
        setError("Użytkownik nie istnieje. Zarejestruj się.");
        break;
      case "auth/wrong-password":
        setError("Nieprawidłowe hasło. Spróbuj ponownie.");
        break;
      case "auth/email-already-in-use":
        setError("Ten e-mail jest już zarejestrowany.");
        break;
      case "auth/weak-password":
        setError("Hasło jest za słabe (minimum 6 znaków).");
        break;
      case "auth/too-many-requests":
        setError("Za dużo prób logowania. Spróbuj później.");
        break;
      case "auth/invalid-credential":
        setError("Nieprawidłowe dane logowania.");
        break;
      default:
        setError("Wystąpił błąd. Spróbuj ponownie.");
    }
  };

  return (
    <div className="p-6 bg-[#ffe6a7] rounded-lg shadow-lg w-72 text-[#99582a]">
      <h2 className="text-2xl font-bold text-center mb-4 border-b-2 border-[#ffbe0b] pb-2">
        {isRegistering ? "Rejestracja" : "Logowanie"}
      </h2>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="px-3 py-2 rounded-md shadow border border-[#99582a] bg-[#ffe6a7] placeholder-[#99582a] text-[#99582a]"
        />
        <input
          type="password"
          placeholder="Hasło"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="px-3 py-2 rounded-md shadow border border-[#99582a] bg-[#ffe6a7] placeholder-[#99582a] text-[#99582a]"
        />
        <button
          type="submit"
          className="mt-4 px-4 py-2 rounded-md bg-[#99582a] text-[#ffe6a7] hover:bg-[#dda15e] transition duration-200 shadow-md"
        >
          {isRegistering ? "Zarejestruj się" : "Zaloguj się"}
        </button>
      </form>
      <button
        onClick={() => setIsRegistering(!isRegistering)}
        className="mt-2 text-sm text-[#99582a] hover:text-[#ffbe0b] transition duration-200"
      >
        {isRegistering ? "Masz konto? Zaloguj się" : "Nie masz konta? Zarejestruj się"}
      </button>
    </div>
  );
};

export default Login;