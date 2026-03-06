import React, { useEffect, useState } from "react";
import { getAllPricingPlans, deletePricingPlan } from "../../api/pricingPlan";
import { showSuccess, showError } from "../../Utils/toast";
import { useNavigate } from "react-router-dom";
import AdminLoading from "./AdminLoading";

const PricingPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  const navigate = useNavigate();

  const fetchPlans = async () => {
    try {
      setLoading(true);

      const res = await getAllPricingPlans();

      setPlans(res.data.data.plans || []);
    } catch {
      showError("Failed to load pricing plans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleDelete = async () => {
    try {
      await deletePricingPlan(deleteId);
      showSuccess("Plan deleted successfully");
      setDeleteId(null);
      fetchPlans();
    } catch {
      showError("Failed to delete plan");
    }
  };
  

  if (loading) return <AdminLoading />;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">Pricing Plans</h2>

        <button
          onClick={() => navigate("/admin/add-pricing")}
          className="rounded-lg bg-dark-green px-5 py-2 text-white cursor-pointer"
        >
          Add Plan
        </button>
      </div>

      {/* Cards */}
      {plans.length === 0 ? (
        <div className="text-center text-gray-500 py-10">
          No pricing plans found
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {plans?.map((p) => (
            <div
              key={p._id}
              className={`border rounded-xl p-5 relative shadow-sm hover:shadow-md transition ${
                p.recommended ? "border-green-500" : "border-gray-200"
              }`}
            >
              {/* Recommended Badge */}
              {p.recommended && (
                <span className="absolute top-3 right-3 text-xs bg-green-600 text-white px-3 py-1 rounded-full">
                  Recommended
                </span>
              )}

              {/* Plan Name */}
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                {p.name}
              </h3>

              <p className="text-sm text-gray-500 mb-3">{p.duration}</p>

              {/* Pricing */}
              <div className="mb-4">
                <p className="text-gray-400 line-through text-sm">
                  ₹{p.originalPrice}
                </p>

                <p className="text-2xl font-bold text-gray-800">₹{p.price}</p>

                {p.savePercentage > 0 && (
                  <p className="text-green-600 text-sm">
                    Save {p.savePercentage}%
                  </p>
                )}
              </div>

              {/* Features */}
              {p.features?.length > 0 && (
                <ul className="text-sm text-gray-600 mb-4 list-disc pl-4 space-y-1">
                  {p.features.slice(0, 3).map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              )}

              {/* Highlight Box */}
              {p.highlightBox?.title && (
                <div className="bg-gray-50 border rounded-lg p-3 mb-4">
                  <p className="text-sm font-semibold mb-2">
                    {p.highlightBox.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    {p.highlightBox.description}
                  </p>
                </div>
              )}

              {/* Status */}
              <div className="mb-4">
                {p.isActive ? (
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
                    Active
                  </span>
                ) : (
                  <span className="bg-gray-100 px-3 py-1 rounded-full text-xs">
                    Disabled
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <button
                  onClick={() => navigate(`/admin/pricing/${p._id}/edit`)}
                  className="text-yellow-600 hover:underline text-sm cursor-pointer"
                >
                  Edit
                </button>

                <button
                  onClick={() => setDeleteId(p._id)}
                  className="text-red-600 hover:underline text-sm cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-80 text-center">
            <h3 className="text-lg font-semibold mb-4">Delete Plan?</h3>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 border rounded cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded cursor-pointer"
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

export default PricingPlans;
