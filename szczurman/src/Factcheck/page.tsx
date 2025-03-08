import { useEffect, useState } from "react"
import { Storage } from "@plasmohq/storage"
import "~/styles/global.css";
import CheeseCoin from "data-base64:~assets/money.png"

const storage = new Storage()

export default function Popup() {
  const [enabled, setEnabled] = useState(true)

  useEffect(() => {
    storage.get("factChekerEnabled").then((value) => {
      setEnabled(value ?? true)
    })
  }, [])

  const toggleFactChecker = async () => {
    const newState = !enabled
    setEnabled(newState)
    await storage.set("factChekerEnabled", newState)
    chrome.runtime.sendMessage({ action: "toggle_script", enabled: newState })
  }

  return ( 
    <div className="flex justify-center items-center h-screen bg-[#dda15e]">
      <div className="p-6 bg-[#ffe6a7] rounded-lg shadow-lg w-64 text-center text-[#6d4c2b] font-semibold">
        <h2 className="mb-4 text-xl font-bold border-b-2 border-[#ffbe0b] pb-2">Fact Checker</h2>
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={enabled}
            onChange={toggleFactChecker}
            className="sr-only peer"
          />
          <div className="relative w-11 h-6 bg-[#d4a373] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#ffbe0b] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6d4c2b]"></div>
          <span className="ml-3 text-sm font-medium text-[#6d4c2b]">
            {enabled ? "Włączone" : "Wyłączone"}
          </span>
        </label>
        <img src={CheeseCoin} className="w-24 h-24 border-[#ffbe0b] border-4 rounded-full mt-4 mx-auto" alt="Cheese Coiny" />
        <p className="mt-2 text-[#6d4c2b] text-lg font-bold">Aktualne Cheese Coiny: 100</p>
        <button className="mt-4 bg-[#6d4c2b] text-[#ffe6a7] px-6 py-3 rounded-md text-lg hover:bg-[#ffbe0b] hover:text-[#6d4c2b] transition-colors">Kup Cheese Coiny</button>
      </div>
    </div>
  )
}
