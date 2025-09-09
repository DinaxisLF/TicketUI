import React, { useState } from "react";
import { useAuth } from "./Login.jsx";
import TheaterImage from "../assets/teatro.jpg";

export default function PurchaseSummary() {
  // Sample purchase data (would come from your state management)
  const [purchaseData, setPurchaseData] = useState({
    event: {
      title: "Concierto de Rock Nacional",
      date: "15 Octubre 2023",
      time: "20:00 - 23:00",
      location: "Auditorio Nacional, CDMX",
      image: TheaterImage,
    },
    tickets: [
      { name: "General", quantity: 2, price: 25.99, section: "General" },
      { name: "VIP", quantity: 1, price: 129.99, section: "VIP" },
    ],
    seats: ["General A3", "General A4", "VIP B2"],
    total: 181.97,
  });

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Resumen de Compra
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Event Information */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <img
                src={purchaseData.event.image}
                alt={purchaseData.event.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  {purchaseData.event.title}
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
                    <span>{purchaseData.event.date}</span>
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
                    <span>{purchaseData.event.time}</span>
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
                    <span>{purchaseData.event.location}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Purchase Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">
                Detalles de tu compra
              </h3>

              {/* Tickets Summary */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3">Boletos</h4>
                <div className="space-y-2">
                  {purchaseData.tickets.map((ticket, index) => (
                    <div
                      key={index}
                      className="flex justify-between text-sm p-2 bg-gray-50 rounded"
                    >
                      <span>
                        {ticket.quantity} x {ticket.name} ({ticket.section})
                      </span>
                      <span className="font-medium">
                        ${(ticket.price * ticket.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Seats Summary */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3">
                  Asientos seleccionados
                </h4>
                <div className="flex flex-wrap gap-2">
                  {purchaseData.seats.map((seat, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full"
                    >
                      {seat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-2xl font-bold text-green-600">
                    ${purchaseData.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
