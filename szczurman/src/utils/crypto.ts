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
        publicKeyBase64: btoa(String.fromCharCode(...new Uint8Array(publicKey))),
        privateKeyBase64: btoa(String.fromCharCode(...new Uint8Array(privateKey))),
    };
}

export async function encryptData(data: string, publicKeyBase64: string) {
    const publicKeyBuffer = Uint8Array.from(atob(publicKeyBase64), c => c.charCodeAt(0)).buffer;
    const publicKey = await window.crypto.subtle.importKey(
        "spki",
        publicKeyBuffer,
        { name: "RSA-OAEP", hash: "SHA-256" },
        false,
        ["encrypt"]
    );

    const encodedData = new TextEncoder().encode(data);
    const encryptedBuffer = await window.crypto.subtle.encrypt({ name: "RSA-OAEP" }, publicKey, encodedData);

    return btoa(String.fromCharCode(...new Uint8Array(encryptedBuffer)));
}

export async function decryptData(encryptedBase64: string, privateKeyBase64: string) {
    const privateKeyBuffer = Uint8Array.from(atob(privateKeyBase64), c => c.charCodeAt(0)).buffer;
    const privateKey = await window.crypto.subtle.importKey(
        "pkcs8",
        privateKeyBuffer,
        { name: "RSA-OAEP", hash: "SHA-256" },
        false,
        ["decrypt"]
    );

    const encryptedBuffer = Uint8Array.from(atob(encryptedBase64), c => c.charCodeAt(0)).buffer;
    const decryptedBuffer = await window.crypto.subtle.decrypt({ name: "RSA-OAEP" }, privateKey, encryptedBuffer);

    return new TextDecoder().decode(decryptedBuffer);
}
