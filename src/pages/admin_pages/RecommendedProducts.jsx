import React, { useEffect, useState } from "react";
import {
  getProductsGroupedByGoal,
  updateProductGoal,
  getAllProductsName,
} from "../../api/product";
import { showError, showSuccess } from "../../Utils/toast";
import AdminLoading from "./AdminLoading";

const GOALS = ["Gut Health", "PCOS", "Fat Loss", "Diabetes / Metabolic Health"];

const RecommendedProducts = () => {
  const [goalProducts, setGoalProducts] = useState({});
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  /* ================= Fetch Data ================= */

  const fetchData = async () => {
    try {
      setLoading(true);

      const [goalRes, productsRes] = await Promise.all([
        getProductsGroupedByGoal(),
        getAllProductsName(true),
      ]);

      setGoalProducts(goalRes.data.data || {});
      setAllProducts(productsRes.data.data || []);
    } catch (err) {
      showError("Failed to load recommended products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ================= Helpers ================= */

  const formatPrice = (price) =>
    Number(price?.$numberDecimal || price).toFixed(2);

  const handleAddProduct = async (goal, productId) => {
    if (!productId) return;

    try {
      setUpdating(productId);

      await updateProductGoal(productId, {
        goal,
        action: "add",
      });

      showSuccess("Product added to goal");

      fetchData();
    } catch (err) {
      showError("Failed to add product");
    } finally {
      setUpdating(null);
    }
  };

  const handleRemoveProduct = async (goal, productId) => {
    try {
      setUpdating(productId);

      await updateProductGoal(productId, {
        goal,
        action: "remove",
      });

      showSuccess("Product removed from goal");

      fetchData();
    } catch (err) {
      showError("Failed to remove product");
    } finally {
      setUpdating(null);
    }
  };

  if (loading) return <AdminLoading />;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-6">
        Recommended Products
      </h2>

      <div className="grid lg:grid-cols-2 gap-8">
        {GOALS.map((goal) => {
          const products = goalProducts?.[goal] || [];

          return (
            <div key={goal} className="border rounded-xl p-5 border-gray-200">
              {/* ===== Goal Header ===== */}
              <h3 className="text-md font-semibold mb-4">{goal}</h3>

              {/* ===== Product List ===== */}
              {products.length > 0 ? (
                <div className="grid gap-4 mb-4">
                  {products.map((product) => (
                    <div
                      key={product._id}
                      className="flex items-center gap-4 border rounded-lg p-3 border-gray-200"
                    >
                      <img
                        src={product.featureImage}
                        alt={product.genericName}
                        className="w-16 h-16 object-cover rounded"
                      />

                      <div className="flex-1">
                        <p className="font-medium">{product.genericName}</p>

                        <p className="text-sm text-gray-500">
                          ₹{formatPrice(product.sellPrice)}
                        </p>
                      </div>

                      <button
                        disabled={updating === product._id}
                        onClick={() => handleRemoveProduct(goal, product._id)}
                        className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 cursor-pointer text-sm"
                      >
                        <i className="fa-regular fa-trash-can"></i>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 mb-4">
                  No products added yet.
                </p>
              )}

              {/* ===== Add Product ===== */}
              <select
                onChange={(e) => handleAddProduct(goal, e.target.value)}
                className="border px-3 py-2 rounded w-full border-gray-200"
              >
                <option value="">Add Product</option>

                {allProducts.map((product) => {
                  const price =
                    product.sellPrice?.$numberDecimal || product.sellPrice;

                  return (
                    <option
                      key={product._id}
                      value={product._id}
                      disabled={product.stock === 0}
                    >
                      {product.genericName} - ₹{Number(price).toFixed(2)}{" "}
                      (Stock: {product.stock})
                    </option>
                  );
                })}
              </select>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecommendedProducts;
