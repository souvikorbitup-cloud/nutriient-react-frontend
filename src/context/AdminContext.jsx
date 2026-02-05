import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { adminLogin, adminLogout, currentAdmin } from "../api/admin-auth.js";

const AdminContext = createContext(null);

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() =>
    JSON.parse(localStorage.getItem("admin")),
  );

  const [adminLoading, setAdminLoading] = useState(false);

  const setAdminAndPersist = (adminData) => {
    if (!adminData) {
      localStorage.removeItem("admin");
      setAdmin(null);
      return;
    }
    localStorage.setItem("admin", JSON.stringify(adminData));
    setAdmin(adminData);
  };

  const refresh = async () => {
    try {
      setAdminLoading(true);
      const res = await currentAdmin();
      setAdminAndPersist(res?.data?.data || null);
    } catch {
      // Not logged in / cookie missing
      setAdminAndPersist(null);
    } finally {
      setAdminLoading(false);
    }
  };

  useEffect(() => {
    // If localStorage says logged-in, verify with server (cookie-based)
    // If localStorage empty, still attempt (safe) to support cookie-only sessions.
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = (adminData) => setAdminAndPersist(adminData);

  const signIn = async (data) => {
    setAdminLoading(true);
    try {
      const res = await adminLogin(data);
      const adminData = res?.data?.data?.admin || res?.data?.data;
      if (adminData) setAdminAndPersist(adminData);
      return res;
    } finally {
      setAdminLoading(false);
    }
  };

  const logout = async () => {
    setAdminLoading(true);
    try {
      await adminLogout();
    } catch {
      // ignore
    } finally {
      setAdminAndPersist(null);
      setAdminLoading(false);
    }
  };

  const value = useMemo(
    () => ({
      admin,
      adminLoading,
      login,
      signIn,
      logout,
      refresh,
    }),
    [admin, adminLoading],
  );

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);
