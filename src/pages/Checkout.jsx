import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { createOrderApi } from "../api/order";
import { showError, showSuccess } from "../Utils/toast";
import { normalizeDecimal } from "../Utils/helpers";
import { BASIC_DRAFT_KEY, INDIAN_STATES_UT } from "../variables";
import Preloder from "../sections/Preloder";
import { updateUser } from "../api/user-auth";

const Checkout = () => {
  const navigate = useNavigate();
  const { items, clearCart } = useCart();
  const { user, signUp, signIn, refresh } = useAuth();

  const [loading, setLoading] = useState(false);
  const [paymentMode, setPaymentMode] = useState("COD");

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    mobile: "",
    confirmMobile: "",
    altMobile: "",
    landmark: "",
    city: "",
    state: "",
    zipCode: "",
  });

  const [recommendationData, setRecommendationData] = useState(null);
  const [noOfMonths, setNoOfMonths] = useState(1);

  useEffect(() => {
    const stored = sessionStorage.getItem("recommendationCheckout");
    if (stored) {
      const data = JSON.parse(stored);
      switch (data?.plan?.duration) {
        case "One Month Plan":
          setNoOfMonths(1);
          break;
        case "Three Months Subscription":
          setNoOfMonths(3);
          break;
        case "Six Months Subscription":
          setNoOfMonths(6);
          break;
        case "Twelve Months Subscription":
          setNoOfMonths(12);
          break;
      }

      setRecommendationData(data);
    }
  }, []);

  /* ---------------- VALIDATION ---------------- */

  const validateForm = () => {
    if (!form.fullName || form.fullName.trim().length < 3) {
      showError("Full name must be at least 3 characters");
      return false;
    }

    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      showError("Invalid email address");
      return false;
    }

    if (form.altMobile && !/^\d{10}$/.test(form.altMobile)) {
      showError("Enter a valid 10-digit alternate mobile number");
      return false;
    }

    if (!form.mobile || !/^\d{10}$/.test(form.mobile)) {
      showError("Enter a valid 10-digit mobile number");
      return false;
    }

    if (!form.landmark || form.landmark.trim() === "") {
      showError("Landmark is required");
      return false;
    }

    if (!form.city || form.city.trim() === "") {
      showError("City is required");
      return false;
    }

    if (!form.zipCode || !/^\d{6}$/.test(form.zipCode)) {
      showError("Enter a valid 6-digit PIN code");
      return false;
    }

    if (!form.state || !INDIAN_STATES_UT.includes(form.state)) {
      showError("Please select a valid Indian state");
      return false;
    }

    return true;
  };

  /* ================= PREFILL USER DATA ================= */

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        fullName: user.fullName || "",
        email: user.email || "",
        mobile: user.mobile || "",
        altMobile: user.altMobile || "",
      }));
    }
  }, [user]);

  /* ================= PRICE CALCULATIONS ================= */

  const totals = items.reduce(
    (acc, i) => {
      const mrp = normalizeDecimal(i.product?.mrp) || 0;
      const sell = normalizeDecimal(i.product?.sellPrice) || 0;
      const qty = i.quantity;

      acc.totalMrp += mrp * qty;
      acc.subTotal += sell * qty;
      return acc;
    },
    { totalMrp: 0, subTotal: 0 },
  );

  const discount = totals.totalMrp - totals.subTotal;
  const deliveryCharge = 0;
  const finalAmount = totals.subTotal + deliveryCharge;

  /* ================= HANDLERS ================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => {
      const updated = { ...prev, [name]: value };

      // Trigger auto auth when confirmMobile typed
      if (
        name === "confirmMobile" &&
        form.mobile !== value &&
        value.length === 10
      ) {
        showError("Mobile numbers do not match");
      } else if (name === "confirmMobile" && value.length === 10) {
        setTimeout(() => {
          handleAutoAuth(value);
        }, 300);
      }

      return updated;
    });
  };

  const handleAutoAuth = async (confirmMobileValue) => {
    if (user) return;

    if (
      !form.fullName ||
      !form.mobile ||
      !/^\d{10}$/.test(form.mobile) ||
      form.mobile !== confirmMobileValue
    ) {
      return;
    }

    try {
      let didAuth = false;

      try {
        // Try Login
        await signIn({
          mobile: form.mobile,
        });
        didAuth = true;
      } catch (err) {
        if (err?.response?.status === 404) {
          // Register if not exists
          await signUp({
            fullName: form.fullName || "User",
            email: form.email || undefined,
            mobile: form.mobile,
          });
          didAuth = true;
        } else {
          throw err;
        }
      }

      try {
        await updateUser({
          fullName: form.fullName,
          email: form.email || undefined,
          altMobile: form.altMobile || undefined,
        });
        await refresh(); // Refresh user data in context after update
      } catch (error) {
        // ignore
      }

      if (didAuth) {
        localStorage.removeItem(BASIC_DRAFT_KEY);
        localStorage.removeItem("quiz_sid");
      }
    } catch (err) {
      console.error("Auto auth failed", err);
    }
  };

  /* ================= PLACE ORDER ================= */

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    if (!items.length) {
      showError("Cart is empty");
      return;
    }

    try {
      setLoading(true);

      /* ================= CREATE ORDER ================= */
      const payload = {
        paymentMode,
        orderSource: "GENERAL",
        shippingAddress: {
          landmark: form.landmark,
          city: form.city,
          state: form.state,
          zipCode: form.zipCode,
        },
      };

      await createOrderApi(payload);

      clearCart();
      showSuccess("Order placed successfully 🎉");
      navigate("/my-orders");
    } catch (err) {
      showError(err?.response?.data?.message || "Order failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRecommendationPlaceOrder = async () => {
    if (!validateForm()) return;

    console.log("Recommendation Order Placed");
  };

  /* ================= EMPTY CART ================= */

  if (loading) return <Preloder />;

  if (!items.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Your cart is empty</p>
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <section className="app-container mx-auto px-4 py-20 pt-32">
      <h1 className="text-2xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ================= LEFT ================= */}
        <div className="lg:col-span-2 space-y-6">
          {/* SHIPPING DETAILS */}
          <div className="border rounded-xl p-6 space-y-4 border-gray-300">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <span className="text-xl">📦</span>
              Shipping Details
            </h2>

            <Input
              label="Full Name*"
              name="fullName"
              placeholder="Enter your full name"
              value={form.fullName}
              onChange={handleChange}
            />

            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Phone*"
                name="mobile"
                placeholder="Phone number"
                value={form.mobile}
                disabled={!!user}
                onChange={handleChange}
              />

              {!user ? (
                <Input
                  label="Confirm Phone*"
                  name="confirmMobile"
                  placeholder="Re-enter phone number"
                  value={form.confirmMobile}
                  onChange={handleChange}
                />
              ) : (
                <Input
                  label="Alternate Phone"
                  name="altMobile"
                  placeholder="Optional"
                  value={form.altMobile}
                  onChange={handleChange}
                />
              )}
            </div>

            <Input
              label="Landmark*"
              name="landmark"
              placeholder="Near temple, school, etc."
              value={form.landmark}
              onChange={handleChange}
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="City*"
                name="city"
                placeholder="City"
                value={form.city}
                onChange={handleChange}
              />

              <SelectInput
                label="State*"
                name="state"
                value={form.state}
                onChange={handleChange}
                options={["", ...INDIAN_STATES_UT]}
              />

              <Input
                label="Zip Code*"
                name="zipCode"
                placeholder="Postal code"
                value={form.zipCode}
                onChange={handleChange}
              />
            </div>
          </div>

          {recommendationData ? (
            <div className="border rounded-xl p-6 space-y-4 border-gray-300">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-semibold">
                  Chosen Plan:{" "}
                  <span className="text-green-600">
                    {recommendationData.plan.name}
                  </span>
                </h2>
                <p className="text-green-600">
                  {recommendationData.plan.duration}
                </p>
              </div>

              {recommendationData.products.map((product) => (
                <div
                  key={product.productId || product._id}
                  className="flex gap-4 items-center"
                >
                  <img
                    src={product.featureImage}
                    className="w-16 h-16 object-cover rounded"
                  />

                  <div className="flex-1">
                    <p className="font-medium">{product.genericName}</p>
                  </div>
                </div>
              ))}
              <div className="flex gap-4 items-center">
                <img
                  src={recommendationData.chart.image}
                  className="w-16 h-16 object-cover rounded"
                />

                <div className="flex-1">
                  <p className="font-medium">Diet Chart</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="border rounded-xl p-6 space-y-4 border-gray-300">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-semibold">Order Items</h2>
                <button
                  className="text-sm text-green-600 hover:underline cursor-pointer"
                  onClick={() => navigate("/cart")}
                >
                  Edit Cart
                </button>
              </div>

              {items.map((item) => (
                <div
                  key={item.productId || item.product._id}
                  className="flex gap-4 items-center"
                >
                  <img
                    src={item.product.featureImage}
                    className="w-16 h-16 object-cover rounded"
                  />

                  <div className="flex-1">
                    <p className="font-medium">{item.product.genericName}</p>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  <p className="font-semibold">
                    ₹{normalizeDecimal(item.product.sellPrice) * item.quantity}
                  </p>
                </div>
              ))}
            </div>
          )}
          {/* CART ITEMS */}
        </div>

        {/* ================= RIGHT ================= */}
        <div className="border rounded-xl p-6 h-fit sticky top-28 border-gray-300">
          <h2 className="font-semibold mb-4">Price Summary</h2>

          {recommendationData ? (
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Total MRP</span>
                <span>
                  ₹{recommendationData.plan.originalPrice} x {noOfMonths} = ₹
                  {recommendationData.plan.originalPrice * noOfMonths}
                </span>
              </div>

              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>
                  -₹
                  {recommendationData.plan.originalPrice * noOfMonths -
                    recommendationData.plan.price * noOfMonths}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{recommendationData.plan.price * noOfMonths}</span>
              </div>

              <div className="flex justify-between">
                <span>Delivery</span>
                <span className="text-green-600">
                  {deliveryCharge > 0 ? deliveryCharge : "FREE"}
                </span>
              </div>

              <div className="border-t pt-3 flex justify-between font-semibold">
                <span>Total Payable</span>
                <span>
                  ₹{recommendationData.plan.price * noOfMonths + deliveryCharge}
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Total MRP</span>
                <span>₹{totals.totalMrp}</span>
              </div>

              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-₹{discount}</span>
              </div>

              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{totals.subTotal}</span>
              </div>

              <div className="flex justify-between">
                <span>Delivery</span>
                <span className="text-green-600">
                  {deliveryCharge > 0 ? deliveryCharge : "FREE"}
                </span>
              </div>

              <div className="border-t pt-3 flex justify-between font-semibold">
                <span>Total Payable</span>
                <span>₹{finalAmount}</span>
              </div>
            </div>
          )}

          {/* PAYMENT MODE */}
          <div className="mt-6">
            <p className="font-medium mb-2">Payment Mode</p>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked
                onChange={() => setPaymentMode("COD")}
              />
              Cash on Delivery
            </label>
          </div>

          <button
            onClick={
              recommendationData
                ? handleRecommendationPlaceOrder
                : handlePlaceOrder
            }
            disabled={loading}
            className="mt-6 w-full py-3 rounded-xl bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-400 cursor-pointer"
          >
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </div>
      </div>
    </section>
  );
};

const Input = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  disabled = false,
  className = "",
}) => {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full rounded-xl border border-gray-300 px-4 py-2 text-sm
          focus:outline-none focus:ring-2 focus:ring-black focus:border-black
          transition
          ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}
          ${className}`}
      />
    </div>
  );
};

const SelectInput = ({ label, options, ...props }) => (
  <div>
    <label className="block text-sm text-t-black-light mb-1">{label}</label>
    <select
      {...props}
      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:bg-gray-100"
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt || "Select"}
        </option>
      ))}
    </select>
  </div>
);

export default Checkout;
