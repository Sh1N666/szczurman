import React, { useState, useEffect } from "react";
import { Storage } from "@plasmohq/storage";

const storage = new Storage();

const validatePassword = (password: string): string => {
    if (password.length < 3) return "Hasło jest za krótkie";

    const minLength = /^.{8,}$/;
    const hasLetter = /[A-Za-z]/;
    const hasNumber = /\d/;
    const hasSpecial = /[@$!%*?&]/;

    if (!minLength.test(password)) return "Hasło musi mieć min. 8 znaków";
    if (!hasLetter.test(password)) return "Hasło musi zawierać literę";
    if (!hasNumber.test(password)) return "Hasło musi zawierać cyfrę";
    if (!hasSpecial.test(password)) return "Hasło musi zawierać znak specjalny";

    return "✅ Hasło jest bezpieczne!";
};

const PasswordManager = () => {
    const [passwords, setPasswords] = useState<{ [key: string]: string }>({});
    const [validationResults, setValidationResults] = useState<{ [key: string]: string }>({});
    const [savePasswords, setSavePasswords] = useState<boolean>(true);

    // 🔄 Funkcja do ładowania haseł
    const loadPasswords = async () => {
        try {
            const savedPasswords = await storage.get<{ [key: string]: string }>("capturedPasswords") || {};
            console.log("🔄 Loaded passwords:", savedPasswords);
            setPasswords(savedPasswords);

            // 🔍 Przelicz walidację dla każdego hasła
            const results: { [key: string]: string } = {};
            Object.entries(savedPasswords).forEach(([site, password]) => {
                results[site] = validatePassword(password);
            });
            setValidationResults(results);
        } catch (error) {
            console.error("❌ Error loading passwords:", error);
        }
    };

    // 🎧 Nasłuchiwanie na zmiany w Plasmo Storage
    useEffect(() => {
        loadPasswords(); // Załaduj hasła przy pierwszym renderze

        const unsubscribe = storage.watch({
            capturedPasswords: (newValue) => {
                console.log("🔔 Passwords updated in storage:", newValue.newValue);
                setPasswords(newValue.newValue || {});

                // 🔍 Przelicz walidację dla nowo zapisanych haseł
                const results: { [key: string]: string } = {};
                Object.entries(newValue.newValue || {}).forEach(([site, password]) => {
                    results[site] = validatePassword(password);
                });
                setValidationResults(results);
            }
        });

        // Załaduj stan zapisywania haseł
        const loadSavePasswordsState = async () => {
            const savedState = await storage.get<boolean>("savePasswords");
            setSavePasswords(savedState ?? true); // Domyślnie true
        };

        loadSavePasswordsState();

    }, []);

    const handleToggleChange = async () => {
        const newValue = !savePasswords;
        setSavePasswords(newValue);
        await storage.set("savePasswords", newValue);
        console.log("🔄 Save passwords state changed:", newValue);
    };

    return (
        <div>
            <h2>🔐 Password Manager</h2>
            <label>
                <input type="checkbox" checked={savePasswords} onChange={handleToggleChange} />
                Save passwords
            </label>
            {Object.keys(passwords).length === 0 ? (
                <p>No passwords captured yet.</p>
            ) : (
                <ul>
                    {Object.entries(passwords).map(([site, password]) => (
                        <li key={site}>
                            <strong>{site}</strong> {/*{password}*/}
                            <p style={{ color: validationResults[site] === "✅ Hasło jest bezpieczne!" ? "green" : "red" }}>
                                {validationResults[site]}
                            </p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default PasswordManager;