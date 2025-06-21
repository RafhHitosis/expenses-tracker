import React, { useState } from "react";

function ExportCSV({ expenses }) {
  const [isExporting, setIsExporting] = useState(false);

  const exportToCSV = async () => {
    if (!expenses || expenses.length === 0) {
      alert("No expenses to export!");
      return;
    }

    setIsExporting(true);

    try {
      // Add a small delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 500));

      const headers = ["Name", "Amount", "Category", "Date", "Created At"];

      // Sort expenses by date (newest first)
      const sortedExpenses = [...expenses].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      const csvContent = [
        headers.join(","),
        ...sortedExpenses.map((expense) =>
          [
            `"${expense.name.replace(/"/g, '""')}"`, // Escape quotes in names
            expense.amount,
            expense.category,
            expense.date,
            expense.createdAt || new Date().toISOString().split("T")[0],
          ].join(",")
        ),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);

      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `expenses-${new Date().toISOString().split("T")[0]}.csv`
      );
      link.style.visibility = "hidden";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the URL object
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export expenses. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const getTotalAmount = () => {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="export-container">
      <div className="export-summary">
        <div className="summary-item">
          <span className="summary-label">Total Expenses</span>
          <span className="summary-value">{expenses.length}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Total Amount</span>
          <span className="summary-value">
            {formatCurrency(getTotalAmount())}
          </span>
        </div>
      </div>

      <button
        className={`btn btn-primary export-btn ${isExporting ? "loading" : ""}`}
        onClick={exportToCSV}
        disabled={isExporting || !expenses.length}
      >
        {isExporting ? (
          <>
            <span className="btn-spinner"></span>
            Exporting...
          </>
        ) : (
          <>
            <span className="btn-icon">📊</span>
            Export to CSV
          </>
        )}
      </button>

      {expenses.length === 0 && (
        <p className="export-note">Add some expenses to enable export</p>
      )}
    </div>
  );
}

export default ExportCSV;
