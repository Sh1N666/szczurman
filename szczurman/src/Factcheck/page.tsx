import { useEffect, useState } from "react"
import { Storage } from "@plasmohq/storage"
import "~/styles/global.css";

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
    <div className="p-6 bg-[#ffe6a7] rounded-lg shadow-lg w-64 text-center text-[#99582a] font-semibold">
      <h2 className="mb-4 text-xl font-bold border-b-2 border-[#ffbe0b] pb-2">Fact Checker</h2>
      <label className="inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={enabled}
          onChange={toggleFactChecker}
          className="sr-only peer"
        />
        <div className="relative w-11 h-6 bg-[#dda15e] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#ffbe0b] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#99582a]"></div>
        <span className="ml-3 text-sm font-medium">{enabled ? "Włączone" : "Wyłączone"}</span>
      </label>
    </div>
  )
}