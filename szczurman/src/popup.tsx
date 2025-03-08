import { MemoryRouter as Router, Routes, Route, Link } from "react-router-dom";
import Assistant from "./Assistant/page";
import ListBox from "./PasswordManager/page";
import PassFun from "./Options/page"

function Navbar() {
  return (
    <div style={{width: '180px'}}>
      <nav className="bg-gradient-to-r from-teal-400 to-blue-500 p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          
          <div >
            <Link to="/Assistant">
              <button className="flex px-6 py-3 bg-gradient-to-r from-yellow-400 to-red-500 text-white text-lg font-semibold rounded-lg transform transition duration-300 hover:scale-110 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-300">
                Assystent
              </button>
            </Link>
          
            <Link to="/PasswordManager">
              <button className="flex px-6 py-3 w-[120%] bg-gradient-to-r from-yellow-400 to-red-500 text-white text-lg font-semibold rounded-lg transform transition duration-300 hover:scale-110 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-300">
                Hasla
              </button>
            </Link>

            <Link to="/Options">
              <button className="flex px-6 py-3 w-[120%] bg-gradient-to-r from-yellow-400 to-red-500 text-white text-lg font-semibold rounded-lg transform transition duration-300 hover:scale-110 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-300">
                Opcje
              </button>
            </Link>
          </div>
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
