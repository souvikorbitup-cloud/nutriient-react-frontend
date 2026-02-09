import React, { useState } from "react";
import { createProduct } from "../../api/product";
import { showSuccess, showError } from "../../utils/toast";
import ProductForm from "../../components/admin_components/ProductForm";

const AddProduct = () => {
  const [loading, setLoading] = useState(false);
  const [formKey, setFormKey] = useState(Date.now()); // ✅ key for reset

  const handleCreate = async (data) => {
    try {
      setLoading(true);
      await createProduct(data);
      showSuccess("Product created successfully");

      // ✅ RESET FORM
      setFormKey(Date.now());
    } catch (e) {
      showError(e?.response?.data?.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Heading */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">
          Add New Product
        </h1>
      </div>

      {/* Form */}
      <ProductForm
        key={formKey} // ✅ IMPORTANT
        onSubmit={handleCreate}
        loading={loading}
      />
    </div>
  );
};

export default AddProduct;
