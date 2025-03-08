// Konwersja Base64 <-> ArrayBuffer (bezbłędna)
function arrayBufferToBase64(buffer: ArrayBuffer): string {
    return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}

// 📌 Generowanie kluczy RSA
export async function generateRSAKeys() {
    const keyPair = await window.crypto.subtle.generateKey(
        {
            name: "RSA-OAEP",
            modulusLength: 2048,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: "SHA-256",
        },
        true,
        ["encrypt", "decrypt"]
    );

    const publicKey = await window.crypto.subtle.exportKey("spki", keyPair.publicKey);
    const privateKey = await window.crypto.subtle.exportKey("pkcs8", keyPair.privateKey);

    return {
        publicKeyBase64: arrayBufferToBase64(publicKey),
        privateKeyBase64: arrayBufferToBase64(privateKey),
    };
}

// 📌 Szyfrowanie danych (publiczny klucz)
export async function encryptData(data: string, publicKeyBase64: string) {
    try {
        const publicKeyBuffer = base64ToArrayBuffer(publicKeyBase64);
        const publicKey = await window.crypto.subtle.importKey(
            "spki",
            publicKeyBuffer,
            { name: "RSA-OAEP", hash: "SHA-256" },
            false,
            ["encrypt"]
        );

        const encodedData = new TextEncoder().encode(data);
        const encryptedBuffer = await window.crypto.subtle.encrypt(
            { name: "RSA-OAEP" },
            publicKey,
            encodedData
        );

        return arrayBufferToBase64(encryptedBuffer);
    } catch (error) {
        console.error("❌ Błąd szyfrowania:", error);
        return null;
    }
}

// 📌 Odszyfrowywanie danych (prywatny klucz)
export async function decryptData(encryptedBase64: string, privateKeyBase64: string) {
    try {
        const privateKeyBuffer = base64ToArrayBuffer(privateKeyBase64);
        const privateKey = await window.crypto.subtle.importKey(
            "pkcs8",
            privateKeyBuffer,
            { name: "RSA-OAEP", hash: "SHA-256" },
            false,
            ["decrypt"]
        );

        const encryptedBuffer = base64ToArrayBuffer(encryptedBase64);
        const decryptedBuffer = await window.crypto.subtle.decrypt(
            { name: "RSA-OAEP" },
            privateKey,
            encryptedBuffer
        );

        return new TextDecoder().decode(decryptedBuffer);
    } catch (error) {
        console.error("❌ Błąd odszyfrowania:", error);
        return null;
    }
}
