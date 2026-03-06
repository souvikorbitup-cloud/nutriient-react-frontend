import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPricingPlanById, updatePricingPlan } from "../../api/pricingPlan";
import { showSuccess, showError } from "../../Utils/toast.js";
import PriceForm from "../../components/admin_components/PriceForm";

const UpdatePricing = () => {
  const { planId } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  /* ================= Fetch Plan ================= */
  useEffect(() => {
    if (!planId) {
      navigate("/not-found", { replace: true });
      return;
    }

    getPricingPlanById(planId)
      .then((res) => {
        if (!res?.data?.data) {
          navigate("/not-found", { replace: true });
          return;
        }

        setData(res.data.data);
      })
      .catch(() => {
        showError("Pricing plan not found");
        navigate("/not-found", { replace: true });
      })
      .finally(() => setPageLoading(false));
  }, [planId, navigate]);

  /* ================= Update Handler ================= */
  const handleUpdate = async (formData) => {
    try {
      setLoading(true);

      await updatePricingPlan(planId, formData);

      showSuccess("Pricing plan updated successfully");

      navigate(-1);
    } catch (e) {
      showError(e?.response?.data?.message || "Failed to update pricing plan");
    } finally {
      setLoading(false);
    }
  };

  /* ================= Loading ================= */
  if (pageLoading) {
    return (
      <div className="py-10 text-center text-gray-500">
        Loading pricing plan...
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* ================= Header ================= */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">
          Update Pricing Plan
        </h1>

        <button
          onClick={() => navigate(-1)}
          className="rounded-lg border px-4 py-2 text-sm cursor-pointer"
        >
          Back
        </button>
      </div>

      {/* ================= Form ================= */}
      <PriceForm
        initialData={data}
        onSubmit={handleUpdate}
        loading={loading}
        submitText="Update Plan"
      />
    </div>
  );
};

export default UpdatePricing;
