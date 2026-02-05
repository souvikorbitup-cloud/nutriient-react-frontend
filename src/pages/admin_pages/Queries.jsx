import React, { useEffect, useState } from "react";
import AdminLoading from "./AdminLoading";
import { getAllContacts, deleteContact } from "../../api/contact";
import { showError, showSuccess } from "../../Utils/toast";

const Queries = () => {
  const [contacts, setContacts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [loading, setLoading] = useState(true);

  // popup state
  const [confirmId, setConfirmId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  /* ---------------- FETCH CONTACTS ---------------- */
  useEffect(() => {
    let mounted = true;

    const fetchContacts = async () => {
      setLoading(true);
      try {
        const res = await getAllContacts({ page, limit });
        if (mounted) {
          setContacts(res?.data?.data?.contacts || []);
          setPagination(res?.data?.data?.pagination || null);
        }
      } catch {
        showError("Failed to fetch queries");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchContacts();
    return () => (mounted = false);
  }, [page, limit]);

  /* ---------------- DELETE ---------------- */
  const handleDelete = async () => {
    if (!confirmId) return;

    try {
      setDeleting(true);
      await deleteContact(confirmId);

      showSuccess("Query deleted successfully");
      setContacts((prev) => prev.filter((c) => c._id !== confirmId));
    } catch {
      showError("Failed to delete query");
    } finally {
      setDeleting(false);
      setConfirmId(null);
    }
  };

  if (loading) return <AdminLoading />;

  return (
    <>
      {/* Main Card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">User Queries</h2>
          <span className="text-sm text-gray-500">
            Total: {pagination?.totalContacts || 0}
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="order-b border-gray-200 text-left text-sm text-gray-500">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3">Message</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {contacts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-6 text-center text-sm text-gray-500">
                    No queries found
                  </td>
                </tr>
              ) : (
                contacts.map((c) => (
                  <tr
                    key={c._id}
                    className="border-b border-gray-100 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <td className="py-3 px-3 font-medium text-gray-800">
                      {c.fullName}
                    </td>
                    <td className="px-4 py-3">{c.email}</td>
                    <td className="px-4 py-3">{c.subject}</td>
                    <td className="px-4 py-3 max-w-sm truncate">{c.message}</td>
                    <td className="px-4 py-3">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setConfirmId(c._id)}
                        className="rounded-lg border border-red-300 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination?.totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <span className="text-sm text-gray-500">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>

            <div className="flex gap-2">
              <button
                disabled={!pagination.hasPrevPage}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-lg border px-4 py-2 text-sm disabled:opacity-50"
              >
                Prev
              </button>
              <button
                disabled={!pagination.hasNextPage}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-lg border px-4 py-2 text-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Center Confirm Popup */}
      {confirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-800">
              Delete Query
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Are you sure you want to delete this query? This action cannot be
              undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setConfirmId(null)}
                disabled={deleting}
                className="rounded-lg border px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 disabled:opacity-60"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Queries;
