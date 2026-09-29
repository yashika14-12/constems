import { useEffect, useState } from "react";
import UploadForm from "./components/UploadForm";
import FileList from "./components/FileList";
import Filters from "./components/Filters";
import DataTable from "./components/DataTable";
import { getUploads, getUpload, deleteUpload } from "./api";

function App() {
  const [files, setFiles] = useState([]);
  const [current, setCurrent] = useState(null);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(false);

  const loadFiles = async () => {
    try {
      const res = await getUploads();
      setFiles(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadFiles();
  }, []);

  const openFile = async (id) => {
    setLoading(true);
    try {
      const res = await getUpload(id);
      setCurrent(res.data);
      setFilters({});
    } catch (err) {
      alert("Could not load file");
    }
    setLoading(false);
  };

  const handleUploaded = (doc) => {
    loadFiles();
    setCurrent(doc);
    setFilters({});
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this file?")) return;
    await deleteUpload(id);
    if (current && current._id === id) setCurrent(null);
    loadFiles();
  };

  // keep only rows that match every filter
  const filteredRows = current
    ? current.rows.filter((row) =>
        Object.entries(filters).every(([col, f]) => {
          if (!f.value) return true;
          const cell = String(row[col] ?? "").toLowerCase();
          const value = f.value.toLowerCase();
          return f.exact ? cell === value : cell.includes(value);
        })
      )
    : [];

  return (
    <div className="container">
      <h1>CSV Viewer</h1>

      <div className="top">
        <UploadForm onUploaded={handleUploaded} />
        <FileList
          files={files}
          activeId={current?._id}
          onOpen={openFile}
          onDelete={handleDelete}
        />
      </div>

      {loading && <p>Loading...</p>}

      {current && !loading && (
        <>
          <h2>
            {current.fileName}{" "}
            <span className="count">
              ({filteredRows.length} of {current.rows.length} rows)
            </span>
          </h2>
          <Filters
            columns={current.columns}
            rows={current.rows}
            filters={filters}
            setFilters={setFilters}
          />
          <DataTable columns={current.columns} rows={filteredRows} />
        </>
      )}
    </div>
  );
}

export default App;
