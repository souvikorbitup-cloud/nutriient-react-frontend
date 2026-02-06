import React, { useEffect, useState } from "react";
import {
  getCategoriesByType,
  updateCategory,
  deleteCategory,
} from "../../api/category";
import AdminLoading from "./AdminLoading";
import { showError, showSuccess } from "../../utils/toast";

const Categories = () => {
  const [data, setData] = useState([]);
  const [editing, setEditing] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await getCategoriesByType();
      setData(res.data.data);
    } catch (err) {
      showError(err?.response?.data?.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleUpdate = async () => {
    if (!editing.name.trim()) {
      showError("Category name cannot be empty");
      return;
    }

    try {
      setLoading(true);

      await updateCategory(editing._id, {
        name: editing.name.trim(),
        type: editing.type,
        parent: editing.parent || null,
      });

      showSuccess("Category updated successfully");
      setEditing(null);
      fetchCategories();
    } catch (err) {
      showError(err?.response?.data?.message || "Failed to update category");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteCategory(confirmDelete);
      showSuccess("Category deleted successfully");
      setConfirmDelete(null);
      fetchCategories();
    } catch (err) {
      showError(err?.response?.data?.message || "Failed to delete category");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <AdminLoading />;

  // get parents for edit popup (type wise)
  const parentOptions =
    (editing &&
      data
        .find((g) => g.type === editing.type)
        ?.categories.filter((c) => c._id !== editing._id)) ||
    [];

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      {data.map((group) => (
        <div key={group.type}>
          <h3 className="mb-4 text-lg font-semibold text-gray-800">
            {group.type}
          </h3>

          <div className="space-y-3">
            {group.categories.map((cat) => (
              <div
                key={cat._id}
                className="border-b border-gray-200 py-3 text-sm"
              >
                {/* Category */}
                <div className="flex justify-between">
                  <span className="font-medium text-gray-800 capitalize">{cat.name}</span>

                  <div className="flex gap-3">
                    <button
                      onClick={() =>
                        setEditing({
                          ...cat,
                          parent: null,
                        })
                      }
                      className="text-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setConfirmDelete(cat._id)}
                      className="text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Sub-categories */}
                {cat.subCategories.length > 0 && (
                  <div className="mt-3 ml-4 space-y-2">
                    {cat.subCategories.map((sub) => (
                      <div
                        key={sub._id}
                        className="flex justify-between text-gray-600 py-1 pl-3 "
                      >
                        <span className="capitalize">
                          <i className="fa-solid fa-stop text-dark-green"></i>{" "}
                          {sub.name}
                        </span>

                        <div className="flex gap-3 text-sm">
                          <button
                            onClick={() =>
                              setEditing({
                                ...sub,
                                type: cat.type,
                                parent: cat._id,
                              })
                            }
                            className="text-blue-600"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setConfirmDelete(sub._id)}
                            className="text-red-600"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* ================= EDIT POPUP ================= */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-xl bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold">Edit Category</h3>

            {/* Name */}
            <div className="mb-3">
              <label className="mb-1 block text-sm text-gray-600">Name</label>
              <input
                value={editing.name}
                onChange={(e) =>
                  setEditing({ ...editing, name: e.target.value })
                }
                className="w-full rounded-lg border px-3 py-2"
              />
            </div>

            {/* Type */}
            <div className="mb-3">
              <label className="mb-1 block text-sm text-gray-600">Type</label>
              <select
                value={editing.type}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    type: e.target.value,
                    parent: "",
                  })
                }
                className="w-full rounded-lg border px-3 py-2"
              >
                <option value="Health Supplements">Health Supplements</option>
                <option value="Health Pre Packs">Health Pre Packs</option>
              </select>
            </div>

            {/* Parent */}
            <div className="mb-4">
              <label className="mb-1 block text-sm text-gray-600">
                Parent Category (optional)
              </label>
              <select
                value={editing.parent || ""}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    parent: e.target.value || null,
                  })
                }
                className="w-full rounded-lg border px-3 py-2"
              >
                <option value="">No Parent (Top-level category)</option>

                {parentOptions.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <button onClick={() => setEditing(null)}>Cancel</button>
              <button
                onClick={handleUpdate}
                className="rounded-lg bg-primary px-4 py-2 text-white cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= DELETE POPUP ================= */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center">
            <h3 className="mb-3 text-lg font-semibold">
              Delete this category?
            </h3>
            <p className="mb-5 text-sm text-gray-600">
              This will also remove sub-categories.
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setConfirmDelete(null)}
                className="rounded-lg border px-4 py-2"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="rounded-lg bg-red-500 px-4 py-2 text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
