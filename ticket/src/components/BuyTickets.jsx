import React, { useState } from "react";
import TheaterImage from "../assets/teatro.jpg";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./Login.jsx";

export default function BuyTickets() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [ticketTypes, setTicketTypes] = useState([
    { id: 1, name: "Platea", price: 3000, quantity: 0, section: "platea" },
    { id: 2, name: "Palco", price: 2800, quantity: 0, section: "palco" },
    { id: 3, name: "Balcon", price: 2500, quantity: 0, section: "balcon" },
    { id: 4, name: "General", price: 1500, quantity: 0, section: "general" },
  ]);

  const [eventInfo] = useState({
    title: "Romeo y Julieta",
    date: "15 Octubre 2023",
    time: "20:00 - 23:00",
    location: "Teatro Metropolitano, CDMX",
    image: TheaterImage,
  });
  const [showSeatModal, setShowSeatModal] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedSections, setSelectedSections] = useState(new Set());

  // Define seat arrays for different sections with realistic layouts
  const sectionSeats = {
    general: {
      name: "General",
      price: 1500,
      rows: 5,
      cols: 20,
      occupied: [
        [0, 3],
        [0, 6],
        [0, 15],
        [0, 16],
        [1, 5],
        [1, 4],
        [1, 17],
        [2, 8],
        [2, 1],
        [2, 18],
        [3, 2],
        [3, 7],
        [3, 19],
        [4, 6],
        [4, 3],
        [4, 14],
      ],
    },
    platea: {
      name: "Platea",
      price: 3000,
      rows: 5,
      cols: 4,
      occupied: [
        [0, 2],
        [0, 3],
        [1, 0],
        [1, 1],
        [2, 2],
        [3, 3],
        [4, 0],
        [4, 1],
      ],
    },
    palco: {
      name: "Palco",
      price: 2800,
      rows: 3,
      cols: 4,
      occupied: [
        [0, 1],
        [0, 2],
        [1, 0],
        [1, 3],
        [2, 1],
        [2, 2],
      ],
    },
    balcon: {
      name: "Balcon",
      price: 2500,
      rows: 5,
      cols: 6,
      occupied: [
        [0, 2],
        [0, 3],
        [1, 1],
        [1, 4],
        [2, 0],
        [2, 5],
        [3, 2],
        [3, 3],
        [4, 1],
        [4, 4],
      ],
    },
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 0) return;

    setTicketTypes((prev) =>
      prev.map((ticket) =>
        ticket.id === id ? { ...ticket, quantity: newQuantity } : ticket
      )
    );
  };

  const calculateTotal = () => {
    return ticketTypes.reduce(
      (total, ticket) => total + ticket.price * ticket.quantity,
      0
    );
  };

  const getTotalTickets = () => {
    return ticketTypes.reduce((total, ticket) => total + ticket.quantity, 0);
  };

  const getTicketsBySection = (section) => {
    return ticketTypes
      .filter((ticket) => ticket.section === section && ticket.quantity > 0)
      .reduce((total, ticket) => total + ticket.quantity, 0);
  };

  const handlePurchase = () => {
    const selectedTickets = ticketTypes.filter((ticket) => ticket.quantity > 0);
    if (selectedTickets.length === 0) {
      alert("Por favor selecciona al menos un boleto");
      return;
    }

    // Get all sections with selected tickets
    const sections = new Set(selectedTickets.map((ticket) => ticket.section));
    setSelectedSections(sections);
    setShowSeatModal(true);
  };

  const handleSeatSelection = (section, row, col) => {
    // Check if seat is occupied
    if (
      sectionSeats[section].occupied.some(([r, c]) => r === row && c === col)
    ) {
      alert("Este asiento ya está ocupado. Por favor selecciona otro.");
      return;
    }

    const seatId = `${section}-${row}-${col}`;
    const sectionTickets = getTicketsBySection(section);
    const sectionSelectedSeats = selectedSeats.filter((seat) =>
      seat.startsWith(section)
    );

    // Check if user is trying to select more seats than tickets for this section
    if (
      sectionSelectedSeats.length >= sectionTickets &&
      !selectedSeats.includes(seatId)
    ) {
      alert(
        `Solo puedes seleccionar ${sectionTickets} asiento(s) para la sección ${sectionSeats[section].name}.`
      );
      return;
    }

    // Toggle seat selection
    setSelectedSeats((prev) => {
      if (prev.includes(seatId)) {
        return prev.filter((id) => id !== seatId);
      } else {
        return [...prev, seatId];
      }
    });
  };

  const confirmSeatSelection = () => {
    // Check if each section has the correct number of seats selected
    let isValid = true;
    let errorMessage = "";

    selectedSections.forEach((section) => {
      const sectionTickets = getTicketsBySection(section);
      const sectionSelectedSeats = selectedSeats.filter((seat) =>
        seat.startsWith(section)
      );

      if (sectionSelectedSeats.length !== sectionTickets) {
        isValid = false;
        errorMessage += `Debes seleccionar ${sectionTickets} asiento(s) para la sección ${sectionSeats[section].name}.\n`;
      }
    });

    if (!isValid) {
      alert(errorMessage);
      return;
    }

    // Process payment with section information
    console.log("Asientos seleccionados:", selectedSeats);
    navigate("/purchaseSummary", {
      state: {
        selectedSeats,
        ticketTypes: ticketTypes.filter((t) => t.quantity > 0),
        total: calculateTotal(),
        eventInfo,
      },
    });

    // Close modal and reset
    setShowSeatModal(false);
    setSelectedSeats([]);
    setSelectedSections(new Set());
  };

  // Render a single seat
  const renderSeat = (section, row, col) => {
    const isOccupied = sectionSeats[section].occupied.some(
      ([r, c]) => r === row && c === col
    );
    const isSelected = selectedSeats.includes(`${section}-${row}-${col}`);
    const hasTickets = getTicketsBySection(section) > 0;

    return (
      <button
        key={`${section}-${row}-${col}`}
        onClick={() => handleSeatSelection(section, row, col)}
        disabled={isOccupied || !hasTickets}
        className={`
          w-6 h-6 m-1 rounded-sm text-xs flex items-center justify-center
          ${
            isOccupied
              ? "bg-red-500 cursor-not-allowed"
              : !hasTickets
                ? "bg-gray-300 cursor-not-allowed"
                : isSelected
                  ? "bg-green-500 text-white"
                  : "bg-blue-200 hover:bg-blue-300"
          }
        `}
        title={
          isOccupied
            ? "Ocupado"
            : !hasTickets
              ? "No hay boletos seleccionados para esta sección"
              : `${sectionSeats[section].name} ${String.fromCharCode(65 + row)}${col + 1}`
        }
      >
        {isOccupied ? "X" : col + 1}
      </button>
    );
  };

  // Render a section with its seats
  const renderSection = (sectionKey) => {
    const section = sectionSeats[sectionKey];
    const rows = [];
    const hasTickets = getTicketsBySection(sectionKey) > 0;

    for (let row = 0; row < section.rows; row++) {
      const rowSeats = [];
      for (let col = 0; col < section.cols; col++) {
        rowSeats.push(renderSeat(sectionKey, row, col));
      }
      rows.push(
        <div key={row} className="flex items-center justify-center">
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
          <div className="flex items-center gap-2">
            {hasTickets && (
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                {getTicketsBySection(sectionKey)} seleccionados
              </span>
            )}
          </div>
        </div>
        <div
          className={`bg-gray-50 p-3 rounded-lg flex flex-col items-center ${!hasTickets ? "opacity-50" : ""}`}
        >
          {rows}
        </div>
      </div>
    );
  };

  // Render the complete theater layout
  const renderTheaterLayout = () => {
    return (
      <div className="p-4 bg-gray-100 rounded-lg">
        {/* Stage */}
        <div className="text-center mb-8">
          <div className="bg-gray-800 text-white py-4 rounded">
            <h3 className="text-xl font-bold">ESCENARIO</h3>
          </div>
        </div>

        {/* Upper Sections */}
        <div className="grid grid-cols-3 gap-3 mb-2">
          {/* Left Balcony */}
          <div className="text-center">
            <h4 className="font-semibold mb-2">Balcón Izquierdo</h4>
            {renderSection("balcon")}
          </div>

          {/* Palco Sections */}
          <div className="text-center">
            <h4 className="font-semibold mb-2">Palco</h4>
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
              <div className="w-6 h-6 bg-gray-300 rounded-sm mr-2"></div>
              <span className="text-sm">Sin boletos</span>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 bg-gray-800 rounded-sm mr-2"></div>
              <span className="text-sm">Escenario</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTicketType = (ticket) => {
    const sectionInfo = sectionSeats[ticket.section];

    return (
      <div
        key={ticket.id}
        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
      >
        <div className="flex-1">
          <h4 className="font-medium text-gray-800">{ticket.name}</h4>
          <div className="flex items-center gap-2">
            <span className="text-green-600 font-semibold">
              ${ticket.price.toFixed(2)}
            </span>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {sectionInfo.name}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => updateQuantity(ticket.id, ticket.quantity - 1)}
            disabled={ticket.quantity === 0}
            className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            -
          </button>

          <span className="w-8 text-center font-medium">{ticket.quantity}</span>

          <button
            onClick={() => updateQuantity(ticket.id, ticket.quantity + 1)}
            className="w-8 h-8 rounded-full bg-blue-600 text-white"
          >
            +
          </button>
        </div>

        <div className="w-20 text-right">
          <span className="font-semibold">
            ${(ticket.price * ticket.quantity).toFixed(2)}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Comprar Boletos
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Event Information */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <img
                src={eventInfo.image}
                alt={eventInfo.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  {eventInfo.title}
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <svg
                      className="w-5 h-5 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span>{eventInfo.date}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <svg
                      className="w-5 h-5 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>{eventInfo.time}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <svg
                      className="w-5 h-5 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span>{eventInfo.location}</span>
                  </div>
                </div>

                {/* Section Legend */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <h4 className="font-semibold mb-2">Secciones disponibles:</h4>
                  <div className="space-y-2 text-sm">
                    {Object.values(sectionSeats).map((section) => (
                      <div key={section.name} className="flex justify-between">
                        <span>{section.name}</span>
                        <span className="font-semibold">${section.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Ticket Selection */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">
                Selecciona tus boletos
              </h3>

              <div className="space-y-6">
                {ticketTypes.map(renderTicketType)}
              </div>

              {/* Order Summary */}
              <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">
                  Resumen de compra
                </h4>

                <div className="space-y-2">
                  {ticketTypes
                    .filter((ticket) => ticket.quantity > 0)
                    .map((ticket) => (
                      <div
                        key={ticket.id}
                        className="flex justify-between text-sm"
                      >
                        <span>
                          {ticket.quantity} x {ticket.name} (
                          {sectionSeats[ticket.section].name})
                        </span>
                        <span>
                          ${(ticket.price * ticket.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                </div>

                <div className="border-t border-gray-200 mt-4 pt-4">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {getTotalTickets()} boleto
                    {getTotalTickets() !== 1 ? "s" : ""}
                  </p>
                </div>

                <button
                  onClick={handlePurchase}
                  disabled={getTotalTickets() === 0}
                  className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  Seleccionar Asientos
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Seat Selection Modal */}
      {showSeatModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">
                  Selección de Asientos
                </h3>
                <button
                  onClick={() => {
                    setShowSeatModal(false);
                    setSelectedSeats([]);
                    setSelectedSections(new Set());
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-2">
                  Resumen de tu compra:
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  {ticketTypes
                    .filter((ticket) => ticket.quantity > 0)
                    .map((ticket) => (
                      <div
                        key={ticket.id}
                        className="flex justify-between text-sm mb-1"
                      >
                        <span>
                          {ticket.quantity} x {ticket.name} (
                          {sectionSeats[ticket.section].name})
                        </span>
                        <span>
                          ${(ticket.price * ticket.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  <div className="border-t border-gray-200 mt-2 pt-2 font-semibold">
                    <div className="flex justify-between">
                      <span>Total:</span>
                      <span>${calculateTotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-normal text-gray-600">
                      <span>Asientos a seleccionar:</span>
                      <span>{getTotalTickets()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {renderTheaterLayout()}

              <div className="mt-6">
                <h4 className="text-lg font-semibold mb-2">
                  Tus asientos seleccionados:
                </h4>
                {selectedSeats.length > 0 ? (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="font-medium">
                      {selectedSeats
                        .map((seat) => {
                          const [section, row, col] = seat.split("-");
                          return `${sectionSeats[section].name} ${String.fromCharCode(65 + parseInt(row))}${parseInt(col) + 1}`;
                        })
                        .join(", ")}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {selectedSeats.length} de {getTotalTickets()} asientos
                      seleccionados
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-500">
                    Aún no has seleccionado ningún asiento.
                  </p>
                )}
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => {
                    setShowSeatModal(false);
                    setSelectedSeats([]);
                    setSelectedSections(new Set());
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmSeatSelection}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Confirmar Asientos y Pagar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
