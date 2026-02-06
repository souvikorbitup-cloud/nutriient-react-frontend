import React, { useEffect, useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { getCategoriesByType } from "../../api/category";
import { showError } from "../../utils/toast";
import { normalizeDecimal } from "../../Utils/helpers";

const ProductForm = ({
  initialData = {},
  onSubmit,
  loading,
  submitText = "Save",
}) => {
  const [categories, setCategories] = useState([]);

  const [existingFeatureImage, setExistingFeatureImage] = useState(
    initialData.featureImage || null,
  );

  const [existingImages, setExistingImages] = useState(
    initialData.images || [],
  );

  // ✅ Track ONLY removed images
  const [removedImages, setRemovedImages] = useState([]);

  const [form, setForm] = useState({
    category: initialData.category?._id || "",
    subCategory: initialData.subCategory?._id || "",
    genericName: initialData.genericName || "",
    subGenericName: initialData.subGenericName || "",
    mrp: normalizeDecimal(initialData.mrp),
    sellPrice: normalizeDecimal(initialData.sellPrice),
    coursDuration: initialData.coursDuration || "month",
    stock: initialData.stock ?? 0,
    isRecommendation: initialData.isRecommendation || false,
    shortDescription: initialData.shortDescription || "",
    fullDescription: initialData.fullDescription || "",
    descriptionForRecommendation:
      initialData.descriptionForRecommendation || "",
    featureImage: null,
    images: [],
  });

  /* ================= Fetch Categories ================= */
  useEffect(() => {
    getCategoriesByType()
      .then((res) => setCategories(res.data.data))
      .catch(() => showError("Failed to load categories"));
  }, []);

  /* ================= Sub Categories ================= */
  const selectedGroup = categories.find((g) =>
    g.categories.some((c) => c._id === form.category),
  );

  const selectedCategory = selectedGroup?.categories.find(
    (c) => c._id === form.category,
  );

  const subCategories = selectedCategory?.subCategories || [];

  /* ================= Handlers ================= */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "category") {
      setForm((prev) => ({
        ...prev,
        category: value,
        subCategory: "",
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !form.category ||
      !form.genericName ||
      !form.mrp ||
      !form.sellPrice ||
      !form.coursDuration ||
      form.stock === ""
    ) {
      showError("Please fill all required fields");
      return;
    }

    const fd = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      if (value !== null && value !== "") {
        if (Array.isArray(value)) {
          value.forEach((v) => fd.append(key, v));
        } else {
          fd.append(key, value);
        }
      }
    });

    // ✅ send ONLY removed images
    if (removedImages.length) {
      fd.append("removedImages", JSON.stringify(removedImages));
    }

    onSubmit(fd);
  };

  /* ================= Remove handlers ================= */

  // Remove EXISTING image
  const removeExistingImage = (index) => {
    setRemovedImages((prev) => [...prev, existingImages[index]]);
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Remove NEW image
  const removeGalleryImage = (index) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ================= Category ================= */}
      <div>
        <label className="mb-1 block text-sm font-medium">Category *</label>
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full rounded-lg border p-2"
        >
          <option value="">Select Category</option>
          {categories.map((group) =>
            group.categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {group.type} → {cat.name}
              </option>
            )),
          )}
        </select>
      </div>

      {/* ================= Sub Category ================= */}
      {subCategories.length > 0 && (
        <div>
          <label className="mb-1 block text-sm font-medium">Sub Category</label>
          <select
            name="subCategory"
            value={form.subCategory}
            onChange={handleChange}
            className="w-full rounded-lg border p-2"
          >
            <option value="">Select Sub Category</option>
            {subCategories.map((sub) => (
              <option key={sub._id} value={sub._id}>
                {sub.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* ================= Names ================= */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">
            Generic Name *
          </label>
          <input
            name="genericName"
            value={form.genericName}
            onChange={handleChange}
            className="w-full rounded-lg border p-2"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Sub Generic Name
          </label>
          <input
            name="subGenericName"
            value={form.subGenericName}
            onChange={handleChange}
            className="w-full rounded-lg border p-2"
          />
        </div>
      </div>

      {/* ================= Prices & Stock ================= */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">MRP *</label>
          <input
            type="number"
            step="0.01"
            name="mrp"
            value={form.mrp}
            onChange={handleChange}
            className="w-full rounded-lg border p-2"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Selling Price *
          </label>
          <input
            type="number"
            step="0.01"
            name="sellPrice"
            value={form.sellPrice}
            onChange={handleChange}
            className="w-full rounded-lg border p-2"
          />
        </div>

        {/* ✅ STOCK INPUT (ADDED) */}
        <div>
          <label className="mb-1 block text-sm font-medium">Stock *</label>
          <input
            type="number"
            name="stock"
            value={form.stock}
            onChange={handleChange}
            className="w-full rounded-lg border p-2"
          />
        </div>
      </div>

      {/* ================= Recommendation ================= */}
      <div className="flex items-center gap-3 p-3">
        <input
          type="checkbox"
          name="isRecommendation"
          checked={form.isRecommendation}
          onChange={handleChange}
          className="h-4 w-4 cursor-pointer"
          id="recommendation"
        />
        <label
          className="text-sm font-medium cursor-pointer select-none"
          htmlFor="recommendation"
        >
          Mark as Recommended Product
        </label>
      </div>

      {/* ================= Editors ================= */}
      {[
        { key: "shortDescription", label: "Short Description" },
        { key: "fullDescription", label: "Full Description" },
        {
          key: "descriptionForRecommendation",
          label: "Recommendation Description",
        },
      ].map(({ key, label }) => (
        <div key={key}>
          <label className="mb-1 block text-sm font-medium">{label}</label>
          <CKEditor
            editor={ClassicEditor}
            data={form[key]}
            onChange={(_, editor) =>
              setForm((prev) => ({
                ...prev,
                [key]: editor.getData(),
              }))
            }
          />
        </div>
      ))}

      {/* ================= Feature Image ================= */}
      <div>
        <label className="mb-2 block text-sm font-medium">
          Feature Image *
        </label>

        {existingFeatureImage && !form.featureImage && (
          <div className="relative w-40">
            <img
              src={existingFeatureImage}
              className="h-40 w-full rounded-lg object-cover"
            />
            <button
              type="button"
              onClick={() => setExistingFeatureImage(null)}
              className="absolute right-2 top-2 rounded bg-red-600 px-2 text-xs text-white"
            >
              ✕
            </button>
          </div>
        )}

        {form.featureImage && (
          <div className="relative w-40">
            <img
              src={URL.createObjectURL(form.featureImage)}
              className="h-40 w-full rounded-lg object-cover"
            />
            <button
              type="button"
              onClick={() =>
                setForm((prev) => ({ ...prev, featureImage: null }))
              }
              className="absolute right-1 top-1 rounded bg-red-600 px-1 text-xs text-white"
            >
              ✕
            </button>
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          className="mt-2 cursor-pointer hover:text-dark-green transition"
          required={!initialData._id && !existingFeatureImage}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              featureImage: e.target.files[0],
            }))
          }
        />
      </div>

      {/* ================= Gallery Images ================= */}
      <div>
        <label className="mb-2 block text-sm font-medium">Gallery Images</label>

        <div className="flex flex-wrap gap-3">
          {existingImages.map((img, i) => (
            <div key={i} className="relative">
              <img src={img} className="h-40 w-40 rounded object-contain" />
              <button
                type="button"
                onClick={() => removeExistingImage(i)}
                className="absolute right-1 top-1 rounded bg-red-600 px-1 text-xs text-white"
              >
                ✕
              </button>
            </div>
          ))}

          {form.images.map((img, i) => (
            <div key={i} className="relative">
              <img
                src={URL.createObjectURL(img)}
                className="h-40 w-40 rounded object-contain"
              />
              <button
                type="button"
                onClick={() => removeGalleryImage(i)}
                className="absolute right-1 top-1 rounded bg-red-600 px-1 text-xs text-white"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <input
          type="file"
          multiple
          accept="image/*"
          className="mt-3 cursor-pointer hover:text-dark-green transition"
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              images: Array.from(e.target.files),
            }))
          }
        />
      </div>

      {/* ================= Submit ================= */}
      <button
        disabled={loading}
        className="rounded-xl bg-dark-green px-9 py-3 text-white disabled:opacity-60 cursor-pointer"
        type="submit"
      >
        {submitText}
      </button>
    </form>
  );
};

export default ProductForm;
