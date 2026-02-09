import React, { useEffect, useState } from "react";
import { getAllProducts, deleteProduct } from "../../api/product";
import { useNavigate, useLocation } from "react-router-dom";
import { showSuccess, showError } from "../../utils/toast";
import { normalizeDecimal } from "../../Utils/helpers";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [deleteId, setDeleteId] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const fetchProducts = async () => {
    try {
      const res = await getAllProducts();
      setProducts(res.data.data);
    } catch {
      showError("Failed to load products");
    }
  };

  useEffect(() => {
    // Use cached products when coming back
    if (location.state?.products?.length) {
      setProducts(location.state.products);
    } else {
      fetchProducts();
    }
  }, []);

  const handleDelete = async () => {
    try {
      await deleteProduct(deleteId);
      showSuccess("Product deleted successfully");
      setDeleteId(null);
      fetchProducts();
    } catch {
      showError("Failed to delete product");
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">Products</h2>
        <button
          onClick={() => navigate(`/admin/add-product`)}
          className="rounded-lg bg-dark-green px-5 py-2 text-white cursor-pointer sm:mt-0"
        >
          Add New Product
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr className="border-b border-gray-200 text-sm text-gray-500 text-center">
              <th className="py-3 px-2 border-x border-gray-300 capitalize">
                Image
              </th>
              <th className="py-3 px-2 border-x border-gray-300 capitalize">
                Category
              </th>
              <th className="py-3 px-2 border-x border-gray-300 capitalize">
                Generic Name
              </th>
              <th className="py-3 px-2 border-x border-gray-300 capitalize">
                Sub Generic
              </th>
              <th className="py-3 px-2 border-x border-gray-300 capitalize">
                MRP
              </th>
              <th className="py-3 px-2 border-x border-gray-300 capitalize">
                Sell Price
              </th>
              <th className="py-3 px-2 border-x border-gray-300 capitalize">
                Duration
              </th>
              <th className="py-3 px-2 border-x border-gray-300 capitalize">
                Stock
              </th>
              <th className="py-3 px-2 border-x border-gray-300 capitalize">
                Recommendation
              </th>
              <th className="py-3 px-2 border-x border-gray-300 capitalize">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {products.length === 0 && (
              <tr>
                <td
                  colSpan="10"
                  className="py-6 text-center text-sm text-gray-500 capitalize"
                >
                  No products found
                </td>
              </tr>
            )}

            {products.map((p) => (
              <tr
                key={p._id}
                className="border-b border-gray-100 text-sm text-gray-700 hover:bg-gray-50"
              >
                {/* Image */}
                <td className="py-3 px-2 border-x border-gray-300 capitalize">
                  <img
                    src={p.featureImage}
                    alt={p.genericName}
                    className="h-12 w-12 rounded object-cover border"
                  />
                </td>

                {/* Category */}
                <td className="py-3 px-2 border-x border-gray-300 capitalize">
                  <div className="text-sm font-medium">{p.category?.name}</div>
                  {p.subCategory && (
                    <div className="text-xs text-gray-500 ml-1.5">
                      &bull; {p.subCategory.name}
                    </div>
                  )}
                </td>

                {/* Names */}
                <td className="py-3 px-2 border-x border-gray-300 capitalize font-medium">
                  {p.genericName}
                </td>
                <td
                  className={`py-3 px-2 border-x border-gray-300 capitalize ${p.subGenericName ? "text-left" : "text-center"}`}
                >
                  {p.subGenericName || "-"}
                </td>

                {/* Prices */}
                <td className="py-3 px-2 border-x border-gray-300 capitalize text-center">
                  ₹{normalizeDecimal(p.mrp)}
                </td>
                <td className="py-3 px-2 border-x border-gray-300 capitalize text-center">
                  ₹{normalizeDecimal(p.sellPrice)}
                </td>

                {/* Duration */}
                <td className="py-3 px-2 border-x border-gray-300 capitalize text-center">
                  {p.coursDuration}
                </td>

                {/* Stock */}
                <td className="py-3 px-2 border-x border-gray-300 capitalize text-center">
                  {p.stock}
                </td>

                {/* Recommendation */}
                <td className="py-3 px-2 border-x border-gray-300 capitalize text-center">
                  {p.isRecommendation ? (
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                      Yes
                    </span>
                  ) : (
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs">
                      No
                    </span>
                  )}
                </td>

                {/* Actions */}
                <td className="py-3 px-2 border-x border-gray-300 capitalize">
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() =>
                        navigate(`/admin/products/${p._id}`, {
                          state: { products },
                        })
                      }
                      className="text-blue-600 hover:underline cursor-pointer"
                    >
                      View
                    </button>

                    <button
                      onClick={() =>
                        navigate(`/admin/products/${p._id}/edit`, {
                          state: { products },
                        })
                      }
                      className="text-yellow-600 hover:underline cursor-pointer"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => setDeleteId(p._id)}
                      className="text-red-600 hover:underline cursor-pointer"
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

      {/* ================= Delete Confirmation ================= */}
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
