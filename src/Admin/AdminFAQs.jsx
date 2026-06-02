import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Trash2,
  PencilLine,
  PlusCircle,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { toast } from "react-hot-toast";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;
const ITEMS_PER_PAGE = 5;

const AdminFAQs = () => {
  const [faqs, setFaqs] = useState([]);
  const [form, setForm] = useState({
    question: "",
    answer: "",
    isVerified: true,
  });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);

  // ✅ Fetch FAQs
  const fetchFAQs = async () => {
    try {
      const { data } = await axios.get(`${SERVER_URL}/api/faq`);
      setFaqs(data);
    } catch {
      toast.error("Failed to load FAQs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, []);

  // ✅ Handle Add / Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`${SERVER_URL}/api/faq/${editId}`, form);
        toast.success("FAQ updated successfully!");
      } else {
        await axios.post(`${SERVER_URL}/api/faq`, form);
        toast.success("FAQ added successfully!");
      }
      resetForm();
      fetchFAQs();
    } catch {
      toast.error("Error saving FAQ");
    }
  };

  // ✅ Edit Mode
  const handleEdit = (faq) => {
    setForm({
      question: faq.question,
      answer: faq.answer,
      isVerified: faq.isVerified,
    });
    setEditId(faq._id);
  };

  // ✅ Reset
  const resetForm = () => {
    setForm({ question: "", answer: "", isVerified: true });
    setEditId(null);
  };

  // ✅ Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this FAQ?")) return;
    try {
      await axios.delete(`${SERVER_URL}/api/faq/${id}`);
      toast.success("FAQ deleted!");
      fetchFAQs();
    } catch {
      toast.error("Error deleting FAQ");
    }
  };

  // ✅ Bulk Delete
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Delete ${selectedIds.length} selected FAQ(s)?`))
      return;
    try {
      await Promise.all(
        selectedIds.map((id) => axios.delete(`${SERVER_URL}/api/faq/${id}`))
      );
      toast.success("Selected FAQs deleted!");
      fetchFAQs();
      setSelectedIds([]);
    } catch {
      toast.error("Bulk delete failed");
    }
  };

  // ✅ Filter + Search
  const filteredFaqs = faqs.filter((faq) => {
    const matchesQuery = faq.question
      .toLowerCase()
      .includes(query.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "verified" && faq.isVerified) ||
      (filter === "unverified" && !faq.isVerified);
    return matchesQuery && matchesFilter;
  });

  // ✅ Pagination
  const totalPages = Math.ceil(filteredFaqs.length / ITEMS_PER_PAGE);
  const paginatedFaqs = filteredFaqs.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // ✅ Component UI
  return (
    <div className="p-6 bg-gradient-to-b from-emerald-50 via-amber-50 to-white min-h-screen text-amber-900 rounded-xl">
      <h1 className="text-3xl font-bold mb-6 text-emerald-700 text-center">
         Manage FAQs
      </h1>

      {/* ✅ Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white/80 p-6 rounded-2xl shadow-md border border-emerald-200 mb-8"
      >
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-emerald-700">
          <PlusCircle size={20} />
          {editId ? "Edit FAQ" : "Add New FAQ"}
        </h2>

        <input
          type="text"
          name="question"
          value={form.question}
          onChange={(e) => setForm({ ...form, question: e.target.value })}
          placeholder="Question"
          className="w-full border border-emerald-200 rounded-xl px-3 py-2 mb-3 focus:ring-2 focus:ring-emerald-400 outline-none"
          required
        />

        <textarea
          name="answer"
          value={form.answer}
          onChange={(e) => setForm({ ...form, answer: e.target.value })}
          placeholder="Answer"
          rows="4"
          className="w-full border border-emerald-200 rounded-xl px-3 py-2 mb-3 focus:ring-2 focus:ring-amber-400 outline-none"
          required
        />

        <label className="flex items-center gap-2 mb-3 text-emerald-700">
          <input
            type="checkbox"
            checked={form.isVerified}
            onChange={(e) => setForm({ ...form, isVerified: e.target.checked })}
          />
          Verified
        </label>

        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-emerald-600 text-white px-6 py-2 rounded-xl hover:bg-emerald-700 transition-all shadow-md"
          >
            {editId ? "Update FAQ" : "Add FAQ"}
          </button>
          {editId && (
            <button
              type="button"
              onClick={resetForm}
              className="text-sm text-gray-600 underline hover:text-gray-800"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {/* ✅ Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-4 items-center justify-between">
        <input
          type="text"
          placeholder="Search FAQs..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full md:w-1/2 border border-emerald-200 px-3 py-2 rounded-xl focus:ring-2 focus:ring-emerald-400 outline-none"
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-emerald-200 px-3 py-2 rounded-xl focus:ring-2 focus:ring-amber-400 outline-none"
        >
          <option value="all">All</option>
          <option value="verified">Verified</option>
          <option value="unverified">Not Verified</option>
        </select>
      </div>

      {/* ✅ Bulk Delete */}
      {selectedIds.length > 0 && (
        <button
          onClick={handleBulkDelete}
          className="mb-4 bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition-all shadow-md"
        >
          Delete {selectedIds.length} selected
        </button>
      )}

      {/* ✅ FAQ List */}
      {loading ? (
        <div className="flex items-center justify-center h-[50vh]">
          <Loader2 className="animate-spin text-emerald-600 w-10 h-10" />
        </div>
      ) : paginatedFaqs.length === 0 ? (
        <p className="text-center text-gray-600 italic mt-10">No FAQs found.</p>
      ) : (
        <div className="space-y-4">
          {paginatedFaqs.map((faq) => (
            <div
              key={faq._id}
              className={`border p-5 rounded-2xl shadow-sm transition-all hover:shadow-md ${
                selectedIds.includes(faq._id)
                  ? "bg-amber-100 border-amber-300"
                  : "bg-white border-emerald-200"
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(faq._id)}
                      onChange={() => toggleSelect(faq._id)}
                    />
                    <h3 className="font-semibold text-lg text-emerald-800">
                      {faq.question}
                    </h3>
                  </label>
                  <p className="text-amber-900 mt-1">{faq.answer}</p>
                  <p className="text-sm mt-1 flex items-center gap-1">
                    {faq.isVerified ? (
                      <span className="text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 size={14} /> Verified
                      </span>
                    ) : (
                      <span className="text-red-600 flex items-center gap-1">
                        <XCircle size={14} /> Not Verified
                      </span>
                    )}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleEdit(faq)}
                    className="text-emerald-700 hover:text-emerald-900"
                    title="Edit"
                  >
                    <PencilLine size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(faq._id)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ✅ Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="px-3 py-1 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 disabled:opacity-50 transition-all"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm font-medium text-emerald-800">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="px-3 py-1 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 disabled:opacity-50 transition-all"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminFAQs;
