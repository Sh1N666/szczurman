import { useState } from "react"
import { generateRSAKeys } from "../utils/crypto"
import { savePublicKey } from "../utils/storage"

export default function GenerateKeys() {
    const [publicKey, setPublicKey] = useState<string | null>(null)
    const [privateKey, setPrivateKey] = useState<string | null>(null)

    async function handleGenerateKeys() {
        const { publicKeyBase64, privateKeyBase64 } = await generateRSAKeys()
        await savePublicKey(publicKeyBase64)
        setPublicKey(publicKeyBase64)
        setPrivateKey(privateKeyBase64)
    }

    return (
        <div>
            <button onClick={handleGenerateKeys}>🔑 Generuj Klucze</button>
            {publicKey && <p><b>Publiczny Klucz:</b> {publicKey}</p>}
            {privateKey && <p><b>Prywatny Klucz (zapisz!):</b> {privateKey}</p>}
        </div>
    )
}
