import { MemoryRouter as Router, Routes, Route, Link , Navigate } from "react-router-dom";
import Assistant from "./Assistant/page";
import FactCheck from "./Factcheck/page";
import PasswordManager from "./PasswordManager/page";
import Login from "./Auth/login";
import { AuthProvider, useAuth } from "./AuthContext";

function Navbar() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <nav style={{ padding: 16, borderBottom: "1px solid #ccc", display: "flex", gap: 16 }}>
      <Link to="/">Home</Link>
      <Link to="/assistant">Assistant</Link>
      <Link to="/FactCheck">factCheker</Link>
      <Link to="/PasswordManager">Password Manager</Link>
      <button onClick={logout}>🚪 Wyloguj</button>
    </nav>
  );
}

function Home() {
  return (
    <div style={{ padding: 16 }}>
      <h2>Welcome to your Plasmo Extension!</h2>
      <a href="https://docs.plasmo.com" target="_blank" rel="noopener noreferrer">
        View Docs
      </a>
    </div>
  );
}

function Layout() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />; // ❗ Jeśli użytkownik nie jest zalogowany, przenosimy go do logowania
  }

  return (
    <div>
      <Navbar />
      <div style={{ padding: 16 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/assistant" element={<Assistant />} />
          <Route path="/FactCheck" element={<FactCheck />} />
          <Route path="/PasswordManager" element={<PasswordManager />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/*" element={<Layout />} />
    </Routes>
  );
}

function IndexPopup() {
  return (
    <AuthProvider>
      <Router>
        <App />
      </Router>
    </AuthProvider>
  );
}

export default IndexPopup;
