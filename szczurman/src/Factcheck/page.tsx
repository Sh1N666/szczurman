import { useEffect, useState } from "react"
import { Storage } from "@plasmohq/storage"

const storage = new Storage()

export default function Popup() {
  const [enabled, setEnabled] = useState(true)

  useEffect(() => {
    storage.get("factChekerEnabled").then((value) => {
      setEnabled(value ?? true) // Domyślnie włączone
    })
  }, [])

  const toggleFactChecker = async () => {
    const newState = !enabled
    setEnabled(newState)
    await storage.set("factChekerEnabled", newState)
    chrome.runtime.sendMessage({ action: "toggle_script", enabled: newState })
  }

  return (
    <div style={{ padding: 16 }}>
      <h2>Fact Checker</h2>
      <button onClick={toggleFactChecker}>
        {enabled ? "Wyłącz" : "Włącz"} sprawdzanie faktów
      </button>
    </div>
  )
}
