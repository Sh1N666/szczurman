<<<<<<< HEAD
import { Storage } from "@plasmohq/storage"
import { generateRSAKeys } from "./utils/crypto"
import { initializeApp } from "firebase/app"
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore"
import { v4 as uuidv4 } from "uuid"

// Konfiguracja Firebase
const firebaseConfig = {
  apiKey: "TWÓJ_FIREBASE_API_KEY",
  authDomain: "TWÓJ_FIREBASE_DOMAIN",
  projectId: "TWÓJ_PROJECT_ID",
  storageBucket: "TWÓJ_FIREBASE_BUCKET",
  messagingSenderId: "TWÓJ_MESSAGING_ID",
  appId: "TWÓJ_APP_ID"
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const storage = new Storage()

// Przypisanie unikalnego ID dla przeglądarki
async function assignBrowserID() {
  const existingID = await storage.get("browser_id")
  if (!existingID) {
    const newID = uuidv4()
    await storage.set("browser_id", newID)
    console.log("📌 Nowe ID przeglądarki:", newID)
  } else {
    console.log("✔️ Przeglądarka już posiada ID:", existingID)
  }
}

// Generowanie i przechowywanie kluczy RSA
async function ensureKeysExist(userId: string, browserId: string) {
  const existingPublicKey = await storage.get("public_key")
  if (!existingPublicKey) {
    console.log("🔑 Generowanie nowej pary kluczy RSA...")
    const { publicKeyBase64, privateKeyBase64 } = await generateRSAKeys()

    await storage.set("public_key", publicKeyBase64)
    await storage.set("private_key", privateKeyBase64) // Klucz prywatny powinien być przechowywany tylko lokalnie

    console.log("✔️ Klucze wygenerowane. Wysyłanie do Firebase...")
    await setDoc(doc(db, "users", userId, "browsers", browserId), {
      publicKey: publicKeyBase64
    })
    console.log("✅ Klucz publiczny zapisany w Firebase.")
  } else {
    console.log("🔐 Klucz publiczny już istnieje.")
  }
}

// Pobranie klucza publicznego z Firebase
async function fetchPublicKey(userId: string, browserId: string) {
  const docRef = doc(db, "users", userId, "browsers", browserId)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    return docSnap.data().publicKey
  } else {
    console.log("❌ Brak klucza publicznego w Firebase!")
    return null
  }
}

// Obsługa wiadomości z przeglądarki
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.action === "get_public_key") {
    const publicKey = await storage.get("public_key")
    sendResponse({ success: true, publicKey })
    return true
  }

  if (message.action === "verify_public_key") {
    const userId = message.userId
    const browserId = await storage.get("browser_id")
    const storedPublicKey = await fetchPublicKey(userId, browserId)
    const localPublicKey = await storage.get("public_key")

    if (storedPublicKey === localPublicKey) {
      sendResponse({ success: true })
    } else {
      sendResponse({ success: false, error: "Niepoprawny klucz publiczny." })
    }
    return true
  }
})

// Inicjalizacja
assignBrowserID()
=======
import { marked } from "marked";


const OPENAI_API_KEY = process.env.PLASMO_PUBLIC_OPENAI_API_KEY;
const FACTCHECK_SYSTEM_PROMPT = process.env.PLASMO_PUBLIC_FACTCHECK_SYSTEM_PROMPT;

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.action === "analyze_text") {
        const text = message.text;
        console.log("Analyzing text:", text);


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
            });

            const data = await response.json();

            if (data.error) {
                console.error("Błąd API:", data.error);
                sendResponse({ success: false, error: data.error.message });
                return;
            }

            const replyMarkdown = data.choices?.[0]?.message?.content || "Brak odpowiedzi od modelu.";
            const replyHtml = marked.parse(replyMarkdown); // Parsujemy Markdown na HTML

            console.log("Odpowiedź ChatGPT:", replyMarkdown);
            sendResponse({ success: true, reply: replyHtml });


        } catch (error) {
            console.error("Błąd w komunikacji z API:", error);
            sendResponse({ success: false, error: "Wystąpił problem z połączeniem do OpenAI." });
        }

        return true; // Pozwala na asynchroniczną odpowiedź
    }
});
>>>>>>> main
