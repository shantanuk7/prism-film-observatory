
import React from 'react';

const QuickStats = ({ totalCount, filteredCount, activeCategory, type = "observations" }) => {
  const itemType = type === "observations" ? "observation" : "analysis";
  const itemTypePlural = type === "observations" ? "observations" : "analyses";
  
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="text-sm text-gray-600 dark:text-slate-400">
        {activeCategory === 'All' ? (
          `Showing ${totalCount} ${totalCount !== 1 ? itemTypePlural : itemType}`
        ) : (
          `Showing ${filteredCount} of ${totalCount} ${totalCount !== 1 ? itemTypePlural : itemType}`
        )}
      </div>
    </div>
  );
};

export default QuickStats;