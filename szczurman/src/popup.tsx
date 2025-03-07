import { MemoryRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  return (
    <nav style={{ padding: 16, borderBottom: "1px solid #ccc", display: "flex", gap: 16 }}>
      <Link to="/">Home</Link>
      <Link to="/Assistant/page">Options</Link>
    </nav>
  );
}

function Home() {
  const [options, setOptions] = useState("");
  return (
    <div style={{ padding: 16 }}>
      <h2>
        Welcome to your {" "}
        <a href="https://www.plasmo.com" target="_blank" rel="noopener noreferrer">
          Plasmo
        </a>{" "}
        Extension!
      </h2>
      <input onChange={(e) => setOptions(e.target.value)} value={options} />
      <a href="https://docs.plasmo.com" target="_blank" rel="noopener noreferrer">
        View Docs
      </a>
    </div>
  );
}

function OptionsPage() {
  return (
    <div style={{ padding: 16 }}>
      <h2>Options Page</h2>
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
          <Route path="/Assistant/page" element={<OptionsPage />} />
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