import { Storage } from "@plasmohq/storage"
import { v4 as uuidv4 } from "uuid"
import { generateRSAKeys } from "./utils/crypto"

const OPENAI_API_KEY = process.env.PLASMO_PUBLIC_OPENAI_API_KEY
const FACTCHECK_SYSTEM_PROMPT = process.env.PLASMO_PUBLIC_FACTCHECK_SYSTEM_PROMPT

const storage = new Storage()

async function assignInstanceID() {
  const existingID = await storage.get("instance_id")
  if (!existingID) {
    const newID = uuidv4()
    await storage.set("instance_id", newID)
    console.log("📌 Nowe ID instancji:", newID)
  } else {
    console.log("✔️ Instancja już posiada ID:", existingID)
  }
}

async function ensureKeysExist() {
  const existingPublicKey = await storage.get("public_key")

  if (!existingPublicKey) {
    console.log("🔑 Brak klucza publicznego – generowanie nowej pary kluczy...")
    const { publicKeyBase64, privateKeyBase64 } = await generateRSAKeys()

    await storage.set("public_key", publicKeyBase64)
    await storage.set("private_key", privateKeyBase64) // Użytkownik powinien pobrać i zapisać prywatny klucz!

    console.log("✔️ Nowa para kluczy RSA została wygenerowana.")
  } else {
    console.log("🔐 Klucz publiczny już istnieje.")
  }
}

// Przypisz ID instancji i upewnij się, że klucze są wygenerowane
assignInstanceID()
ensureKeysExist()

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.action === "analyze_text") {
    const text = message.text
    console.log("🔍 Analizowanie tekstu:", text)

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [
            { role: "system", content: FACTCHECK_SYSTEM_PROMPT },
            { role: "user", content: text }
          ]
        })
      })

      const data = await response.json()

      if (data.error) {
        console.error("❌ Błąd API:", data.error)
        sendResponse({ success: false, error: data.error.message })
        return
      }

      const reply = data.choices?.[0]?.message?.content || "Brak odpowiedzi od modelu."
      console.log("🤖 Odpowiedź ChatGPT:", reply)
      sendResponse({ success: true, reply })
    } catch (error) {
      console.error("❌ Błąd w komunikacji z API:", error)
      sendResponse({ success: false, error: "Wystąpił problem z połączeniem do OpenAI." })
    }

    return true // Pozwala na asynchroniczną odpowiedź
  } 
  
  // 👇 Ten kod był poza `onMessage.addListener`
  if (message.action === "get_public_key") {
    const publicKey = await storage.get("public_key")
    sendResponse({ success: true, publicKey })
    return true
  }
})
