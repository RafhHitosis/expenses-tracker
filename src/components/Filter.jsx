import React from "react";

function Filter({ filter, setFilter }) {
  const filterOptions = [
    {
      value: "all",
      label: "All Time",
      icon: "📅",
      description: "View all expenses",
    },
    {
      value: "monthly",
      label: "This Month",
      icon: "📆",
      description: "Current month only",
    },
    {
      value: "weekly",
      label: "This Week",
      icon: "📊",
      description: "Last 7 days",
    },
  ];

  return (
    <div className="filter-container">
      <div className="filter-header">
        <h3 className="filter-title">
          <span className="filter-icon">🔍</span>
          Filter Expenses
        </h3>
      </div>

      <div className="filter-buttons">
        {filterOptions.map((option) => (
          <button
            key={option.value}
            className={`filter-btn ${filter === option.value ? "active" : ""}`}
            onClick={() => setFilter(option.value)}
            title={option.description}
          >
            <span className="filter-btn-icon">{option.icon}</span>
            <span className="filter-btn-text">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default Filter;
