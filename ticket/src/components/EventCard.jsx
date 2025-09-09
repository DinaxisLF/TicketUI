import React from "react";

const EventCard = ({
  imageUrl,
  eventName,
  eventDate,
  eventTime,
  eventLocation,
  price,
  onButtonClick,
  buttonText,
}) => {
  const isPrice = price;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1">
      {/* Event Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={imageUrl}
          alt={eventName}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        {/* Price Badge */}
        {isPrice ? (
          <div className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
            ${price}
          </div>
        ) : (
          <></>
        )}
      </div>

      {/* Event Details */}
      <div className="p-5">
        {/* Event Name */}
        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 h-14">
          {eventName}
        </h3>
        <div className="flex items-center text-gray-600">
          <svg
            className="w-5 h-5 mr-2"
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
          <span>{eventTime}</span>
        </div>

        {/* Date and Time */}
        <div className="flex items-center text-gray-600 mb-3">
          <svg
            className="w-5 h-5 mr-2"
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
          <span>{eventDate}</span>
        </div>

        <div className="flex items-center text-gray-600 mb-4">
          <svg
            width="16"
            height="16"
            stroke="currentColor"
            class="bi bi-geo-alt-fill w-5 h-5 mr-2"
            viewBox="0 0 16 16"
          >
            <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6" />
          </svg>
          <h1>{eventLocation}</h1>
        </div>

        {/* Action Button */}
        <button
          onClick={onButtonClick}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default EventCard;
