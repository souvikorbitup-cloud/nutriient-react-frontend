import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import Button from "./Button";
import Heading from "../Utils/Heading";
import "../swiper.css";
import { slides } from "../variables";

export default function RoutineSlider() {
  return (
    <section className="py-20 bg-white">
      <div className="app-container mx-auto px-4">
        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Heading text="A Routine Compatible To Only You" />
          <p className="text-gray-600 text-sm md:text-base">
            Everyone has their unique health mechanisms, this is why we design
            and deliver{" "}
            <span className="font-semibold">Personalized Nutrition</span> to
            your door.
          </p>
        </div>

        {/* Slider */}
        <Swiper
          modules={[Pagination]}
          pagination={{
            clickable: true,
            bulletClass: "custom-bullet",
            bulletActiveClass: "custom-bullet-active",
          }}
          className="!pb-16"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Left visuals */}
                <div className="relative flex justify-center">
                  <img src={slide.image} alt={slide.name} className="w-full" />
                </div>

                {/* Right content */}
                <div>
                  <h3 className="text-3xl font-light text-gray-900">
                    {slide.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">{slide.role}</p>
                  <p className="text-sm text-gray-600 mb-6">{slide.desc}</p>

                  <ul className="space-y-4">
                    {slide.points.map((point, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-3 text-gray-700 text-sm border-b-1 border-gray-400 py-3"
                      >
                        <span
                          className={`text-primary mt-1 ${point.icon_class}`}
                        ></span>
                        {point.data}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* CTA */}
        <div className="text-center mt-12">
          <Button text="TAKE QUIZ NOW" />
        </div>
      </div>
    </section>
  );
}
