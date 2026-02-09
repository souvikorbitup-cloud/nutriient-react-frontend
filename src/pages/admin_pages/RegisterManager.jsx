import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createManager } from "../../api/admin-auth";
import { showError, showSuccess } from "../../utils/toast";

const RegisterManager = () => {
  const [form, setForm] = useState({
    fullName: "",
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createManager({ ...form, role: "manager" });
      showSuccess("Manager registered successfully");
      navigate("/admin/managers");
    } catch (err) {
      showError("Failed to register manager");
    }
  };

  return (
    <div className="flex items-center justify-center px-4">
      <div className="w-full max-w-xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-center text-lg font-semibold text-gray-700">
          Register New Manager
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-gray-600">
              Full Name
            </label>
            <input
              name="fullName"
              placeholder="Full Name"
              className="w-full rounded-lg border border-t-black-light px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
              value={form.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-gray-600">Username</label>
            <input
              name="username"
              placeholder="Username"
              className="w-full rounded-lg border border-t-black-light px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-gray-600">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full rounded-lg border border-t-black-light px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-dark-green py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60 cursor-pointer hover:bg-dark-green/90"
          >
            Register Manager
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterManager;
