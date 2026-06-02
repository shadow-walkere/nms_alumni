import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

function ManageGallery() {
  const [images, setImages] = useState([]);
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState("All");
  const [filterCategory, setFilterCategory] = useState("All");
  const [preview, setPreview] = useState(null);
  const [title, setTitle] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // ✅ Fetch images
  const fetchImages = async () => {
    try {
      const res = await axios.get(`${SERVER_URL}/api/gallery`);
      setImages(res.data.data || []);
    } catch (err) {
      console.error("Failed to load images:", err);
      toast.error("Failed to load gallery images.");
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  // ✅ Handle file select
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    setFile(selected);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(selected);
  };

  // ✅ Upload
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Please select an image to upload.");

    const formData = new FormData();
    formData.append("image", file);
    if (title) formData.append("title", title);
    if (category) formData.append("category", category);

    try {
      setUploading(true);
      setUploadProgress(0);

      const res = await axios.post(
        `${SERVER_URL}/api/gallery/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percent = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress(percent);
            }
          },
        }
      );

      toast.success("✅ Image uploaded successfully!");
      setImages((prev) => [res.data.data, ...prev]);
      setFile(null);
      setPreview(null);
      setTitle("");
      setCategory("All");
    } catch (err) {
      console.error("Upload failed:", err);
      toast.error(err.response?.data?.message || "Failed to upload image.");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // ✅ Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;
    try {
      await axios.delete(`${SERVER_URL}/api/gallery/${id}`);
      setImages((prev) => prev.filter((img) => img._id !== id));
      toast.success("🗑️ Image deleted!");
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete image.");
    }
  };

  // ✅ Filtered images
  const filteredImages =
    filterCategory === "All"
      ? images
      : images.filter((img) => img.category === filterCategory);

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gradient-to-b from-emerald-50 via-amber-50 to-white min-h-screen text-amber-900 rounded-xl">
      <h1 className="text-3xl font-bold text-center mb-8 text-emerald-700">
        📸 Manage Gallery
      </h1>

      {/* Upload Form */}
      <form
        onSubmit={handleUpload}
        className="space-y-4 bg-white/80 p-6 rounded-2xl shadow-md border border-emerald-200 mb-10"
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block border border-emerald-200 px-3 py-2 rounded-xl w-full focus:ring-2 focus:ring-emerald-400 outline-none"
        />

        <input
          type="text"
          placeholder="Enter image title (optional)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="block border border-emerald-200 px-3 py-2 rounded-xl w-full focus:ring-2 focus:ring-amber-400 outline-none"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="block border border-emerald-200 px-3 py-2 rounded-xl w-full focus:ring-2 focus:ring-emerald-400 outline-none"
        >
          <option value="All">All</option>
          <option value="Weddings">Weddings</option>
          <option value="Food & Drinks">Food & Drinks</option>
          <option value="Accommodation">Accommodation</option>
          <option value="Team Building">Team Building</option>
          <option value="Picnics">Picnics</option>
          <option value="Adventure Playground">Adventure Playground</option>
        </select>

        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="w-full max-h-64 object-cover rounded-xl shadow-md border border-emerald-200"
          />
        )}

        {uploading && (
          <div className="w-full bg-gray-200 rounded-xl overflow-hidden">
            <div
              className="bg-emerald-600 text-white text-sm text-center py-1 transition-all duration-200"
              style={{ width: `${uploadProgress}%` }}
            >
              {uploadProgress}%
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={uploading}
          className="bg-emerald-700 text-white px-5 py-2 rounded-xl hover:bg-emerald-800 transition disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "Upload Image"}
        </button>
      </form>

      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-lg font-semibold text-amber-800">
          Gallery Overview
        </h2>

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="border border-amber-300 rounded-xl px-3 py-2 bg-white focus:ring-2 focus:ring-amber-400 outline-none"
        >
          <option value="All">Show All</option>
          <option value="Weddings">Weddings</option>
          <option value="Food & Drinks">Food & Drinks</option>
          <option value="Accommodation">Accommodation</option>
          <option value="Team Building">Team Building</option>
          <option value="Picnics">Picnics</option>
          <option value="Adventure playground">Adventure Playground</option>
        </select>
      </div>

      {/* Gallery Grid */}
      {filteredImages.length === 0 ? (
        <p className="text-center text-gray-600 italic">No images found.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filteredImages.map((img) => (
            <div
              key={img._id}
              className="relative group overflow-hidden rounded-xl shadow-md border border-emerald-100"
            >
              <img
                src={img.imageUrl}
                alt={img.title || "Gallery"}
                className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
              />

              {img.title && (
                <p className="absolute bottom-1 left-2 text-sm text-white bg-black/50 px-2 py-0.5 rounded">
                  {img.title}
                </p>
              )}

              {img.category && (
                <span className="absolute top-1 left-2 bg-white/80 text-xs text-black px-2 py-0.5 rounded shadow">
                  {img.category}
                </span>
              )}

              <button
                onClick={() => handleDelete(img._id)}
                className="absolute top-2 right-2 bg-red-600 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ManageGallery;
