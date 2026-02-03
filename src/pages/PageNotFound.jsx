import React from "react";
import { NavLink } from "react-router-dom";

const PageNotFound = () => {
  return (
    <section className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 text-gray-700">
          <span className="text-2xl font-medium">404</span>
          <span className="h-6 w-px bg-gray-300" />
          <span className="text-base">Not Found</span>
        </div>

        <NavLink
          to="/"
          className="mt-6 inline-flex items-center justify-center rounded-lg border-2 border-primary px-6 py-2 text-sm font-medium text-primary transition-all duration-200 hover:bg-primary hover:text-white"
        >
          Back to Home
        </NavLink>
      </div>
    </section>
  );
};

export default PageNotFound;
