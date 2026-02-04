import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Navbar / Sidebar */}
      <div className="flex">
        <aside className="w-64 bg-white shadow">Admin Sidebar</aside>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
