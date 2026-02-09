import React, { useEffect, useState } from "react";
import AdminLoading from "./AdminLoading";
import { getAllUsers } from "../../api/admin-auth";

const Customers = () => {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [loading, setLoading] = useState(true);

  // -------------------------
  // Helpers (safe UI rendering)
  // -------------------------
  const safeValue = (value, suffix = "") => {
    if (value === null || value === undefined || value === "") {
      return "—";
    }
    return `${value}${suffix}`;
  };

  const safeText = (value) => value || "—";

  // -------------------------
  // Fetch users
  // -------------------------
  useEffect(() => {
    let mounted = true;

    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await getAllUsers({ page, limit });
        if (mounted) {
          setUsers(res?.data?.data?.users || []);
          setPagination(res?.data?.data?.pagination || null);
        }
      } catch (error) {
        console.error("Failed to fetch users", error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchUsers();

    return () => {
      mounted = false;
    };
  }, [page, limit]);

  if (loading) return <AdminLoading />;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">Customers</h2>
        <span className="text-sm text-gray-500">
          Total: {pagination?.totalUsers || 0}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-200 text-left text-sm text-gray-500">
              <th className="py-3 px-3">Name</th>
              <th className="py-3 px-3">Mobile</th>
              <th className="py-3 px-3">Age</th>
              <th className="py-3 px-3">Gender</th>
              <th className="py-3 px-3">Weight</th>
              <th className="py-3 px-3">Body Type</th>
              <th className="py-3 px-3">Joined</th>
            </tr>
          </thead>

          <tbody className="capitalize">
            {users.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="py-6 text-center text-sm text-gray-500"
                >
                  No customers found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user._id}
                  className="border-b border-gray-100 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <td className="py-3 px-3 font-medium text-gray-800">
                    {safeText(user.fullName)}
                  </td>

                  <td className="py-3 px-3">{safeText(user.mobile)}</td>

                  <td className="py-3 px-3">{safeValue(user.age)}</td>

                  <td className="py-3 px-3 capitalize">
                    {safeText(user.gender)}
                  </td>

                  <td className="py-3 px-3">{safeValue(user.weight, " kg")}</td>

                  <td className="py-3 px-3">{safeText(user.bodyType)}</td>

                  <td className="py-3 px-3 text-gray-500">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <span className="text-sm text-gray-500">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>

          <div className="flex gap-2">
            <button
              disabled={!pagination.hasPrevPage}
              onClick={() => setPage((p) => p - 1)}
              className={`rounded-lg border px-4 py-2 text-sm transition ${
                pagination.hasPrevPage
                  ? "border-gray-300 text-gray-700 hover:bg-gray-100"
                  : "cursor-not-allowed border-gray-200 text-gray-400"
              }`}
            >
              Prev
            </button>

            <button
              disabled={!pagination.hasNextPage}
              onClick={() => setPage((p) => p + 1)}
              className={`rounded-lg border px-4 py-2 text-sm transition ${
                pagination.hasNextPage
                  ? "border-gray-300 text-gray-700 hover:bg-gray-100"
                  : "cursor-not-allowed border-gray-200 text-gray-400"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
