/* ---------- Helpers ---------- */
export const normalizeDecimal = (value) => {
  if (!value) return "";
  if (typeof value === "object" && value.$numberDecimal) {
    return value.$numberDecimal;
  }
  return value.toString();
};
