import React, { useState } from "react";

export default function TheaterSeatLayout() {
  const [selectedSection, setSelectedSection] = useState("platea");
  const [selectedSeats, setSelectedSeats] = useState([]);

  // Define all sections with their seat layouts
  const sections = {
    palco: {
      name: "Palco",
      price: 3000,
      rows: 3,
      cols: 4,
      occupied: [
        [0, 1],
        [1, 0],
        [2, 3],
      ],
      position: "top",
    },
    platea: {
      name: "Platea",
      price: 2000,
      rows: 5,
      cols: 20,
      occupied: [
        [0, 5],
        [0, 6],
        [0, 14],
        [0, 15],
        [1, 2],
        [1, 17],
        [2, 8],
        [2, 9],
        [2, 10],
        [2, 11],
        [3, 0],
        [3, 19],
        [4, 4],
        [4, 15],
      ],
      position: "center",
    },
    general: {
      name: "General",
      price: 1000,
      rows: 10,
      cols: 20,
      occupied: [
        [0, 3],
        [0, 16],
        [1, 5],
        [1, 14],
        [2, 8],
        [2, 11],
        [3, 2],
        [3, 17],
        [4, 6],
        [4, 13],
        [5, 9],
        [5, 10],
        [6, 1],
        [6, 18],
        [7, 4],
        [7, 15],
        [8, 7],
        [8, 12],
        [9, 0],
        [9, 19],
      ],
      position: "bottom",
    },
    balcon: {
      name: "Balcón",
      price: 1500,
      rows: 5,
      cols: 6,
      occupied: [
        [0, 2],
        [1, 3],
        [2, 1],
        [3, 4],
        [4, 0],
      ],
      position: "sides",
    },
  };

  const handleSeatClick = (section, row, col) => {
    const seatId = `${section}-${row}-${col}`;

    // Check if seat is occupied
    if (sections[section].occupied.some(([r, c]) => r === row && c === col)) {
      return;
    }

    setSelectedSeats((prev) => {
      // If already selected, remove it
      if (prev.includes(seatId)) {
        return prev.filter((id) => id !== seatId);
      }

      // If selecting from a different section, clear previous selections
      const newSelections = prev.filter((id) => id.startsWith(section));

      // Add new seat
      return [...newSelections, seatId];
    });

    setSelectedSection(section);
  };

  const renderSeat = (section, row, col) => {
    const isOccupied = sections[section].occupied.some(
      ([r, c]) => r === row && c === col
    );
    const isSelected = selectedSeats.includes(`${section}-${row}-${col}`);

    return (
      <button
        key={`${section}-${row}-${col}`}
        onClick={() => handleSeatClick(section, row, col)}
        disabled={isOccupied}
        className={`
          w-6 h-6 m-1 rounded-sm text-xs flex items-center justify-center
          ${
            isOccupied
              ? "bg-red-500 cursor-not-allowed"
              : isSelected
                ? "bg-green-500 text-white"
                : "bg-blue-200 hover:bg-blue-300"
          }
        `}
        title={
          isOccupied
            ? "Ocupado"
            : `${section} ${String.fromCharCode(65 + row)}${col + 1}`
        }
      >
        {isOccupied ? "X" : col + 1}
      </button>
    );
  };

  const renderSection = (sectionKey) => {
    const section = sections[sectionKey];
    const rows = [];

    for (let row = 0; row < section.rows; row++) {
      const rowSeats = [];
      for (let col = 0; col < section.cols; col++) {
        rowSeats.push(renderSeat(sectionKey, row, col));
      }
      rows.push(
        <div key={row} className="flex items-center">
          <span className="w-6 text-center font-medium text-sm mr-2">
            {String.fromCharCode(65 + row)}
          </span>
          {rowSeats}
        </div>
      );
    }

    return (
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold">{section.name}</h3>
          <span className="text-sm bg-gray-100 px-2 py-1 rounded">
            ${section.price}
          </span>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">{rows}</div>
      </div>
    );
  };

  const calculateTotal = () => {
    return selectedSeats.reduce((total, seatId) => {
      const [section] = seatId.split("-");
      return total + sections[section].price;
    }, 0);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Selección de Asientos
        </h2>

        {/* Selection Summary */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold">
                Seleccionaste {sections[selectedSection].name}
              </h3>
              <p className="text-gray-600">
                {selectedSeats.length} asiento(s) seleccionado(s)
              </p>
            </div>
            <div className="text-2xl font-bold text-green-600">
              ${calculateTotal().toFixed(2)}
            </div>
          </div>
        </div>

        {/* Theater Layout */}
        <div className="bg-white rounded-xl shadow-md p-6">
          {/* Stage */}
          <div className="text-center mb-8">
            <div className="bg-gray-800 text-white py-4 rounded">
              <h3 className="text-xl font-bold">ESCENARIO</h3>
            </div>
          </div>

          {/* Upper Sections */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            {/* Left Balcony */}
            <div className="text-center">
              <h4 className="font-semibold mb-2">Balcón Izquierdo</h4>
              {renderSection("balcon")}
            </div>

            {/* Palco Sections */}
            <div className="text-center">
              <h4 className="font-semibold mb-2">Palco Central</h4>
              {renderSection("palco")}
            </div>

            {/* Right Balcony */}
            <div className="text-center">
              <h4 className="font-semibold mb-2">Balcón Derecho</h4>
              {renderSection("balcon")}
            </div>
          </div>

          {/* Platea Section */}
          <div className="text-center mb-8">
            <h4 className="font-semibold mb-2">Platea</h4>
            {renderSection("platea")}
          </div>

          {/* Divider */}
          <div className="border-t-2 border-gray-300 border-dashed my-8"></div>

          {/* General Section */}
          <div className="text-center">
            <h4 className="font-semibold mb-2">General</h4>
            {renderSection("general")}
          </div>

          {/* Legend */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h4 className="font-semibold mb-3">Leyenda:</h4>
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-blue-200 rounded-sm mr-2"></div>
                <span className="text-sm">Disponible</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-green-500 rounded-sm mr-2"></div>
                <span className="text-sm">Seleccionado</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-red-500 rounded-sm mr-2"></div>
                <span className="text-sm">Ocupado</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-gray-800 rounded-sm mr-2"></div>
                <span className="text-sm">Escenario</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 mt-6">
          <button className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
            Cancelar
          </button>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Continuar con el Pago
          </button>
        </div>
      </div>
    </div>
  );
}
