import React, { useEffect, useState } from "react";
import {
  getAllCharts,
  updateSelectedChart,
  deleteChart,
} from "../../api/chart";
import AdminLoading from "./AdminLoading";
import { showError, showSuccess } from "../../Utils/toast";

const DiteCharts = () => {
  const [charts, setCharts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(true);

  // modal states
  const [editChart, setEditChart] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCharts();
  }, [page]);

  const fetchCharts = async () => {
    setLoading(true);
    try {
      const res = await getAllCharts({ page, limit });
      setCharts(res?.data?.data?.charts || []);
      setPagination(res?.data?.data?.pagination || null);
    } catch (err) {
      showError("Failed to fetch charts");
    } finally {
      setLoading(false);
    }
  };

  /* ============================
      UPDATE HANDLER
  ============================ */
  const handleUpdate = async () => {
    if (!editChart?.value) return;

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("value", editChart.value);
      formData.append("description", editChart.description || "");
      if (editChart.newImage) {
        formData.append("image", editChart.newImage);
      }

      await updateSelectedChart(editChart._id, formData);
      setEditChart(null);
      fetchCharts();
      showSuccess("Chart updated successfully");
    } catch (err) {
      showError("Update failed");
    } finally {
      setSaving(false);
    }
  };

  /* ============================
      DELETE HANDLER
  ============================ */
  const handleDelete = async () => {
    setSaving(true);
    try {
      await deleteChart(deleteId);
      setDeleteId(null);
      fetchCharts();
    } catch (err) {
      showError("Delete failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <AdminLoading />;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">Diet Charts</h2>
        <span className="text-sm text-gray-500">
          Total: {pagination?.totalCharts || 0}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-200 text-left text-sm text-gray-500">
              <th className="py-3 text-left">Image</th>
              <th className="py-3 text-left">Calories</th>
              <th className="py-3 text-left">Description</th>
              <th className="py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {charts.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-6 text-center text-sm text-gray-500">
                  No charts found
                </td>
              </tr>
            ) : (
              charts.map((chart) => (
                <tr key={chart._id} className="border-b border-gray-100 text-sm text-gray-700 hover:bg-gray-50">
                  <td className="py-3">
                    <img
                      src={chart.image}
                      alt=""
                      className="h-12 w-12 rounded-lg object-cover"
                    />
                  </td>
                  <td className="py-3 font-medium">{chart.value}</td>
                  <td className="py-3 text-gray-600">
                    {chart.description || "-"}
                  </td>
                  <td className="py-3 text-right space-x-3">
                    <button
                      onClick={() => setEditChart({ ...chart })}
                      className="text-primary hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteId(chart._id)}
                      className="text-red-500 hover:underline"
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
              className="rounded-lg border px-4 py-2 disabled:opacity-50"
            >
              Prev
            </button>
            <button
              disabled={!pagination.hasNextPage}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-lg border px-4 py-2 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* ============================
          EDIT MODAL (FULL SCREEN)
      ============================ */}
      {editChart && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold">Update Chart</h3>

            <input
              type="number"
              value={editChart.value}
              onChange={(e) =>
                setEditChart({
                  ...editChart,
                  value: e.target.value,
                })
              }
              placeholder="Calories"
              className="mb-3 w-full rounded-lg border px-3 py-2"
            />

            <textarea
              value={editChart.description || ""}
              onChange={(e) =>
                setEditChart({
                  ...editChart,
                  description: e.target.value,
                })
              }
              placeholder="Description"
              className="mb-3 w-full rounded-lg border px-3 py-2"
            />

            <input
              type="file"
              onChange={(e) =>
                setEditChart({
                  ...editChart,
                  newImage: e.target.files[0],
                })
              }
              className="mb-4 w-full"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditChart(null)}
                className="rounded-lg border px-4 py-2"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={saving}
                className="rounded-lg bg-primary px-4 py-2 text-white"
              >
                {saving ? "Saving..." : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================
          DELETE MODAL (FULL SCREEN)
      ============================ */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center">
            <h3 className="mb-3 text-lg font-semibold">Delete Chart?</h3>
            <p className="mb-5 text-sm text-gray-600">
              This action cannot be undone.
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setDeleteId(null)}
                className="rounded-lg border px-4 py-2"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={saving}
                className="rounded-lg bg-red-500 px-4 py-2 text-white"
              >
                {saving ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiteCharts;
