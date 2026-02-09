import { Navigate } from "react-router-dom";
import { useAdmin } from "../context/AdminContext";

const AdminOnlyRoute = ({ children }) => {
  const { admin } = useAdmin();
  if (!admin) return null; // loading handled outside

  if (admin.role !== "admin") {
    return <Navigate to="/admin/profile" replace />;
  }

  return children;
};

export default AdminOnlyRoute;
