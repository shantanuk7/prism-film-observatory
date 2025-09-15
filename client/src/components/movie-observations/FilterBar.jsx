import React, { useState, useRef, useEffect } from 'react';
import { Filter, ChevronDown, X, SortDesc } from 'lucide-react';

const FilterBar = ({ 
  activeCategory, 
  setActiveCategory, 
  sort, 
  setSort, 
  categories,
  type = "observations" // "observations" or "analyses"
}) => {
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const categoryDropdownRef = useRef(null);
  const sortDropdownRef = useRef(null);

  const sortOptions = type === "observations" 
    ? [
        { value: "newest", label: "Newest First" },
        { value: "oldest", label: "Oldest First" },
        { value: "mostLiked", label: "Most Liked" }
      ]
    : [
        { value: "newest", label: "Newest First" },
        { value: "oldest", label: "Oldest First" }
      ];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setShowCategoryDropdown(false);
      }
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
        setShowSortDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        
        {/* Left side - Category Filter (only for observations) */}
        {type === "observations" && (
          <div className="flex items-center gap-3 flex-1 flex-wrap">
            <span className="text-sm font-medium text-gray-700 dark:text-slate-300 whitespace-nowrap">
              Filter by:
            </span>
            
            {/* Category Dropdown */}
            <div className="relative" ref={categoryDropdownRef}>
              <button
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-lg transition-colors min-w-[140px]"
              >
                <Filter size={16} />
                <span className="text-sm truncate">
                  {activeCategory === 'All' ? 'All Categories' : activeCategory}
                </span>
                <ChevronDown size={16} className={`transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {showCategoryDropdown && (
                <div className="absolute top-full mt-2 left-0 w-64 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-lg z-20 max-h-64 overflow-y-auto">
                  <div className="p-2">
                    <button
                      onClick={() => {
                        setActiveCategory('All');
                        setShowCategoryDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        activeCategory === 'All' 
                          ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300' 
                          : 'text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      All Categories
                    </button>
                    {categories.map(category => (
                      <button
                        key={category}
                        onClick={() => {
                          setActiveCategory(category);
                          setShowCategoryDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                          activeCategory === category 
                            ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300' 
                            : 'text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Active Filter Indicator */}
            {activeCategory !== 'All' && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-full text-sm">
                <span className="truncate max-w-32">{activeCategory}</span>
                <button
                  onClick={() => setActiveCategory('All')}
                  className="hover:bg-teal-200 dark:hover:bg-teal-800 rounded-full p-0.5 flex-shrink-0"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Right side - Sort Options */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700 dark:text-slate-300 whitespace-nowrap">
            Sort by:
          </span>
          
          <div className="relative" ref={sortDropdownRef}>
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-lg transition-colors min-w-[130px]"
            >
              <SortDesc size={16} />
              <span className="text-sm">
                {sortOptions.find(opt => opt.value === sort)?.label}
              </span>
              <ChevronDown size={16} className={`transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
            </button>
            
            {showSortDropdown && (
              <div className="absolute top-full mt-2 right-0 w-48 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-lg z-20">
                <div className="p-2">
                  {sortOptions.map(option => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSort(option.value);
                        setShowSortDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        sort === option.value 
                          ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300' 
                          : 'text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;