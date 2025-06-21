import React, { useState, useEffect } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import Filter from "./components/Filter";
import ExportCSV from "./components/ExportCSV";
import { getExpenses } from "./services/expenseService";
import "./index.css";

function App() {
  const [user, setUser] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    signInAnonymously(auth);
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) setUser(currentUser);
    });
  }, []);

  useEffect(() => {
    if (user) {
      return getExpenses(user.uid, setExpenses);
    }
  }, [user]);

  const filteredExpenses = expenses.filter((exp) => {
    const now = new Date();
    const date = new Date(exp.date);
    if (filter === "monthly") {
      return (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      );
    }
    if (filter === "weekly") {
      const weekAgo = new Date();
      weekAgo.setDate(now.getDate() - 7);
      return date >= weekAgo && date <= now;
    }
    return true;
  });

  const totalAmount = filteredExpenses.reduce(
    (acc, item) => acc + item.amount,
    0
  );

  return (
    <div className="app">
      <div className="container">
        <header className="app-header">
          <div className="header-content">
            <h1 className="app-title">
              <span className="title-icon">💰</span>
              <span className="title-text">Expense Tracker</span>
            </h1>
            <div className="total-display">
              <span className="total-label">Total</span>
              <span className="total-amount">₱{totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </header>

        {user ? (
          <main className="app-main">
            <section className="form-section">
              <ExpenseForm userId={user.uid} />
            </section>

            <section className="filter-section">
              <Filter filter={filter} setFilter={setFilter} />
            </section>

            <section className="list-section">
              <ExpenseList expenses={filteredExpenses} userId={user.uid} />
            </section>

            <section className="export-section">
              <ExportCSV expenses={filteredExpenses} />
            </section>
          </main>
        ) : (
          <div className="loading-container">
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p className="loading-text">Loading your expenses...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
