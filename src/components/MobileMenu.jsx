import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import Button from "./Button";
import { useAuth } from "../context/AuthContext";
import { useAdmin } from "../context/AdminContext";
import { useShop } from "../context/ShopContext";
import { slugify } from "../Utils/helpers.js";

export default function MobileMenu({ open, setOpen }) {
  const { user } = useAuth();
  const { admin } = useAdmin();
  const { categories } = useShop();

  /**
   * panel index
   * 0 = main
   * 1 = shop
   * 2 = category items
   * 3 = cart
   */
  const [panel, setPanel] = useState(0);
  const [activeTypeIndex, setActiveTypeIndex] = useState(null);

  // Reset when closed
  useEffect(() => {
    if (!open) {
      setPanel(0);
      setActiveTypeIndex(null);
    }
  }, [open]);

  const handleNavClick = () => {
    setOpen(false);
    setPanel(0);
    setActiveTypeIndex(null);
  };

  const handleBack = () => {
    if (panel === 2) setPanel(1);
    else setPanel(0);
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-50 bg-black/40 transition-opacity duration-300
        ${open ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={() => setOpen(false)}
      />

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 z-50 w-full md:w-80 bg-white shadow-xl
        h-[100dvh] flex flex-col transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-green-600 px-4 py-4 text-white">
          {panel > 0 ? (
            <button
              onClick={handleBack}
              className="flex items-center gap-2 cursor-pointer"
            >
              <i className="fa-solid fa-chevron-left" />
              Back
            </button>
          ) : (
            <span className="text-sm font-semibold">Menu</span>
          )}

          <button onClick={() => setOpen(false)} className="cursor-pointer">
            <i className="fa-solid fa-x" />
          </button>
        </div>

        {/* Panels */}
        <div className="relative flex-1 overflow-hidden">
          <div
            className="flex h-full transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${panel * 100}%)` }}
          >
            {/* ================= MAIN ================= */}
            <div className="w-full shrink-0">
              <nav className="flex flex-col divide-y text-sm font-medium">
                <NavLink
                  to="/"
                  onClick={handleNavClick}
                  className="px-5 py-4 hover:bg-green-500 hover:text-white"
                >
                  Home
                </NavLink>

                <button
                  onClick={() => setPanel(1)}
                  className="flex justify-between px-5 py-4 hover:bg-green-500 hover:text-white"
                >
                  Shop <i className="fa-solid fa-chevron-right" />
                </button>

                <NavLink
                  to="/faq"
                  onClick={handleNavClick}
                  className="px-5 py-4 hover:bg-green-500 hover:text-white"
                >
                  FAQ
                </NavLink>

                <NavLink
                  to="/contact-us"
                  onClick={handleNavClick}
                  className="px-5 py-4 hover:bg-green-500 hover:text-white"
                >
                  Contact
                </NavLink>

                {user || admin ? (
                  <NavLink
                    to={admin?.role ? "/admin/profile" : "/profile"}
                    onClick={handleNavClick}
                    className="px-5 py-4 hover:bg-green-500 hover:text-white"
                  >
                    Profile
                  </NavLink>
                ) : (
                  <NavLink
                    to="/login"
                    onClick={handleNavClick}
                    className="px-5 py-4 hover:bg-green-500 hover:text-white"
                  >
                    Sign In
                  </NavLink>
                )}

                <div className="flex justify-between">
                  <NavLink
                    to="/cart"
                    onClick={handleNavClick}
                    className="px-5 py-4 hover:bg-green-500 hover:text-white grow"
                  >
                    Cart
                  </NavLink>

                  {!admin?.role && (
                    <button
                      onClick={() => setPanel(3)}
                      className="px-5 py-4 bg-green-500 text-white hover:bg-green-600"
                    >
                      <i className="fa-solid fa-chevron-right" />
                    </button>
                  )}
                </div>

                <div className="px-5 py-6">
                  <Button text="START QUIZ" cText="MY REPORT" />
                </div>
              </nav>
            </div>

            {/* ================= SHOP ================= */}
            <div className="w-full shrink-0">
              <div className="flex flex-col divide-y text-sm">
                <span className="px-5 py-4 bg-green-500 text-white">Shop</span>

                {categories.map((group, index) => (
                  <button
                    key={group.type}
                    onClick={() => {
                      setActiveTypeIndex(index);
                      setPanel(2);
                    }}
                    className="flex justify-between px-5 py-4 hover:bg-green-500 hover:text-white"
                  >
                    {group.type}
                    <i className="fa-solid fa-chevron-right" />
                  </button>
                ))}
              </div>
            </div>

            {/* ============ CATEGORY ITEMS ============ */}
            <div className="w-full shrink-0">
              {activeTypeIndex !== null && (
                <div className="flex flex-col divide-y text-sm">
                  <span className="px-5 py-4 bg-green-500 text-white">
                    {categories[activeTypeIndex].type}
                  </span>

                  {categories[activeTypeIndex].categories.map((cat) => (
                    <NavLink
                      key={cat._id}
                      to={`/shop/${slugify(cat.name)}`}
                      onClick={handleNavClick}
                      className="px-5 py-4 hover:bg-green-500 hover:text-white"
                    >
                      {cat.name}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>

            {/* ================= CART ================= */}
            {!admin?.role && (
              <div className="w-full shrink-0">
                <div className="flex flex-col divide-y text-sm">
                  <span className="px-5 py-4 bg-green-500 text-white">
                    Cart
                  </span>

                  <NavLink
                    to={user ? "/recommend" : "/quiz"}
                    onClick={handleNavClick}
                    className="px-5 py-4 hover:bg-green-500 hover:text-white"
                  >
                    Your Recommendation
                  </NavLink>

                  <NavLink
                    to="/cart"
                    onClick={handleNavClick}
                    className="px-5 py-4 hover:bg-green-500 hover:text-white"
                  >
                    Your Cart
                  </NavLink>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
