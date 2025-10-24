import React from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";

const AdminDashboard = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar title="Admin Dashboard" />
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Welcome, Admin 👋</h1>
          <div className="grid grid-cols-2 gap-6">
            <Link
              to="/admin/employees"
              className="bg-blue-500 text-white p-6 rounded-xl hover:bg-blue-600 text-center shadow-md"
            >
              Manage Employees
            </Link>
            <Link
              to="/admin/transactions"
              className="bg-green-500 text-white p-6 rounded-xl hover:bg-green-600 text-center shadow-md"
            >
              Manage Transactions
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
