import React, { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { getUserPayments } from "../services/api";

function DashboardPage() {
  const { user } = useOutletContext();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch payments safely
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await getUserPayments();
        console.log("User payments:", res.data);
        setPayments(res.data?.payments || []); // fallback to empty array
      } catch (err) {
        console.error("Error fetching payments:", err.response?.data || err);
        setError("Failed to load payments.");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      {/* Welcome Card */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          padding: "2rem",
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
          marginBottom: "2rem",
        }}
      >
        <h1 style={{ color: "#2c3e50", marginBottom: "0.5rem", fontSize: "2rem" }}>
          Welcome back, {user?.fullName || "User"}!
        </h1>
        <p style={{ color: "#7f8c8d", fontSize: "1rem" }}>
          Account Number: {user?.accountNumber || "N/A"}
        </p>
      </div>

      {/* Action Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        <Link
          to="/make-payment"
          style={{
            backgroundColor: "white",
            borderRadius: "8px",
            padding: "2rem",
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            textDecoration: "none",
            border: "2px solid transparent",
            transition: "all 0.3s ease",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>💳</div>
          <h3 style={{ color: "#2c3e50", marginBottom: "0.5rem" }}>Make Payment</h3>
          <p style={{ color: "#7f8c8d", fontSize: "0.95rem" }}>
            Send international payments securely
          </p>
        </Link>

        <Link
          to="/payments"
          style={{
            backgroundColor: "white",
            borderRadius: "8px",
            padding: "2rem",
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            textDecoration: "none",
            border: "2px solid transparent",
            transition: "all 0.3s ease",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📊</div>
          <h3 style={{ color: "#2c3e50", marginBottom: "0.5rem" }}>Payment History</h3>
          <p style={{ color: "#7f8c8d", fontSize: "0.95rem" }}>View and track your payments</p>
        </Link>
      </div>

      {/* Quick Stats / Recent Payments */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          padding: "2rem",
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        }}
      >
        <h3 style={{ color: "#2c3e50", marginBottom: "1rem" }}>Recent Payments</h3>

        {loading ? (
          <p>Loading payments...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : payments.length === 0 ? (
          <p>No payments yet.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ borderBottom: "1px solid #ddd", padding: "0.5rem" }}>Amount</th>
                <th style={{ borderBottom: "1px solid #ddd", padding: "0.5rem" }}>Currency</th>
                <th style={{ borderBottom: "1px solid #ddd", padding: "0.5rem" }}>Provider</th>
                <th style={{ borderBottom: "1px solid #ddd", padding: "0.5rem" }}>Status</th>
                <th style={{ borderBottom: "1px solid #ddd", padding: "0.5rem" }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p._id}>
                  <td style={{ padding: "0.5rem" }}>{p.amount}</td>
                  <td style={{ padding: "0.5rem" }}>{p.currency}</td>
                  <td style={{ padding: "0.5rem" }}>{p.provider}</td>
                  <td style={{ padding: "0.5rem" }}>{p.status}</td>
                  <td style={{ padding: "0.5rem" }}>
                    {new Date(p.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;
