import React, { useEffect, useState } from "react";
import {
  fetchAllOrdersApi,
  updateDeliveryStateApi,
  updateOrderByAdminApi,
} from "../../api/order";
import { showError, showSuccess } from "../../Utils/toast";
import AdminLoading from "./AdminLoading";
import { useLocation } from "react-router-dom";
import { getAllProductsName } from "../../api/product";

const DELIVERY_STATES = ["PENDING", "SHIPPED", "DELIVERED", "CANCELLED"];

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [editOrder, setEditOrder] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [saving, setSaving] = useState(false);

  const location = useLocation();

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "SHIPPED":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "DELIVERED":
        return "bg-green-100 text-green-700 border-green-300";
      case "CANCELLED":
        return "bg-red-100 text-red-700 border-red-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const openEditModal = async (order) => {
    try {
      setEditOrder({
        ...order,
        orderDetails: order.orderDetails.map((item) => ({
          product: item.product._id,
          productData: item.product,
          quantity: item.quantity,
          price: item.price,
        })),
      });

      const res = await getAllProductsName();
      setAllProducts(res.data.data || []);
    } catch (err) {
      showError("Failed to load products");
    }
  };

  const handleQuantityChange = (productId, value) => {
    const stock = getProductStock(productId);
    const qty = Math.max(1, Math.min(Number(value), stock));

    setEditOrder((prev) => ({
      ...prev,
      orderDetails: prev.orderDetails.map((item) =>
        item.product === productId ? { ...item, quantity: qty } : item,
      ),
    }));
  };

  const handleAddProduct = (productId) => {
    if (!productId) return;

    const product = allProducts.find((p) => p._id === productId);
    if (!product) return;

    if (product.stock < 1) {
      showError("Product is out of stock");
      return;
    }

    if (editOrder.orderDetails.some((i) => i.product === productId)) {
      showError("Product already exists in order");
      return;
    }

    setEditOrder((prev) => ({
      ...prev,
      orderDetails: [
        ...prev.orderDetails,
        {
          product: product._id,
          productData: product,
          quantity: 1,
          price: product.sellPrice,
        },
      ],
    }));
  };

  const handleRemoveProduct = (productId) => {
    setEditOrder((prev) => ({
      ...prev,
      orderDetails: prev.orderDetails.filter(
        (item) => item.product !== productId,
      ),
    }));
  };

  const handleSaveOrder = async () => {
    try {
      setSaving(true);

      const payload = {
        shippingAddress: editOrder.shippingAddress,
        orderDetails: editOrder.orderDetails.map((item) => ({
          product: item.product,
          quantity: item.quantity,
        })),
      };

      await updateOrderByAdminApi(editOrder._id, payload);

      showSuccess("Order updated successfully");

      setEditOrder(null);
      fetchOrders(page);
    } catch (err) {
      console.log(err);

      showError("Failed to update order");
    } finally {
      setSaving(false);
    }
  };

  /* ================= Fetch Orders ================= */
  const fetchOrders = async (pageNumber = 1) => {
    try {
      setLoading(true);
      const res = await fetchAllOrdersApi({ page: pageNumber, limit });
      setOrders(res.data.data.orders || []);
      setPagination(res.data.data.pagination || null);
      setPage(pageNumber);
    } catch (err) {
      showError("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Use cached products when coming back
    if (location.state?.orders?.length) {
      setOrders(location.state.orders);
      setPagination(location.state.pagination || null);
      setLoading(false);
    } else {
      fetchOrders(1);
    }
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

      showSuccess(`Order status updated to ${newState}`);
    } catch (err) {
      showError("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  /* ================= Helpers ================= */
  const formatPrice = (price) =>
    Number(price?.$numberDecimal || price).toFixed(2);

  const getProductStock = (productId) => {
    const product = allProducts.find((p) => p._id === productId);
    return product?.stock || 0;
  };

  const filteredOrders =
    statusFilter === "ALL"
      ? orders
      : orders.filter((order) => order.deliveryState === statusFilter);

  if (loading) return <AdminLoading />;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6">
      {/* ================= HEADER ================= */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">Orders</h2>
        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-600 capitalize">Filter:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border px-3 py-2 rounded border-gray-200 text-sm"
          >
            <option value="ALL">All</option>
            {DELIVERY_STATES.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>
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
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
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
                    <div className="flex items-center justify-center gap-2">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                          order.deliveryState,
                        )}`}
                      >
                        {order.deliveryState}
                      </span>

                      <select
                        value={order.deliveryState}
                        disabled={updatingId === order._id}
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value)
                        }
                        className="border px-2 py-1 rounded border-gray-200 text-xs"
                      >
                        {DELIVERY_STATES.map((state) => (
                          <option key={state}>{state}</option>
                        ))}
                      </select>
                    </div>
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
                      disabled={order.deliveryState !== "PENDING"}
                      onClick={() => openEditModal(order)}
                      className="bg-blue-700 text-white px-3 py-1 rounded hover:bg-blue-700/90 cursor-pointer disabled:bg-gray-700 disabled:hover:cursor-not-allowed"
                      title="Edit"
                    >
                      <i className="fa-regular fa-pen-to-square"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-6 text-center text-gray-500">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ================= PAGINATION ================= */}
      {pagination?.totalPages > 1 && (
        <div className="mt-8 flex justify-center items-center gap-2 flex-wrap">
          {/* PREV */}
          <button
            disabled={!pagination.hasPrevPage}
            onClick={() => fetchProducts(page - 1)}
            className={`px-3 py-2 rounded-lg border text-sm
              ${
                pagination.hasPrevPage
                  ? "hover:bg-gray-100"
                  : "opacity-50 cursor-not-allowed"
              }`}
          >
            Prev
          </button>

          {/* PAGE NUMBERS */}
          {Array.from({ length: pagination.totalPages }).map((_, i) => {
            const pageNumber = i + 1;
            return (
              <button
                key={pageNumber}
                onClick={() => fetchProducts(pageNumber)}
                className={`px-4 py-2 rounded-lg border text-sm
                  ${
                    page === pageNumber
                      ? "bg-dark-green text-white"
                      : "hover:bg-gray-100"
                  }`}
              >
                {pageNumber}
              </button>
            );
          })}

          {/* NEXT */}
          <button
            disabled={!pagination.hasNextPage}
            onClick={() => fetchProducts(page + 1)}
            className={`px-3 py-2 rounded-lg border text-sm
              ${
                pagination.hasNextPage
                  ? "hover:bg-gray-100"
                  : "opacity-50 cursor-not-allowed"
              }`}
          >
            Next
          </button>
        </div>
      )}

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

      {editOrder && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white w-[900px] max-h-[90vh] overflow-y-auto rounded-lg p-6 relative">
            <button
              onClick={() => setEditOrder(null)}
              className="absolute top-3 right-4 text-red-500 font-bold cursor-pointer"
            >
              ✕
            </button>

            <h3 className="text-xl font-bold mb-6">Edit Order</h3>

            {/* ===== Shipping ===== */}
            <h4 className="font-semibold mb-2">Shipping Address</h4>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <input
                className="border p-2 rounded border-gray-200"
                value={editOrder.shippingAddress.landmark}
                onChange={(e) =>
                  setEditOrder({
                    ...editOrder,
                    shippingAddress: {
                      ...editOrder.shippingAddress,
                      landmark: e.target.value,
                    },
                  })
                }
                placeholder="Landmark"
              />

              <input
                className="border p-2 rounded border-gray-200"
                value={editOrder.shippingAddress.city}
                onChange={(e) =>
                  setEditOrder({
                    ...editOrder,
                    shippingAddress: {
                      ...editOrder.shippingAddress,
                      city: e.target.value,
                    },
                  })
                }
                placeholder="City"
              />

              <input
                className="border p-2 rounded border-gray-200"
                value={editOrder.shippingAddress.state}
                onChange={(e) =>
                  setEditOrder({
                    ...editOrder,
                    shippingAddress: {
                      ...editOrder.shippingAddress,
                      state: e.target.value,
                    },
                  })
                }
                placeholder="State"
              />

              <input
                className="border p-2 rounded border-gray-200"
                value={editOrder.shippingAddress.zipCode}
                onChange={(e) =>
                  setEditOrder({
                    ...editOrder,
                    shippingAddress: {
                      ...editOrder.shippingAddress,
                      zipCode: e.target.value,
                    },
                  })
                }
                placeholder="Zip Code"
              />
            </div>

            {/* ===== Products ===== */}
            <h4 className="font-semibold mb-3">Products</h4>

            {editOrder.orderDetails.map((item) => {
              const stock = getProductStock(item.product);

              return (
                <div
                  key={item.product}
                  className="flex items-center gap-4 border p-3 mb-3 rounded border-gray-200"
                >
                  <img
                    src={item.productData.featureImage}
                    alt=""
                    className="w-14 h-14 object-cover rounded"
                  />

                  <div className="flex-1">
                    <p className="font-medium">
                      {item.productData.genericName}
                    </p>
                    <p className="text-xs text-gray-500">Stock: {stock}</p>
                  </div>

                  <input
                    type="number"
                    min="1"
                    max={stock}
                    value={item.quantity}
                    onChange={(e) =>
                      handleQuantityChange(item.product, e.target.value)
                    }
                    className="border px-2 py-1 w-20 rounded border-gray-200"
                  />

                  <button
                    onClick={() => handleRemoveProduct(item.product)}
                    className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 cursor-pointer"
                  >
                    <i className="fa-regular fa-trash-can"></i>
                  </button>
                </div>
              );
            })}

            {/* ===== Add Product ===== */}
            <div className="mt-4">
              <select
                onChange={(e) => handleAddProduct(e.target.value)}
                className="border px-3 py-2 rounded w-full border-gray-200"
              >
                <option value="">Add New Product</option>
                {allProducts.map((product) => {
                  const price =
                    product.sellPrice?.$numberDecimal || product.sellPrice;

                  return (
                    <option
                      key={product._id}
                      value={product._id}
                      disabled={product.stock === 0}
                    >
                      {product.genericName} - ₹{Number(price).toFixed(2)}
                      (Stock: {product.stock})
                    </option>
                  );
                })}
              </select>
            </div>

            {/* ===== Save Button ===== */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSaveOrder}
                disabled={saving}
                className="bg-dark-green text-white px-6 py-2 rounded hover:bg-dark-green/90 cursor-pointer"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderList;
