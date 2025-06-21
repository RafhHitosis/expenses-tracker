import React, { useState } from "react";
import { database } from "../firebase";
import { ref, push, set } from "firebase/database";

function ExpenseForm({ userId }) {
  const [expense, setExpense] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { value: "food", label: "🍽️ Food & Dining", icon: "🍽️" },
    { value: "bills", label: "📄 Bills & Utilities", icon: "📄" },
    { value: "transport", label: "🚗 Transportation", icon: "🚗" },
    { value: "shopping", label: "🛍️ Shopping", icon: "🛍️" },
    { value: "entertainment", label: "🎬 Entertainment", icon: "🎬" },
    { value: "health", label: "🏥 Health & Medical", icon: "🏥" },
    { value: "education", label: "📚 Education", icon: "📚" },
    { value: "travel", label: "✈️ Travel", icon: "✈️" },
    { value: "other", label: "📦 Other", icon: "📦" },
  ];

  const addExpense = async () => {
    if (expense && amount && category && date) {
      setIsSubmitting(true);
      try {
        const expenseRef = ref(database, `expenses/${userId}`);
        const newRef = push(expenseRef);
        await set(newRef, {
          name: expense,
          amount: parseFloat(amount),
          category,
          date,
          createdAt: new Date().toISOString(),
        });

        // Reset form
        setExpense("");
        setAmount("");
        setCategory("");
        setDate("");
      } catch (error) {
        console.error("Error adding expense:", error);
        alert("Failed to add expense. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      alert("Please fill in all fields");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addExpense();
  };

  // Set today's date as default
  React.useEffect(() => {
    if (!date) {
      const today = new Date().toISOString().split("T")[0];
      setDate(today);
    }
  }, [date]);

  return (
    <div className="expense-form">
      <div className="form-header">
        <h2 className="form-title">
          <span className="form-icon">✨</span>
          Add New Expense
        </h2>
        <p className="form-subtitle">Track your spending with ease</p>
      </div>

      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-group">
          <label className="form-label">
            <span className="label-icon">💡</span>
            Expense Name
          </label>
          <input
            className="form-input"
            value={expense}
            onChange={(e) => setExpense(e.target.value)}
            placeholder="e.g., Lunch at restaurant"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            <span className="label-icon">💰</span>
            Amount
          </label>
          <input
            className="form-input amount-input"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            step="0.01"
            min="0"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            <span className="label-icon">📂</span>
            Category
          </label>
          <select
            className="form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">
            <span className="label-icon">📅</span>
            Date
          </label>
          <input
            className="form-input"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className={`btn btn-primary btn-submit ${
              isSubmitting ? "loading" : ""
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="btn-spinner"></span>
                Adding...
              </>
            ) : (
              <>
                <span className="btn-icon">✨</span>
                Add Expense
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ExpenseForm;
