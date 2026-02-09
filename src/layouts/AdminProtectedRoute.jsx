import { Navigate, Outlet } from "react-router-dom";
import { useAdmin } from "../context/AdminContext";

const AdminProtectedRoute = () => {
  const { admin, adminLoading } = useAdmin();

  if (adminLoading) return null; // or loader

  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};

export default AdminProtectedRoute;
