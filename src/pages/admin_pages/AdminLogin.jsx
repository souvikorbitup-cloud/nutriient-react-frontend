import React, { useState } from "react";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../../context/AdminContext";

const AdminLogin = () => {
  useDocumentTitle("Sign In - Admin | Nutriient");

  const navigate = useNavigate();
  const { signIn } = useAdmin();

  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onLogin = async (e) => {
    e.preventDefault();

    // ===== VALIDATION (POPUP ONLY) =====
    const { showError, showSuccess } = await import("../../Utils/toast");

    if (!username.trim()) {
      showError("Username is required");
      return;
    }

    if (username.trim().length < 3) {
      showError("Username must be at least 3 characters");
      return;
    }

    if (!password.trim()) {
      showError("Password is required");
      return;
    }

    if (password.length < 3) {
      showError("Password must be at least 3 characters");
      return;
    }

    try {
      setLoading(true);

      await signIn({ username, password });

      showSuccess("Signed in successfully!");
      navigate("/admin");
    } catch (err) {
      showError("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col justify-center w-full h-screen bg-white lg:flex-row">
      {/* ================= LEFT FORM ================= */}
      <div className="flex flex-col flex-1 w-full lg:w-1/2">
        <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
          <div>
            <div className="mb-8">
              <h1 className="mb-2 text-3xl font-semibold text-gray-800 dark:text-white">
                Sign In
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Enter your username and password to sign in
              </p>
            </div>

            {/* ================= FORM ================= */}
            <form className="space-y-5" onSubmit={onLogin}>
              {/* Username */}
              <div>
                <label className="block mb-1.5 text-sm text-gray-700 dark:text-gray-400">
                  Username <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full h-11 rounded-lg border border-gray-300 px-4 text-sm
                             dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block mb-1.5 text-sm text-gray-700 dark:text-gray-400">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-11 rounded-lg border border-gray-300 px-4 pr-11 text-sm
                               dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? (
                      <i className="fa-regular fa-eye-slash"></i>
                    ) : (
                      <i className="fa-regular fa-eye"></i>
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 text-sm text-white bg-dark-green rounded-lg
                           hover:bg-dark-green/90 disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* ================= RIGHT PANEL ================= */}
      <div className="relative items-center hidden w-1/2 h-full bg-brand-950 lg:flex dark:bg-white/5">
        <div className="flex flex-col items-center max-w-xs mx-auto text-center">
          <img src="/logo.png" alt="Logo" className="mb-4" />
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
