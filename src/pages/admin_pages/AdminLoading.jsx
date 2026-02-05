import React from "react";

const AdminLoading = () => {
  return (
    <div className="flex h-[80vh] w-full items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <i className="fa-solid fa-spinner fa-spin text-3xl text-gray-600" />
      </div>
    </div>
  );
};

export default AdminLoading;
