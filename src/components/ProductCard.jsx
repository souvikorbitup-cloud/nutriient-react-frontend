import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { slugify } from "../Utils/helpers";
import { showSuccess } from "../Utils/toast";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const mrp = product?.mrp?.$numberDecimal || 0;
  const sellPrice = product?.sellPrice?.$numberDecimal || 0;
  const stock = product?.stock || 0;

  const [qty, setQty] = useState(1);

  /* ================= HANDLERS ================= */

  const handleAddToCart = (e) => {
    e.stopPropagation();

    console.log("ADD TO CART:", {
      productId: product._id,
      quantity: qty,
    });
    showSuccess("Product added to cart successfully!");
  };

  const handleShowCategory = (e, catName) => {
    e.stopPropagation();
    navigate(`/shop/${slugify(catName)}`);
  };

  const increaseQty = (e) => {
    e.stopPropagation();
    setQty((prev) => (prev < stock ? prev + 1 : prev));
  };

  const decreaseQty = (e) => {
    e.stopPropagation();
    setQty((prev) => (prev > 1 ? prev - 1 : prev));
  };

  return (
    <div
      onClick={() => navigate(`/product/${product._id}`)}
      className="border rounded-xl p-3 md:p-4 bg-white cursor-pointer hover:shadow-lg transition border-gray-400 flex flex-col justify-between"
    >
      <div>
        {/* IMAGE */}
        <img
          src={product.featureImage}
          alt={product.genericName}
          className="w-full object-contain rounded-lg mb-4"
        />

        {/* CATEGORY */}
        <p className="text-xs text-gray-500 mb-1">
          <span
            className="hover:text-dark-green hover:underline"
            onClick={(e) => handleShowCategory(e, product.category?.name)}
          >
            {product.category?.name}
          </span>
          {product.subCategory && ` • ${product.subCategory.name}`}
        </p>

        {/* NAME */}
        <h3 className="text-sm font-semibold mb-2">{product.genericName}</h3>

        {/* PRICE */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-semibold text-gray-900">
            ₹{sellPrice}
          </span>
          <span className="text-xs line-through text-gray-400">₹{mrp}</span>
        </div>

        {/* META */}
        <div className="flex flex-wrap gap-2 text-xs mb-3">
          {product.coursDuration && (
            <span className="px-2 py-1 bg-gray-100 rounded">
              {product.coursDuration}
            </span>
          )}

          {product.isRecommendation && (
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded">
              Recommended
            </span>
          )}
        </div>
      </div>

      {/* ================= ACTIONS ================= */}
      {product.isOutOfStock ? (
        <button
          disabled
          className="w-full py-2 text-sm rounded-lg bg-red-100 text-red-600"
        >
          Out of Stock
        </button>
      ) : (
        <div className="grid gap-2 grid-cols-1 sm:grid-cols-2" onClick={(e) => e.stopPropagation()}>
          {/* QUANTITY CONTROLLER */}
          <div className="flex items-center border rounded-lg overflow-hidden border-gray-400">
            <button
              onClick={decreaseQty}
              disabled={qty === 1}
              className={`px-3 py-2 text-sm grow
                ${
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
              className={`px-3 py-2 text-sm grow 
                ${
                  qty === stock
                    ? "text-gray-400 cursor-not-allowed"
                    : "hover:bg-gray-100 cursor-pointer"
                }`}
            >
              +
            </button>
          </div>

          {/* ADD TO CART */}
          <button
            onClick={handleAddToCart}
            className="flex-1 py-2 text-sm rounded-lg bg-green-600 text-white hover:bg-green-700 transition cursor-pointer"
          >
            Add to Cart
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
