import React, { useState } from "react";
import { addChart } from "../../api/chart";
import AdminLoading from "./AdminLoading";
import { showError, showSuccess } from "../../Utils/toast";

const AddDiteCharts = () => {
  const [form, setForm] = useState({
    value: "",
    description: "",
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImage(null);
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.value || !image) {
      showError("Calories value and image are required");
      return;
    }

    const formData = new FormData();
    formData.append("value", form.value);
    formData.append("description", form.description);
    formData.append("image", image);

    try {
      setLoading(true);
      await addChart(formData);

      setForm({ value: "", description: "" });
      removeImage();
      showSuccess("Chart added successfully");
    } catch (err) {
      console.error("Failed to add chart", err);
      showError("Failed to add chart");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <AdminLoading />;

  return (
    <div className="flex items-center justify-center px-4">
      <div className="w-full max-w-xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-center text-lg font-semibold text-gray-800">
          Add Diet Chart
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Calories */}
          <div>
            <label className="mb-1 block text-sm text-gray-600">
              Calories Value
            </label>
            <input
              type="number"
              name="value"
              value={form.value}
              onChange={handleChange}
              placeholder="e.g. 2200"
              className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-1 block text-sm text-gray-600">
              Description (optional)
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="3"
              placeholder="Short description"
              className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="mb-1 block text-sm text-gray-600">
              Chart Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full text-sm"
            />
          </div>

          {/* Image Preview */}
          {preview && (
            <div className="relative mt-3 overflow-hidden rounded-xl border">
              <img
                src={preview}
                alt="Preview"
                className="h-48 w-full object-cover"
              />

              <button
                type="button"
                onClick={removeImage}
                className="absolute right-2 top-2 rounded-lg bg-black/70 px-3 py-1 text-xs text-white transition hover:bg-black"
              >
                Remove
              </button>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-dark-green py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60 cursor-pointer hover:bg-dark-green/90"
          >
            Add Chart
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddDiteCharts;
