// if a column has only a few different values we show a dropdown,
// otherwise a normal text box
const MAX_OPTIONS = 20;

function Filters({ columns, rows, filters, setFilters }) {
  // dropdown values are matched exactly, text boxes do a "contains" search
  const handleChange = (col, value, exact) => {
    setFilters({ ...filters, [col]: { value, exact } });
  };

  const getOptions = (col) => {
    const values = new Set(rows.map((r) => r[col]).filter((v) => v !== ""));
    if (values.size > MAX_OPTIONS) return null;
    return [...values].sort();
  };

  return (
    <div className="filters">
      <div className="filters-head">
        <h3>Filters</h3>
        <button onClick={() => setFilters({})}>Clear all</button>
      </div>

      <div className="filters-grid">
        {columns.map((col) => {
          const options = getOptions(col);
          return (
            <div key={col} className="filter-item">
              <label>{col}</label>
              {options ? (
                <select
                  value={filters[col]?.value || ""}
                  onChange={(e) => handleChange(col, e.target.value, true)}
                >
                  <option value="">All</option>
                  {options.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  placeholder="Search..."
                  value={filters[col]?.value || ""}
                  onChange={(e) => handleChange(col, e.target.value, false)}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Filters;
