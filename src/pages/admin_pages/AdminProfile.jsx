import React, { useEffect, useState } from "react";
import ProfileModal from "../../components/admin_components/ProfileModal";
import PasswordModal from "../../components/admin_components/PasswordModal";
import { adminLogout, currentAdmin } from "../../api/admin-auth";
import { useNavigate } from "react-router-dom";
import { UserCircleIcon } from "../../icons";

const AdminProfile = () => {
  const [admin, setAdmin] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const fetchAdmin = async () => {
    const { data } = await currentAdmin();
    setAdmin(data.data);
  };

  useEffect(() => {
    fetchAdmin();
  }, []);

  const handleLogout = async () => {
    try {
      await adminLogout();
      navigate("/admin/login", { replace: true });
    } catch (error) {
      console.error(error);
    }
  };

  if (!admin) return null;

  return (
    <div className="flex-center">
      {/* ===== PROFILE CARD ===== */}
      <div className="rounded-2xl bg-white shadow-lg p-6 space-y-6 border w-full sm:w-2xl border-gray-200">
        {/* Header */}
        <div className="flex items-center gap-4">
          {admin.avatar ? (
            <img
              src={admin.avatar}
              className="rounded-full h-16 w-16 aspect-square object-cover"
            />
          ) : (
            <UserCircleIcon className="h-16 w-16" />
          )}

          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              {admin.fullName}
            </h2>
            <p className="text-sm text-gray-500">@{admin.username}</p>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-2 text-sm text-gray-700">
          <div className="flex justify-between">
            <span className="font-medium">Role</span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                admin.role === "admin"
                  ? "bg-red-100 text-red-600"
                  : "bg-blue-100 text-blue-600"
              }`}
            >
              {admin.role.toUpperCase()}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium">Joined</span>
            <span>{new Date(admin.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              onClick={() => setShowProfile(true)}
              className="w-full py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition cursor-pointer"
            >
              Edit Profile
            </button>

            <button
              onClick={() => setShowPassword(true)}
              className="w-full py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition cursor-pointer"
            >
              Change Password
            </button>

            {/* ADMIN ONLY ACTIONS */}
            {admin.role === "admin" && (
              <>
                <button
                  onClick={() => navigate("/admin/managers")}
                  className="w-full py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition cursor-pointer"
                >
                  Show All Managers
                </button>

                <button
                  onClick={() => navigate("/admin/register-manager")}
                  className="w-full py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition cursor-pointer"
                >
                  Register New Manager
                </button>
              </>
            )}
          </div>

          <button
            onClick={handleLogout}
            className="w-full py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>

      {/* ===== MODALS ===== */}
      {showProfile && (
        <ProfileModal
          admin={admin}
          onClose={() => setShowProfile(false)}
          onRefresh={fetchAdmin}
          onChangePassword={() => {
            setShowProfile(false);
            setShowPassword(true);
          }}
        />
      )}

      {showPassword && <PasswordModal onClose={() => setShowPassword(false)} />}
    </div>
  );
};

export default AdminProfile;
