import React, { useEffect, useState } from "react";
import { Cart, UserCircleIcon, Order, HealthReport } from "../icons";
import { useNavigate } from "react-router-dom";
import { useQuiz } from "../context/QuizContext";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";
import Preloder from "../sections/Preloder";
import Button2 from "../components/Button2";
import { getProductsByGoal } from "../api/product";
import { showError } from "../Utils/toast";

const HealthRepoat = () => {
  const navigate = useNavigate();
  const { completed, loading, currentGoal } = useQuiz();
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [productLoading, setProductLoading] = useState(false);

  const generateNewQuizSession = () => {
    console.log("New Session Generating...");
  };

  useEffect(() => {
    const fetchProducts = async () => {
      if (!currentGoal) return;

      try {
        setProductLoading(true);
        const res = await getProductsByGoal(currentGoal);
        setProducts(res?.data?.data?.products || []);
      } catch (error) {
        showError("Failed to fetch recommended products");
      } finally {
        setProductLoading(false);
      }
    };

    fetchProducts();
  }, [currentGoal]);

  if (loading || productLoading) return <Preloder />;

  return (
    <div className="app-container mx-auto px-4 py-32">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-6 items-center">
        <div className="text-center sm:text-left">
          <h1 className="text-2xl font-bold text-t-black">My Reports</h1>
          <p className="text-t-black-light capitalize">
            Manage your health information
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl space-y-4">
          {/* Recommended Supplements */}
          {completed && user ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-20 sm:gap-6 mx-auto mt-24">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-2xl p-4 sm:p-6 flex sm:flex-col items-center sm:items-stretch justify-between border border-gray-300 gap-3 sm:gap-0"
                >
                  <div className="flex items-center justify-center">
                    <img
                      src={product.featureImage}
                      alt={product.genericName}
                      className="w-[90px] h-[90px] sm:w-[140px] sm:h-[140px] object-contain scale-175 -translate-y-6 sm:-translate-y-10"
                    />
                  </div>

                  <div className="w-[230px] sm:w-full">
                    <h3 className="text-dark-green font-bold text-xl mb-2 sm:text-center sm:mt-4 capitalize">
                      {product.genericName}
                    </h3>

                    <p className="text-t-black-light sm:mb-4 sm:text-center capitalize">
                      {product?.shortDescription}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-5 sm:p-8 border border-gray-300">
              <h3 className="mb-3 text-t-black capitalize">
                Our quick health quiz helps you understand your health
                condition, identify potential risks, and gain personalized
                insights to support better lifestyle and wellness choices.
              </h3>
              <Button />
            </div>
          )}

          {completed && user && (
            <div className="mt-6 bg-white rounded-2xl p-5 sm:p-8 border border-gray-300">
              <h3 className="mb-3 text-t-black capitalize">
                Based on your results, our recommended supplement supports your
                health needs and helps you achieve better daily wellness
                naturally.
              </h3>
              <Button2 text="Checkout Recommended Plans" url="/recommend" />
            </div>
          )}
        </div>

        {/* Links */}
        <div className="bg-white rounded-2xl border border-gray-300 p-6 space-y-4">
          <h3>Other Links</h3>
          <QuickLink
            title="My Cart"
            Icon={Cart}
            onClick={() => navigate("/cart")}
          />
          <QuickLink
            title="My Orders"
            Icon={Order}
            onClick={() => navigate("/my-orders")}
          />
          <QuickLink
            title="My Profile"
            Icon={UserCircleIcon}
            onClick={() => navigate("/profile")}
          />
          {completed && user && (
            <QuickLink
              title="Take New Quiz"
              Icon={HealthReport}
              onClick={generateNewQuizSession}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default HealthRepoat;

const QuickLink = ({ title, onClick, Icon }) => (
  <button
    onClick={onClick}
    className="w-full py-3 rounded-xl border border-gray-300 text-left px-4 hover:bg-dark-green hover:text-white transition flex gap-2 items-center cursor-pointer"
  >
    <Icon className="size-6" />
    {title}
  </button>
);
