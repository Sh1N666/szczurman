import { Storage } from "@plasmohq/storage"
import imgAsset from "data-base64:~../assets/icon.png"

const storage = new Storage()
let factCheckerEnabled = true // Default state
let imageElement = null; // Globalny obiekt obrazka
let boxText = "";
let currentHighlightedBlock = null; // Zmienna przechowująca aktualnie zaznaczony blok
console.log(imgAsset)

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
        const allowedTags = ['A', 'B', 'I', 'STRONG', 'SPAN', 'CODE'];
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
            imageElement.src = imgAsset // Ścieżka do lokalnej ikony w folderze `assets`
            imageElement.style.position = "absolute"
            imageElement.style.right = "0px" // Ustawienie obrazu na prawo od elementu
            imageElement.style.top = "0%"
            imageElement.style.zIndex = "9999"
            imageElement.style.width = "30px"
            imageElement.style.height = "30px"
            imageElement.style.opacity = "0.8"
            imageElement.style.transition = "all 0.3s ease" // Dodajemy animację
            imageElement.classList.add("floating-icon")
            document.body.appendChild(imageElement) // Dodajemy obrazek do body, aby był zawsze widoczny

            imageElement.addEventListener("click", () => {
                console.log("Kliknięto na obrazek!");
                const selectedText = window.getSelection().toString();
                if (selectedText) boxText = selectedText;
                chrome.runtime.sendMessage({ action: "analyze_text", text: boxText });
            });
        }

        block.addEventListener("mouseover", (event) => {
            if (!factCheckerEnabled) return;
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

// 🚀 Start the script after loading storage
initialize()
