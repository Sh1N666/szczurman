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

          const reply = data.choices?.[0]?.message?.content || "Brak odpowiedzi od modelu.";
          console.log("Odpowiedź ChatGPT:", reply);
          sendResponse({ success: true, reply });

      } catch (error) {
          console.error("Błąd w komunikacji z API:", error);
          sendResponse({ success: false, error: "Wystąpił problem z połączeniem do OpenAI." });
      }

      return true; // Pozwala na asynchroniczną odpowiedź
  }
});
