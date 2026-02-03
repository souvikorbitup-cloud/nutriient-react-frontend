import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const BASIC_DRAFT_KEY = "quiz_basic_draft";

function loadBasicDraft() {
  try {
    return JSON.parse(localStorage.getItem(BASIC_DRAFT_KEY) || "{}") || {};
  } catch {
    return {};
  }
}

const StepRenderer = ({
  question,
  onNext,
  goal,
  currValue,
  fieldKey,
  actionError,
  actionLoading,
}) => {
  const { user } = useAuth();
  const [val, setVal] = useState(currValue);
  // selected stores selected option values for MULTI questions
  const [selected, setSelected] = useState(() => {
    if (!Array.isArray(currValue)) return [];
    const first = currValue[0];
    if (first && typeof first === "object")
      return currValue.map((c) => c.value);
    return currValue;
  });
  // Validation messages are shown via global toasts (no inline error state)

  // Toggle a value in the selected array
  const toggleSelected = (value) => {
    setSelected((prev) => {
      if (!Array.isArray(prev)) return [value];
      if (prev.includes(value)) return prev.filter((v) => v !== value);
      return [...prev, value];
    });
  };

  // Handle GIF Timer
  useEffect(() => {
    if (!question || question.type !== "GIF") return;

    // Ensure duration is present and sensible; fallback to 3s to prevent hanging
    const durationSec = Math.max(1, Number(question.metadata?.duration) || 3);
    if (!question.metadata?.duration) {
      // eslint-disable-next-line no-console
      console.warn(
        "GIF question missing duration; using fallback 3s",
        question._id,
      );
    }

    const timer = setTimeout(() => {
      onNext(null);
    }, durationSec * 1000);
    return () => clearTimeout(timer);
  }, [question]);

  useEffect(() => {
    setVal(currValue);
    // Normalize previously-saved values or objects to an array of option values
    if (!Array.isArray(currValue)) {
      setSelected([]);
    } else {
      const first = currValue[0];
      if (first && typeof first === "object")
        setSelected(currValue.map((c) => c.value));
      else setSelected(currValue);
    }
  }, [question?._id]);

  if (!question) return null;

  const validationType = question.metadata?.validationType || null;
  const questionTextHay =
    `${question.questionText || ""} ${question.metadata?.placeholder || ""}`.toLowerCase();
  // OTP auth is not used: treat OTP questions as normal input fields
  const isOtpStep = false;

  // Show server errors as toast (actionError) so they are visible in the overall UI
  React.useEffect(() => {
    if (actionError) {
      (async () => {
        const { showError } = await import("../Utils/toast");
        showError(actionError);
      })();
    }
  }, [actionError]);

  const validateAndSubmit = async () => {
    const raw = (val ?? "").toString().trim();

    // name validation
    if (validationType === "fullName" || fieldKey === "fullName") {
      if (raw.length < 2) {
        const { showError } = await import("../Utils/toast");
        showError("Please enter a valid name (at least 2 characters).");
        return;
      }
      return onNext({ value: raw });
    }

    // Email validation
    if (validationType === "email" || fieldKey === "email") {
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw);
      if (!ok) {
        const { showError } = await import("../Utils/toast");
        showError("Please enter a valid email address.");
        return;
      }
      return onNext({ value: raw });
    }

    // Phone/mobile validation (10 digits, allows +91, spaces, dashes)
    if (validationType === "phone" || fieldKey === "mobile") {
      const digits = raw.replace(/[^\d]/g, "");
      const ok = digits.length === 10;
      if (!ok) {
        const { showError } = await import("../Utils/toast");
        showError("Please enter a valid 10-digit phone number.");
        return;
      }
      return onNext({ value: digits });
    }

    // Age validation (10..100)
    if (fieldKey === "age") {
      const n = Number(raw);
      const ok = Number.isFinite(n) && n >= 10 && n <= 100;
      if (!ok) {
        const { showError } = await import("../Utils/toast");
        showError("Please enter a valid age (10 to 100).");
        return;
      }
      return onNext({ value: n });
    }

    // weight validation (20..300 kg)
    if (fieldKey === "weight") {
      const n = Number(raw);
      const ok = Number.isFinite(n) && n >= 20 && n <= 300;
      if (!ok) {
        const { showError } = await import("../Utils/toast");
        showError("Please enter a valid weight (20 to 300 kg).");
        return;
      }
      return onNext({ value: n });
    }

    // Default
    return onNext({ value: raw });
  };

  return (
    <div>
      {/* GIF View */}
      {question.type === "GIF" && (
        <div className="flex-1 flex justify-center px-4">
          <div className="pt-16 w-[550px]">
            {question.metadata?.gifUrl && (
              <img
                src={question.metadata.gifUrl}
                alt="anim"
                className="w-full h-40 object-contain"
              />
            )}
            <h2 className="text-2xl font-bold mt-4 text-green-700 text-center">
              {user &&
              user?.fullName &&
              question.stepOrder === 0 &&
              goal === "BASIC"
                ? `Welcome ${user.fullName}`
                : question.stepOrder === 2
                  ? `${question.questionText} ${loadBasicDraft(BASIC_DRAFT_KEY)?.fullName || user?.fullName || "User"}!`
                  : question.questionText}
            </h2>
            <h3 className="text-md font-bold mt-4 text-green-900 text-center">
              {question?.description}
            </h3>
          </div>
        </div>
      )}

      {/* Input View (treat OTP as normal input now) */}
      {(question.type === "INPUT" || question.type === "OTP") && (
        <div className="flex-1 flex justify-center px-4">
          <div className="pt-16 w-[550px]">
            <label className="block text-gray-700 font-medium mb-1">
              {question.questionText}
            </label>

            <div className="flex">
              <input
                type={question.metadata?.validationType || "text"}
                placeholder={question.metadata?.placeholder}
                onChange={(e) => setVal(e.target.value)}
                value={val}
                className="grow-1 border border-primary rounded-sm px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary bg-white"
              />
              <button
                onClick={validateAndSubmit}
                disabled={actionLoading}
                className=" bg-green-600 text-white p-3 rounded cursor-pointer hover:bg-green-700 transition"
              >
                {actionLoading ? (
                  <i className="fa-solid fa-spinner"></i>
                ) : (
                  <i className="fa fa-angle-right"></i>
                )}
              </button>
            </div>

            <span className="text-sm text-gray-500 mt-1.5">
              {question?.description}
            </span>
          </div>
        </div>
      )}

      {/* MULTI (multiple choice) View */}
      {question.type === "MULTI" && (
        <div className="flex-1 flex justify-center px-4">
          <div className="pt-16">
            <h2 className="text-xl mb-4 text-center">
              {question.questionText}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {question.options.map((opt) => (
                <label
                  key={opt.value}
                  className={`border flex flex-col justify-center items-center gap-2 whitespace-nowrap cursor-pointer border-gray-500 hover:border-green-500 py-4 px-8 rounded-xl bg-white hover:text-green-700 ${selected.includes(opt.value) ? "text-green-700 border-green-500" : ""}`}
                >
                  {opt.icon && (
                    <img
                      src={opt.icon}
                      alt={opt.label}
                      className="inline-block h-16 w-16 object-contain"
                    />
                  )}
                  <div>
                    <input
                      type="checkbox"
                      checked={selected.includes(opt.value)}
                      onChange={() => toggleSelected(opt.value)}
                    />
                    <span className="ml-2">{opt.label}</span>
                  </div>
                </label>
              ))}
            </div>

            {selected.length > 0 && (
              <button
                onClick={() => {
                  if (selected.length === 0) {
                    (async () => {
                      const { showError } = await import("../Utils/toast");
                      showError("Please select at least one option.");
                    })();
                    return;
                  }
                  // Map selected values to full option objects before sending
                  const selectedOptions = question.options.filter((opt) =>
                    selected.includes(opt.value),
                  );
                  onNext({ value: selectedOptions });
                }}
                disabled={actionLoading}
                className="w-full bg-green-600 text-white p-3 mt-4 rounded cursor-pointer hover:bg-green-700 transition"
              >
                {actionLoading ? "Please wait..." : "Next"}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Handle gender for login user */}
      {user && user?.gender !== "unset" && fieldKey === "gender" ? (
        <div className="flex-1 flex justify-center px-4">
          <div className="pt-16">
            <h2 className="text-xl mb-4 text-center">Gender: {user?.gender}</h2>
            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={() => onNext(user?.gender)}
                className={`w-full bg-green-600 text-white p-3 mt-4 rounded cursor-pointer hover:bg-green-700 transition`}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      ) : (
        question.type === "CHOICE" && (
          <div className="flex-1 flex justify-center px-4">
            <div className="pt-16">
              <h2 className="text-xl mb-4 text-center">
                {question.questionText}
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 justify-center">
                {question.options.map((opt) => (
                  <button
                    key={opt.label}
                    onClick={() => onNext(opt)}
                    className={`border flex flex-col justify-center items-center gap-2 cursor-pointer border-gray-500 hover:border-green-500 py-4 px-8 rounded-xl bg-white hover:text-green-700 text-left ${opt.value === val ? "text-green-700 border-green-500" : ""}`}
                  >
                    {opt.icon && (
                      <img
                        src={opt.icon}
                        alt={opt.label}
                        className="inline-block h-16 w-16 object-contain"
                      />
                    )}
                    <span className="text-center">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default StepRenderer;
