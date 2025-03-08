import React from "react";
import { MemoryRouter as Router, Routes, Route, NavLink , Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Assistant from "./Assistant/page";
import FactCheck from "./Factcheck/page";
import PasswordManager from "./PasswordManager/page";
import Login from "./Auth/login";
import { AuthProvider, useAuth } from "./AuthContext";
import "~/styles/global.css";
import SzczurekGif from "data-base64:~assets/SzczurasStop.gif";

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
        Szczurze tipy
      </NavLink>
      <NavLink
        to="/assistant"
        className={({ isActive }) =>
          `transition-all duration-200 rounded-md text-center ${
            isActive ? "bg-[#ffbe0b] text-[#99582a] font-bold" : "text-[#ffe6a7] hover:text-[#ffbe0b] hover:bg-[#99582a]"
          }`
        }
      >
        Szczurzystent
      </NavLink>
      <NavLink
        to="/FactCheck"
        className={({ isActive }) =>
          `transition-all duration-200 rounded-md text-center ${
            isActive ? "bg-[#ffbe0b] text-[#99582a] font-bold" : "text-[#ffe6a7] hover:text-[#ffbe0b] hover:bg-[#99582a]"
          }`
        }
      >
        Szczurfikator faktów
      </NavLink>
      <NavLink
        to="/PasswordManager"
        className={({ isActive }) =>
          `transition-all duration-200 rounded-md text-center ${
            isActive ? "bg-[#ffbe0b] text-[#99582a] font-bold" : "text-[#ffe6a7] hover:text-[#ffbe0b] hover:bg-[#99582a]"
          }`
        }
      >
        Szczurmenadżer haseł
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


const tips = [
  "Ej, młody szczurze, hasło to nie imię twojego chomika! Mocne, długie i z symbolami!",
  "Nie rozdawaj danych jak darmowego sera! Im mniej wiesz, tym lepiej śpisz!",
  "Phishing? To pułapka na głupie szczury! Sprawdzaj, gdzie klikasz!",
  "Nie loguj się na cudzych kompach! Nie wiesz, kto tam zostawił pułapki!",
  "VPN to twoja tajna norka w necie. Używaj i znikaj z radarów!",
  "Nie klikasz w podejrzane linki? Jesteś szczurem z klasą!",
  "Darmowy ser istnieje tylko w pułapkach – nie wierz w obietnice łatwej kasy!",
  "Twoja kamerka to okno do norki. Zasłoń, jeśli nie używasz!",
  "Hej, hej, młody szczurze! Aktualizacje to tarcza przeciw wirusom – instaluj je od razu!",
  "Nie instaluj dziwnych plików – nawet jeśli wyglądają jak ser. To może być trucizna!",
  "Logowanie dwuskładnikowe? To jak dodatkowa kłódka na twoją norkę!",
  "Nie ufaj wszystkiemu, co widzisz w necie – szczurzy nos zawsze wyczuwa fejki!",
  "Oszustwa w sieci? One czają się jak koty! Bądź sprytniejszy!",
  "Hasła zmieniaj regularnie! Stare hasło to jak nadgryziony ser – prędzej czy później ktoś je dorwie!",
  "Nie pobieraj dziwnych aplikacji – mogą ci podrzucić szczurzy wirus!",
  "Nie podawaj numeru karty w dziwnych miejscach – to jak oddanie klucza do swojej spiżarni!",
  "Pamiętaj: im mniej udostępniasz, tym mniej tracisz!",
  "Hej, szczurze, nie otwieraj dziwnych maili! Krzyczą 'darmowa nagroda'? To scam!",
  "Publiczne Wi-Fi to jak stara dziurawa norka – łatwo cię wyśledzić!",
  "Nie loguj się wszędzie jednym hasłem – to jak otwieranie każdej klatki jednym kluczem!",
  "Nie wiesz, czy coś jest fejkiem? Sprawdź w kilku źródłach, zanim udostępnisz!",
  "Nie wrzucaj wszystkiego do neta – co raz wyląduje w sieci, nigdy nie znika!",
  "Ktoś ci pisze dziwnie znajomy, ale nie wiesz, czy to on? Może to oszust z maską!",
  "Lepiej zignorować dziwną wiadomość, niż wpaść w sidła hakera!",
  "Nie podawaj PESELu jakby to był numer telefonu – to nie informacja na sprzedaż!",
  "Szczurze, zanim pobierzesz plik, zapytaj siebie: czy to źródło jest legit?",
  "Jeśli coś wygląda podejrzanie, to pewnie jest podejrzane!",
  "Nie wysyłaj nikomu swoich zdjęć, których nie chcesz zobaczyć w całym necie!",
  "Szczurza zasada nr 1: ZAWSZE myśl, zanim klikniesz!"
];

function Home() {
  const [tip, setTip] = useState("");
  const [showText, setShowText] = useState(false);
  
  useEffect(() => {
    const changeTip = () => {
      setShowText(false);
      setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * tips.length);
        setTip(tips[randomIndex]);
        setShowText(true);
      }, 3000); // Czas trwania GIF-a (zmień jeśli potrzeba)
    };
    
    changeTip();
    const interval = setInterval(changeTip, 20000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "90vh",
      position: "relative"
    }}>
      {/* GIF */}
      <img
        src={SzczurekGif}
        alt="Szczur Animacja"
        style={{
          width: "350px",
          height: "350px",
          marginLeft: "-50px",
          imageRendering: "pixelated",
          zIndex: 1, 
        }}
      />
      
      {showText && (
        <h2 style={{
          position: "absolute",
          top: "20%",
          color: "black",
          fontSize: "14px",
          width: "250px",
          fontWeight: "bold",
          zIndex: 2, 
          textAlign: "center",
        
        }}>
          {tip}
        </h2>
      )} 
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