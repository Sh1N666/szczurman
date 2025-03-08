import React, { useState } from "react";

export default function ListBox() {
  // Stan przechowujący aktualnie wybraną opcję
  const [selectedOption, setSelectedOption] = useState("");

  // Funkcja, która zmienia stan na wybraną wartość
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div>
      <h2>Select an option:</h2>
      
      {/* ListBox (select) z różnymi opcjami */}
      <select value={selectedOption} onChange={handleSelectChange}>
        <option value="">-- Select --</option>
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
        <option value="option3">Option 3</option>
        <option value="option4">Option 4</option>
      </select>

      {/* Wyświetlanie wybranej opcji */}
      <div>
        <h3>You selected: {selectedOption || "None"}</h3>
      </div>
    </div>
  );
}
