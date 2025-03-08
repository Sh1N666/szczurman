import { useState } from "react"
import { encryptData, decryptData } from "../utils/crypto"
import { saveEncryptedPassword, getEncryptedPassword, getPublicKey } from "../utils/storage"

export default function ManagePasswords() {
    const [password, setPassword] = useState("")
    const [privateKey, setPrivateKey] = useState("")
    const [decryptedPassword, setDecryptedPassword] = useState<string | null>(null)

    async function handleSavePassword() {
        const publicKey = await getPublicKey()
        if (!publicKey) {
            alert("Brak klucza publicznego!")
            return
        }
        const encrypted = await encryptData(password, publicKey)
        await saveEncryptedPassword(encrypted)
        alert("🔐 Hasło zaszyfrowane!")
    }

    async function handleDecryptPassword() {
        const encryptedPassword = await getEncryptedPassword()
        if (!encryptedPassword) {
            alert("Brak hasła do odszyfrowania!")
            return
        }
        const decrypted = await decryptData(encryptedPassword, privateKey)
        setDecryptedPassword(decrypted)
    }

    return (
        <div>
            <input type="text" placeholder="Hasło" value={password} onChange={e => setPassword(e.target.value)} />
            <button onClick={handleSavePassword}>🔒 Zaszyfruj</button>
            
            <input type="text" placeholder="Prywatny Klucz" value={privateKey} onChange={e => setPrivateKey(e.target.value)} />
            <button onClick={handleDecryptPassword}>🔓 Odszyfruj</button>

            {decryptedPassword && <p>Odszyfrowane hasło: {decryptedPassword}</p>}
        </div>
    )
}
