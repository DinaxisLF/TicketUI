import React from "react";
import CoverSlider from "./CoverSlider.jsx";
import EventCard from "./EventCard.jsx";
import cinemaImage from "../assets/cine.jpg";
import TheaterImage from "../assets/teatro.jpg";
import MuseumImage from "../assets/museo.jpg";

import { useAuth } from "./Login.jsx";

export default function Dashboard() {
  const events = [
    {
      id: 1,
      imageUrl: cinemaImage,
      name: "Concierto de Rock Nacional",
      date: "15 Oct 2023",
      time: "20:00 - 23:00",
      eventLocation: "Cinepolis, México",
      price: 25.99,
    },
    {
      id: 2,
      imageUrl: TheaterImage,
      name: "Festival de Jazz Internacional",
      date: "22 Oct 2023",
      time: "19:30 - 22:30",
      eventLocation: "Teatro de la Scala, Milan",
      price: 35.5,
    },
    {
      id: 3,
      imageUrl: MuseumImage,
      name: "Museo Metropolitano",
      date: "28 Oct 2023",
      time: "18:00 - 21:00",
      eventLocation: "CDMX, México",
      price: 29.99,
    },
  ];

  const { user, logout } = useAuth();
  const handleTicketReview = (eventName) => {
    console.log("Going to review ticket");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Slider Cover Section */}
      <CoverSlider />

      {/* Content Section */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Compras Recientes
        </h2>

        {events.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-4">
              No tienes compras recientes
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg">
              Explorar Eventos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {events.map((event) => (
              <EventCard
                key={event.id}
                imageUrl={event.imageUrl}
                eventName={event.name}
                eventDate={event.date}
                eventTime={event.time}
                eventLocation={event.eventLocation}
                price={event.price}
                buttonText={"Ver Resumen"}
                onButtonClick={() => handleBuyTickets(event.name)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
