import { MemoryRouter as Router, Routes, Route, Link } from "react-router-dom";
import Assistant from "./Assistant/page";
import FactCheck from "./Factcheck/page";
import PasswordManager from "./PasswordManager/page";
import Login from "./Auth/login";
import PrivateRoute from "./PrivateRoute";
import { AuthProvider, useAuth } from "./AuthContext";

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav style={{ padding: 16, borderBottom: "1px solid #ccc", display: "flex", gap: 16 }}>
      <Link to="/">Home</Link>
      <Link to="/assistant">Options</Link>
      <Link to="/FactCheck">FactChecker</Link>
      <Link to="/PasswordManager">Password Manager</Link>
      {user && <button onClick={logout}>🚪 Wyloguj</button>}
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
  return (
    <div>
      <Navbar />
      <div style={{ padding: 16 }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/assistant" element={<PrivateRoute><Assistant /></PrivateRoute>} />
          <Route path="/FactCheck" element={<PrivateRoute><FactCheck /></PrivateRoute>} />
          <Route path="/PasswordManager" element={<PrivateRoute><PasswordManager /></PrivateRoute>} />
        </Routes>
      </div>
    </div>
  );
}

function IndexPopup() {
  return (
    <AuthProvider>
      <Router>
        <Layout />
      </Router>
    </AuthProvider>
  );
}

export default IndexPopup;
