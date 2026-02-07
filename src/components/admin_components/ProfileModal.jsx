import React, { useState } from "react";
import { updateAdmin } from "../../api/admin-auth";
import { showError, showSuccess } from "../../utils/toast";
import { UserCircleIcon } from "../../icons";

const ProfileModal = ({ admin, onClose, onRefresh, onChangePassword }) => {
  const [fullName, setFullName] = useState(admin.fullName);
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      if (fullName !== admin.fullName) formData.append("fullName", fullName);
      if (avatar) formData.append("avatar", avatar);

      await updateAdmin(formData);
      showSuccess("Profile updated");
      onRefresh();
      onClose();
    } catch (e) {
      showError(e?.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-xl rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Profile</h2>

        {/* Avatar */}
        <div className="flex items-center gap-4 mb-4">
          {admin.avatar || avatar ? (
            <img
              src={avatar ? URL.createObjectURL(avatar) : admin.avatar}
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <UserCircleIcon className="h-16 w-16" />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setAvatar(e.target.files[0])}
          />
        </div>

        {/* Full Name */}
        <input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full border rounded-lg px-4 py-2 mb-3"
        />

        {/* Role */}
        <p className="text-sm text-gray-500 mb-4">
          Role: <b className="uppercase">{admin.role}</b>
        </p>

        {/* Actions */}
        <div className="flex justify-between">
          <button
            onClick={onChangePassword}
            className="text-blue-600 text-sm cursor-pointer hover:underline"
          >
            Change Password
          </button>

          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2">
              Cancel
            </button>
            <button
              disabled={loading}
              onClick={handleUpdate}
              className="bg-black text-white px-4 py-2 rounded-lg cursor-pointer"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
