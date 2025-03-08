import React, { useState } from "react";

export default function ListBox() {
  // Stan przechowujący aktualnie wybraną opcję
  const [selectedOption, setSelectedOption] = useState("");
  
  // Tablica do przechowywania liczby użyć poszczególnych opcji
  const [passwordUsageCount, setPasswordUsageCount] = useState({
    option1: 0,
    option2: 0,
    option3: 0,
    option4: 0,
  });

  // Funkcja, która zmienia stan na wybraną wartość
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = event.target.value;
    setSelectedOption(selected);

    // Jeśli wybrano option3, ustawiamy liczbę użyć na 3
    setPasswordUsageCount((prevState) => ({
      ...prevState,
      [selected]: selected === "option3" ? 3 : prevState[selected],
    }));
  };

  // Sprawdzamy, czy wybrane hasło zostało użyte więcej niż 3 razy
  const passwordStatusMessage =
    passwordUsageCount[selectedOption] >= 3
      ? `Hasło "${selectedOption}" zostało użyte za dużo razy!`
      : `Hasło "${selectedOption}" jest bezpieczne.`;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-teal-400 via-cyan-500 to-blue-600 animate-gradient-x">
      <div className="w-full max-w-lg p-8 bg-white rounded-xl shadow-lg space-y-6 transform transition-all duration-500 hover:scale-105">
        
        <h2 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-600 mb-6">
          Wybierz opcję:
        </h2>
  
        {/* ListBox (select) z różnymi opcjami */}
        <div className="space-y-4">
          <label className="block text-xl text-gray-800 font-semibold">Wybierz jedną z opcji</label>
          <select
            value={selectedOption}
            onChange={handleSelectChange}
            className="w-full p-4 bg-gradient-to-r from-indigo-300 via-indigo-400 to-indigo-500 text-white rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-400 transition duration-300 transform hover:scale-105"
          >
            <option value="">-- Wybierz --</option>
            <option value="option1">Opcja 1</option>
            <option value="option2">Opcja 2</option>
            <option value="option3">Opcja 3</option>
            <option value="option4">Opcja 4</option>
          </select>
        </div>
  
        {/* Wyświetlanie wybranej opcji */}
        <div className="mt-6 text-center">
          <h3 className="text-2xl font-semibold text-gray-800">
            Wybrałeś: <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-600">{selectedOption || "Brak"}</span>
          </h3>
        </div>
  
        {/* Dodatkowy efekt animacji po wyborze */}
        {selectedOption && (
          <div className="text-center mt-4">
            <p className="text-xl font-medium text-indigo-600 animate-pulse">
              {passwordStatusMessage}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
