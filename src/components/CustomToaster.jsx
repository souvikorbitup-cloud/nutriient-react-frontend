import React from "react";
import { Toaster } from "react-hot-toast";

const CustomToaster = () => {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={10}
      toastOptions={{
        // Default options for all toasts
        duration: 4000,
        style: {
          background: "white",
          color: "#111827",
          fontFamily: "Montserrat, system-ui, -apple-system, 'Segoe UI', Roboto",
          borderRadius: 8,
          boxShadow: "0 8px 22px rgba(0,0,0,0.2)",
          padding: "8px 12px",
          fontSize: "14px",
        },
        // Default types
        success: {
          style: {
            borderLeft: "4px solid #6dbe45",
          },
        },
        error: {
          style: {
            borderLeft: "4px solid #f43f5e",
          },
        },
        loading: {
          style: {
            borderLeft: "4px solid #4b5563",
          },
        },
      }}
    />
  );
};

export default CustomToaster;