import { MemoryRouter as Router, Routes, Route, Link } from "react-router-dom"

export default function Assistant() {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold">Twoj asystent jest tutaj</h2>
      <Link to="../">
        <button className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200">
          <center>Go to Assistant</center>
        </button>
      </Link>
    </div>
  );
}