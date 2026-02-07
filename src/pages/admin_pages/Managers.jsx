import { useEffect, useState } from "react";
import {
  allmanagers,
  deleteManager,
  updatePassword,
} from "../../api/admin-auth";
import { showSuccess, showError } from "../../utils/toast";
import { useNavigate } from "react-router-dom";

const Managers = () => {
  const [managers, setManagers] = useState([]);
  const [passwordModal, setPasswordModal] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [newPassword, setNewPassword] = useState("");

  const navigate = useNavigate();

  /* ================= Fetch Managers ================= */
  const fetchManagers = async () => {
    try {
      const res = await allmanagers();
      setManagers(res.data.data);
    } catch {
      showError("Failed to load managers");
    }
  };

  useEffect(() => {
    fetchManagers();
  }, []);

  /* ================= Open Delete Modal ================= */
  const openDeleteModal = (manager) => {
    setDeleteModal(manager);
  };

  /* ================= Confirm Delete ================= */
  const handleDeleteConfirm = async () => {
    try {
      await deleteManager(deleteModal._id);
      showSuccess("Manager deleted");

      setManagers((prev) => prev.filter((m) => m._id !== deleteModal._id));
      setDeleteModal(null);
    } catch {
      showError("Failed to delete manager");
    }
  };

  /* ================= Open Password Modal ================= */
  const openPasswordModal = (manager) => {
    setPasswordModal(manager);
    setNewPassword("");
  };

  /* ================= Update Password ================= */
  const handlePasswordUpdate = async () => {
    if (!newPassword.trim()) {
      showError("Password is required");
      return;
    }

    try {
      await updatePassword({
        newPassword,
        managerId: passwordModal._id,
      });

      showSuccess("Manager password updated");
      setPasswordModal(null);
    } catch (err) {
      showError(err?.response?.data?.message || "Failed to update password");
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6">
      <div className="flex-bt mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Managers</h2>

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="rounded-lg border px-4 py-2 text-sm cursor-pointer"
        >
          Back
        </button>
      </div>

      {managers.length === 0 && (
        <p className="text-sm text-gray-500">No managers found</p>
      )}

      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-200 text-left text-sm text-gray-500">
            <th className="py-3 text-center">Name</th>
            <th className="py-3 text-center">Username</th>
            <th className="py-3 text-center">Joined</th>
            <th className="py-3 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {managers.map((m) => (
            <tr key={m._id} className="border-b border-gray-100 text-sm text-gray-700 hover:bg-gray-50 text-center">
              <td className="py-3">{m.fullName}</td>
              <td className="py-3">@{m.username}</td>
              <td className="py-3">
                {new Date(m.createdAt).toLocaleDateString()}
              </td>
              <td className="py-3 space-x-3">
                <button
                  onClick={() => openPasswordModal(m)}
                  className="text-blue-600 hover:underline cursor-pointer"
                >
                  Change Password
                </button>

                <button
                  onClick={() => openDeleteModal(m)}
                  className="text-red-600 hover:underline cursor-pointer"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ================= Password Modal ================= */}
      {passwordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-sm rounded-xl bg-white p-6">
            <h3 className="text-lg font-semibold mb-4">Change Password</h3>

            <p className="text-sm text-gray-600 mb-3">
              Manager: <b>{passwordModal.fullName}</b>
            </p>

            <label className="block text-sm font-medium mb-1">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border px-3 py-2 rounded mb-4"
              placeholder="Enter new password"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setPasswordModal(null)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={handlePasswordUpdate}
                className="px-4 py-2 bg-gray-900 text-white rounded cursor-pointer"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= Delete Confirmation Modal ================= */}
      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-sm rounded-xl bg-white p-6">
            <h3 className="text-lg font-semibold mb-3 text-red-600">
              Delete Manager
            </h3>

            <p className="text-sm text-gray-700 mb-6">
              Are you sure you want to delete <b>{deleteModal.fullName}</b>?
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteModal(null)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Managers;
