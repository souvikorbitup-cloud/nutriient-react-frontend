import { CART_KEY } from "../variables";


export const getGuestCart = () => {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
};

export const setGuestCart = (items) => {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
};

export const clearGuestCart = () => {
  localStorage.removeItem(CART_KEY);
};
