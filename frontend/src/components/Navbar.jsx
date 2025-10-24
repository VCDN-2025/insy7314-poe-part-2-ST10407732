import React from "react";

const Navbar = ({ title }) => {
  return (
    <div className="bg-white shadow p-4 flex justify-between items-center">
      <h2 className="font-semibold text-lg">{title}</h2>
      <div className="text-gray-600">Admin User</div>
    </div>
  );
};

export default Navbar;
