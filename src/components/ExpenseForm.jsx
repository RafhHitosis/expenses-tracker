import React, { useState } from "react";
import { database } from "../firebase";
import { ref, push, set } from "firebase/database";

function ExpenseForm({ userId }) {
  const [expense, setExpense] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");

  const addExpense = () => {
    if (expense && amount && date) {
      const expenseRef = ref(database, `expenses/${userId}`);
      const newRef = push(expenseRef);
      set(newRef, {
        name: expense,
        amount: parseFloat(amount),
        category,
        date,
      });
      setExpense("");
      setAmount("");
      setCategory("Food");
      setDate("");
    }
  };

  return (
    <div className="expense-form">
      <div className="form-group">
        <input
          className="form-input"
          value={expense}
          onChange={(e) => setExpense(e.target.value)}
          placeholder="💡 Expense name"
        />
      </div>

      <div className="form-group">
        <input
          className="form-input"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="💰 Amount"
        />
      </div>

      <div className="form-group">
        <div className="form-select-wrapper">
          <select
            className="form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select a category</option>
            <option value="Food">🍽️ Food</option>
            <option value="Bills">📄 Bills</option>
            <option value="Transport">🚗 Transport</option>
            <option value="Other">📦 Other</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <input
          className="form-input"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <div className="form-group">
        <button className="btn btn-primary" onClick={addExpense}>
          ✨ Add Expense
        </button>
      </div>
    </div>
  );
}

export default ExpenseForm;
