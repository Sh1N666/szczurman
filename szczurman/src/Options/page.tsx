import { MemoryRouter as Router, Routes, Route, Link } from "react-router-dom"
import React, { useState } from "react";

export default function PassFun() {
  // Stan przechowujący aktualnie wybraną opcję
  const [selectedOption, setSelectedOption] = useState<number>(0);

  // Funkcja, która zmienia stan na wybraną wartość
  const handleSelectChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Konwertujemy wartość na liczbę
    const value = Number(event.target.value);
    setSelectedOption(value);
  };

  const [selectedOption2, setSelectedOption2] = useState<string>("");

  // Funkcja, która zmienia wybraną opcję
  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption2(event.target.value);
  };

  const [isChecked, setIsChecked] = useState<boolean>(false);

  // Funkcja, która zmienia stan checkboxa
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500">
      <div className="w-full max-w-lg p-8 bg-white rounded-2xl shadow-xl space-y-6 transform transition-all duration-500 hover:scale-105">
        <h2 className="text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-600 mb-6">
          Czestotliwość
        </h2>
        
        {/* Input */}
        <div className="space-y-3">
          <label htmlFor="numberInput" className="block text-xl text-gray-800 font-medium">Wybierz liczbę:</label>
          <input
            type="number"
            max={10}
            min={0}
            value={selectedOption}
            onChange={handleSelectChange}
            id="numberInput"
            className="w-full p-4 bg-gray-100 text-gray-900 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-400 transition duration-300"
          />
        </div>
  
        {/* Radio buttons */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-center text-gray-800">Czy chcesz wyłączyć hasła?</h2>
          
          <div className="space-y-3">
            <label className="inline-flex items-center text-lg text-gray-800">
              <input
                type="radio"
                value="option1"
                checked={selectedOption2 === "option1"}
                onChange={handleRadioChange}
                className="mr-3 text-indigo-500 bg-gray-100 border-gray-300 rounded-full focus:ring-2 focus:ring-yellow-400"
              />
              Wylaczyć hasła takie same
            </label>
            <label className="inline-flex items-center text-lg text-gray-800">
              <input
                type="radio"
                value="option2"
                checked={selectedOption2 === "option2"}
                onChange={handleRadioChange}
                className="mr-3 text-indigo-500 bg-gray-100 border-gray-300 rounded-full focus:ring-2 focus:ring-yellow-400"
              />
              Tylko ostrzeżenie
            </label>
          </div>
        </div>
  
        {/* Checkbox */}
        <div>
          <label className="inline-flex items-center text-lg text-gray-800">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={handleCheckboxChange}
              className="mr-3 text-indigo-500 bg-gray-100 border-gray-300 rounded-full focus:ring-2 focus:ring-yellow-400"
            />
            Czy chcesz, by Szczurosław tobie towarzyszył?
          </label>
        </div>
  
        <div className="text-center mt-4">
          <button className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-red-500 text-white font-bold rounded-lg shadow-md hover:scale-105 transform transition-all duration-300">
            Zatwierdź
          </button>
        </div>
      </div>
    </div>
  );
  
}

