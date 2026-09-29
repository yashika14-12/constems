function FileList({ files, activeId, onOpen, onDelete }) {
  return (
    <div className="card">
      <h3>Uploaded Files</h3>
      {files.length === 0 && <p>No files yet</p>}
      <ul className="file-list">
        {files.map((f) => (
          <li key={f._id} className={f._id === activeId ? "active" : ""}>
            <span onClick={() => onOpen(f._id)}>
              {f.fileName} ({f.rowCount} rows)
            </span>
            <button className="small" onClick={() => onDelete(f._id)}>
              x
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FileList;
