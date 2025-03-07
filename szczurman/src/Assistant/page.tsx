import { MemoryRouter as Router, Routes, Route, Link } from "react-router-dom"

function OptionsPage() {
  return (
    <div style={{ padding: 16 }}>
      <h2>Options Page</h2>
      <p>Here you can configure your settings.</p>
      <Link to="../">
        <button>Back to Home</button>
      </Link>
    </div>
  )
}

export default function Options() {
  return (
    <Router>
      <Routes>
        <Route path="../" element={<OptionsPage />} />
      </Routes>
    </Router>
  )
}