import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col p-4">
      <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
      <nav className="flex flex-col gap-3">
        <Link to="/admin/dashboard" className="hover:text-blue-400">Dashboard</Link>
        <Link to="/admin/employees" className="hover:text-blue-400">Employees</Link>
        <Link to="/admin/transactions" className="hover:text-blue-400">Transactions</Link>
        <Link to="/admin/login" className="hover:text-red-400 mt-auto">Logout</Link>
      </nav>
    </div>
  );
};

export default Sidebar;
