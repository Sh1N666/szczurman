import { MemoryRouter as Router, Routes, Route, NavLink , Navigate } from "react-router-dom";
import Assistant from "./Assistant/page";
import FactCheck from "./Factcheck/page";
import PasswordManager from "./PasswordManager/page";
import Login from "./Auth/login";
import { AuthProvider, useAuth } from "./AuthContext";
import "~/styles/global.css";

function Navbar() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <nav className="flex flex-col gap-4 bg-gradient-to-b from-[#dda15e] to-[#99582a] shadow-lg w-1/6 rounded-lg h-full">
      <NavLink
        to="/"
        className={({ isActive }) =>
          `transition-all duration-200 rounded-md text-center ${
            isActive ? "bg-[#ffbe0b] text-[#99582a] font-bold" : "text-[#ffe6a7] hover:text-[#ffbe0b] hover:bg-[#99582a]"
          }`
        }
      >
        Home
      </NavLink>
      <NavLink
        to="/assistant"
        className={({ isActive }) =>
          `transition-all duration-200 rounded-md text-center ${
            isActive ? "bg-[#ffbe0b] text-[#99582a] font-bold" : "text-[#ffe6a7] hover:text-[#ffbe0b] hover:bg-[#99582a]"
          }`
        }
      >
        Assistant
      </NavLink>
      <NavLink
        to="/FactCheck"
        className={({ isActive }) =>
          `transition-all duration-200 rounded-md text-center ${
            isActive ? "bg-[#ffbe0b] text-[#99582a] font-bold" : "text-[#ffe6a7] hover:text-[#ffbe0b] hover:bg-[#99582a]"
          }`
        }
      >
        Fact Checker
      </NavLink>
      <NavLink
        to="/PasswordManager"
        className={({ isActive }) =>
          `transition-all duration-200 rounded-md text-center ${
            isActive ? "bg-[#ffbe0b] text-[#99582a] font-bold" : "text-[#ffe6a7] hover:text-[#ffbe0b] hover:bg-[#99582a]"
          }`
        }
      >
        Password Manager
      </NavLink>

      <button
        onClick={logout}
        className="mt-auto h-10 bg-[#99582a] text-[#ffe6a7] rounded-md hover:bg-[#dda15e] hover:text-[#ffbe0b] transition hover:scale-105"
      >
        Wyloguj
      </button>
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
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex flex-row-reverse items-start rounded-lg w-[450px] h-96 bg-[#dda15e] shadow-lg">
      <Navbar />
      <div className="w-[400px] bg-[#ffe6a7] rounded-lg text-[#99582a] shadow-md">
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