import { useEffect, useState } from "react";

const PAGE_SIZE = 25;

// numbers are compared as numbers, everything else as text
const compare = (a, b) => {
  if (a === "" && b === "") return 0;
  if (a === "") return 1;
  if (b === "") return -1;

  const x = Number(a);
  const y = Number(b);
  if (!isNaN(x) && !isNaN(y)) return x - y;

  return String(a).localeCompare(String(b));
};

function DataTable({ columns, rows }) {
  const [page, setPage] = useState(1);
  const [sortCol, setSortCol] = useState(null);
  const [sortDir, setSortDir] = useState("asc");

  // go back to first page when filters change
  useEffect(() => {
    setPage(1);
  }, [rows.length]);

  // first click = asc, next clicks switch between asc and desc
  const handleSort = (col) => {
    if (sortCol === col) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortCol(col);
      setSortDir("asc");
    }
    setPage(1);
  };

  if (rows.length === 0) {
    return <p>No rows match the filters.</p>;
  }

  let sortedRows = rows;
  if (sortCol) {
    sortedRows = [...rows].sort((a, b) => {
      const result = compare(a[sortCol] ?? "", b[sortCol] ?? "");
      return sortDir === "asc" ? result : -result;
    });
  }

  const totalPages = Math.ceil(sortedRows.length / PAGE_SIZE);
  const start = (page - 1) * PAGE_SIZE;
  const pageRows = sortedRows.slice(start, start + PAGE_SIZE);

  return (
    <div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col} className="sortable" onClick={() => handleSort(col)}>
                  {col}
                  {sortCol === col && (sortDir === "asc" ? " ▲" : " ▼")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.map((row, i) => (
              <tr key={start + i}>
                {columns.map((col) => (
                  <td key={col}>{row[col]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default DataTable;
