import React from "react";

function ExportCSV({ expenses }) {
  const exportToCSV = () => {
    if (!expenses || expenses.length === 0) {
      alert("No expenses to export!");
      return;
    }

    const headers = ["Name", "Amount", "Category", "Date"];
    const csvContent = [
      headers.join(","),
      ...expenses.map((expense) =>
        [
          `"${expense.name}"`,
          expense.amount,
          expense.category,
          expense.date,
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
  };

  return (
    <button className="btn btn-primary export-btn" onClick={exportToCSV}>
      📊 Export to CSV
    </button>
  );
}

export default ExportCSV;
