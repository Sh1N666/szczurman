import { MemoryRouter as Router, Routes, Route, Link } from "react-router-dom"


export default function Assistant() {
    return (
        <div style={{ padding: 16 }}>
          <h2>Twoj asystent jest tutaj</h2>
          <Link to="../">
            <button>Go to Assistant</button>
          </Link>
        </div>
      )
  }