// Frontend/src/pages/EmployeeDashboardPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { logout } from "../services/api";

export default function EmployeeDashboardPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsed = JSON.parse(userData);
      setUser(parsed);
      if (parsed.role !== "employee") navigate("/login");
    } else {
      navigate("/admin/login");
    }

    fetchAllPayments();
  }, [navigate]);

  const fetchAllPayments = async () => {
    try {
      setLoading(true);
      const res = await api.get("/payments/pending/all"); // includes verified and pending
      setPayments(res.data.payments || []);
    } catch (err) {
      console.error("Fetch error:", err);
      showMessage("Failed to load payments", "error");
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 5000);
  };

  // ----------------- Verify payment -----------------
  const handleVerify = async (id) => {
    if (!window.confirm("Verify this payment? Ensure SWIFT code and account details are correct.")) return;

    try {
      await api.patch(`/payments/${id}/verify`);
      showMessage("Payment verified successfully", "success");

      // Update local state to mark as verified
      setPayments((prev) =>
        prev.map((p) => (p._id === id ? { ...p, status: "verified" } : p))
      );
    } catch (err) {
      showMessage(err.response?.data?.error || "Error verifying payment", "error");
    }
  };

  // ----------------- Complete payment -----------------
  const handleComplete = async (id) => {
    if (!window.confirm("Submit this payment to SWIFT? This action cannot be undone.")) return;

    try {
      await api.patch(`/payments/${id}/complete`);
      showMessage("Payment submitted to SWIFT successfully", "success");

      // Remove from local state
      setPayments((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      showMessage(err.response?.data?.error || "Error completing payment", "error");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/admin/login");
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/admin/login");
    }
  };

  if (loading) return <div style={styles.loading}>Loading payments...</div>;

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.headerTitle}>💼 Employee Portal</h1>
          <div style={styles.headerRight}>
            <span style={styles.userName}>👤 {user?.fullName || "Employee"}</span>
            <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
          </div>
        </div>
      </header>

      <main style={styles.main}>
        {/* Message */}
        {message.text && (
          <div style={{
            ...styles.message,
            backgroundColor: message.type === "error" ? "#fee" : "#d4edda",
            color: message.type === "error" ? "#c33" : "#155724",
            border: message.type === "error" ? "1px solid #fcc" : "1px solid #c3e6cb"
          }}>
            {message.text}
          </div>
        )}

        {/* Stats */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>{payments.length}</div>
            <div style={styles.statLabel}>Total Payments</div>
          </div>
          <div style={{ ...styles.statCard, borderLeft: "4px solid #f6ad55" }}>
            <div style={styles.statNumber}>{payments.filter(p => p.status === "pending").length}</div>
            <div style={styles.statLabel}>Pending Verification</div>
          </div>
          <div style={{ ...styles.statCard, borderLeft: "4px solid #4299e1" }}>
            <div style={styles.statNumber}>{payments.filter(p => p.status === "verified").length}</div>
            <div style={styles.statLabel}>Ready to Submit</div>
          </div>
        </div>

        {/* Instructions */}
        <div style={styles.instructionCard}>
          <h3 style={styles.instructionTitle}>📋 Instructions</h3>
          <ul style={styles.instructionList}>
            <li>Review each payment carefully before verification</li>
            <li>Verify that the SWIFT code is correct for the recipient bank</li>
            <li>Check that account information matches the payee details</li>
            <li>Click "Verify" to approve a payment</li>
            <li>Click "Submit to SWIFT" only after verification is complete</li>
          </ul>
        </div>

        {/* Payments Table */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Payment Queue</h2>
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Customer</th>
                  <th style={styles.th}>Amount</th>
                  <th style={styles.th}>Currency</th>
                  <th style={styles.th}>Recipient</th>
                  <th style={styles.th}>SWIFT Code</th>
                  <th style={styles.th}>Provider</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan="9" style={styles.emptyCell}>No pending payments at this time</td>
                  </tr>
                ) : (
                  payments.map((payment) => (
                    <tr key={payment._id} style={styles.tr}>
                      <td style={styles.td}>{new Date(payment.createdAt).toLocaleString()}</td>
                      <td style={styles.td}>{payment.user?.fullName || "N/A"}</td>
                      <td style={styles.td}><strong>{payment.amount.toLocaleString()}</strong></td>
                      <td style={styles.td}>{payment.currency}</td>
                      <td style={styles.td}>{payment.recipientAccount}</td>
                      <td style={styles.td}><code style={styles.code}>{payment.swiftCode}</code></td>
                      <td style={styles.td}>{payment.provider}</td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.statusBadge,
                          backgroundColor:
                            payment.status === "verified" ? "#4299e1" :
                            payment.status === "pending" ? "#f6ad55" : "#68d391"
                        }}>
                          {payment.status}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <div style={styles.actionButtons}>
                          {payment.status === "pending" && (
                            <button onClick={() => handleVerify(payment._id)} style={styles.verifyBtn}>✓ Verify</button>
                          )}
                          {payment.status === "verified" && (
                            <button onClick={() => handleComplete(payment._id)} style={styles.completeBtn}>→ Submit to SWIFT</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

// Your original styles can remain the same
//const styles = { /* ... keep your original styles ... */ };


const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f7fafc"
  },
  loading: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    fontSize: "18px",
    color: "#718096"
  },
  header: {
    backgroundColor: "white",
    borderBottom: "1px solid #e2e8f0",
    padding: "16px 32px"
  },
  headerContent: {
    maxWidth: "1400px",
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  headerTitle: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#1a202c",
    margin: 0
  },
  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: "16px"
  },
  userName: {
    fontSize: "14px",
    color: "#4a5568",
    fontWeight: "500"
  },
  logoutBtn: {
    padding: "8px 16px",
    backgroundColor: "#e53e3e",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500"
  },
  main: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "32px"
  },
  message: {
    padding: "12px 20px",
    borderRadius: "8px",
    marginBottom: "24px",
    fontSize: "14px",
    fontWeight: "500"
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    marginBottom: "24px"
  },
  statCard: {
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "24px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    borderLeft: "4px solid #3182ce"
  },
  statNumber: {
    fontSize: "36px",
    fontWeight: "700",
    color: "#1a202c",
    marginBottom: "4px"
  },
  statLabel: {
    fontSize: "14px",
    color: "#718096",
    fontWeight: "500"
  },
  instructionCard: {
    backgroundColor: "#edf2f7",
    borderRadius: "8px",
    padding: "24px",
    marginBottom: "24px",
    borderLeft: "4px solid #4299e1"
  },
  instructionTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#1a202c",
    margin: "0 0 12px 0"
  },
  instructionList: {
    margin: 0,
    paddingLeft: "20px",
    color: "#4a5568",
    fontSize: "14px",
    lineHeight: "1.8"
  },
  section: {
    marginBottom: "24px"
  },
  sectionTitle: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#1a202c",
    marginBottom: "16px"
  },
  tableContainer: {
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    overflow: "auto"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "1100px"
  },
  th: {
    padding: "16px",
    textAlign: "left",
    backgroundColor: "#f7fafc",
    fontWeight: "600",
    fontSize: "13px",
    color: "#4a5568",
    borderBottom: "2px solid #e2e8f0",
    whiteSpace: "nowrap"
  },
  tr: {
    borderBottom: "1px solid #e2e8f0"
  },
  td: {
    padding: "16px",
    fontSize: "14px",
    color: "#2d3748"
  },
  emptyCell: {
    padding: "40px",
    textAlign: "center",
    color: "#a0aec0",
    fontSize: "16px"
  },
  code: {
    backgroundColor: "#edf2f7",
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: "13px",
    fontFamily: "monospace",
    color: "#2d3748"
  },
  statusBadge: {
    padding: "4px 12px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "600",
    color: "white",
    textTransform: "capitalize",
    display: "inline-block"
  },
  actionButtons: {
    display: "flex",
    gap: "8px"
  },
  verifyBtn: {
    padding: "8px 16px",
    backgroundColor: "#4299e1",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
    whiteSpace: "nowrap"
  },
  completeBtn: {
    padding: "8px 16px",
    backgroundColor: "#48bb78",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
    whiteSpace: "nowrap"
  }
};