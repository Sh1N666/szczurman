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
    <div>
      <h2>Czestototliwosc:</h2>
      <input
        type="number"
        max={10}
        min={0}
        value={selectedOption}
        onChange={handleSelectChange}
      />
      
      <br/>


      <h2>Czy chcesz wylaczyc hasla</h2>
      <br/>
      <label>
        <input
          type="radio"
          value="option1"
          checked={selectedOption2 === "option1"}
          onChange={handleRadioChange}
        />
        Wylaczyc hasla takie same
      </label>
      <label>
        <input
          type="radio"
          value="option2"
          checked={selectedOption2 === "option2"}
          onChange={handleRadioChange}
        />
        Tylko ostrzerzenie
      </label>
      <br/>
      <input
        type="checkbox"
        checked={isChecked}
        onChange={handleCheckboxChange}
      />
      Czy chcesz by szczurosław tobie towarzyszył
      <br/>
      


    </div>
  );
}

