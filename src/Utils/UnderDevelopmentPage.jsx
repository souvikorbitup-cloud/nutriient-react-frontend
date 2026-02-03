import React from "react";
import { NavLink } from "react-router-dom";

export default function UnderDevelopmentPage() {
  return (
    <section className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="mx-auto max-w-md text-center">
        {/* Icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <i className="fa-solid fa-screwdriver-wrench text-3xl text-primary"></i>
        </div>

        {/* Text */}
        <h1 className="text-2xl font-semibold text-gray-900">
          Page Under Development
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-gray-600">
          We’re currently working hard to bring this page to life. Please check
          back soon — exciting updates are on the way!
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <NavLink
            to="/"
            className="inline-flex items-center justify-center rounded-lg border-2 border-primary px-6 py-2 text-sm font-medium text-primary transition-all duration-200 hover:bg-primary hover:text-white"
          >
            Back to Home
          </NavLink>

          <NavLink
            to="/contact-us"
            className="inline-flex items-center justify-center rounded-lg border-2 border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:border-primary hover:text-primary"
          >
            Contact Us
          </NavLink>
        </div>
      </div>
    </section>
  );
}
