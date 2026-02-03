import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function Adminlayout() {
  const location = useLocation();

  if (!user) {
    return (
        <div>Login page</div>
    );
  }

  return <Outlet />;
}
