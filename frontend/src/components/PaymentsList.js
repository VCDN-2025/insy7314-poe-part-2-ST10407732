import React, { useEffect, useState } from "react";
import { getUserPayments } from "../services/api";

function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await getUserPayments();
        setPayments(res.data?.payments || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load payments.");
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Payment History</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : payments.length === 0 ? (
        <p>No payments found.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Amount</th>
              <th>Currency</th>
              <th>Provider</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p._id}>
                <td>{p.amount}</td>
                <td>{p.currency}</td>
                <td>{p.provider}</td>
                <td>{p.status}</td>
                <td>{new Date(p.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default PaymentsPage;
