import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { useAuth } from "../context/AuthContext";

function isValidPhone10(digits) {
  return /^\d{10}$/.test(digits);
}

const Login = () => {
  useDocumentTitle(
    "Sign In | Nutriient - Customized Supplements & Diet Regimen",
  );
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    const mob = mobile.replace(/[^\d]/g, "");
    if (!isValidPhone10(mob)) {
      const { showError } = await import("../Utils/toast");
      showError("Please enter a valid 10-digit mobile number.");
      return;
    }

    try {
      setLoading(true);
      await signIn({ mobile: mob });
      {
        const { showSuccess } = await import("../Utils/toast");
        showSuccess("Signed in successfully!");
      }
      navigate("/profile");
    } catch (err) {
      const msg =
        err?.response?.data?.message || err?.message || "Failed to sign in.";

      {
        const { showError } = await import("../Utils/toast");
        showError("Mobile Not Registered");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-col items-center justify-center px-4 bg-white py-32">
      {/* Heading */}
      <h2 className="text-center text-primary font-medium mb-6 text-[20px] tracking-wider">
        SIGN IN TO VIEW REPORT
      </h2>
      <div className="w-full max-w-[455px] bg-white rounded-md shadow-[0_24px_35px_11px_rgba(153,153,153,0.15)] px-6 py-8 sm:px-8">
        {/* Input */}
        <input
          type="tel"
          placeholder="Mobile No."
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          className="w-full border border-gray-300 px-4 py-3 text-sm
                       focus:outline-none focus:ring-1 focus:ring-primary"
        />

        {/* Button */}
        <div className="mt-5 text-center">
          <button
            onClick={onLogin}
            disabled={loading}
            className="px-6 py-2.5 border-2 border-primary hover:text-primary
                     rounded-sm font-medium bg-primary text-white hover:bg-transparent cursor-pointer 
                     transition disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </div>

        {/* Footer text */}
        <p className="text-center text-sm mt-4 text-[#444]">
          <span className="text-black">New User?</span>{" "}
          <NavLink
            to="/register"
            className="font-medium cursor-pointer hover:text-primary transition"
          >
            Sign Up Here
          </NavLink>
        </p>
      </div>
    </section>
  );
};

export default Login;
