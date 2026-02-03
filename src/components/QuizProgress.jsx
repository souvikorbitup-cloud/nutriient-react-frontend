import { useEffect, useState } from "react";

const steps = [
  { id: 1, label: "BASIC" },
  { id: 2, label: "GOALS" },
  { id: 3, label: "LIFESTYLE" },
];

export default function QuizProgress({ currentStep }) {
  const [stp, setStp] = useState(1);
  useEffect(() => {
    if (currentStep === "BASIC") setStp(1);
    else if (currentStep === "GOALS" || currentStep === "GOAL_SELECT")
      setStp(2);
    else if (currentStep === "LIFESTYLE") setStp(3);
  }, [currentStep]);
  
  

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <div className="relative flex items-center justify-between">
        {/* Progress Line */}
        <div className="absolute top-1/3 left-0 h-[2px] bg-gray-300 -translate-y-1/2  w-[calc(100%-15px)]" />
        <div
          className="absolute top-1/3 left-0 h-[2px] bg-primary -translate-y-1/2 transition-all duration-300 w-[calc(100%-15px)]"
          style={{
            width: `calc(${((stp - 1) / (steps.length - 1)) * 100}% - 15px)`,
          }}
        />

        {steps.map((step, index) => {
          const isActive = stp >= step.id;

          return (
            <div
              key={step.id}
              className="relative z-10 flex flex-col items-center"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold
                  ${
                    isActive
                      ? "bg-primary text-white"
                      : "border-2 border-primary text-primary bg-white"
                  }
                `}
              >
                {isActive ? "✓" : `0${step.id}`}
              </div>
              <span className="mt-2 text-xs font-semibold tracking-wide text-gray-700">
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
