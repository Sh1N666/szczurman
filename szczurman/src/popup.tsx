import { MemoryRouter as Router, Routes, Route, Link } from "react-router-dom";
import Assistant from "./Assistant/page";
import ListBox from "./PasswordManager/page";
import PassFun from "./Options/page"

function Navbar() {
  return (
    <nav style={{ padding: 16, borderBottom: "1px solid #ccc", display: "flex", gap: 16 }}>
      <Link to="/Assistant">Assystent Bezpieczenstwa</Link>
      <Link to="/PasswordManager">Hasla</Link>
      <Link to="/Options">Opcje</Link>
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
          <Route path="/Assistant" element={<Assistant />} />
          <Route path="/Options" element={<PassFun />} />
          <Route path="/PasswordManager" element={<ListBox />} />
        </Routes>
      </div>
    </div>
  );
}

function IndexPopup() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default IndexPopup;
