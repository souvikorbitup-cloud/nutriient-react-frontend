import React, { useEffect, useState } from "react";
import { createCategory, getAllCategories } from "../../api/category";
import AdminLoading from "./AdminLoading";
import { showError, showSuccess } from "../../utils/toast";

const AddCategories = () => {
  const [form, setForm] = useState({
    name: "",
    type: "",
    parent: "",
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await getAllCategories();
      setCategories(res.data.data);
    } catch (err) {
      showError("Failed to load categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // reset parent if type changes
    if (name === "type") {
      setForm((prev) => ({ ...prev, type: value, parent: "" }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      showError("Category name is required");
      return;
    }

    if (!form.type) {
      showError("Please select a category type");
      return;
    }

    try {
      setLoading(true);

      await createCategory({
        name: form.name.trim(),
        type: form.type,
        parent: form.parent || null,
      });

      showSuccess(
        form.parent
          ? "Sub-category created successfully"
          : "Category created successfully",
      );

      setForm({ name: "", type: "", parent: "" });
      fetchCategories();
    } catch (err) {
      showError(err?.response?.data?.message || "Failed to create category");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <AdminLoading />;

  const filteredParents = categories.filter((cat) => cat.type === form.type);

  return (
    <div className="flex items-center justify-center px-4">
      <div className="w-full max-w-xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-center text-lg font-semibold text-gray-700">
          Add Category / Sub-Category
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category Name */}
          <div>
            <label className="mb-1 block text-sm text-gray-600">
              Category Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter category name"
              value={form.name}
              onChange={handleChange}
              className="w-full rounded-lg border border-t-black-light px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Type */}
          <div>
            <label className="mb-1 block text-sm text-gray-600">
              Category Type
            </label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full rounded-lg border border-t-black-light px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">Select Type</option>
              <option value="Health Supplements">Health Supplements</option>
              <option value="Health Pre Packs">Health Pre Packs</option>
              <option value="Vitamins">Vitamins</option>
            </select>
          </div>

          {/* Parent Category (Optional) */}
          <div>
            <label className="mb-1 block text-sm text-gray-600">
              Parent Category (Optional)
            </label>

            <select
              name="parent"
              value={form.parent}
              onChange={handleChange}
              disabled={!form.type}
              className="w-full rounded-lg border border-t-black-light px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">No Parent (Create top-level category)</option>

              {filteredParents.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <p className="mt-1 text-xs text-gray-500">
              Selecting a parent will create a sub-category
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-dark-green py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60 cursor-pointer hover:bg-dark-green/90"
          >
            Add Category
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCategories;
