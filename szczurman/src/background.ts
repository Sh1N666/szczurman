chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // Sprawdzamy, czy wiadomość zawiera akcję 'analyze_text'
    if (message.action === "analyze_text") {
      const text = message.text;
      console.log("Analyzing text:", text);
  
      // Możesz tu zrobić analizę tekstu, zapisać go, lub wykonać inne operacje.
      // Odpowiadamy na wiadomość z powrotem, jeśli trzeba
      sendResponse({ success: true, analyzedText: text });
    }
    return true; // Zwracamy true, żeby pozwolić na asynchroniczną odpowiedź
  });
  console.log('test')