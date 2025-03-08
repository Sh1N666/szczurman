import React, { useState, useEffect } from "react";
import { Storage } from "@plasmohq/storage";
import "~/styles/global.css";

const storage = new Storage();

const PasswordManager = () => {
    const [passwords, setPasswords] = useState<{ [key: string]: string }>({});
    const [validationResults, setValidationResults] = useState<{ [key: string]: string }>({});
    const [savePasswords, setSavePasswords] = useState<boolean>(true);

    const loadPasswords = async () => {
        try {
            const savedPasswords = await storage.get<{ [key: string]: string }>("capturedPasswords") || {};
            setPasswords(savedPasswords);
            setValidationResults({});
        } catch (error) {
            console.error("Error loading passwords:", error);
        }
    };

    useEffect(() => {
        loadPasswords();

        const unsubscribe = storage.watch({
            capturedPasswords: (newValue) => {
                setPasswords(newValue.newValue || {});
                setValidationResults({});
            }
        });

        const loadSavePasswordsState = async () => {
            const savedState = await storage.get<boolean>("savePasswords");
            setSavePasswords(savedState ?? true);
        };
        loadSavePasswordsState();

        return () => unsubscribe();
    }, []);

    const handleToggleChange = async () => {
        const newValue = !savePasswords;
        setSavePasswords(newValue);
        await storage.set("savePasswords", newValue);
    };

    const handleDeletePassword = async (site: string) => {
        const updatedPasswords = { ...passwords };
        delete updatedPasswords[site];
        setPasswords(updatedPasswords);
        await storage.set("capturedPasswords", updatedPasswords);
    };

    return (
        <div className="p-6 bg-[#ffe6a7] rounded-lg shadow-lg w-full max-w-md mx-auto text-[#99582a] font-medium flex flex-col items-center">
            <h2 className="text-xl font-bold border-b-2 border-[#ffbe0b] pb-2 mb-4">Password Manager</h2>
            <label className="inline-flex items-center cursor-pointer mb-4">
                <input
                    type="checkbox"
                    checked={savePasswords}
                    onChange={handleToggleChange}
                    className="form-checkbox h-5 w-5 text-[#99582a] border-[#99582a] rounded"
                />
                <span className="ml-2">Zapisuj hasła</span>
            </label>
            {Object.keys(passwords).length === 0 ? (
                <p className="text-center">Brak zapisanych haseł.</p>
            ) : (
                <ul className="space-y-3 w-full">
                    {Object.entries(passwords).map(([site, password]) => (
                        <li key={site} className="p-3 bg-[#dda15e] rounded-md shadow-sm flex justify-between items-center w-full">
                            <div>
                                <strong>{site}</strong>
                                <p className={`mt-1 text-sm ${validationResults[site] === "Hasło jest bezpieczne!" ? "text-green-700" : "text-red-700"}`}>
                                    {validationResults[site]}
                                </p>
                            </div>
                            <button
                                onClick={() => handleDeletePassword(site)}
                                className="ml-4 p-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                            >
                                Usuń
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default PasswordManager;