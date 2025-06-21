import React from "react";

function Filter({ filter, setFilter }) {
  const filterOptions = [
    { value: "all", label: "📅 All Time", icon: "📅" },
    { value: "monthly", label: "📆 This Month", icon: "📆" },
    { value: "weekly", label: "📊 This Week", icon: "📊" },
  ];

  return (
    <div className="filter-container">
      <div className="filter-buttons">
        {filterOptions.map((option) => (
          <button
            key={option.value}
            className={`filter-btn ${filter === option.value ? "active" : ""}`}
            onClick={() => setFilter(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Filter;
