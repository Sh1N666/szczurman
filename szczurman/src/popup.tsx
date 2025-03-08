import { MemoryRouter as Router, Routes, Route, Link } from "react-router-dom";
import Assistant from "./Assistant/page";
import FactCheck from "./Factcheck/page";

function Navbar() {
  return (
    <nav style={{ padding: 16, borderBottom: "1px solid #ccc", display: "flex", gap: 16 }}>
      <Link to="/">Home</Link>
      <Link to="/assistant">Options</Link>
      <Link to="/FactCheck">factCheker</Link>
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
          <Route path="/" element={<Home />} />
          <Route path="/assistant" element={<Assistant />} />
          <Route path="/FactCheck" element={<FactCheck />} />
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
