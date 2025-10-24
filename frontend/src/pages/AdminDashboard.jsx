// Frontend/src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { logout } from "../services/api";

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsed = JSON.parse(userData);
      setUser(parsed);
      setLoadingUser(false);

      // Check if user is admin
      if (parsed.role !== "admin") {
        navigate("/login");
      }
    } else {
      navigate("/admin/login");
    }
  }, [navigate]);

  useEffect(() => {
    if (!user) return;

    const fetchTransactions = async () => {
      try {
        setLoadingTransactions(true);
        const res = await api.get("/payments/all"); // Adjust API endpoint if different
        setTransactions(res.data.payments || []);
      } catch (err) {
        console.error("Failed to fetch transactions:", err);
      } finally {
        setLoadingTransactions(false);
      }
    };

    fetchTransactions();
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/admin/login");
    }
  };

  if (loadingUser) {
    return (
      <div style={styles.loading}>
        Loading...
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.headerTitle}>🏦 Admin Portal</h1>
          <div style={styles.headerRight}>
            <span style={styles.userName}>👤 {user.fullName}</span>
            <button onClick={handleLogout} style={styles.logoutBtn}>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={styles.main}>
        <div style={styles.welcomeCard}>
          <h2 style={styles.welcomeTitle}>Welcome back, {user.fullName}! 👋</h2>
          <p style={styles.welcomeText}>
            Manage employees and monitor transactions from your dashboard.
          </p>
        </div>

        {/* Action Cards */}
        <div style={styles.grid}>
          <div 
            style={styles.card}
            onClick={() => navigate("/admin/employees")}
          >
            <div style={styles.cardIcon}>👥</div>
            <h3 style={styles.cardTitle}>Manage Employees</h3>
            <p style={styles.cardText}>
              Add, edit, or remove employee accounts
            </p>
            <button style={styles.cardButton}>
              Go to Employees →
            </button>
          </div>

          <div 
            style={styles.card}
            onClick={() => navigate("/admin/transactions")}
          >
            <div style={styles.cardIcon}>💳</div>
            <h3 style={styles.cardTitle}>View Transactions</h3>
            <p style={styles.cardText}>
              Monitor all payment transactions
            </p>
            <button style={styles.cardButton}>
              Go to Transactions →
            </button>
          </div>
        </div>

        {/* Transactions Table */}
        <div style={{ marginTop: 32 }}>
          <h2>All Transactions</h2>
          {loadingTransactions ? (
            <div style={{ marginTop: 20 }}>Loading transactions...</div>
          ) : (
            <div style={{ overflowX: "auto" }}>
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
                  </tr>
                </thead>
                <tbody>
                  {transactions.length === 0 ? (
                    <tr>
                      <td colSpan="8" style={{ textAlign: "center", padding: 16 }}>
                        No transactions found
                      </td>
                    </tr>
                  ) : (
                    transactions.map((t) => (
                      <tr key={t._id} style={styles.tr}>
                        <td style={styles.td}>{new Date(t.createdAt).toLocaleString()}</td>
                        <td style={styles.td}>{t.user?.fullName || "N/A"}</td>
                        <td style={styles.td}>{t.amount.toLocaleString()}</td>
                        <td style={styles.td}>{t.currency}</td>
                        <td style={styles.td}>{t.recipientAccount}</td>
                        <td style={styles.td}><code style={styles.code}>{t.swiftCode}</code></td>
                        <td style={styles.td}>{t.provider}</td>
                        <td style={styles.td}>{t.status}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

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
    maxWidth: "1200px",
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
    fontWeight: "500",
    transition: "background-color 0.2s"
  },
  main: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "32px"
  },
  welcomeCard: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "32px",
    marginBottom: "32px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
  },
  welcomeTitle: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#1a202c",
    margin: "0 0 8px 0"
  },
  welcomeText: {
    fontSize: "16px",
    color: "#718096",
    margin: 0
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "24px"
  },
  card: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "32px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    cursor: "pointer",
    transition: "transform 0.2s, box-shadow 0.2s",
    border: "2px solid transparent"
  },
  cardIcon: {
    fontSize: "48px",
    marginBottom: "16px"
  },
  cardTitle: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#1a202c",
    margin: "0 0 8px 0"
  },
  cardText: {
    fontSize: "14px",
    color: "#718096",
    margin: "0 0 20px 0"
  },
  cardButton: {
    padding: "10px 20px",
    backgroundColor: "#3182ce",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    width: "100%"
  }
};