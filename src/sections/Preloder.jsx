import React from "react";

const Preloder = () => {
  return (
    <div className="h-screen w-screen bg-white flex justify-center items-center fixed top-0 left-0 z-50">
      <img width="250" height="250" src="/preloader.gif" alt="Loading..." />
    </div>
  );
};

export default Preloder;
