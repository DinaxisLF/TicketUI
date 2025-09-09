import React from "react";
import { useParams } from "react-router-dom";
import TheaterImage from "../assets/teatro.jpg";
import EventCard from "./EventCard.jsx";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./Login.jsx";
export default function TheaterEvents() {
  const navigate = useNavigate();
  const { theaterId } = useParams();
  const { user, logout } = useAuth();
  const handleBuyTickets = () => {
    navigate("/buyTickets");
  };

  const events = [
    {
      id: 1,
      imageUrl: TheaterImage,
      name: "Hamlet",
      date: "17 Sep 2025",
      time: "20:00 - 23:00",
      eventLocation: "Buenos Aires, Argentina",
      price: 25.99,
    },
    {
      id: 2,
      imageUrl: TheaterImage,
      name: "Romeo y Julieta",
      date: "24 Sep 2023",
      time: "19:30 - 22:30",
      eventLocation: "Buenos Aires, Argentina",
      price: 35.5,
    },
    {
      id: 3,
      imageUrl: TheaterImage,
      name: "El Rey Lear",
      date: "10 Oct 2023",
      time: "18:00 - 21:00",
      eventLocation: "Buenos Aires, Argentina",
      price: 29.99,
    },
    {
      id: 4,
      imageUrl: TheaterImage,
      name: "La Casa de Bernarda Alba",
      date: "28 Oct 2023",
      time: "18:00 - 21:00",
      eventLocation: "Buenos Aires, Argentina",
      price: 29.99,
    },
  ];

  console.log(theaterId);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Teatro Colon
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
                buttonText="Comprar Boletos"
                onButtonClick={() => handleBuyTickets(event.name)}
              />
            ))}
          </div>
        )}
      </div>
      ;
    </div>
  );
}
