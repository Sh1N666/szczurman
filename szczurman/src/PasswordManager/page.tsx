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

    const loadPasswords = async () => {
        try {
            const savedPasswords = await storage.get<{ [key: string]: string }>("capturedPasswords") || {};
            setPasswords(savedPasswords);
            const results: { [key: string]: string } = {};
            Object.entries(savedPasswords).forEach(([site, password]) => {
                results[site] = validatePassword(password);
            });
            setValidationResults(results);
        } catch (error) {
            console.error("❌ Error loading passwords:", error);
        }
    };

    useEffect(() => {
        loadPasswords();

        const unsubscribe = storage.watch({
            capturedPasswords: (newValue) => {
                setPasswords(newValue.newValue || {});
                const results: { [key: string]: string } = {};
                Object.entries(newValue.newValue || {}).forEach(([site, password]) => {
                    results[site] = validatePassword(password);
                });
                setValidationResults(results);
            }
        });

        const loadSavePasswordsState = async () => {
            const savedState = await storage.get<boolean>("savePasswords");
            setSavePasswords(savedState ?? true);
        };
        loadSavePasswordsState();
    }, []);

    const handleToggleChange = async () => {
        const newValue = !savePasswords;
        setSavePasswords(newValue);
        await storage.set("savePasswords", newValue);
    };

    const capturePasswordAfterLogin = async (site: string, password: string) => {
        if (!savePasswords) return;

        const checkLoginSuccess = () => {
            return new Promise<boolean>((resolve) => {
                setTimeout(() => {
                    if (document.body.innerText.includes("Wyloguj") || document.location.pathname.includes("dashboard")) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                }, 2000);
            });
        };

        const success = await checkLoginSuccess();
        if (success) {
            const updatedPasswords = { ...passwords, [site]: password };
            await storage.set("capturedPasswords", updatedPasswords);
            setPasswords(updatedPasswords);
            setValidationResults({ ...validationResults, [site]: validatePassword(password) });
            console.log("✅ Hasło zapisane dla:", site);
        } else {
            console.log("❌ Logowanie nieudane, hasło nie zostało zapisane");
        }
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
                            <strong>{site}</strong>
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
