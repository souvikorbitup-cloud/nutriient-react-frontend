import React, { useEffect, useState } from "react";
import { getAllProducts, deleteProduct } from "../../api/product";
import { useNavigate, useLocation } from "react-router-dom";
import { showSuccess, showError } from "../../Utils/toast.js";
import { normalizeDecimal } from "../../Utils/helpers";
import AdminLoading from "./AdminLoading.jsx";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  /* ================= FETCH ================= */
  const fetchProducts = async (pageNumber = 1) => {
    try {
      setLoading(true);
      const res = await getAllProducts({ page: pageNumber, limit });

      setProducts(res.data.data.products || []);
      setPagination(res.data.data.pagination || null);
      setPage(pageNumber);
    } catch {
      showError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Use cached products when coming back
    if (location.state?.products?.length) {
      setProducts(location.state.products);
      setPagination(location.state.pagination || null);
      setLoading(false);
    } else {
      fetchProducts(1);
    }
  }, []);

  /* ================= DELETE ================= */
  const handleDelete = async () => {
    try {
      await deleteProduct(deleteId);
      showSuccess("Product deleted successfully");
      setDeleteId(null);
      fetchProducts(page);
    } catch {
      showError("Failed to delete product");
    }
  };

  if (loading) return <AdminLoading />;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6">
      {/* ================= HEADER ================= */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">Products</h2>
        <button
          onClick={() => navigate(`/admin/add-product`)}
          className="rounded-lg bg-dark-green px-5 py-2 text-white cursor-pointer"
        >
          Add New Product
        </button>
      </div>

      {/* ================= TABLE ================= */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr className="border-b border-gray-200 text-sm text-gray-500 text-center">
              <th className="py-3 px-2 border-x border-gray-200">Image</th>
              <th className="py-3 px-2 border-x border-gray-200">Category</th>
              <th className="py-3 px-2 border-x border-gray-200">
                Generic Name
              </th>
              <th className="py-3 px-2 border-x border-gray-200">
                Sub Generic
              </th>
              <th className="py-3 px-2 border-x border-gray-200">MRP</th>
              <th className="py-3 px-2 border-x border-gray-200">Sell Price</th>
              <th className="py-3 px-2 border-x border-gray-200">Duration</th>
              <th className="py-3 px-2 border-x border-gray-200">Stock</th>
              <th className="py-3 px-2 border-x border-gray-200">
                Recommendation
              </th>
              <th className="py-3 px-2 border-x border-gray-200">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.length === 0 && (
              <tr>
                <td colSpan="10" className="py-6 text-center text-gray-500">
                  No products found
                </td>
              </tr>
            )}

            {products.map((p) => (
              <tr
                key={p._id}
                className="border-b border-gray-200 text-sm hover:bg-gray-50"
              >
                {/* Image */}
                <td className="py-3 px-2 border-x border-gray-200 text-center">
                  <img
                    src={p.featureImage}
                    alt={p.genericName}
                    className="h-12 w-12 mx-auto rounded object-cover border"
                  />
                </td>

                {/* Category */}
                <td className="py-3 px-2 border-x border-gray-200">
                  <div className="font-medium">{p.category?.name}</div>
                  {p.subCategory && (
                    <div className="text-xs text-gray-500">
                      • {p.subCategory.name}
                    </div>
                  )}
                </td>

                {/* Names */}
                <td className="py-3 px-2 border-x border-gray-200 font-medium">
                  {p.genericName}
                </td>
                <td className="py-3 px-2 border-x border-gray-200 text-center">
                  {p.subGenericName || "-"}
                </td>

                {/* Prices */}
                <td className="py-3 px-2 border-x border-gray-200 text-center">
                  ₹{normalizeDecimal(p.mrp)}
                </td>
                <td className="py-3 px-2 border-x border-gray-200 text-center">
                  ₹{normalizeDecimal(p.sellPrice)}
                </td>

                {/* Duration */}
                <td className="py-3 px-2 border-x border-gray-200 text-center">
                  {p.coursDuration}
                </td>

                {/* Stock */}
                <td className="py-3 px-2 border-x border-gray-200 text-center">
                  {p.stock}
                </td>

                {/* Recommendation */}
                <td className="py-3 px-2 border-x border-gray-200 text-center">
                  {p.isRecommendation ? (
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs text-green-700">
                      Yes
                    </span>
                  ) : (
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs">
                      No
                    </span>
                  )}
                </td>

                {/* Actions */}
                <td className="py-3 px-2 border-x border-gray-200">
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() =>
                        navigate(`/admin/products/${p._id}`, {
                          state: { products, pagination },
                        })
                      }
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </button>

                    <button
                      onClick={() =>
                        navigate(`/admin/products/${p._id}/edit`, {
                          state: { products, pagination },
                        })
                      }
                      className="text-yellow-600 hover:underline"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => setDeleteId(p._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= PAGINATION ================= */}
      {pagination?.totalPages > 1 && (
        <div className="mt-8 flex justify-center items-center gap-2 flex-wrap">
          {/* PREV */}
          <button
            disabled={!pagination.hasPrevPage}
            onClick={() => fetchProducts(page - 1)}
            className={`px-3 py-2 rounded-lg border text-sm
              ${
                pagination.hasPrevPage
                  ? "hover:bg-gray-100"
                  : "opacity-50 cursor-not-allowed"
              }`}
          >
            Prev
          </button>

          {/* PAGE NUMBERS */}
          {Array.from({ length: pagination.totalPages }).map((_, i) => {
            const pageNumber = i + 1;
            return (
              <button
                key={pageNumber}
                onClick={() => fetchProducts(pageNumber)}
                className={`px-4 py-2 rounded-lg border text-sm
                  ${
                    page === pageNumber
                      ? "bg-dark-green text-white"
                      : "hover:bg-gray-100"
                  }`}
              >
                {pageNumber}
              </button>
            );
          })}

          {/* NEXT */}
          <button
            disabled={!pagination.hasNextPage}
            onClick={() => fetchProducts(page + 1)}
            className={`px-3 py-2 rounded-lg border text-sm
              ${
                pagination.hasNextPage
                  ? "hover:bg-gray-100"
                  : "opacity-50 cursor-not-allowed"
              }`}
          >
            Next
          </button>
        </div>
      )}

      {/* ================= DELETE MODAL ================= */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-sm rounded-xl bg-white p-6">
            <h3 className="text-lg font-semibold">Delete Product</h3>
            <p className="mt-2 text-sm text-gray-600">
              Are you sure you want to delete this product?
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="rounded-lg border px-4 py-2"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="rounded-lg bg-red-600 px-4 py-2 text-white"
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

export default Products;
