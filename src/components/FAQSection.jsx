import { useState } from "react";
import { faqs } from "../variables";

export default function FAQSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {faqs.map((faq, index) => {
        const isOpen = activeIndex === index;

        return (
          <div
            key={index}
            className={
              faqs.length - 1 === index ? "" : "border-b border-[#D0D0D0]"
            }
          >
            {/* Question */}
            <button
              onClick={() => toggle(index)}
              className="w-full flex items-center justify-between py-5 text-left"
            >
              <h3 className="text-lg font-semibold text-t-black">
                {faq.question}
              </h3>

              {/* Plus / Minus Circle */}
              <span className="flex items-center justify-center h-6 w-6 shrink-0">
                {isOpen ? <img src="/icons/minus-circle.svg" alt="-" /> : <img src="/icons/plus-circle.svg" alt="+" /> }
              </span>
            </button>

            {/* Answer */}
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <p className="pb-5 pr-8 text-sm md:text-base text-t-black-light leading-relaxed font-thin">
                {faq.answer}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
