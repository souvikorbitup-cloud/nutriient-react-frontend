import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProductById } from "../../api/product";
import { showError } from "../../utils/toast";
import { normalizeDecimal } from "../../Utils/helpers";

const ShowSelectedProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

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
        setProduct(res.data.data);
      })
      .catch(() => {
        showError("Product not found");
        navigate("/not-found", { replace: true });
      })
      .finally(() => setLoading(false));
  }, [productId, navigate]);

  if (loading) {
    return (
      <div className="py-10 text-center text-gray-500">Loading product...</div>
    );
  }

  if (!product) return null;

  return (
    <div className="space-y-8">
      {/* ================= Header ================= */}
      <div className="flex items-center justify-between flex-col sm:flex-row">
        <h2 className="text-2xl font-bold">{product.genericName}</h2>

        <button
          onClick={() => navigate(`/admin/products/${product._id}/edit`)}
          className="rounded-lg bg-dark-green px-5 py-2 text-white cursor-pointer mt-4 sm:mt-0"
        >
          Edit Product
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-[30%_70%]">
        {/* ================= Feature Image ================= */}
        <div>
          <h3 className="mb-2 font-semibold">Feature Image</h3>
          <img
            src={product.featureImage}
            alt={product.genericName}
            className="w-full rounded-xl border"
          />
        </div>

        {/* ================= Gallery Images ================= */}
        {product.images?.length > 0 && (
          <div>
            <h3 className="mb-2 font-semibold">Gallery Images</h3>
            <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
              {product.images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt=""
                  className="w-[30%] sm:h-32  sm:w-32 rounded-lg border object-cover"
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ================= Product Info ================= */}
      <div className="grid grid-cols-2 gap-6 rounded-xl border p-6">
        <Info label="Category" value={product.category?.name} />
        <Info label="Sub Category" value={product.subCategory?.name || "-"} />
        <Info label="Generic Name" value={product.genericName} />
        <Info label="Sub Generic Name" value={product.subGenericName || "-"} />
        <Info label="Course Duration" value={product.coursDuration} />
        <Info label="Stock" value={product.stock} />
        <Info label="MRP" value={`₹${normalizeDecimal(product.mrp)}`} />
        <Info
          label="Selling Price"
          value={`₹${normalizeDecimal(product.sellPrice)}`}
        />
        <Info
          label="Recommendation"
          value={product.isRecommendation ? "Yes" : "No"}
        />
      </div>

      {/* ================= Descriptions ================= */}
      <Description
        title="Short Description"
        content={
          product?.shortDescription?.length > 0
            ? product.shortDescription
            : "No Description"
        }
      />

      <Description
        title="Full Description"
        content={
          product?.fullDescription?.length > 0
            ? product.fullDescription
            : "No Description"
        }
      />

      <Description
        title="Recommendation Description"
        content={
          product?.descriptionForRecommendation?.length > 0
            ? product.descriptionForRecommendation
            : "No Description"
        }
      />
    </div>
  );
};

/* ================= Reusable Components ================= */

const Info = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-500">{label}</p>
    <p className="font-medium">{value}</p>
  </div>
);

const Description = ({ title, content }) => (
  <div className="rounded-xl border p-6">
    <h3 className="mb-3 font-semibold text-t-black-light">{title}</h3>
    <div
      className="prose max-w-none text-t-black"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  </div>
);

export default ShowSelectedProduct;
