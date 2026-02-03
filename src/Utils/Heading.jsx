import React from "react";

const Heading = ({ text }) => {
  return (
    <div className="text-center mb-4">
      <h2 className="text-3xl md:text-4xl font-semibold text-gray-900">
        {text}
      </h2>
      <div className="mt-3 h-1 w-24 bg-primary mx-auto rounded-full" />
    </div>
  );
};

export default Heading;
