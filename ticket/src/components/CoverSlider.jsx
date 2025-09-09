import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import cinemaImage from "../assets/cine.jpg";
import TheaterImage from "../assets/teatro.jpg";
import MuseumImage from "../assets/museo.jpg";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const CoverSlider = () => {
  // Slider data
  const slides = [
    {
      id: 1,
      image: cinemaImage,
      title: "Tus Compras Recientes",
      subtitle: "Revive tus experiencias favoritas",
    },
    {
      id: 2,
      image: TheaterImage,
      title: "Eventos Inolvidables",
      subtitle: "Descubre tus próximas aventuras",
    },
    {
      id: 3,
      image: MuseumImage,
      title: "Experiencias Únicas",
      subtitle: "Cada evento una historia por contar",
    },
  ];

  return (
    <div className="relative w-full h-64 md:h-80 lg:h-96">
      <Swiper
        spaceBetween={0}
        centeredSlides={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        modules={[Autoplay, Pagination, Navigation]}
        className="h-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative w-full h-full">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center px-4">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 md:mb-4">
                  {slide.title}
                </h1>
                <p className="text-lg md:text-xl text-white opacity-90 max-w-2xl">
                  {slide.subtitle}
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}

        {/* Custom Navigation Buttons */}
        <div className="swiper-button-prev absolute left-4 top-1/2 z-10 -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-all duration-200">
          <ChevronLeftIcon className="h-6 w-6 text-white" />
        </div>
        <div className="swiper-button-next absolute right-4 top-1/2 z-10 -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-all duration-200">
          <ChevronRightIcon className="h-6 w-6 text-white" />
        </div>

        {/* Pagination Dots */}
        <div className="swiper-pagination !bottom-4" />
      </Swiper>
    </div>
  );
};

export default CoverSlider;
