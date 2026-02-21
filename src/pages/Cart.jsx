import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { normalizeDecimal } from "../Utils/helpers";
import Preloder from "../sections/Preloder";

const Cart = () => {
  const { items, updateQuantity, removeItem, loading } = useCart();
  const navigate = useNavigate();

  /* ================= CALCULATIONS ================= */

  const totals = items.reduce(
    (acc, i) => {
      const stock = i.product?.stock ?? 0;
      const isOut = i.product?.isOutOfStock || stock === 0;

      if (isOut) return acc;

      const mrp = normalizeDecimal(i.product?.mrp) || 0;
      const sell = normalizeDecimal(i.product?.sellPrice) || 0;

      acc.totalMrp += mrp * i.quantity;
      acc.subTotal += sell * i.quantity;
      return acc;
    },
    { totalMrp: 0, subTotal: 0 },
  );

  const totalDiscount = totals.totalMrp - totals.subTotal;
  const deliveryCharge = 0;
  const finalPayable = totals.subTotal + deliveryCharge;

  const hasOutOfStockItem = items.some(
    (i) => i.product?.isOutOfStock || i.product?.stock === 0,
  );

  if (loading) return <Preloder />;

  /* ================= EMPTY CART ================= */

  if (!items.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 text-center">
        <i className="fa-solid fa-cart-shopping text-5xl text-gray-300" />
        <h2 className="text-xl font-semibold">Your cart is empty</h2>
        <p className="text-gray-500 text-sm">
          Looks like you haven’t added anything yet
        </p>
        <button
          onClick={() => navigate("/shop")}
          className="mt-2 px-6 py-3 rounded-xl bg-dark-green text-white cursor-pointer hover:bg-dark-green/90 transition"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  /* ================= CART UI ================= */

  return (
    <div className="app-container mx-auto px-4 py-20 pt-32">
      <h1 className="text-2xl font-bold mb-6">My Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ================= LEFT ================= */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const stock = item.product?.stock ?? 0;
            const isOut = item.product?.isOutOfStock || stock === 0;

            const mrp = normalizeDecimal(item.product?.mrp) || 0;
            const sell = normalizeDecimal(item.product?.sellPrice) || 0;

            return (
              <div
                key={item.productId || item.product._id}
                className={`flex gap-4 items-center border p-4 rounded-xl border-gray-300 ${
                  isOut ? "opacity-70 bg-gray-50" : ""
                }`}
              >
                <img
                  src={item.product.featureImage}
                  alt={item.product.genericName}
                  className="w-20 h-20 object-cover rounded"
                />

                <div className="flex-1">
                  <h3 className="font-semibold">{item.product.genericName}</h3>

                  <div className="flex items-center gap-2 text-sm mt-1">
                    <span className="font-semibold">₹{sell}</span>
                    {mrp > sell && (
                      <span className="line-through text-gray-400">₹{mrp}</span>
                    )}
                  </div>

                  {isOut && (
                    <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded bg-red-100 text-red-600">
                      Out of Stock
                    </span>
                  )}
                </div>

                {/* QTY */}
                <input
                  type="number"
                  min="1"
                  max={stock}
                  value={item.quantity}
                  disabled={isOut}
                  onChange={(e) =>
                    updateQuantity(
                      item.productId || item.product._id,
                      Number(e.target.value),
                    )
                  }
                  className={`w-16 border rounded px-2 py-1 text-center ${
                    isOut ? "bg-gray-200 cursor-not-allowed" : "border-gray-300"
                  }`}
                />

                {/* REMOVE */}
                <button
                  onClick={() => removeItem(item.productId || item.product._id)}
                  className="text-red-500 hover:text-red-600 cursor-pointer"
                >
                  <i className="fa-solid fa-trash" />
                </button>
              </div>
            );
          })}
        </div>

        {/* ================= RIGHT ================= */}
        <div className="border border-gray-300 rounded-2xl p-6 h-fit sticky top-28">
          <h2 className="text-lg font-semibold mb-4">Price Details</h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Total MRP</span>
              <span>₹{totals.totalMrp}</span>
            </div>

            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>- ₹{totalDiscount}</span>
            </div>

            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{totals.subTotal}</span>
            </div>

            <div className="flex justify-between">
              <span>Delivery</span>
              <span className="text-green-600">FREE</span>
            </div>

            <div className="border-t pt-3 flex justify-between font-semibold text-base">
              <span>Total Payable</span>
              <span>₹{finalPayable}</span>
            </div>
          </div>

          {hasOutOfStockItem && (
            <p className="mt-3 text-xs text-red-600">
              Please remove out-of-stock items to proceed.
            </p>
          )}

          <button
            disabled={hasOutOfStockItem}
            onClick={() => navigate("/checkout")}
            className={`mt-6 w-full py-3 rounded-xl text-white transition ${
              hasOutOfStockItem
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-dark-green hover:bg-dark-green/90 cursor-pointer"
            }`}
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
