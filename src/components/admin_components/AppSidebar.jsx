import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";

// Assume these icons are imported from an icon library
import {
  GridIcon,
  ChevronDownIcon,
  ListIcon,
  TableIcon,
  HorizontaLDots,
  ProductIcon,
  CategoryIcon,
  ChartIcon,
  UsersIcon,
  OrdersIcon,
} from "../../icons";
import { useSidebar } from "../../context/SidebarContext";

const navItems = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    path: "/admin",
  },
  {
    icon: <ProductIcon />,
    name: "Product",
    subItems: [
      { name: "Product List", path: "/admin/products" },
      { name: "Add Product", path: "/admin/add-product" },
    ],
  },
  {
    icon: <OrdersIcon />,
    name: "Orders",
    path: "/admin/orders",
  },
  {
    icon: <CategoryIcon />,
    name: "Category",
    subItems: [
      { name: "Category List", path: "/admin/categories" },
      { name: "Add Category", path: "/admin/add-category" },
    ],
  },
  {
    icon: <ChartIcon />,
    name: "Dite Charts",
    subItems: [
      { name: "Charts List", path: "/admin/charts" },
      { name: "Add New Chart", path: "/admin/add-charts" },
    ],
  },
  {
    icon: <UsersIcon />,
    name: "Customers",
    path: "/admin/customers",
  },
  {
    icon: <ListIcon />,
    name: "Quiz List",
    path: "/admin/quiz-list",
  },
  {
    icon: <ListIcon />,
    name: "Followup List",
    path: "/admin/followup",
  },
  {
    icon: <TableIcon />,
    name: "Client Queries",
    path: "/admin/queries",
  },
];

const AppSidebar = () => {
  const {
    isExpanded,
    isMobileOpen,
    isHovered,
    setIsHovered,
    toggleSidebar,
    toggleMobileSidebar,
  } = useSidebar();
  const location = useLocation();

  const [openSubmenu, setOpenSubmenu] = useState(null);

  const [subMenuHeight, setSubMenuHeight] = useState({});

  const subMenuRefs = useRef({});

  const handleToggle = () => {
    if (window.innerWidth < 450) {
      toggleMobileSidebar();
    }
  };

  // const isActive = (path: string) => location.pathname === path;
  const isActive = useCallback(
    (path) => location.pathname === path,
    [location.pathname],
  );

  useEffect(() => {
    let submenuMatched = false;
    navItems.forEach((nav, index) => {
      if (nav.subItems) {
        nav.subItems.forEach((subItem) => {
          if (isActive(subItem.path)) {
            setOpenSubmenu({
              index,
            });
            submenuMatched = true;
          }
        });
      }
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index, menuType) => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  const renderMenuItems = (items, menuType) => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`relative flex items-center w-full gap-3 px-3 py-2 font-medium rounded-lg text-theme-sm group ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "bg-brand-50 text-brand-500 dark:text-brand-400"
                  : "text-gray-700 hover:bg-gray-100 group-hover:text-gray-700"
              } cursor-pointer ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
              }`}
            >
              <span
                className={`!size-6  ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "mtext-brand-500 dark:text-brand-400"
                    : "text-gray-500 group-hover:text-gray-700"
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "rotate-180 text-brand-500"
                      : ""
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                onClick={handleToggle}
                to={nav.path}
                className={`relative flex items-center w-full gap-3 px-3 py-2 font-medium rounded-lg text-theme-sm group ${
                  isActive(nav.path)
                    ? "bg-brand-50 text-brand-500 "
                    : "text-gray-700 hover:bg-gray-100 group-hover:text-gray-700"
                }`}
              >
                <span
                  className={`!size-6 ${
                    isActive(nav.path)
                      ? "text-brand-500 dark:text-brand-400"
                      : "ext-gray-500 group-hover:text-gray-700"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      onClick={handleToggle}
                      to={subItem.path}
                      className={`relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-theme-sm font-medium ${
                        isActive(subItem.path)
                          ? "bg-brand-50 text-brand-500"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {subItem.name}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "mbg-brand-100"
                                : "bg-brand-50 group-hover:bg-brand-100"
                            } block rounded-full px-2.5 py-0.5 text-xs font-medium uppercase text-brand-500`}
                          >
                            new
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
              ? "w-[290px]"
              : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`pt-4 pb-6 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link to="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <img src="/logo.png" alt="Logo" width={150} height={40} />
            </>
          ) : (
            <img src="/preloader.gif" alt="Logo" width={32} height={32} />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <HorizontaLDots className="size-6" />
                )}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
