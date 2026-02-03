import React from "react";
import { useNavigate } from "react-router-dom";

const Button2 = ({ text, url = "/pricing" }) => {
  const navigate = useNavigate();
  return (
    <button
      className="flex px-[20px] py-[12px]
         justify-center items-center gap-[8px]
         rounded-[8px]
         bg-[linear-gradient(90deg,#E7497B_0%,#717FF3_100%)] hover:bg-[linear-gradient(270deg,#E7497B_0%,#717FF3_100%)] text-white uppercase cursor-pointer"
      onClick={() => navigate(url)}
    >
      {text}{" "}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
      >
        <path
          d="M15 8.99988L15.2655 8.73438L15.5303 8.99988L15.2655 9.26538L15 8.99988ZM3.75 9.37488C3.65054 9.37488 3.55516 9.33537 3.48484 9.26504C3.41451 9.19471 3.375 9.09933 3.375 8.99988C3.375 8.90042 3.41451 8.80504 3.48484 8.73471C3.55516 8.66438 3.65054 8.62488 3.75 8.62488L3.75 9.37488ZM10.7655 4.23438L15.2655 8.73438L14.7345 9.26538L10.2345 4.76538L10.7655 4.23438ZM15.2655 9.26538L10.7655 13.7654L10.2345 13.2344L14.7345 8.73438L15.2655 9.26538ZM15 9.37488L3.75 9.37488L3.75 8.62488L15 8.62488L15 9.37488Z"
          fill="white"
        />
      </svg>
    </button>
  );
};

export default Button2;
