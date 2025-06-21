import React, { useState } from "react";
import { database } from "../firebase";
import { ref, remove } from "firebase/database";

function ExpenseList({ expenses, userId }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);

  const handleDeleteClick = (expense) => {
    setExpenseToDelete(expense);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (expenseToDelete) {
      const expenseRef = ref(
        database,
        `expenses/${userId}/${expenseToDelete.id}`
      );
      remove(expenseRef);
      setShowDeleteModal(false);
      setExpenseToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setExpenseToDelete(null);
  };

  const getCategoryIcon = (category) => {
    switch (category.toLowerCase()) {
      case "food":
        return "🍽️";
      case "bills":
        return "📄";
      case "transport":
        return "🚗";
      default:
        return "📦";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (!expenses || expenses.length === 0) {
    return (
      <div className="empty-state">
        <h3>No expenses yet</h3>
        <p>Start by adding your first expense above!</p>
      </div>
    );
  }

  return (
    <>
      <div className="expense-list">
        {expenses.map((expense) => (
          <div key={expense.id} className="expense-item">
            <div className="expense-header">
              <h3 className="expense-name">
                {getCategoryIcon(expense.category)} {expense.name}
              </h3>
              <span className="expense-amount">
                ₱{expense.amount.toFixed(2)}
              </span>
            </div>

            <div className="expense-meta">
              <span
                className={`expense-category ${expense.category.toLowerCase()}`}
              >
                {expense.category}
              </span>
              <span className="expense-date">{formatDate(expense.date)}</span>
            </div>

            <div className="expense-actions">
              <button
                className="btn btn-danger"
                onClick={() => handleDeleteClick(expense)}
                title="Delete this expense"
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && expenseToDelete && (
        <div className="modal-overlay" onClick={cancelDelete}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-icon">⚠️</span>
              <h3 className="modal-title">Delete Expense</h3>
            </div>

            <div className="modal-message">
              Are you sure you want to delete
              <div className="expense-name-highlight">
                {expenseToDelete.name}
              </div>
              This action cannot be undone and will permanently remove this
              expense from your records.
            </div>

            <div className="modal-actions">
              <button
                className="modal-btn modal-btn-cancel"
                onClick={cancelDelete}
              >
                Cancel
              </button>
              <button
                className="modal-btn modal-btn-danger"
                onClick={confirmDelete}
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ExpenseList;
