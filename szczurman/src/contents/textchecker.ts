import { Storage } from "@plasmohq/storage"
import ratLookImg from "data-base64:~../assets/FaceLookIcon.png"
import ratThinkImg from "data-base64:~../assets/RatLookUp.gif"
import ratRunImg from "data-base64:~../assets/RatRun.gif"

const storage = new Storage()
let factCheckerEnabled = true // Default state
let imageElement = null; // Globalny obiekt obrazka
let boxText = "";
let currentHighlightedBlock = null; // Zmienna przechowująca aktualnie zaznaczony blok
let blockLock = false;

async function initialize() {
    const storedValue = await storage.get("factChekerEnabled")
    factCheckerEnabled = storedValue === "true" || storedValue === true

    // Watch for changes in storage and update `factCheckerEnabled`
    storage.watch({
        factChekerEnabled: (newValue) => {
            factCheckerEnabled = newValue.newValue
            console.log("Fact Checker state changed:", newValue)
        }
    })

    setupEventListeners()
}

function setupEventListeners() {
    document.addEventListener('mouseup', () => {
        if (!factCheckerEnabled) return;
        const selectedText = window.getSelection().toString();
        if (selectedText) {
            console.log('Zaznaczony tekst:', selectedText);
        }
    });

    const textBlocks = document.querySelectorAll("*");

    function containsTextOnly(element) {
        const text = element.innerText || '';
        const allowedTags = ['A', 'B', 'I', 'STRONG', 'SPAN', 'CODE', 'BR'];
        const allAllowedChildren = Array.from(element.children).every(child =>
            allowedTags.includes(child.tagName)
        );
        return (element.childElementCount === 0 || allAllowedChildren) && text.trim().length > 0;
    }

    const validTextBlocks = Array.from(textBlocks).filter(block => containsTextOnly(block));

    validTextBlocks.forEach(block => {
        block.style.position = "relative"

        // Sprawdzamy, czy obrazek już istnieje, jeśli nie, tworzymy go
        if (!imageElement) {
            imageElement = document.createElement("img")
            imageElement.src = ratLookImg // Ścieżka do lokalnej ikony w folderze `assets`
            imageElement.style.position = "absolute"
            imageElement.style.right = "0px"
            imageElement.style.top = "0%"
            imageElement.style.zIndex = "9999"
            imageElement.style.width = "45px"
            imageElement.style.height = "45px"
            imageElement.style.opacity = "1"
            imageElement.style.transition = "all 0.3s ease" // Dodajemy animację
            imageElement.classList.add("floating-icon")
            document.body.appendChild(imageElement) // Dodajemy obrazek do body, aby był zawsze widoczny

            imageElement.addEventListener("click", () => {
                console.log("Kliknięto na obrazek!");
                blockLock = true;
                const selectedText = window.getSelection().toString();

                // Pobieramy pozycję zaznaczonego bloku
                const rect = currentHighlightedBlock.getBoundingClientRect();
                const startX = rect.left - 60; // Start po lewej
                const endX = rect.right; // Koniec po prawej

                console.log(startX, endX);

                // Ustawienie początkowej pozycji i animacji biegu
                imageElement.src = ratRunImg;
                imageElement.style.transform = "rotate(-90deg)";
                imageElement.style.width = "160px";
                imageElement.style.height = "160px";
                imageElement.style.left = `${startX}px`;
                imageElement.style.top = `${rect.top + window.scrollY - 115}px`;
                imageElement.style.transition = "left 5s linear";

                let animationRunning = true; // Flaga do kontroli animacji

                // Rozpoczęcie animacji biegu
                const runAnimation = setTimeout(() => {
                    if (animationRunning) {
                        imageElement.style.left = `${endX - 70}px`;
                    }
                }, 300);

                // Po 5 sekundach zmiana na tryb myślenia (chyba że wcześniej przerwano)
                const thinkingAnimation = setTimeout(() => {
                    if (animationRunning) {
                        imageElement.src = ratThinkImg;
                        imageElement.style.transition = "all 0.3s ease";
                        imageElement.style.transform = "rotate(0deg)";
                        imageElement.style.left = `${rect.right - 45}px`;
                        imageElement.style.top = `${rect.top + window.scrollY - 45}px`;
                    }
                }, 5000);

                if (selectedText) boxText = selectedText;

                // Wysłanie wiadomości do background i obsługa odpowiedzi
                chrome.runtime.sendMessage({ action: "analyze_text", text: boxText }, (response) => {
                    if (chrome.runtime.lastError) {
                        console.error("Błąd komunikacji:", chrome.runtime.lastError.message);
                        return;
                    }

                    if (response && response.success) {
                        console.log("Odpowiedź z background:", response.reply);
                        showPopup(response.reply);
                    } else {
                        console.warn("Nieprawidłowa odpowiedź z background.");
                    }

                    // Przerwanie animacji, jeśli odpowiedź przyszła przed zakończeniem animacji biegu
                    animationRunning = false;
                    clearTimeout(runAnimation);
                    clearTimeout(thinkingAnimation);

                    // Resetowanie obrazka do początkowego stanu
                    imageElement.src = ratLookImg;
                    imageElement.style.width = "45px";
                    imageElement.style.height = "45px";
                    imageElement.style.transform = "rotate(0deg)";
                    imageElement.style.transition = "all 0.3s ease";

                    // Przywrócenie domyślnej pozycji
                    imageElement.style.left = `${rect.right}px`;
                    imageElement.style.top = `${rect.top + window.scrollY}px`;

                    blockLock = false;
                });
            });

        }

        block.addEventListener("mouseover", (event) => {
            if (!factCheckerEnabled || blockLock) return;
            event.target.style.backgroundColor = "yellow";
            boxText = event.target.innerText;

            // Przesuwamy obrazek do nowego elementu z animacją
            const rect = event.target.getBoundingClientRect();
            imageElement.style.left = `${rect.right}px`; // Ustawiamy obrazek na prawo od elementu
            imageElement.style.top = `${rect.top + window.scrollY}px`; // Ustawiamy obrazek na samej górze elementu (dostosowanie względem scrolla)

            // Sprawdzamy, czy to jest nowy blok, jeżeli tak to aktualizujemy zaznaczenie
            if (currentHighlightedBlock !== event.target) {
                if (currentHighlightedBlock) {
                    currentHighlightedBlock.style.backgroundColor = ""; // Resetujemy kolor poprzedniego bloku
                }
                currentHighlightedBlock = event.target; // Ustawiamy aktualnie najechany blok
            }
        });



    });
}
// Funkcja tworząca i pokazująca pop-up
function showPopup(replyHtml) {
    // Usunięcie starego pop-upu, jeśli istnieje
    const existingPopup = document.querySelector("#fact-check-popup");
    if (existingPopup) existingPopup.remove();

    // Tworzenie kontenera pop-upu
    const popup = document.createElement("div");
    popup.classList.add("chat-popup");

    // Wstawienie HTML sformatowanego z Markdown
    popup.innerHTML = `
        <div class="chat-popup-content">
            ${replyHtml}
        </div>
    `;


    popup.id = "fact-check-popup";
    popup.style.position = "fixed";
    popup.style.bottom = "20px";
    popup.style.right = "20px";
    popup.style.background = "#222";
    popup.style.color = "#fff";
    popup.style.padding = "15px";
    popup.style.borderRadius = "8px";
    popup.style.zIndex = "10000";
    popup.style.boxShadow = "0px 4px 10px rgba(0,0,0,0.5)";
    popup.style.maxWidth = "350px";
    popup.style.wordWrap = "break-word";
    popup.style.fontSize = "14px";
    popup.style.display = "flex";
    popup.style.flexDirection = "column";
    popup.style.gap = "10px";
    popup.style.opacity = "0";
    popup.style.transform = "translateY(20px)";
    popup.style.transition = "opacity 0.3s ease, transform 0.3s ease";


    // Przycisk zamykania
    const closeButton = document.createElement("button");
    closeButton.innerText = "Zamknij";
    closeButton.style.background = "#ff5555";
    closeButton.style.color = "#fff";
    closeButton.style.border = "none";
    closeButton.style.padding = "5px 10px";
    closeButton.style.borderRadius = "4px";
    closeButton.style.cursor = "pointer";
    closeButton.style.alignSelf = "flex-end";

    closeButton.addEventListener("click", () => {
        popup.style.opacity = "0";
        popup.style.transform = "translateY(20px)";
        setTimeout(() => popup.remove(), 300);
    });

    // Dodanie elementów do pop-upu
    popup.appendChild(closeButton);
    document.body.appendChild(popup);

    // Animacja pojawienia się
    setTimeout(() => {
        popup.style.opacity = "1";
        popup.style.transform = "translateY(0)";
    }, 10);


}

// 🚀 Start the script after loading storage
initialize()
