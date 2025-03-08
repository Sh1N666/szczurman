import { Storage } from "@plasmohq/storage"

const storage = new Storage()

export async function savePublicKey(publicKey: string) {
    await storage.set("public_key", publicKey)
    console.log("🔑 Publiczny klucz zapisany!");
}

export async function getPublicKey() {
    return await storage.get("public_key");
}

export async function saveEncryptedPassword(password: string) {
    await storage.set("hashed_password", password);
    console.log("🔐 Hasło zapisane!");
}

export async function getEncryptedPassword() {
    return await storage.get("hashed_password");
}
