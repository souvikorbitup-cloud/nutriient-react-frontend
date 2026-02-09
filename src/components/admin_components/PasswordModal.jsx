import React, { useState } from "react";
import { updatePassword } from "../../api/admin-auth";
import { showError, showSuccess } from "../../utils/toast";

const PasswordModal = ({ onClose }) => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = async () => {
    try {
      setLoading(true);
      await updatePassword({ newPassword: password });
      showSuccess("Password updated");
      onClose();
    } catch (e) {
      showError(e?.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-sm rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Change Password</h2>

        <input
          type="password"
          placeholder="New password"
          className="w-full border rounded-lg px-4 py-2 mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose}>Cancel</button>
          <button
            disabled={loading}
            onClick={handleChange}
            className="bg-black text-white px-4 py-2 rounded-lg cursor-pointer"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordModal;
