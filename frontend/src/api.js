import axios from "axios";

const api = axios.create({ baseURL: "/api" });

export const uploadCsv = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return api.post("/uploads", formData);
};

export const getUploads = () => api.get("/uploads");
export const getUpload = (id) => api.get(`/uploads/${id}`);
export const deleteUpload = (id) => api.delete(`/uploads/${id}`);
