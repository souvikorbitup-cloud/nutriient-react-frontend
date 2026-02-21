import React, { useEffect, useState } from "react";
import { fetchAllOrdersApi, updateDeliveryStateApi } from "../../api/order";
import { showError, showSuccess } from "../../Utils/toast";
import AdminLoading from "./AdminLoading";

const DELIVERY_STATES = ["PENDING", "SHIPPED", "DELIVERED", "CANCELLED"];

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  /* ================= Fetch Orders ================= */
  const fetchOrders = async () => {
    try {
      const res = await fetchAllOrdersApi();
      setOrders(res.data.data || []);
    } catch (err) {
      showError("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  /* ================= Update Status ================= */
  const handleStatusChange = async (orderId, newState) => {
    try {
      setUpdatingId(orderId);
      await updateDeliveryStateApi(orderId, newState);

      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, deliveryState: newState } : order,
        ),
      );

      showSuccess("Order status updated");
    } catch (err) {
      showError("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  /* ================= Helpers ================= */
  const formatPrice = (price) =>
    Number(price?.$numberDecimal || price).toFixed(2);

  if (loading) return <AdminLoading />;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6">
      {/* ================= HEADER ================= */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">All Orders</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr className="border-b border-gray-200 text-sm text-gray-500 text-center">
              <th className="py-3 px-2 border-x border-gray-200">Order ID</th>
              <th className="py-3 px-2 border-x border-gray-200">User</th>
              <th className="py-3 px-2 border-x border-gray-200">Mobile</th>
              <th className="py-3 px-2 border-x border-gray-200">Total</th>
              <th className="py-3 px-2 border-x border-gray-200">Status</th>
              <th className="py-3 px-2 border-x border-gray-200">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order._id}
                className="border-b border-gray-200 text-sm hover:bg-gray-50"
              >
                <td className="py-3 px-2 border-x border-gray-200 text-center">
                  {order._id}
                </td>

                <td className="py-3 px-2 border-x border-gray-200 text-center">
                  {order.user?.fullName}
                  <br />
                  <span className="text-xs text-gray-500">
                    {order.user?.email}
                  </span>
                </td>

                <td className="py-3 px-2 border-x border-gray-200 text-center">
                  {order.user?.mobile}
                </td>

                <td className="py-3 px-2 border-x border-gray-200 text-center">
                  ₹{formatPrice(order.totalPrice)}
                </td>

                <td className="py-3 px-2 border-x border-gray-200 text-center">
                  <select
                    value={order.deliveryState}
                    disabled={updatingId === order._id}
                    onChange={(e) =>
                      handleStatusChange(order._id, e.target.value)
                    }
                    className="border px-2 py-1 rounded border-gray-200"
                  >
                    {DELIVERY_STATES.map((state) => (
                      <option key={state}>{state}</option>
                    ))}
                  </select>
                </td>

                <td className="py-3 px-2 border-x border-gray-200 text-center flex-center gap-2">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="bg-dark-green text-white px-3 py-1 rounded hover:bg-dark-green/90 cursor-pointer"
                    title="View More"
                  >
                    <i className="fa-solid fa-bars"></i>
                  </button>
                  <button
                    className="bg-blue-700 text-white px-3 py-1 rounded hover:bg-blue-700/90 cursor-pointer"
                    title="Edit"
                  >
                    <i className="fa-regular fa-pen-to-square"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= MODAL ================= */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white w-[800px] max-h-[90vh] overflow-y-auto rounded-lg p-6 relative">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-3 right-4 text-red-500 font-bold cursor-pointer"
            >
              ✕
            </button>

            <h3 className="text-xl font-bold mb-4">Order Details</h3>

            <p>
              <strong>Order ID:</strong> {selectedOrder._id}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(selectedOrder.createdAt).toLocaleString()}
            </p>
            <p>
              <strong>Payment:</strong> {selectedOrder.paymentMode}
            </p>
            <p>
              <strong>Status:</strong> {selectedOrder.deliveryState}
            </p>

            <hr className="my-4 border-gray-200" />

            <h4 className="font-semibold mb-2">Shipping Address</h4>
            <p>
              {selectedOrder.shippingAddress.landmark},<br />
              {selectedOrder.shippingAddress.city},{" "}
              {selectedOrder.shippingAddress.state} -{" "}
              {selectedOrder.shippingAddress.zipCode}
            </p>

            <hr className="my-4 border-gray-200" />

            <h4 className="font-semibold mb-3">Products</h4>

            {selectedOrder.orderDetails.map((item) => (
              <div
                key={item._id}
                className="flex items-center gap-4 border p-3 mb-3 rounded border-gray-200"
              >
                <img
                  src={item.product.featureImage}
                  alt={item.product.genericName}
                  className="w-16 h-16 object-cover rounded"
                />

                <div className="flex-1">
                  <p className="font-medium">{item.product.genericName}</p>
                  <p className="text-sm text-gray-500">
                    Duration: {item.product.coursDuration}
                  </p>
                  <p className="text-sm">Qty: {item.quantity}</p>
                </div>

                <div className="font-semibold">₹{formatPrice(item.price)}</div>
              </div>
            ))}

            <hr className="my-4 border-gray-200" />

            <h3 className="text-right text-lg font-bold">
              Total: ₹{formatPrice(selectedOrder.totalPrice)}
            </h3>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderList;
