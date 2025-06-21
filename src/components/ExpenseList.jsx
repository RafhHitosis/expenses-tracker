import React, { useState, useMemo } from "react";
import { database } from "../firebase";
import { ref, remove } from "firebase/database";

function ExpenseList({ expenses, userId }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const [collapsedCategories, setCollapsedCategories] = useState(new Set());

  // Group expenses by category
  const groupedExpenses = useMemo(() => {
    const groups = {};
    expenses.forEach((expense) => {
      const category = expense.category || "other";
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(expense);
    });

    // Sort expenses within each category by date (newest first)
    Object.keys(groups).forEach((category) => {
      groups[category].sort((a, b) => new Date(b.date) - new Date(a.date));
    });

    return groups;
  }, [expenses]);

  const handleDeleteClick = (expense) => {
    setExpenseToDelete(expense);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (expenseToDelete) {
      try {
        const expenseRef = ref(
          database,
          `expenses/${userId}/${expenseToDelete.id}`
        );
        await remove(expenseRef);
        setShowDeleteModal(false);
        setExpenseToDelete(null);
      } catch (error) {
        console.error("Error deleting expense:", error);
        alert("Failed to delete expense. Please try again.");
      }
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setExpenseToDelete(null);
  };

  const toggleCategory = (category) => {
    const newCollapsed = new Set(collapsedCategories);
    if (newCollapsed.has(category)) {
      newCollapsed.delete(category);
    } else {
      newCollapsed.add(category);
    }
    setCollapsedCategories(newCollapsed);
  };

  const getCategoryInfo = (category) => {
    const categoryMap = {
      food: { icon: "🍽️", name: "Food & Dining", color: "#10b981" },
      bills: { icon: "📄", name: "Bills & Utilities", color: "#f59e0b" },
      transport: { icon: "🚗", name: "Transportation", color: "#3b82f6" },
      shopping: { icon: "🛍️", name: "Shopping", color: "#ec4899" },
      entertainment: { icon: "🎬", name: "Entertainment", color: "#8b5cf6" },
      health: { icon: "🏥", name: "Health & Medical", color: "#ef4444" },
      education: { icon: "📚", name: "Education", color: "#06b6d4" },
      travel: { icon: "✈️", name: "Travel", color: "#84cc16" },
      other: { icon: "📦", name: "Other", color: "#6b7280" },
    };

    return categoryMap[category] || categoryMap.other;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays - 1} days ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  if (!expenses || expenses.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📊</div>
        <h3 className="empty-title">No expenses yet</h3>
        <p className="empty-text">
          Start tracking your expenses by adding your first entry above!
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="expense-list">
        <div className="list-header">
          <h2 className="list-title">
            <span className="list-icon">📋</span>
            Your Expenses
          </h2>
          <span className="expense-count">{expenses.length} items</span>
        </div>

        {Object.entries(groupedExpenses).map(([category, categoryExpenses]) => {
          const categoryInfo = getCategoryInfo(category);
          const isCollapsed = collapsedCategories.has(category);
          const categoryTotal = categoryExpenses.reduce(
            (sum, exp) => sum + exp.amount,
            0
          );

          return (
            <div key={category} className="category-group">
              <div
                className="category-header"
                onClick={() => toggleCategory(category)}
                style={{ "--category-color": categoryInfo.color }}
              >
                <div className="category-info">
                  <span className="category-icon">{categoryInfo.icon}</span>
                  <span className="category-name">{categoryInfo.name}</span>
                  <span className="category-count">
                    ({categoryExpenses.length})
                  </span>
                </div>
                <div className="category-summary">
                  <span className="category-total">
                    {formatCurrency(categoryTotal)}
                  </span>
                  <span
                    className={`collapse-arrow ${
                      isCollapsed ? "collapsed" : ""
                    }`}
                  >
                    ▼
                  </span>
                </div>
              </div>

              <div
                className={`category-items ${isCollapsed ? "collapsed" : ""}`}
              >
                {categoryExpenses.map((expense) => (
                  <div key={expense.id} className="expense-item">
                    <div className="expense-main">
                      <div className="expense-info">
                        <h4 className="expense-name">{expense.name}</h4>
                        <div className="expense-meta">
                          <span className="expense-date">
                            {formatDate(expense.date)}
                          </span>
                        </div>
                      </div>
                      <div className="expense-amount">
                        {formatCurrency(expense.amount)}
                      </div>
                    </div>
                    <div className="expense-actions">
                      <button
                        className="btn-delete"
                        onClick={() => handleDeleteClick(expense)}
                        title="Delete this expense"
                      >
                        <span className="delete-icon">🗑️</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && expenseToDelete && (
        <div className="modal-overlay" onClick={cancelDelete}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-icon">⚠️</div>
              <h3 className="modal-title">Delete Expense</h3>
            </div>

            <div className="modal-body">
              <p className="modal-message">
                Are you sure you want to delete this expense?
              </p>
              <div className="expense-preview">
                <div className="preview-name">{expenseToDelete.name}</div>
                <div className="preview-amount">
                  {formatCurrency(expenseToDelete.amount)}
                </div>
              </div>
              <p className="modal-warning">
                This action cannot be undone and will permanently remove this
                expense from your records.
              </p>
            </div>

            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={cancelDelete}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={confirmDelete}>
                <span className="btn-icon">🗑️</span>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ExpenseList;
