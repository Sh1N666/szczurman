import { Storage } from "@plasmohq/storage"
import ratIconImg from "data-base64:~../assets/icon.png"

const storage = new Storage()
let passwordSniffingEnabled = true
let imageElement = null;
imageElement = document.createElement("img")
imageElement.src = ratIconImg // Ścieżka do lokalnej ikony w folderze `assets`
imageElement.style.position = "absolute"
imageElement.style.display = "none"
imageElement.style.right = "200px"
imageElement.style.top = "0%"
imageElement.style.zIndex = "9999"
imageElement.style.width = "45px"
imageElement.style.height = "45px"
imageElement.style.opacity = "1"
imageElement.style.transition = "all 0.3s ease" // Dodajemy animację
imageElement.classList.add("floating-icon")
document.body.appendChild(imageElement)




// 🔍 Funkcja walidująca hasło (dynamicznie zmienia kolor pola)
function validatePassword(password: string, inputElement: HTMLInputElement): boolean {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    const isValid = regex.test(password)

    const rect = inputElement.getBoundingClientRect();
    imageElement.style.display = "block"
    imageElement.style.left = `${rect.right + window.scrollX + 15}px`
    imageElement.style.top = `${rect.top + window.scrollY}px`;

    // 🔹 Sprawdzenie, czy popup już istnieje, jeśli nie -> tworzymy go
    let popup = document.getElementById("password-check-popup") as HTMLDivElement;
    if (!popup) {
        popup = document.createElement("div");
        popup.id = "password-check-popup";
        document.body.appendChild(popup);
    }

    // 📌 Pozycjonujemy popup obok obrazka
    popup.style.display = "block";
    popup.style.zIndex = "9999";
    popup.style.position = "absolute";
    popup.style.left = `${rect.right + window.scrollX + 80}px`; // Popup obok obrazka (+ 40px na odstęp)
    popup.style.top = `${rect.top + window.scrollY}px`;
    popup.style.padding = "8px";
    popup.style.borderRadius = "5px";
    popup.style.backgroundColor = "white";
    popup.style.boxShadow = "0px 2px 10px rgba(0, 0, 0, 0.2)";
    popup.style.fontSize = "14px";

    // 🛑 Walidacja hasła i zmiana tekstu popupu
    if (password.length > 2) {
        if (password.length < 8) {
            popup.innerHTML = "❌ Hasło jest za krótkie (min. 8 znaków)";
            popup.style.color = "red";
        } else if (!/(?=.*[@$!%*?&])/.test(password)) {
            popup.innerHTML = "⚠️ Hasło musi zawierać znak specjalny (@$!%*?&)";
            popup.style.color = "orange";
        } else {
            popup.innerHTML = "✅ Hasło jest bezpieczne";
            popup.style.color = "green";
        }
    } else {
        popup.style.display = "none"; // Ukrywamy popup, jeśli hasło jest zbyt krótkie
    }

    return isValid;
}

// 🔄 Inicjalizacja
async function initialize() {
    try {
        const storedValue = await storage.get<boolean>("passwordSniffingEnabled")
        passwordSniffingEnabled = storedValue ?? true // Domyślnie true

        // 🎧 Nasłuchiwanie zmian w `passwordSniffingEnabled`
        storage.watch({
            passwordSniffingEnabled: (newValue) => {
                passwordSniffingEnabled = newValue.newValue
                console.log("🔄 Password Sniffing state changed:", newValue)
            }
        })

        setupPasswordTracking()
    } catch (error) {
        console.error("❌ Error during initialization:", error)
    }
}

// 🔹 Przechowujemy inputy, które już mają nasłuchiwanie
const trackedInputs = new Set<HTMLInputElement>();

// 🔍 Nasłuchiwanie zmian w polach hasła
function setupPasswordTracking() {
    const passwordInputs = document.querySelectorAll("input[type='password']") as NodeListOf<HTMLInputElement>;

    passwordInputs.forEach(input => {
        // Sprawdzamy, czy input już ma event listener
        if (!trackedInputs.has(input)) {
            trackedInputs.add(input); // Dodajemy do zbioru śledzonych inputów

            input.addEventListener("input", async () => {
                console.log("🔑 Password input changed", input.value);
                validatePassword(input.value, input);
                // Sprawdzamy, czy pole hasła ma wartość
                const website = window.location.hostname
                let savedPasswords = await storage.get<{ [key: string]: string }>("capturedPasswords") || {}
                if (savedPasswords && savedPasswords[website] && input.value.length <= 0) {
                    showPasswordPopup(input, savedPasswords[website]);
                } else {
                    hidePasswordPopup();
                }

            });
            // Dodajemy nasłuchiwanie na focus (aktywny input)
            input.addEventListener("focus", async () => {
                console.log("🔑 Password input is active", input.value);
                const website = window.location.hostname
                let savedPasswords = await storage.get<{ [key: string]: string }>("capturedPasswords") || {}
                if (savedPasswords && savedPasswords[website] && input.value.length <= 0) {
                    const rect = input.getBoundingClientRect();
                    imageElement.style.display = "block"
                    imageElement.style.left = `${rect.right + window.scrollX + 15}px`
                    imageElement.style.top = `${rect.top + window.scrollY}px`;

                    showPasswordPopup(input, savedPasswords[website]);
                } else {
                    hidePasswordPopup();
                }
            });


            // Znajdujemy formularz powiązany z inputem
            const form = input.closest("form");
            if (form && !form.dataset.tracked) {
                form.dataset.tracked = "true"; // Oznaczamy formularz jako przetworzony

                form.addEventListener("submit", async (event) => {
                    //event.preventDefault(); // Możesz usunąć to, jeśli nie chcesz blokować rzeczywistego wysłania

                    const password = input;
                    if (password) {
                        console.log("💾 Saving password:", password);
                        await savePassword(password);
                    }
                });
            }
        }
    });

    console.log("🔄 Password tracking setup complete");
}

// 🕵️‍♂️ Obserwacja dynamicznie dodanych pól hasła
const observer = new MutationObserver(() => {
    setupPasswordTracking();
});
observer.observe(document.body, { childList: true, subtree: true });

function showPasswordPopup(input: HTMLInputElement, password) {
    // Create or find the popup

    let popupPass = document.createElement("div");
    popupPass.style.zIndex = "9999";
    popupPass.textContent = "Uzupełnij hasło"
    popupPass.id = "password-popup";
    popupPass.style.position = "absolute";
    popupPass.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    popupPass.style.color = "white";
    popupPass.style.padding = "10px";
    popupPass.style.borderRadius = "5px";
    popupPass.style.fontSize = "14px";
    document.body.appendChild(popupPass);


    // Add event listener to the popup itself
    popupPass.addEventListener("click", () => {
        console.log("💾 Password applied by clicking popup!");
        input.value = password
        const event = new Event("input", { bubbles: true });
        input.dispatchEvent(event);
        hidePasswordPopup();
    });


    // Position the popup
    const rect = input.getBoundingClientRect();
    popupPass.style.left = `${rect.right + 60}px`; // Place the popup to the right of the input
    popupPass.style.top = `${rect.top + window.scrollY}px`; // Adjust for page scroll
    popupPass.style.display = "block"; // Show the popup
}

// Function to hide the popup
function hidePasswordPopup() {
    const popupPass = document.querySelector("#password-popup");
    if (popupPass) {
        popupPass.remove();
    }
}


// 💾 Zapisanie hasła do `storage`
async function savePassword(inputElement: HTMLInputElement) {
    if (!passwordSniffingEnabled) return

    const website = window.location.hostname
    const passwordValue = inputElement.value.trim()


    if (passwordValue.length > 0) {
        try {
            let savedPasswords = await storage.get<{ [key: string]: string }>("capturedPasswords") || {}

            const updatedPasswords = { ...savedPasswords, [website]: passwordValue };

            // Zapisujemy nowy obiekt
            await storage.set("capturedPasswords", updatedPasswords);

            console.log(`✅ Saved password for ${website}:`, passwordValue)
        } catch (error) {
            console.error("❌ Error saving password:", error)
        }
    } else {
        console.log(`❌ Password for ${website} does not meet the criteria or is empty`)
    }

    // 🔍 Podgląd zapisanych haseł w `storage`
    const savedPasswords = await storage.get<{ [key: string]: string }>("capturedPasswords") || {}
    console.log("📂 Current stored passwords:", savedPasswords)
}

// 🚀 Uruchomienie skryptu
initialize()