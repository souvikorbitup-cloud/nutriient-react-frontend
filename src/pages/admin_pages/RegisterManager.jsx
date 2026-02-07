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
    <div className="max-w-lg mx-auto bg-white p-6 rounded-xl border">
      <h2 className="text-lg font-semibold mb-4">Register New Manager</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="fullName"
          placeholder="Full Name"
          className="w-full border px-3 py-2 rounded"
          value={form.fullName}
          onChange={handleChange}
          required
        />

        <input
          name="username"
          placeholder="Username"
          className="w-full border px-3 py-2 rounded"
          value={form.username}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full border px-3 py-2 rounded"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button className="w-full bg-gray-900 text-white py-2 rounded">
          Register Manager
        </button>
      </form>
    </div>
  );
};

export default RegisterManager;
