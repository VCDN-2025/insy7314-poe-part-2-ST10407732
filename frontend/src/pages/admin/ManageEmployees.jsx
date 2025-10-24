// Frontend/src/pages/admin/ManageEmployees.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { listEmployees, createEmployee, updateEmployee, deleteEmployee } from "../../services/api";

export default function ManageEmployees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    accountNumber: "",
    idNumber: "",
    password: "",
    role: "employee"
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await listEmployees();
      setEmployees(res.data.users || []);
    } catch (err) {
      console.error("Fetch error:", err);
      showMessage("Failed to load employees", "error");
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 5000);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingEmployee) {
        // Update
        await updateEmployee(editingEmployee._id, formData);
        showMessage("Employee updated successfully", "success");
      } else {
        // Create
        await createEmployee(formData);
        showMessage("Employee created successfully", "success");
      }

      setShowModal(false);
      setEditingEmployee(null);
      setFormData({
        fullName: "",
        email: "",
        accountNumber: "",
        idNumber: "",
        password: "",
        role: "employee"
      });
      fetchEmployees();
    } catch (err) {
      showMessage(err.response?.data?.error || "Operation failed", "error");
    }
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setFormData({
      fullName: employee.fullName,
      email: employee.email,
      accountNumber: employee.accountNumber,
      idNumber: employee.idNumber,
      password: "", // Don't populate password
      role: employee.role
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to deactivate this employee?")) {
      return;
    }

    try {
      await deleteEmployee(id);
      showMessage("Employee deactivated successfully", "success");
      fetchEmployees();
    } catch (err) {
      showMessage(err.response?.data?.error || "Delete failed", "error");
    }
  };

  const handleAddNew = () => {
    setEditingEmployee(null);
    setFormData({
      fullName: "",
      email: "",
      accountNumber: "",
      idNumber: "",
      password: "",
      role: "employee"
    });
    setShowModal(true);
  };

  if (loading) {
    return <div style={styles.loading}>Loading employees...</div>;
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button onClick={() => navigate("/admin/dashboard")} style={styles.backBtn}>
          ← Back to Dashboard
        </button>
        <h1 style={styles.title}>Manage Employees</h1>
        <button onClick={handleAddNew} style={styles.addBtn}>
          + Add Employee
        </button>
      </div>

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

      {/* Table */}
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Account Number</th>
              <th style={styles.th}>Role</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 ? (
              <tr>
                <td colSpan="6" style={styles.emptyCell}>
                  No employees found
                </td>
              </tr>
            ) : (
              employees.map((emp) => (
                <tr key={emp._id} style={styles.tr}>
                  <td style={styles.td}>{emp.fullName}</td>
                  <td style={styles.td}>{emp.email}</td>
                  <td style={styles.td}>{emp.accountNumber}</td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.badge,
                      backgroundColor: emp.role === "admin" ? "#3182ce" : "#48bb78"
                    }}>
                      {emp.role}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.badge,
                      backgroundColor: emp.isActive ? "#48bb78" : "#e53e3e"
                    }}>
                      {emp.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <button
                      onClick={() => handleEdit(emp)}
                      style={styles.editBtn}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(emp._id)}
                      style={styles.deleteBtn}
                    >
                      Deactivate
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>
              {editingEmployee ? "Edit Employee" : "Add New Employee"}
            </h2>
            <form onSubmit={handleSubmit} style={styles.form}>
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleInputChange}
                style={styles.input}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                style={styles.input}
                required
              />
              <input
                type="text"
                name="accountNumber"
                placeholder="Account Number (6-20 digits)"
                value={formData.accountNumber}
                onChange={handleInputChange}
                style={styles.input}
                required={!editingEmployee}
                disabled={editingEmployee}
              />
              <input
                type="text"
                name="idNumber"
                placeholder="ID Number (13 digits)"
                value={formData.idNumber}
                onChange={handleInputChange}
                style={styles.input}
                required={!editingEmployee}
                disabled={editingEmployee}
              />
              {!editingEmployee && (
                <input
                  type="password"
                  name="password"
                  placeholder="Password (min 8 chars, uppercase, lowercase, number, special char)"
                  value={formData.password}
                  onChange={handleInputChange}
                  style={styles.input}
                  required
                />
              )}
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                style={styles.input}
                required
              >
                <option value="employee">Employee</option>
                <option value="admin">Admin</option>
              </select>
              <div style={styles.modalButtons}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={styles.cancelBtn}
                >
                  Cancel
                </button>
                <button type="submit" style={styles.submitBtn}>
                  {editingEmployee ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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
  addBtn: {
    padding: "10px 20px",
    backgroundColor: "#48bb78",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600"
  },
  message: {
    padding: "12px 20px",
    borderRadius: "8px",
    marginBottom: "20px",
    fontSize: "14px"
  },
  tableContainer: {
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    overflow: "hidden"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse"
  },
  th: {
    padding: "16px",
    textAlign: "left",
    backgroundColor: "#f7fafc",
    fontWeight: "600",
    fontSize: "14px",
    color: "#4a5568",
    borderBottom: "2px solid #e2e8f0"
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
  badge: {
    padding: "4px 12px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "600",
    color: "white",
    textTransform: "capitalize"
  },
  editBtn: {
    padding: "6px 12px",
    backgroundColor: "#3182ce",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "12px",
    marginRight: "8px"
  },
  deleteBtn: {
    padding: "6px 12px",
    backgroundColor: "#e53e3e",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "12px"
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000
  },
  modal: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "32px",
    width: "90%",
    maxWidth: "500px",
    maxHeight: "90vh",
    overflow: "auto"
  },
  modalTitle: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#1a202c",
    marginBottom: "24px"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px"
  },
  input: {
    padding: "12px 16px",
    borderRadius: "6px",
    border: "1px solid #e2e8f0",
    fontSize: "14px",
    outline: "none"
  },
  modalButtons: {
    display: "flex",
    gap: "12px",
    marginTop: "8px"
  },
  cancelBtn: {
    flex: 1,
    padding: "12px",
    backgroundColor: "#e2e8f0",
    color: "#4a5568",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600"
  },
  submitBtn: {
    flex: 1,
    padding: "12px",
    backgroundColor: "#3182ce",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600"
  }
};