import React, { createContext, useContext, useEffect, useState } from "react";
import { getCategoriesByType } from "../api/category";
import {
  getAllProducts,
  getProductById,
  getProductsByCategoryName,
} from "../api/product";

const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  /* ===================== STATES ===================== */
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState(null);

  const [pagination, setPagination] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /* ===================== CATEGORY ===================== */

  const fetchCategoriesByType = async () => {
    try {
      setLoading(true);
      const res = await getCategoriesByType();
      setCategories(res.data.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  /* ===================== PRODUCTS ===================== */

  // /shop?page=1
  const fetchProducts = async ({ page = 1, limit = 10 } = {}) => {
    try {
      setLoading(true);
      const res = await getAllProducts({ page, limit });

      setProducts(res.data.data?.products);
      setPagination(res.data.data?.pagination || {});
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // /shop/:categoryName
  const fetchProductsByCategory = async (
    categoryName,
    { page = 1, limit = 10 } = {},
  ) => {
    try {
      setLoading(true);
      const res = await getProductsByCategoryName(categoryName, {
        page,
        limit,
      });

      setProducts(res.data.data);
      setPagination(res.data.data?.pagination || {});
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // /product/:productId
  const fetchProductById = async (productId) => {
    try {
      setLoading(true);
      const res = await getProductById(productId);
      setProduct(res.data.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  /* ===================== INIT ===================== */

  useEffect(() => {
    fetchCategoriesByType(); // cache categories globally
  }, []);

  /* ===================== CONTEXT VALUE ===================== */

  return (
    <ShopContext.Provider
      value={{
        // data
        products,
        product,
        categories,
        pagination,

        // state
        loading,
        error,

        // actions
        setError,
        fetchProducts,
        fetchProductsByCategory,
        fetchProductById,
        fetchCategoriesByType,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

/* ===================== HOOK ===================== */

export const useShop = () => useContext(ShopContext);
