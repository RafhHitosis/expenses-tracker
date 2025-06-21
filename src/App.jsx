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

  return (
    <div className="container">
      <h1>💰 Expense Tracker</h1>
      {user ? (
        <>
          <div className="card">
            <ExpenseForm userId={user.uid} />
          </div>

          <div className="card">
            <Filter filter={filter} setFilter={setFilter} />
          </div>

          <div className="card">
            <ExpenseList expenses={filteredExpenses} userId={user.uid} />
          </div>

          <div className="total-amount">
            Total: ₱
            {filteredExpenses
              .reduce((acc, item) => acc + item.amount, 0)
              .toFixed(2)}
          </div>

          <ExportCSV expenses={filteredExpenses} />
        </>
      ) : (
        <div className="card">
          <div className="loading">
            <div className="spinner"></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
