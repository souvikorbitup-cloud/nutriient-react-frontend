import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchMyOrdersApi } from "../api/order";
import { showError } from "../Utils/toast";
import { normalizeDecimal } from "../Utils/helpers";
import Preloder from "../sections/Preloder";
import { STATUS_STYLES } from "../variables";

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await fetchMyOrdersApi();
      setOrders(res.data.data);
    } catch {
      showError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Preloder />;

  if (!orders.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 text-center">
        <i className="fa-solid fa-cart-shopping text-5xl text-gray-300" />
        <h2 className="text-xl font-semibold">Your Order is empty</h2>
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

  return (
    <section className="app-container mx-auto px-4 py-20 pt-32 min-h-[70vh]">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            onClick={() => navigate(`/order/${order._id}`)}
            className="border rounded-xl p-4 flex gap-4 cursor-pointer hover:shadow transition"
          >
            {/* Product preview */}
            <img
              src={order.orderDetails[0].product.featureImage}
              alt={order.orderDetails[0].product.genericName}
              className="w-20 h-20 object-cover rounded"
            />

            <div className="flex-1">
              <p className="font-medium">Order #{order._id.slice(-6)}</p>

              <p className="text-sm text-gray-500">
                {new Date(order.createdAt).toLocaleString()}
              </p>

              <p className="text-sm mt-1">
                {order.orderDetails.length} item(s)
              </p>
            </div>

            <div className="text-right">
              <p className="font-semibold">
                ₹{normalizeDecimal(order.totalPrice)}
              </p>

              <span
                className={`text-xs px-2 py-1 rounded-full font-medium ${
                  STATUS_STYLES[order.deliveryState] ||
                  "bg-gray-100 text-gray-700"
                }`}
              >
                {order.deliveryState}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Orders;
