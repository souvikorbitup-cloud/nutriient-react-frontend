import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { useAuth } from "../context/AuthContext";

function isValidPhone10(digits) {
  return /^\d{10}$/.test(digits);
}

const Register = () => {
  useDocumentTitle(
    "Sign Up | Nutriient - Customized Supplements & Diet Regimen",
  );

  const navigate = useNavigate();
  const { signUp } = useAuth();

  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);

  const onCreate = async () => {
    const name = fullName.trim();
    const mob = mobile.replace(/[^\d]/g, "");

    if (!name) {
      const { showError } = await import("../Utils/toast");
      showError("Please enter your name.");
      return;
    }

    if (!isValidPhone10(mob)) {
      const { showError } = await import("../Utils/toast");
      showError("Please enter a valid 10-digit mobile number.");
      return;
    }

    try {
      setLoading(true);
      await signUp({ fullName: name, mobile: mob });
      {
        const { showSuccess } = await import("../Utils/toast");
        showSuccess("Account created successfully!");
      }
      navigate("/profile");
    } catch (err) {
      let msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to create account.";

      if (err?.status === 409) msg = "Mobile Already Registered | Please Login";

      {
        const { showError } = await import("../Utils/toast");
        navigate("/login");
        showError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-32 flex flex-col items-center justify-center px-4 bg-white">
      {/* Heading */}
      <h2 className="text-center text-primary text-lg font-medium mb-6">
        Create Your Account
      </h2>

      <div
        className="w-full max-w-[455px] bg-white rounded-md
                   shadow-[0_24px_35px_11px_rgba(153,153,153,0.15)]
                   px-6 py-8 sm:px-8"
      >
        {/* Inputs */}
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full border border-gray-300 px-4 py-3 text-sm
                       focus:outline-none focus:ring-1 focus:ring-primary"
          />

          <input
            type="tel"
            placeholder="Mobile No."
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            className="w-full border border-gray-300 px-4 py-3 text-sm
                       focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Button */}
        <div className="mt-5 text-center">
          <button
            className="px-6 py-2.5 border-2 border-primary hover:text-primary
                     rounded-sm font-medium bg-primary text-white hover:bg-transparent cursor-pointer 
                     transition"
            onClick={onCreate}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <span className="flex-1 h-px bg-gray-300" />
          <span className="text-primary text-sm font-medium">OR</span>
          <span className="flex-1 h-px bg-gray-300" />
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm font-semibold tracking-wide">
            ALREADY HAVE AN ACCOUNT?
          </p>
          <NavLink
            to="/login"
            className="mt-1 text-primary text-sm font-medium cursor-pointer"
          >
            Sign In
          </NavLink>
        </div>
      </div>
    </section>
  );
};

export default Register;
