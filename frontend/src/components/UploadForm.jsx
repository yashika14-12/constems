import { useState } from "react";
import { uploadCsv } from "../api";

function UploadForm({ onUploaded }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file first");
      return;
    }

    setError("");
    setUploading(true);
    try {
      const res = await uploadCsv(file);
      onUploaded(res.data);
      setFile(null);
      e.target.reset();
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed");
    }
    setUploading(false);
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h3>Upload CSV</h3>
      <input
        type="file"
        accept=".csv"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button type="submit" disabled={uploading}>
        {uploading ? "Uploading..." : "Upload"}
      </button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}

export default UploadForm;
