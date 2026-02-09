import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useShop } from "../context/ShopContext";
import { slugify } from "../Utils/helpers.js";
import ProductCard from "../components/ProductCard.jsx";
import AdminLoading from "./admin_pages/AdminLoading.jsx";

const Shop = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();

  const {
    categories,
    products,
    loading,
    pagination,
    fetchProducts,
    fetchProductsByCategory,
  } = useShop();

  const [openType, setOpenType] = useState(null);
  const [page, setPage] = useState(1);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  /* ================= FETCH PRODUCTS ================= */
  useEffect(() => {
    if (categoryName) {
      fetchProductsByCategory(categoryName);
    } else {
      fetchProducts({ page, limit: 9 });
    }
  }, [categoryName, page]);

  /* ================= SYNC ACCORDION WITH URL ================= */
  useEffect(() => {
    if (!categories.length) return;

    if (!categoryName) {
      setOpenType(categories[0]?.type);
      return;
    }

    const matchedGroup = categories.find((group) =>
      group.categories.some((cat) => slugify(cat.name) === categoryName),
    );

    if (matchedGroup) setOpenType(matchedGroup.type);
  }, [categoryName, categories]);

  const toggle = (type) => {
    setOpenType((prev) => (prev === type ? null : type));
  };

  /* ================= CATEGORY SIDEBAR CONTENT ================= */
  const CategorySidebar = ({ isMobile = false }) => (
    <>
      {/* SHOW ALL */}
      <button
        onClick={() => {
          navigate("/shop", { replace: true });
          if (isMobile) setShowMobileFilter(false);
        }}
        className={`w-full mb-4 p-4 rounded-lg text-xs font-semibold uppercase transition
          ${
            !categoryName
              ? "bg-dark-green text-white"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
      >
        Show All
      </button>

      {categories.map((group) => {
        const isOpen = openType === group.type;

        return (
          <div key={group.type} className="mb-4">
            <button
              onClick={() => toggle(group.type)}
              className="w-full flex justify-between items-center p-4 rounded-lg bg-gray-100 hover:bg-gray-200 text-xs font-semibold uppercase"
            >
              {group.type}
              <i
                className={`fa-solid fa-chevron-down text-[10px] transition-transform ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isOpen && (
              <ul className="mt-2 space-y-2">
                {group.categories.map((cat) => {
                  const slug = slugify(cat.name);
                  const active = slug === categoryName;

                  return (
                    <li
                      key={cat._id}
                      onClick={() => {
                        navigate(`/shop/${slug}`, { replace: true });
                        if (isMobile) setShowMobileFilter(false);
                      }}
                      className={`px-3 py-2 rounded-lg text-sm cursor-pointer transition
                        ${
                          active
                            ? "bg-dark-green text-white font-medium"
                            : "hover:bg-gray-100"
                        }`}
                    >
                      {cat.name}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}
    </>
  );

  return (
    <section className="app-container mx-auto px-4 py-32">
      {/* ================= TITLE ================= */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold">Products</h2>
        <div className="w-12 h-0.5 bg-primary mx-auto mt-2" />
      </div>

      {/* ================= MOBILE FILTER BUTTON ================= */}
      <div className="md:hidden mb-4 flex justify-end">
        <button
          onClick={() => setShowMobileFilter(true)}
          className="px-4 py-2 rounded-lg border text-sm font-medium flex items-center gap-2"
        >
          <i className="fa-solid fa-filter" />
          Filter
        </button>
      </div>

      <div className="flex gap-4 items-start">
        {/* ================= DESKTOP ASIDE ================= */}
        <aside className="hidden md:block sticky top-[80px] w-[260px] shrink-0 border rounded-xl p-4 border-gray-300 h-fit">
          <CategorySidebar />
        </aside>

        {/* ================= RIGHT PRODUCTS ================= */}
        {loading ? (
          <AdminLoading />
        ) : (
          <section className="grow">
            {products.length === 0 ? (
              <p className="text-center text-gray-500">No products found</p>
            ) : (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* ================= PAGINATION ================= */}
                {!categoryName && pagination?.totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-10 flex-wrap">
                    <button
                      disabled={!pagination.hasPrevPage}
                      onClick={() => setPage(pagination.page - 1)}
                      className={`px-3 py-2 rounded-lg border text-sm ${
                        pagination.hasPrevPage
                          ? "hover:bg-gray-100"
                          : "opacity-50 cursor-not-allowed"
                      }`}
                    >
                      Prev
                    </button>

                    {Array.from({ length: pagination.totalPages }).map(
                      (_, i) => {
                        const pageNumber = i + 1;
                        const active = pagination.page === pageNumber;

                        return (
                          <button
                            key={pageNumber}
                            onClick={() => setPage(pageNumber)}
                            className={`px-4 py-2 rounded-lg border text-sm ${
                              active
                                ? "bg-green-600 text-white"
                                : "hover:bg-gray-100"
                            }`}
                          >
                            {pageNumber}
                          </button>
                        );
                      },
                    )}

                    <button
                      disabled={!pagination.hasNextPage}
                      onClick={() => setPage(pagination.page + 1)}
                      className={`px-3 py-2 rounded-lg border text-sm ${
                        pagination.hasNextPage
                          ? "hover:bg-gray-100"
                          : "opacity-50 cursor-not-allowed"
                      }`}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
        )}
      </div>

      {/* ================= MOBILE FILTER POPUP ================= */}
      {showMobileFilter && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowMobileFilter(false)}
          />

          {/* Drawer */}
          <div className="relative w-[85%] max-w-xs bg-white h-full p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Filter</h3>
              <button
                onClick={() => setShowMobileFilter(false)}
                className="text-xl"
              >
                ✕
              </button>
            </div>

            <CategorySidebar isMobile />
          </div>
        </div>
      )}
    </section>
  );
};

export default Shop;
