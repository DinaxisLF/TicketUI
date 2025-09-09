import React from "react";
import { useNavigate } from "react-router-dom";

const OptionCard = ({
  id,
  imageUrl,
  eventName,
  eventLocation,
  onButtonClick,
  buttonText = "Ver Eventos",
}) => {
  const navigate = useNavigate();

  const handleCardSelection = () => {
    navigate(`/theaterEvents/${id}`);
  };
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1">
      {/* Event Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={imageUrl}
          alt={eventName}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* Event Details */}
      <div className="p-5">
        {/* Event Name */}
        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 h-14 text-center">
          {eventName}
        </h3>

        <h4 className="text-xl text-gray-500 mb-2 line-clamp-2 h-14 text-center">
          {eventLocation}
        </h4>

        {/* Action Button */}
        <button
          onClick={handleCardSelection}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default OptionCard;
