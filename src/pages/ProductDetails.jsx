import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useShop } from "../context/ShopContext";
import { useCart } from "../context/CartContext";
import Preloder from "../sections/Preloder";
import { showError, showSuccess } from "../Utils/toast";

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const { product, fetchProductById, loading, error, setError } = useShop();
  const { addToCart } = useCart();

  const stock = product?.stock || 0;

  const [activeImage, setActiveImage] = useState(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    fetchProductById(productId);
  }, [productId]);

  useEffect(() => {
    if (product?.featureImage) {
      setActiveImage(product.featureImage);
      setQty(1);
    }
  }, [product]);

  if (error) {
    showError("Failed to load product details");
    navigate("/shop", { replace: true });
    setError(null);
    return null;
  }

  if (loading) return <Preloder />;

  const mrp = product?.mrp?.$numberDecimal || 0;
  const sellPrice = product?.sellPrice?.$numberDecimal || 0;

  const images = [product?.featureImage, ...(product?.images || [])];

  const increaseQty = () => {
    if (qty < stock) setQty((prev) => prev + 1);
  };

  const decreaseQty = () => {
    if (qty > 1) setQty((prev) => prev - 1);
  };

  /* ================= ADD TO CART ================= */

  const handleAddToCart = async () => {
    try {
      await addToCart(product, qty);
      showSuccess("Added to cart");
    } catch (err) {
      showError("Failed to add to cart");
    }
  };

  return (
    <section className="app-container mx-auto px-4 py-32">
      {/* ================= BACK ================= */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm mb-6 hover:text-green-600 cursor-pointer"
      >
        <i className="fa-solid fa-arrow-left" />
        Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* ================= IMAGES ================= */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="hidden lg:flex flex-col gap-3">
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                onMouseEnter={() => setActiveImage(img)}
                className={`w-20 h-20 object-contain border rounded-lg cursor-pointer ${
                  activeImage === img ? "border-green-600" : "border-gray-300"
                }`}
              />
            ))}
          </div>

          <div className="flex-1 border rounded-xl p-6 border-gray-300">
            <img
              src={activeImage}
              alt={product?.genericName}
              className="w-full h-[380px] object-contain"
            />

            <div className="flex lg:hidden gap-2 mt-4">
              {images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  onClick={() => setActiveImage(img)}
                  className={`w-16 h-16 object-contain border rounded-lg cursor-pointer ${
                    activeImage === img ? "border-green-600" : "border-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ================= INFO ================= */}
        <div>
          <p className="text-xs text-gray-500 mb-1">
            {product?.category?.name}
            {product?.subCategory && ` • ${product.subCategory.name}`}
          </p>

          <h1 className="text-2xl font-bold mb-3">{product?.genericName}</h1>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl font-semibold">₹{sellPrice}</span>
            <span className="text-sm line-through text-gray-400">₹{mrp}</span>
          </div>

          <div className="flex flex-wrap gap-3 text-sm mb-6">
            <span className="px-3 py-1 bg-gray-100 rounded">
              Duration: {product?.coursDuration}
            </span>

            {product?.isRecommendation && (
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded">
                Recommended
              </span>
            )}

            <span
              className={`px-3 py-1 rounded ${
                product?.isOutOfStock
                  ? "bg-red-100 text-red-600"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {product?.isOutOfStock ? "Out of Stock" : "In Stock"}
            </span>
          </div>

          {/* ================= ADD TO CART ================= */}
          <div className="flex gap-3">
            <div className="flex items-center border rounded-lg overflow-hidden border-gray-300">
              <button
                onClick={decreaseQty}
                disabled={qty === 1}
                className={`p-3 text-sm grow ${
                  qty === 1
                    ? "text-gray-400 cursor-not-allowed"
                    : "hover:bg-gray-100 cursor-pointer"
                }`}
              >
                −
              </button>

              <span className="px-3 text-sm font-medium w-8 text-center">
                {qty}
              </span>

              <button
                onClick={increaseQty}
                disabled={qty === stock}
                className={`p-3 text-sm grow ${
                  qty === stock
                    ? "text-gray-400 cursor-not-allowed"
                    : "hover:bg-gray-100 cursor-pointer"
                }`}
              >
                +
              </button>
            </div>

            <button
              disabled={product?.isOutOfStock}
              onClick={handleAddToCart}
              className={`flex-1 py-3 rounded-lg text-sm transition ${
                product?.isOutOfStock
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700 cursor-pointer"
              }`}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* ================= DESCRIPTIONS ================= */}
      <div className="mt-16 space-y-10">
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
    </section>
  );
};

const Description = ({ title, content }) => (
  <div>
    <h3 className="mb-4 font-semibold text-t-black-light">{title}</h3>
    <div
      className="prose max-w-none text-t-black reset-design rounded-xl border p-6 border-gray-300"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  </div>
);

export default ProductDetails;
