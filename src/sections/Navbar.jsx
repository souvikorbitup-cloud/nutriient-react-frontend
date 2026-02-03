import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { healthPrePacks, healthSupplements } from "../variables";
import Button from "../components/Button";
import MobileMenu from "../components/MobileMenu";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user } = useAuth();

  const [scrolled, setScrolled] = useState(false);

  const [open, setOpen] = useState(false);

  const location = useLocation();

  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 2;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={
        isHomePage
          ? `navbar z-50 ${scrolled ? "scrolled" : "not-scrolled"} `
          : `fixed z-50 w-full top-0 bg-white text-black ${scrolled ? "shadow-md" : "border-b-1 border-[#EEE]"} `
      }
    >
      <nav className="app-container mx-auto px-4">
        {/* Top bar */}
        <div className="flex h-20 items-center justify-between">
          <div className="flex-center gap-5 md:gap-12 h-full">
            {/* Logo */}
            <NavLink to="/" className="navbar-brand cursor-pointer">
              <img
                src="/logo.png"
                alt="Nutriiient Logo"
                className="mt-[-4px] w-40 md:w-57"
              />
            </NavLink>

            {/* Desktop Navigation */}
            <ul className="hidden lg:flex items-center gap-10 text-sm font-medium text-gray-800 h-full">
              <li className="h-full">
                <NavLink
                  to="/"
                  className="hover:text-primary transition h-full flex justify-center items-center border-b-2 border-transparent hover:border-primary"
                >
                  HOME
                </NavLink>
              </li>
              <li className="h-full flex-center border-b-2 border-transparent hover:border-gprimary hover:text-primary transition relative group cursor-pointer">
                {/* Trigger */}
                <div>
                  <span>SHOP</span>
                  <span className="ml-1 text-xs">▼</span>
                </div>

                {/* Dropdown Menu */}
                <div
                  className="
      absolute left-1/2 top-full mt-1 w-2xl
      -translate-x-1/2 rounded-xl bg-white shadow-xl
      opacity-0 invisible
      group-hover:opacity-100 group-hover:visible
      transition-all duration-300
    "
                >
                  <div className="grid grid-cols-2 gap-8 p-8">
                    {/* Health Supplements */}
                    <div>
                      <h4 className="mb-4 text-sm font-semibold text-gray-900 uppercase text-center">
                        Health Supplements
                      </h4>
                      <ul className="space-y-3 text-sm text-gray-600">
                        {healthSupplements.map((item, ind) => (
                          <li
                            key={ind}
                            className="hover:text-primary cursor-pointer text-center"
                          >
                            <NavLink to={item.path}>{item.name}</NavLink>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Health Pre Packs */}
                    <div>
                      <h4 className="mb-4 text-sm font-semibold text-gray-900 uppercase text-center">
                        Health Pre Packs
                      </h4>
                      <ul className="space-y-3 text-sm text-gray-600">
                        {healthPrePacks.map((item, ind) => (
                          <li
                            key={ind}
                            className="hover:text-primary cursor-pointer text-center"
                          >
                            <NavLink to={item.path}>{item.name}</NavLink>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </li>

              <li className="h-full">
                <NavLink
                  to="/faq"
                  className="hover:text-primary transition h-full flex justify-center items-center border-b-2 border-transparent hover:border-primary"
                >
                  FAQ
                </NavLink>
              </li>
              <li className="h-full">
                <NavLink
                  to="/contact-us"
                  className="hover:text-primary transition h-full flex justify-center items-center border-b-2 border-transparent hover:border-primary"
                >
                  CONTACT
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Desktop Right Actions */}
          <div className="flex items-center gap-3 md:gap-6 h-full">
            <div className="hidden lg:flex gap-3 md:gap-6 h-full">
              {user ? (
                <div className="relative group cursor-pointer flex items-center">
                  <NavLink
                    to="/profile"
                    className="flex items-center gap-2 text-sm font-medium text-gray-800 cursor-pointer hover:text-primary"
                  >
                    {user.fullName}
                    <img src="/icons/user.svg" alt="user" />
                  </NavLink>
                  <div
                    className="
      absolute left-1/2 top-full mt-0.5 w-[250px]
      -translate-x-1/2 rounded-xl bg-white shadow-xl
      opacity-0 invisible
      group-hover:opacity-100 group-hover:visible
      transition-all duration-300
    "
                  >
                    <div className="grid grid-cols-1 p-6">
                      <div>
                        <ul className="space-y-3 text-gray-600">
                          <li className="hover:text-primary cursor-pointer text-center">
                            <NavLink to="/health-reports">My Dashboard</NavLink>
                          </li>
                          <li className="hover:text-primary cursor-pointer text-center">
                            <NavLink to="/my-orders">My Orders</NavLink>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <NavLink
                  to="/login"
                  className="flex items-center gap-2 text-sm font-medium text-gray-800 cursor-pointer"
                >
                  Sign In
                  <img src="/icons/user.svg" alt="user" />
                </NavLink>
              )}

              <div className="relative group cursor-pointer flex items-center">
                <i
                  className={`fa-solid fa-bag-shopping ${!scrolled && isHomePage ? "text-white" : "text-black"} hover:text-primary transition cursor-pointer text-xl`}
                ></i>
                <div
                  className="
      absolute left-1/2 top-full mt-0.5 w-[250px]
      -translate-x-1/2 rounded-xl bg-white shadow-xl
      opacity-0 invisible
      group-hover:opacity-100 group-hover:visible
      transition-all duration-300
    "
                >
                  <div className="grid grid-cols-1 p-6">
                    <div>
                      <ul className="space-y-3 text-gray-600">
                        <li className="hover:text-primary cursor-pointer text-center">
                          <NavLink to={user ? "/recommend" : "/quiz"}>
                            Your Recommendation
                          </NavLink>
                        </li>
                        <li className="hover:text-primary cursor-pointer text-center">
                          <NavLink to="/cart">Your Cart</NavLink>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <Button text="START QUIZ" cText="MY REPORT" />
              </div>
            </div>
            <button
              onClick={() => setOpen(!open)}
              className={`lg:hidden ${scrolled ? "text-black" : "text-green-800"} text-2xl md:text-3xl`}
            >
              {open ? (
                <i className="fa-solid fa-x"></i>
              ) : (
                <i className="fa-solid fa-bars"></i>
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
        </div>

        {/* Mobile Menu */}
        <MobileMenu open={open} setOpen={setOpen} />
      </nav>
    </header>
  );
};

export default Navbar;
