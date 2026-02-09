import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProductById, updateProduct } from "../../api/product";
import { showSuccess, showError } from "../../utils/toast";
import ProductForm from "../../components/admin_components/ProductForm";

const UpdateProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  /* ================= Fetch Product ================= */
  useEffect(() => {
    if (!productId) {
      navigate("/not-found", { replace: true });
      return;
    }

    getProductById(productId)
      .then((res) => {
        if (!res?.data?.data) {
          navigate("/not-found", { replace: true });
          return;
        }
        setData(res.data.data);
      })
      .catch(() => {
        showError("Product not found");
        navigate("/not-found", { replace: true });
      })
      .finally(() => setPageLoading(false));
  }, [productId, navigate]);

  /* ================= Update Handler ================= */
  const handleUpdate = async (formData) => {
    try {
      setLoading(true);
      await updateProduct(productId, formData);
      showSuccess("Product updated successfully");
      navigate(-1); // go back to previous page
    } catch (e) {
      showError(e?.response?.data?.message || "Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  /* ================= Loading ================= */
  if (pageLoading) {
    return (
      <div className="py-10 text-center text-gray-500">Loading product...</div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* ================= Header ================= */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Update Product</h1>

        <button
          onClick={() => navigate(-1)}
          className="rounded-lg border px-4 py-2 text-sm cursor-pointer"
        >
          Back
        </button>
      </div>

      {/* ================= Form ================= */}
      <ProductForm
        initialData={data}
        onSubmit={handleUpdate}
        loading={loading}
        submitText="Update Product"
      />
    </div>
  );
};

export default UpdateProduct;
