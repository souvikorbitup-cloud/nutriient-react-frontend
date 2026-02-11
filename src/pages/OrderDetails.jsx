import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchOrderByIdApi } from "../api/order";
import { showError } from "../Utils/toast";
import { normalizeDecimal } from "../Utils/helpers";
import Preloder from "../sections/Preloder";
import { STATUS_STYLES } from "../variables";

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    try {
      const res = await fetchOrderByIdApi(orderId);
      setOrder(res.data.data);
    } catch {
      showError("Failed to load order");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/orders");
    }
  };

  if (loading) return <Preloder />;
  if (!order) return null;

  return (
    <section className="app-container mx-auto px-4 py-20 pt-32">
      {/* ===== BACK BUTTON ===== */}
      <button
        onClick={handleBack}
        className="mb-6 text-sm font-medium text-dark-green hover:text-dark-green/90 flex items-center gap-2 cursor-pointer"
      >
        ← Back to Orders
      </button>

      <h1 className="text-2xl font-bold mb-6">Order #{order._id.slice(-6)}</h1>

      {/* ===== STATUS ===== */}
      <div className="mb-6 flex flex-wrap gap-4 text-sm">
        <span
          className={`px-3 py-1 rounded-full font-medium ${
            STATUS_STYLES[order.deliveryState] || "bg-gray-100 text-gray-700"
          }`}
        >
          {order.deliveryState}
        </span>
        <span className="px-3 py-1 rounded-full bg-gray-100">
          {order.paymentMode}
        </span>
        <span className="px-3 py-1 rounded-full bg-gray-100">
          {new Date(order.createdAt).toLocaleString()}
        </span>
      </div>

      {/* ===== PRODUCTS ===== */}
      <div className="border rounded-xl p-6 mb-6">
        <h2 className="font-semibold mb-4">Items</h2>

        <div className="space-y-4">
          {order.orderDetails.map((item) => (
            <div key={item._id} className="flex gap-4 items-center">
              <img
                src={item.product.featureImage}
                alt={item.product.genericName}
                className="w-20 h-20 object-cover rounded"
              />

              <div className="flex-1">
                <p className="font-medium">{item.product.genericName}</p>
                <p className="text-sm text-gray-500">
                  Duration: {item.product.coursDuration}
                </p>
                <p className="text-sm">Qty: {item.quantity}</p>
              </div>

              <p className="font-semibold">
                ₹{normalizeDecimal(item.price) * item.quantity}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ===== SHIPPING ===== */}
      <div className="border rounded-xl p-6 mb-6">
        <h2 className="font-semibold mb-2">Shipping Address</h2>
        <p className="text-sm text-gray-700">
          {order.shippingAddress.landmark},<br />
          {order.shippingAddress.city}, {order.shippingAddress.state} -{" "}
          {order.shippingAddress.zipCode}
        </p>
      </div>

      {/* ===== TOTAL ===== */}
      <div className="border rounded-xl p-6">
        <div className="flex justify-between font-semibold text-lg">
          <span>Total Paid</span>
          <span>₹{normalizeDecimal(order.totalPrice)}</span>
        </div>
      </div>
    </section>
  );
};

export default OrderDetails;
