import { useEffect, useState } from "react";
import { updateUser } from "../api/user-auth";
import { showSuccess, showError } from "../Utils/toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Cart, HealthReport, Order } from "../icons";
import { INDIAN_STATES_UT } from "../variables";
import Preloder from "../sections/Preloder";

/* ---------------- COMPONENT ---------------- */

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [logoutModal, setLogoutModal] = useState(null);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    altMobile: "",
    age: "",
    gender: "unset",
    weight: "",
    bodyType: "",
    address: {
      landmark: "",
      city: "",
      state: "",
      zipCode: "",
    },
  });

  /* ---------------- LOAD USER ---------------- */

  useEffect(() => {
    if (user) {
      setForm({
        fullName: user.fullName || "",
        email: user.email || "",
        altMobile: user.altMobile || "",
        age: user.age || "",
        gender: user.gender || "unset",
        weight: user.weight || "",
        bodyType: user.bodyType || "",
        address: {
          landmark: user.address?.landmark || "",
          city: user.address?.city || "",
          state: user.address?.state || "",
          zipCode: user.address?.zipCode || "",
        },
      });
      setLoading(false);
    }
  }, [user]);

  /* ---------------- HANDLERS ---------------- */

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("address.")) {
      const key = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        address: { ...prev.address, [key]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  /* ---------------- VALIDATION ---------------- */

  const validateForm = () => {
    if (!form.fullName || form.fullName.trim().length < 3) {
      showError("Full name must be at least 3 characters");
      return false;
    }

    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      showError("Invalid email address");
      return false;
    }

    if (form.altMobile && !/^\d{10}$/.test(form.altMobile)) {
      showError("Enter a valid 10-digit mobile number");
      return false;
    }

    if (form.age && (form.age < 10 || form.age > 100)) {
      showError("Age must be between 10 and 100");
      return false;
    }

    if (form.weight && (form.weight < 20 || form.weight > 300)) {
      showError("Weight must be between 20 and 300 kg");
      return false;
    }

    if (form.address.zipCode && !/^\d{6}$/.test(form.address.zipCode)) {
      showError("Enter a valid 6-digit PIN code");
      return false;
    }

    if (form.address.state && !INDIAN_STATES_UT.includes(form.address.state)) {
      showError("Please select a valid Indian state");
      return false;
    }

    return true;
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;

    try {
      await updateUser(form);
      showSuccess("Profile updated successfully");
      setEditing(false);
    } catch (err) {
      showError(err?.response?.data?.message || "Update failed");
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  /* ---------------- RENDER ---------------- */

  if (loading) {
    return <Preloder />;
  }

  return (
    <div className="app-container mx-auto px-4 py-32">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-6 items-center">
        <div className="text-center sm:text-left">
          <h1 className="text-2xl font-bold text-t-black">My Profile</h1>
          <p className="text-t-black-light">
            Manage your personal & health information
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setEditing(!editing)}
            className="px-4 py-2 rounded-lg bg-dark-green hover:bg-dark-green/90 text-white cursor-pointer"
          >
            {editing ? "Cancel" : "Edit Profile"}
          </button>
          <button
            onClick={() => setLogoutModal(true)}
            className="px-4 py-2 rounded-lg border bg-red-600 text-white hover:bg-red-700 transition cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Form */}
        <div className="lg:col-span-2 bg-white rounded-2xl sm:border sm:border-gray-300 sm:p-6 space-y-4">
          <ProfileInput
            label="Full Name"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            disabled={!editing}
          />
          <ProfileInput
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            disabled={!editing}
          />
          <ProfileInput
            label="Alternate Mobile"
            name="altMobile"
            value={form.altMobile}
            onChange={handleChange}
            disabled={!editing}
          />

          <div className="grid grid-cols-2 gap-4">
            <ProfileInput
              label="Age"
              name="age"
              type="number"
              value={form.age}
              onChange={handleChange}
              disabled={!editing}
            />
            <ProfileInput
              label="Weight (kg)"
              name="weight"
              type="number"
              value={form.weight}
              onChange={handleChange}
              disabled={!editing}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <SelectInput
              label="Gender"
              name="gender"
              value={form.gender}
              onChange={handleChange}
              disabled={!editing}
              options={["unset", "male", "female"]}
            />
            <SelectInput
              label="Body Type"
              name="bodyType"
              value={form.bodyType}
              onChange={handleChange}
              disabled={!editing}
              options={[
                "",
                "Fat But Fit",
                "Very Fat",
                "Skinny",
                "Muscular/Lean",
              ]}
            />
          </div>

          <h3 className="font-semibold pt-4">Address</h3>

          <div className="grid grid-cols-2 gap-4">
            <ProfileInput
              label="Landmark"
              name="address.landmark"
              value={form.address.landmark}
              onChange={handleChange}
              disabled={!editing}
            />
            <ProfileInput
              label="City"
              name="address.city"
              value={form.address.city}
              onChange={handleChange}
              disabled={!editing}
            />

            <SelectInput
              label="State"
              name="address.state"
              value={form.address.state}
              onChange={handleChange}
              disabled={!editing}
              options={["", ...INDIAN_STATES_UT]}
            />

            <ProfileInput
              label="Zip Code"
              name="address.zipCode"
              value={form.address.zipCode}
              onChange={handleChange}
              disabled={!editing}
            />
          </div>

          {editing && (
            <button
              onClick={handleUpdate}
              className="mt-4 w-full py-3 rounded-xl bg-dark-green hover:bg-dark-green/90 text-white cursor-pointer"
            >
              Save Changes
            </button>
          )}
        </div>

        {/* Links */}
        <div className="bg-white rounded-2xl border border-gray-300 p-6 space-y-4">
          <h3>Other Links</h3>
          <QuickLink
            title="My Cart"
            Icon={Cart}
            onClick={() => navigate("/cart")}
          />
          <QuickLink
            title="My Orders"
            Icon={Order}
            onClick={() => navigate("/my-orders")}
          />
          <QuickLink
            title="My Health Report"
            Icon={HealthReport}
            onClick={() => navigate("/health-reports")}
          />
        </div>
      </div>

      {/* ================= Delete Confirmation Modal ================= */}
      {logoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-sm rounded-xl bg-white p-6">
            <h3 className="text-lg font-semibold mb-3 text-red-600">
              Logout User
            </h3>

            <p className="text-sm text-gray-700 mb-6">
              Are you sure you want to Logout from this action.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setLogoutModal(null)}
                className="px-4 py-2 border rounded cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;

/* ---------------- SMALL COMPONENTS ---------------- */

const ProfileInput = ({ label, ...props }) => (
  <div>
    <label className="block text-sm text-t-black-light mb-1">{label}</label>
    <input
      {...props}
      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:bg-gray-100"
    />
  </div>
);

const SelectInput = ({ label, options, ...props }) => (
  <div>
    <label className="block text-sm text-t-black-light mb-1">{label}</label>
    <select
      {...props}
      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:bg-gray-100"
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt || "Select"}
        </option>
      ))}
    </select>
  </div>
);

const QuickLink = ({ title, onClick, Icon }) => (
  <button
    onClick={onClick}
    className="w-full py-3 rounded-xl border border-gray-300 text-left px-4 hover:bg-dark-green hover:text-white transition flex gap-2 items-center cursor-pointer"
  >
    <Icon className="size-6" />
    {title}
  </button>
);
