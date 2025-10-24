// Frontend/src/pages/admin/ManageTransactions.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllPayments } from "../../services/api";

export default function ManageTransactions() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await getAllPayments();
      setPayments(res.data.payments || []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesFilter = filter === "all" || payment.status === filter;
    const matchesSearch = 
      payment.user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.recipientAccount?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.swiftCode?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: payments.length,
    pending: payments.filter(p => p.status === "pending").length,
    verified: payments.filter(p => p.status === "verified").length,
    completed: payments.filter(p => p.status === "completed").length
  };

  if (loading) {
    return <div style={styles.loading}>Loading transactions...</div>;
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button onClick={() => navigate("/admin/dashboard")} style={styles.backBtn}>
          ← Back to Dashboard
        </button>
        <h1 style={styles.title}>Transaction Management</h1>
        <button onClick={fetchPayments} style={styles.refreshBtn}>
          🔄 Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{stats.total}</div>
          <div style={styles.statLabel}>Total Transactions</div>
        </div>
        <div style={{...styles.statCard, borderLeft: "4px solid #f6ad55"}}>
          <div style={styles.statNumber}>{stats.pending}</div>
          <div style={styles.statLabel}>Pending</div>
        </div>
        <div style={{...styles.statCard, borderLeft: "4px solid #4299e1"}}>
          <div style={styles.statNumber}>{stats.verified}</div>
          <div style={styles.statLabel}>Verified</div>
        </div>
        <div style={{...styles.statCard, borderLeft: "4px solid #48bb78"}}>
          <div style={styles.statNumber}>{stats.completed}</div>
          <div style={styles.statLabel}>Completed</div>
        </div>
      </div>

      {/* Filters */}
      <div style={styles.filterSection}>
        <input
          type="text"
          placeholder="Search by name, account, or SWIFT code..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={styles.filterSelect}
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="verified">Verified</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Transactions Table */}
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Customer</th>
              <th style={styles.th}>Amount</th>
              <th style={styles.th}>Currency</th>
              <th style={styles.th}>Recipient Account</th>
              <th style={styles.th}>SWIFT Code</th>
              <th style={styles.th}>Provider</th>
              <th style={styles.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.length === 0 ? (
              <tr>
                <td colSpan="8" style={styles.emptyCell}>
                  {searchTerm || filter !== "all" 
                    ? "No transactions match your filters" 
                    : "No transactions found"}
                </td>
              </tr>
            ) : (
              filteredPayments.map((payment) => (
                <tr key={payment._id} style={styles.tr}>
                  <td style={styles.td}>
                    {new Date(payment.createdAt).toLocaleDateString()}
                  </td>
                  <td style={styles.td}>
                    {payment.user?.fullName || "N/A"}
                  </td>
                  <td style={styles.td}>
                    {payment.amount.toLocaleString()}
                  </td>
                  <td style={styles.td}>{payment.currency}</td>
                  <td style={styles.td}>{payment.recipientAccount}</td>
                  <td style={styles.td}>{payment.swiftCode}</td>
                  <td style={styles.td}>{payment.provider}</td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.statusBadge,
                      backgroundColor: 
                        payment.status === "completed" ? "#48bb78" :
                        payment.status === "verified" ? "#4299e1" :
                        "#f6ad55"
                    }}>
                      {payment.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f7fafc",
    padding: "32px"
  },
  loading: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    fontSize: "18px"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px"
  },
  backBtn: {
    padding: "10px 20px",
    backgroundColor: "#718096",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px"
  },
  title: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#1a202c",
    margin: 0
  },
  refreshBtn: {
    padding: "10px 20px",
    backgroundColor: "#3182ce",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px"
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
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
    fontSize: "32px",
    fontWeight: "700",
    color: "#1a202c",
    marginBottom: "4px"
  },
  statLabel: {
    fontSize: "14px",
    color: "#718096",
    fontWeight: "500"
  },
  filterSection: {
    display: "flex",
    gap: "16px",
    marginBottom: "24px"
  },
  searchInput: {
    flex: 1,
    padding: "12px 16px",
    borderRadius: "6px",
    border: "1px solid #e2e8f0",
    fontSize: "14px",
    outline: "none"
  },
  filterSelect: {
    padding: "12px 16px",
    borderRadius: "6px",
    border: "1px solid #e2e8f0",
    fontSize: "14px",
    outline: "none",
    cursor: "pointer",
    minWidth: "150px"
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
    minWidth: "900px"
  },
  th: {
    padding: "16px",
    textAlign: "left",
    backgroundColor: "#f7fafc",
    fontWeight: "600",
    fontSize: "14px",
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
  statusBadge: {
    padding: "4px 12px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "600",
    color: "white",
    textTransform: "capitalize",
    display: "inline-block"
  }
};