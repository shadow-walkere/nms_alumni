import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [form, setForm] = useState({
    name: "",
    message: "",
    isVerified: false,
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const testimonialsPerPage = 5;
  const [selectedIds, setSelectedIds] = useState([]);

  // ✅ Fetch Testimonials
  const fetchTestimonials = async () => {
    try {
      const res = await axios.get(`${SERVER_URL}/api/testimonials`);
      setTestimonials(res.data);
      setSelectedIds([]);
    } catch (err) {
      console.error("Error fetching testimonials:", err);
      toast.error("Failed to fetch testimonials");
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  // ✅ File Input
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setForm({ ...form, image: file });
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  // ✅ Submit Form (POST or PUT)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("message", form.message);
      formData.append("isVerified", form.isVerified);
      if (form.image) formData.append("image", form.image);

      if (editingId) {
        await axios.put(
          `${SERVER_URL}/api/testimonials/${editingId}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        toast.success("Testimonial updated successfully!");
      } else {
        await axios.post(`${SERVER_URL}/api/testimonials`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Testimonial added successfully!");
      }

      setForm({ name: "", message: "", isVerified: false, image: null });
      setPreview(null);
      setEditingId(null);
      fetchTestimonials();
    } catch (err) {
      console.error("Submit error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to save testimonial");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete Single
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this testimonial?")) return;
    setLoading(true);
    try {
      await axios.delete(`${SERVER_URL}/api/testimonials/${id}`);
      toast.success("Testimonial deleted!");
      fetchTestimonials();
    } catch {
      toast.error("Failed to delete testimonial");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Edit Mode
  const handleEdit = (t) => {
    setForm({
      name: t.name,
      message: t.message,
      isVerified: t.isVerified,
      image: null,
    });
    setPreview(t.image || null);
    setEditingId(t._id);
  };

  // ✅ Bulk Delete
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Delete ${selectedIds.length} testimonials?`)) return;
    setLoading(true);

    try {
      await axios.post(`${SERVER_URL}/api/testimonials/bulk-delete`, {
        ids: selectedIds,
      });
      toast.success("Selected testimonials deleted!");
      setSelectedIds([]);
      fetchTestimonials();
    } catch {
      toast.error("Failed to delete selected testimonials");
    } finally {
      setLoading(false);
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // ✅ Pagination
  const indexOfLast = currentPage * testimonialsPerPage;
  const indexOfFirst = indexOfLast - testimonialsPerPage;
  const currentTestimonials = testimonials.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(testimonials.length / testimonialsPerPage);

  return (
    <div className="p-6 bg-gradient-to-b from-emerald-50 via-amber-50 to-white min-h-screen relative text-amber-900">
      {loading && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-50">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <h2 className="text-3xl font-extrabold mb-6 text-emerald-700 text-center drop-shadow-sm">
         Manage Testimonials
      </h2>

      {/* ✅ Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 mb-8 border border-emerald-200 rounded-2xl p-6 bg-white/80 shadow-md hover:shadow-lg transition-shadow"
      >
        <input
          type="text"
          placeholder="Name"
          className="w-full p-3 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-400 outline-none"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <textarea
          placeholder="Testimonial message..."
          className="w-full p-3 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-amber-400 outline-none min-h-[100px]"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          required
        />
        <div>
          <label className="block font-medium mb-2 text-emerald-700">
            Upload Client Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="border border-emerald-200 p-2 rounded-xl w-full bg-amber-50"
          />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-3 w-24 h-24 object-cover rounded-xl border border-emerald-200 shadow-sm"
            />
          )}
        </div>
        <label className="flex items-center gap-2 text-emerald-700">
          <input
            type="checkbox"
            checked={form.isVerified}
            onChange={(e) => setForm({ ...form, isVerified: e.target.checked })}
          />
          Verified Testimonial?
        </label>
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-xl shadow-md disabled:opacity-50 transition-all"
          >
            {editingId ? "Update Testimonial" : "Add Testimonial"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setForm({
                  name: "",
                  message: "",
                  isVerified: false,
                  image: null,
                });
                setPreview(null);
                setEditingId(null);
              }}
              className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-xl shadow-md transition-all"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* ✅ Bulk Delete */}
      {selectedIds.length > 0 && (
        <div className="mb-6 text-center">
          <button
            onClick={handleBulkDelete}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-xl shadow-md transition-all"
          >
            Delete Selected ({selectedIds.length})
          </button>
        </div>
      )}

      {/* ✅ Testimonials List */}
      <ul className="space-y-6">
        {currentTestimonials.map((t) => (
          <li
            key={t._id}
            className={`border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-all hover:shadow-md ${
              selectedIds.includes(t._id) ? "bg-amber-100" : "bg-white/90"
            }`}
          >
            <div className="flex items-center gap-4">
              <input
                type="checkbox"
                checked={selectedIds.includes(t._id)}
                onChange={() => toggleSelect(t._id)}
              />
              {t.image && (
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-16 h-16 object-cover rounded-xl border border-emerald-200"
                />
              )}
              <div>
                <p className="font-semibold text-emerald-800">{t.name}</p>
                <p className="italic text-sm text-amber-800">"{t.message}"</p>
                <p className="text-sm mt-1">
                  Status:{" "}
                  <span
                    className={`font-bold ${
                      t.isVerified ? "text-emerald-600" : "text-red-500"
                    }`}
                  >
                    {t.isVerified ? "Verified" : "Unverified"}
                  </span>
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => handleEdit(t)}
                className="text-emerald-700 hover:underline font-medium"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(t._id)}
                className="text-red-600 hover:underline font-medium"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* ✅ Pagination */}
      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 disabled:opacity-50 transition-all"
        >
          Previous
        </button>
        <span className="font-semibold text-emerald-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 disabled:opacity-50 transition-all"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default AdminTestimonials;
