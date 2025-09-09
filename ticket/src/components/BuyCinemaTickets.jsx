import React, { useState } from "react";
import TheaterImage from "../assets/teatro.jpg";
import { useAuth } from "./Login.jsx";
export default function BuyCinemaTickets() {
  const { user, logout } = useAuth();
  const [ticketTypes, setTicketTypes] = useState([
    { id: 1, name: "Platea", price: 3000, quantity: 0 },
    { id: 2, name: "Palco", price: 2800, quantity: 0 },
    { id: 3, name: "Balcon", price: 2500, quantity: 0 },
    { id: 4, name: "General", price: 1500, quantity: 0 },
  ]);

  const [showIdInput, setShowIdInput] = useState({});
  const [eventInfo] = useState({
    title: "Romeo y Julieta",
    date: "15 Octubre 2023",
    time: "20:00 - 23:00",
    location: "Teatro Metropolitano, CDMX",
    image: TheaterImage,
  });
  const [showSeatModal, setShowSeatModal] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState([]);

  const [seats, setSeats] = useState([
    [false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false],
    [false, false, true, true, false, false, false, false],
    [false, false, true, true, false, false, false, false],
    [false, false, false, false, false, false, false, false],
    [true, true, false, false, false, true, true, false],
    [false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false],
  ]);

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

  const handlePurchase = () => {
    const selectedTickets = ticketTypes.filter((ticket) => ticket.quantity > 0);
    if (selectedTickets.length === 0) {
      alert("Por favor selecciona al menos un boleto");
      return;
    }

    // Show seat selection modal
    setShowSeatModal(true);
  };

  const handleSeatSelection = (row, col) => {
    // Check if seat is occupied
    if (seats[row][col]) {
      alert("Este asiento ya está ocupado. Por favor selecciona otro.");
      return;
    }

    const seatId = `${row}-${col}`;
    const totalSelectedTickets = getTotalTickets();

    // Check if user is trying to select more seats than tickets
    if (
      selectedSeats.length >= totalSelectedTickets &&
      !selectedSeats.includes(seatId)
    ) {
      alert(
        `Solo puedes seleccionar ${totalSelectedTickets} asiento(s) para los boletos comprados.`
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
    if (selectedSeats.length !== getTotalTickets()) {
      alert(
        `Debes seleccionar exactamente ${getTotalTickets()} asiento(s) para continuar.`
      );
      return;
    }

    // Here you would typically process the payment
    console.log("Asientos seleccionados:", selectedSeats);
    alert(
      `¡Compra exitosa! Asientos: ${selectedSeats.join(", ")}. Total: $${calculateTotal().toFixed(2)}`
    );

    // Close modal and reset
    setShowSeatModal(false);
    setSelectedSeats([]);
  };

  const renderSeatGrid = () => {
    return (
      <div className="p-4 bg-gray-100 rounded-lg">
        <div className="text-center mb-4">
          <div className="w-20 h-6 bg-gray-300 mx-auto mb-2 rounded"></div>
          <p className="text-sm text-gray-600">Pantalla</p>
        </div>

        <div className="space-y-2">
          {seats.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center space-x-2">
              <div className="w-6 flex items-center justify-center text-sm font-medium">
                {String.fromCharCode(65 + rowIndex)}
              </div>
              {row.map((isOccupied, colIndex) => {
                const seatId = `${rowIndex}-${colIndex}`;
                const isSelected = selectedSeats.includes(seatId);

                return (
                  <button
                    key={colIndex}
                    onClick={() => handleSeatSelection(rowIndex, colIndex)}
                    disabled={isOccupied}
                    className={`
                      w-8 h-8 rounded flex items-center justify-center text-xs font-medium
                      ${
                        isOccupied
                          ? "bg-red-500 cursor-not-allowed"
                          : isSelected
                            ? "bg-green-500 text-white"
                            : "bg-blue-100 hover:bg-blue-200"
                      }
                    `}
                    title={
                      isOccupied
                        ? "Ocupado"
                        : `Asiento ${String.fromCharCode(65 + rowIndex)}${colIndex + 1}`
                    }
                  >
                    {colIndex + 1}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-center space-x-6">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-100 rounded mr-2"></div>
            <span className="text-sm">Disponible</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
            <span className="text-sm">Seleccionado</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
            <span className="text-sm">Ocupado</span>
          </div>
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
                {ticketTypes.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">
                        {ticket.name}
                      </h4>
                      <p className="text-green-600 font-semibold">
                        ${ticket.price.toFixed(2)}
                      </p>
                      {ticket.requiresId && (
                        <p className="text-sm text-gray-500">
                          * Requiere identificación
                        </p>
                      )}
                    </div>

                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() =>
                          updateQuantity(ticket.id, ticket.quantity - 1)
                        }
                        disabled={ticket.quantity === 0}
                        className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        -
                      </button>

                      <span className="w-8 text-center font-medium">
                        {ticket.quantity}
                      </span>

                      <button
                        onClick={() =>
                          updateQuantity(ticket.id, ticket.quantity + 1)
                        }
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
                ))}
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
                          {ticket.quantity} x {ticket.name}
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
      {showSeatModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">
                  Selección de Asientos
                </h3>
                <button
                  onClick={() => setShowSeatModal(false)}
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
                          {ticket.quantity} x {ticket.name}
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

              {renderSeatGrid()}

              <div className="mt-6">
                <h4 className="text-lg font-semibold mb-2">
                  Tus asientos seleccionados:
                </h4>
                {selectedSeats.length > 0 ? (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="font-medium">
                      {selectedSeats
                        .map((seat) => {
                          const [row, col] = seat.split("-");
                          return `${String.fromCharCode(65 + parseInt(row))}${parseInt(col) + 1}`;
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
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmSeatSelection}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  disabled={selectedSeats.length !== getTotalTickets()}
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
