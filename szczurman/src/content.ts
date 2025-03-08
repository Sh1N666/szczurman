import { Storage } from "@plasmohq/storage"

const storage = new Storage()
let factCheckerEnabled = true // Default state

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
        const allowedTags = ['A', 'B', 'I', 'STRONG'];
        const allAllowedChildren = Array.from(element.children).every(child =>
            allowedTags.includes(child.tagName)
        );
        return (element.childElementCount === 0 || allAllowedChildren) && text.trim().length > 0;
    }

    const validTextBlocks = Array.from(textBlocks).filter(block => containsTextOnly(block));

    validTextBlocks.forEach(block => {
        block.addEventListener("mouseover", (event) => {
            if (!factCheckerEnabled) return;
            event.target.style.backgroundColor = "yellow";
        });

        block.addEventListener("mouseout", (event) => {
            if (!factCheckerEnabled) return;
            event.target.style.backgroundColor = "";
        });

        block.addEventListener("click", (event) => {
            if (!factCheckerEnabled) return;
            setTimeout(() => {
                const selectedText = window.getSelection().toString();
                if (selectedText) return;
                const text = event.target.innerText;
                chrome.runtime.sendMessage({ action: "analyze_text", text: text });
            }, 300);
        });

        block.addEventListener("dblclick", (event) => {
            if (!factCheckerEnabled) return;
            setTimeout(() => {
                const selectedText = window.getSelection().toString();
                if (selectedText) return;
            }, 100);
        });
    });


}

// 🚀 Start the script after loading storage
initialize()
