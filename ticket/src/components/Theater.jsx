import React from "react";
import TheaterImage from "../assets/teatro.jpg";
import OptionCard from "./OptionCard.jsx";
import { useNavigate } from "react-router-dom";

export default function Theater() {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate(`/theaterEvents/${theaterId}`);
  };

  const events = [
    {
      id: 1,
      imageUrl: TheaterImage,
      name: "Teatro Colón",
      eventLocation: "Buenos Aires, Argentina",
    },
    {
      id: 2,
      imageUrl: TheaterImage,
      name: "Teatro de la Scala",
      eventLocation: "Milan, Italia",
    },
    {
      id: 3,
      imageUrl: TheaterImage,
      name: "Teatro Metropólitab",
      eventLocation: "Ciudad de México, México",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Teatro
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
              <OptionCard
                key={event.id}
                imageUrl={event.imageUrl}
                eventName={event.name}
                eventLocation={event.eventLocation}
                onButtonClick={handleButtonClick}
              />
            ))}
          </div>
        )}
      </div>
      ;
    </div>
  );
}
