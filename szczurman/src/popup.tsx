import { MemoryRouter as Router, Routes, Route, Link } from "react-router-dom";
import Assistant from "./Assistant/page";
import ListBox from "./PasswordManager/page";
import PassFun from "./Options/page"
import './HelpingFile.css';


function Navbar() {
  return (
    <div style={{width: '180px'}}>
      <nav>
        <div className="btn-group">
          <a href="/Assistant">
            Assystent
          </a>

          <a href="/PasswordManager">
            Hasla
          </a>

          <a href="/Options">
            Opcje
          </a>
        </div>
      </nav>
    </div>
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
