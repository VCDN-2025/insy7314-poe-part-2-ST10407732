import React, { useEffect, useState } from "react";
import { getAllPayments, verifyPayment } from "../services/api";
import api from "../services/api";

const EmployeeDashboard = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchPendingPayments();
  }, []);

  const fetchPendingPayments = async () => {
    try {
      const res = await api.get("/payments/pending/all");
      setPayments(res.data.payments || []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id) => {
    try {
      await api.patch(`/payments/${id}/verify`);
      setMessage("Payment verified successfully.");
      fetchPendingPayments();
    } catch (err) {
      setMessage("Error verifying payment.");
    }
  };

  const handleComplete = async (id) => {
    try {
      await api.patch(`/payments/${id}/complete`);
      setMessage("Payment completed successfully.");
      fetchPendingPayments();
    } catch (err) {
      setMessage("Error completing payment.");
    }
  };

  if (loading) return <p>Loading payments...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Employee Dashboard</h2>
      {message && <p>{message}</p>}
      <table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Payee</th>
            <th>Amount</th>
            <th>Currency</th>
            <th>Provider</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {payments.length === 0 ? (
            <tr><td colSpan="6">No pending payments.</td></tr>
          ) : (
            payments.map((p) => (
              <tr key={p._id}>
                <td>{p.user?.fullName || "N/A"}</td>
                <td>{p.amount}</td>
                <td>{p.currency}</td>
                <td>{p.provider}</td>
                <td>{p.status}</td>
                <td>
                  <button onClick={() => handleVerify(p._id)}>Verify</button>
                  <button onClick={() => handleComplete(p._id)}>Complete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeDashboard;
