document.addEventListener('mouseup', () => {
    const selectedText = window.getSelection().toString();
    if (selectedText) {
        console.log('Zaznaczony tekst:', selectedText);
    }
});

const textBlocks = document.querySelectorAll("*");

// Funkcja pomocnicza do sprawdzania, czy blok zawiera tylko dozwolone dzieci i tekst
function containsTextOnly(element: HTMLElement): boolean {
    const text = element.innerText || '';  // Jeśli innerText jest undefined, przypisujemy pusty ciąg

    // Dozwolone tagi, które mogą zawierać tekst
    const allowedTags = ['A', 'B', 'I', 'STRONG'];

    // Sprawdzamy, czy element zawiera tylko dozwolone dzieci
    const allAllowedChildren = Array.from(element.children).every(child =>
        allowedTags.includes(child.tagName)
    );

    // Sprawdzamy, czy element ma tekst i zawiera tylko dozwolone dzieci
    return (element.childElementCount === 0 || allAllowedChildren) && text.trim().length > 0;
}

// Filtrujemy tylko te, które zawierają tekst, ale nie zawierają innych elementów (poza dozwolonymi)
const validTextBlocks = Array.from(textBlocks).filter(block => containsTextOnly(block as HTMLElement));

validTextBlocks.forEach(block => {
    // Nasłuchiwanie na najechanie myszą
    block.addEventListener("mouseover", (event) => {
        (event.target as HTMLElement).style.backgroundColor = "yellow";
    });

    // Nasłuchiwanie na opuszczenie myszą
    block.addEventListener("mouseout", (event) => {
        (event.target as HTMLElement).style.backgroundColor = "";
    });

    // Nasłuchiwanie na kliknięcie
    block.addEventListener("click", (event) => {
        // Opóźniamy sprawdzanie, czy tekst jest zaznaczony
        setTimeout(() => {
            const selectedText = window.getSelection().toString();

            // Jeśli tekst jest zaznaczony, nie wykonuj akcji
            if (selectedText) {
                console.log("Nie wykonuję akcji, ponieważ tekst jest zaznaczony.");
                return;  // Zatrzymujemy dalsze przetwarzanie
            }

            // Jeśli nie ma zaznaczonego tekstu, kontynuujemy akcję
            const text = (event.target as HTMLElement).innerText;
            chrome.runtime.sendMessage({ action: "analyze_text", text: text }, (response) => {
                console.log("Response from background:", response);
            });
        }, 300);  // Opóźnienie 100ms
    });

    // Nasłuchiwanie na podwójne kliknięcie (double click)
    block.addEventListener("dblclick", (event) => {
        // Opóźniamy sprawdzanie zaznaczenia po podwójnym kliknięciu
        setTimeout(() => {
            const selectedText = window.getSelection().toString();

            // Jeśli tekst jest zaznaczony, zapobiegamy dalszemu przetwarzaniu
            if (selectedText) {
                console.log("Nie wykonuję akcji, ponieważ tekst jest zaznaczony.");
                return;  // Zatrzymujemy dalsze przetwarzanie
            }
        }, 100);  // Opóźnienie 100ms
    });
});

console.log('Content script executed!');
