import React from "react";
import Button from "../components/Button";
import Typewriter from "typewriter-effect";
import HowWeWork from "../components/HowWeWork";
import RoutineSlider from "../components/RoutineSlider";
import SupportSection from "../components/SupportSection";
import IngredientsSection from "../components/IngredientsSection";
import FAQSection from "../components/FAQSection";
import CTASection from "../components/CTASection";
import useDocumentTitle from "../hooks/useDocumentTitle";

const Home = () => {
  useDocumentTitle("Nutriient - Customized Supplements & Diet Regimen");
  return (
    <section id="home">
      {/* ============= Banner  ===============  */}

      <div className="h-[860px] bg-[url('/bg/mobile-banner.webp')] md:bg-[url('/bg/banner.webp')] bg-cover bg-center relative">
        <div className="app-container mx-auto px-4 flex pt-52 h-full">
          <div className="max-w-[750px]">
            <h1 className="text-2xl/10 md:text-3xl/12 mb-3 tracking-wide pb-5">
              Customized Nutrition Plans <br />{" "}
              <span className="inline-flex gap-1">
                <span>With</span>
                <span className="font-bold">
                  <Typewriter
                    options={{
                      strings: [
                        "Health Supplements",
                        "Diet Plans",
                        "Routine",
                        "Guidance",
                      ],
                      autoStart: true,
                      loop: true,
                    }}
                  />
                </span>
              </span>
            </h1>
            <p className="text-sm/7 md:text-[1rem]/7 tracking-wide pb-5">
              It's just like visiting a Nutritionist and getting Recommendations
              from the comfort of your home. Get started by taking your{" "}
              <strong>Free Health Assessment</strong> now.
            </p>
            <Button text="TAKE QUIZ NOW" />
          </div>
        </div>
        {/* wave divider */}
        <div className="w-full h-16 absolute bottom-0 left-0 flex items-end">
          <svg
            viewBox="0 0 1440 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="translate-y-2"
          >
            <path
              d="M0 43.9999C106.667 43.9999 213.333 7.99994 320 7.99994C426.667 7.99994 533.333 43.9999 640 43.9999C746.667 43.9999 853.333 7.99994 960 7.99994C1066.67 7.99994 1173.33 43.9999 1280 43.9999C1386.67 43.9999 1440 19.0266 1440 9.01329V100H0V43.9999Z"
              className="fill-current text-white"
            ></path>
          </svg>
        </div>
      </div>

      {/* ============= How We Work  ===============  */}
      <HowWeWork />

      {/* ================ Routin Slider ================== */}
      <RoutineSlider />

      {/* ============= Support Section  ===============  */}
      <SupportSection />

      {/* ============= Ingredients Section  =============== */}
      <IngredientsSection />

      {/* ============= FAQ Section  =============== */}
      <section className=" py-16 bg-white relative z-10">
        <div className="app-container mx-auto p-4">
          {/* Heading */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900">
              FAQ
            </h2>
            <div className="mt-3 h-1 w-8 bg-primary mx-auto rounded-full" />
          </div>

          {/* Accordion */}
          <FAQSection />
        </div>
      </section>

      <CTASection btnText="TAKE QUIZ NOW" />
    </section>
  );
};

export default Home;
