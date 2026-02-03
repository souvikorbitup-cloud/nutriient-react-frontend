import toast from "react-hot-toast";

export const showSuccess = (msg) => toast.success(msg);
export const showError = (msg) => toast.error(msg || "Something went wrong");
export const showLoading = (msg) => toast.loading(msg);
export const dismiss = (id) => toast.dismiss(id);

// A helper that shows success message and optionally navigate
export default {
  showSuccess,
  showError,
  showLoading,
  dismiss,
};