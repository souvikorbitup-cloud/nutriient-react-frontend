import React from "react";
import Heading from "../Utils/Heading";
import { steps } from "../variables";

export default function HowWeWork() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="app-container mx-auto px-4">
        {/* Heading */}
        <Heading text="How we work" />

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 text-center mt-14">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center gap-4">
              {/* Icon */}
              <div className="text-4xl pb-5">
                <img src={step.image_path} alt="work-img" className="w-20" />
              </div>

              {/* Text */}
              <p className="text-sm md:text-base text-gray-700 leading-relaxed font-medium">
                {step.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
