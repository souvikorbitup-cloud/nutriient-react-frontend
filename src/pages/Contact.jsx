import React from "react";
import Heading from "../Utils/Heading";
import ContactForm from "../Utils/ContactForm";
import useDocumentTitle from "../hooks/useDocumentTitle";

const Contact = () => {
  useDocumentTitle(
    "Contact | Nutriient - Customized Supplements & Diet Regimen",
  );
  return (
    <section className="app-container mx-auto px-4 py-20 pt-42">
      {/* TITLE */}
      <Heading text="Contact Us" />

      <div className="grid lg:grid-cols-[55%_45%] items-start w-full align-top pt-5">
        {/* LEFT FORM */}
        <div className="lg:pr-10 pb-5 lg:pb-0">
          <ContactForm />
        </div>

        {/* RIGHT CONTACT INFO */}
        <div className="bg-white shadow-[0_24px_35px_11px_rgba(153,153,153,0.15)] p-8 space-y-6 order-1 lg:order-2 mb-20">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 bg-primary flex items-center justify-center rounded">
              <i className="fa-brands fa-whatsapp text-white text-lg"></i>
            </div>
            <span className="text-sm text-gray-700">+918582841933</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-11 h-11 bg-primary flex items-center justify-center rounded">
              <i className="fa-solid fa-phone text-white text-lg"></i>
            </div>
            <span className="text-sm text-gray-700">+918582841933</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-11 h-11 bg-primary flex items-center justify-center rounded">
              <i className="fa-solid fa-envelope text-white text-lg"></i>
            </div>
            <span className="text-sm text-gray-700">info@nutriient.in</span>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-11 h-11 bg-primary flex items-center justify-center rounded">
              <i className="fa-solid fa-location-dot text-white text-lg"></i>
            </div>
            <span className="text-sm text-gray-700 leading-relaxed">
              Ghosalchak, Panchla, Howrah, West Bengal - 711322
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
