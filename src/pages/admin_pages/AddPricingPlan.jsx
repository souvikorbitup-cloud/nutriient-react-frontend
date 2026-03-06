import React, { useState } from "react";
import { createPricingPlan } from "../../api/pricingPlan";
import { showSuccess, showError } from "../../Utils/toast";
import PriceForm from "../../components/admin_components/PriceForm";

const AddPricingPlan = () => {
  const [loading, setLoading] = useState(false);
  const [formKey, setFormKey] = useState(Date.now());

  const handleCreate = async (data) => {
    try {
      setLoading(true);

      const payload = {
        ...data,
        originalPrice: Number(data.originalPrice),
        price: Number(data.price),
        features: data.features.filter((f) => f.trim() !== ""),
      };

      await createPricingPlan(payload);

      showSuccess("Pricing plan created successfully");

      // reset form
      setFormKey(Date.now());
    } catch (e) {
      showError(e?.response?.data?.message || "Failed to create plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">
          Add Pricing Plan
        </h1>
      </div>

      <PriceForm key={formKey} onSubmit={handleCreate} loading={loading} />
    </div>
  );
};

export default AddPricingPlan;
