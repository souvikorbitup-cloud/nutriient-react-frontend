import React from "react";
import PersonalizedKitSection from "../components/PersonalizedKitSection";
import CTASection from "../components/CTASection";
import useDocumentTitle from "../hooks/useDocumentTitle";

const Aboutus = () => {
  useDocumentTitle(
    "About Us | Nutriient - Customized Supplements & Diet Regimen",
  );
  return (
    <section className="py-32 bg-white">
      {/* Section Heading */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-semibold">About Us</h2>
        <span className="block w-10 h-1 bg-primary mx-auto mt-3" />
      </div>

      {/* Content Wrapper */}
      <div className="app-container mx-auto px-4">
        <div className="grid lg:grid-cols-[60%_40%] items-start">
          {/* LEFT SECTION */}
          <div className="bg-secondary text-white px-4 lg:px-8 pb-8 pt-24 leading-relaxed font-thin">
            <span className="uppercase text-sm tracking-wide opacity-90">
              Story
            </span>

            <h3 className="text-3xl font-medium mb-5">Our mission & vision</h3>

            <p className="mb-4">
              It's not easy to take the first step and the journey is long but
              we are here to make it easier.
            </p>

            <p className="mb-4">
              Now you just need to stick with the routine and we promise you can
              do it, once you onboard with us we will guide you all the way and
              for this specific reason, we are here to make your health journey
              easier. It's never been late to start a good regimen for the
              betterment of your health. We are happy to start that healthy
              regimen with you.
            </p>

            <p className="mb-4">
              Our country suffers from various nutrient deficiencies related
              diseases after a certain age and our Indian day-to-day diet does
              not fulfill our protein need which is a huge concern. But if we
              tweak our Indian diets and add some necessary supplements, we can
              have a sustainable healthy diet that fulfills everything. What we
              believe is if you make habit of a healthy lifestyle at any age,
              you can easily avoid 99% of the future diseases and excel in
              everything you put your mind to.
            </p>

            <p className="mb-4">
              We are a team of nutritionists to make India healthier without
              medicines and educate our fellow Indians about nutrition. We are
              very excited to get you on board with us,
            </p>
          </div>

          {/* RIGHT SECTION */}
          <div className="bg-white p-8 lg:p-10 text-center shadow-[0_20px_40px_rgba(0,0,0,0.08)] lg:ml-5 mt-16">
            <h3 className="text-3xl font-medium mb-4">
              You Are Unique Yourself
            </h3>

            <p className="text-gray-600 leading-relaxed">
              Everyone has their unique health mechanisms, so your health
              routine should be customized for you only.
            </p>
          </div>
        </div>
      </div>

      <PersonalizedKitSection />

      <CTASection btnText="Take Health Assessment" />
    </section>
  );
};

export default Aboutus;
