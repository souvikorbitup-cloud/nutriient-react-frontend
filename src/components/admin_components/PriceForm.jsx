import React, { useState } from "react";
import { showError } from "../../Utils/toast";

const PriceForm = ({
  initialData = {},
  onSubmit,
  loading,
  submitText = "Save",
}) => {
  const [form, setForm] = useState({
    name: initialData.name || "",
    duration: initialData.duration || "",
    originalPrice: initialData.originalPrice || "",
    price: initialData.price || "",
    recommended: initialData.recommended || false,
    isActive: initialData.isActive ?? true,

    features: initialData.features || [""],

    highlightBox: {
      title: initialData.highlightBox?.title || "",
      description: initialData.highlightBox?.description || "",
    },
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleHighlightChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      highlightBox: {
        ...prev.highlightBox,
        [name]: value,
      },
    }));
  };

  const handleFeatureChange = (index, value) => {
    const updated = [...form.features];
    updated[index] = value;

    setForm((prev) => ({
      ...prev,
      features: updated,
    }));
  };

  const addFeature = () => {
    setForm((prev) => ({
      ...prev,
      features: [...prev.features, ""],
    }));
  };

  const removeFeature = (index) => {
    const updated = form.features.filter((_, i) => i !== index);

    setForm((prev) => ({
      ...prev,
      features: updated,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.duration || !form.price || !form.originalPrice) {
      showError("Please fill all required fields");
      return;
    }

    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Plan Name */}
      <div>
        <label className="mb-1 block text-sm font-medium">Plan Name *</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full rounded-lg border p-2"
          placeholder="Example: Premium Plan"
        />
      </div>

      {/* Duration */}
      <div>
        <label className="mb-1 block text-sm font-medium">Duration *</label>
        <select
          name="duration"
          value={form.duration}
          onChange={handleChange}
          className="w-full rounded-lg border p-2"
        >
          <option value="">Select Duration</option>
          <option value="One Month Plan">One Month Plan</option>
          <option value="Three Months Subscription">Three Months Subscription</option>
          <option value="Six Months Subscription">Six Months Subscription</option>
          <option value="Twelve Months Subscription">Twelve Months Subscription</option>
        </select>
      </div>

      {/* Prices */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">
            Original Price *
          </label>
          <input
            type="number"
            name="originalPrice"
            value={form.originalPrice}
            onChange={handleChange}
            className="w-full rounded-lg border p-2"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Discount Price *
          </label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            className="w-full rounded-lg border p-2"
          />
        </div>
      </div>

      {/* Features */}
      <div>
        <label className="mb-2 block text-sm font-medium">Features</label>

        {form.features.map((feature, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              value={feature}
              onChange={(e) => handleFeatureChange(index, e.target.value)}
              className="w-full rounded-lg border p-2"
              placeholder="Feature"
            />

            <button
              type="button"
              onClick={() => removeFeature(index)}
              className="px-3 bg-red-500 text-white rounded text-sm cursor-pointer"
            >
              X
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addFeature}
          className="text-sm text-dark-green cursor-pointer"
        >
          + Add Feature
        </button>
      </div>

      {/* Highlight Box */}
      <div>
        <label className="mb-1 block text-sm font-medium">
          Highlight Title
        </label>
        <input
          name="title"
          value={form.highlightBox.title}
          onChange={handleHighlightChange}
          className="w-full rounded-lg border p-2"
        />

        <label className="mt-3 mb-1 block text-sm font-medium">
          Highlight Description
        </label>
        <textarea
          name="description"
          value={form.highlightBox.description}
          onChange={handleHighlightChange}
          className="w-full rounded-lg border p-2"
        />
      </div>

      {/* Recommended */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          name="recommended"
          checked={form.recommended}
          onChange={handleChange}
          className="h-4 w-4"
        />
        <label className="text-sm font-medium">Recommended Plan</label>
      </div>

      {/* Active */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          name="isActive"
          checked={form.isActive}
          onChange={handleChange}
          className="h-4 w-4"
        />
        <label className="text-sm font-medium">Active Plan</label>
      </div>

      {/* Submit */}
      <button
        disabled={loading}
        className="rounded-xl bg-dark-green px-9 py-3 text-white disabled:opacity-60"
        type="submit"
      >
        {submitText}
      </button>
    </form>
  );
};

export default PriceForm;
