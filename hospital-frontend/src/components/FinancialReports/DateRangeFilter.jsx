import React from 'react';

function DateRangeFilter({ startDate, endDate, onStartDateChange, onEndDateChange, onApply }) {
  return (
    <div className="date-range-filter">
      <div className="filter-group">
        <label>শুরুর তারিখ</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
        />
      </div>
      <div className="filter-group">
        <label>শেষ তারিখ</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
        />
      </div>
      <button className="btn btn-primary" onClick={onApply}>
        Apply
      </button>
    </div>
  );
}

export default DateRangeFilter;