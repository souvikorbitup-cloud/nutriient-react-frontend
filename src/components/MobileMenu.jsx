import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import Button from "./Button";
import { healthPrePacks, healthSupplements } from "../variables";
import { useAuth } from "../context/AuthContext";
import { useAdmin } from "../context/AdminContext";

export default function MobileMenu({ open, setOpen }) {
  const { user } = useAuth();
  const { admin } = useAdmin();
  /**
   * panel index
   * 0 = main
   * 1 = shop
   * 2 = health supplements
   * 3 = health pre packs
   * 4 = cart
   */
  const [panel, setPanel] = useState(0);

  // Reset menu when closed
  useEffect(() => {
    if (!open) {
      setPanel(0);
    }
  }, [open]);

  // Close menu on navigation
  const handleNavClick = () => {
    setOpen(false);
    setPanel(0);
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-50 h-screen bg-black/40 transition-opacity duration-300
          ${open ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={() => setOpen(false)}
      />

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 z-50 w-full md:w-80 bg-white shadow-xl
          h-[100dvh] flex flex-col
          transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-green-600 px-4 py-4 text-white">
          {panel > 0 ? (
            <button
              onClick={() => {
                if (panel === 2 || panel === 3) setPanel(1);
                else if (panel === 1 || panel === 4) setPanel(0);
              }}
              className="flex items-center gap-2"
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

        {/* Sliding Panels */}
        <div className="relative flex-1 overflow-hidden">
          <div
            className="flex h-full w-[500%] transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${panel * 20}%)` }}
          >
            {/* ================= MAIN ================= */}
            <div className="w-1/5">
              <nav className="flex flex-col divide-y text-sm font-medium">
                <NavLink
                  to="/"
                  onClick={handleNavClick}
                  className="px-5 py-4 hover:bg-green-500 hover:text-white transition"
                >
                  Home
                </NavLink>

                <button
                  onClick={() => setPanel(1)}
                  className="flex justify-between px-5 py-4 hover:bg-green-500 hover:text-white transition"
                >
                  Shop <i className="fa-solid fa-chevron-right" />
                </button>

                <NavLink
                  to="/faq"
                  onClick={handleNavClick}
                  className="px-5 py-4 hover:bg-green-500 hover:text-white transition"
                >
                  FAQ
                </NavLink>

                <NavLink
                  to="/contact-us"
                  onClick={handleNavClick}
                  className="px-5 py-4 hover:bg-green-500 hover:text-white transition"
                >
                  Contact
                </NavLink>

                {user || admin ? (
                  <NavLink
                    to={`${admin?.role ? "/admin/profile" : "profile"}`}
                    onClick={handleNavClick}
                    className="px-5 py-4 hover:bg-green-500 hover:text-white transition"
                  >
                    Profile
                  </NavLink>
                ) : (
                  <NavLink
                    to="/login"
                    onClick={handleNavClick}
                    className="px-5 py-4 hover:bg-green-500 hover:text-white transition"
                  >
                    Sign In
                  </NavLink>
                )}

                <div className="flex justify-between">
                  <NavLink
                    to="/cart"
                    onClick={handleNavClick}
                    className="px-5 py-4 hover:bg-green-500 hover:text-white transition grow"
                  >
                    Cart
                  </NavLink>
                  <button
                    onClick={() => setPanel(4)}
                    className="px-5 py-4 bg-green-500 text-white cursor-pointer hover:bg-green-600 transition"
                  >
                    <i className="fa-solid fa-chevron-right" />
                  </button>
                </div>

                <div className="px-5 py-6">
                  <Button text="START QUIZ" cText="MY REPORT" />
                </div>
              </nav>
            </div>

            {/* ================= SHOP ================= */}
            <div className="w-1/5">
              <div className="flex flex-col divide-y text-sm">
                <span className="px-5 py-4 bg-green-500 text-white">Shop</span>

                <button
                  onClick={() => setPanel(2)}
                  className="flex justify-between px-5 py-4 hover:bg-green-500 hover:text-white transition"
                >
                  Health Supplements
                  <i className="fa-solid fa-chevron-right" />
                </button>

                <button
                  onClick={() => setPanel(3)}
                  className="flex justify-between px-5 py-4 hover:bg-green-500 hover:text-white transition"
                >
                  Health Pre Packs
                  <i className="fa-solid fa-chevron-right" />
                </button>
              </div>
            </div>

            {/* ============ HEALTH SUPPLEMENTS ============ */}
            <div className="w-1/5">
              <div className="flex flex-col divide-y text-sm">
                <span className="px-5 py-4 bg-green-500 text-white">
                  Health Supplements
                </span>

                {healthSupplements.map((item, i) => (
                  <NavLink
                    key={i}
                    to={item.path}
                    onClick={handleNavClick}
                    className="px-5 py-4 hover:bg-green-500 hover:text-white transition"
                  >
                    {item.name}
                  </NavLink>
                ))}
              </div>
            </div>

            {/* ============ HEALTH PRE PACKS ============ */}
            <div className="w-1/5">
              <div className="flex flex-col divide-y text-sm">
                <span className="px-5 py-4 bg-green-500 text-white">
                  Health Pre Packs
                </span>

                {healthPrePacks.map((item, i) => (
                  <NavLink
                    key={i}
                    to={item.path}
                    onClick={handleNavClick}
                    className="px-5 py-4 hover:bg-green-500 hover:text-white transition"
                  >
                    {item.name}
                  </NavLink>
                ))}
              </div>
            </div>

            {/* ================= CART ================= */}
            {!admin?.role && (
              <div className="w-1/5">
                <div className="flex flex-col divide-y text-sm">
                  <span className="px-5 py-4 bg-green-500 text-white">
                    Cart
                  </span>

                  <NavLink
                    to={user ? "/recommend" : "quiz"}
                    onClick={handleNavClick}
                    className="px-5 py-4 hover:bg-green-500 hover:text-white transition"
                  >
                    Your Recommendation
                  </NavLink>

                  <NavLink
                    to="/cart"
                    onClick={handleNavClick}
                    className="px-5 py-4 hover:bg-green-500 hover:text-white transition"
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
