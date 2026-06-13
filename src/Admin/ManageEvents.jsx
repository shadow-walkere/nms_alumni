import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Plus,
  Trash2,
  Edit3,
  Upload,
  X,
  Loader2,
  Newspaper,
  CalendarDays,
  Copy,
  Sparkles,
} from "lucide-react";
import SERVER_URL from "../config";

const TABS = [
  { id: "news", label: "News", icon: <Newspaper size={16} /> },
  { id: "event", label: "Events", icon: <CalendarDays size={16} /> },
];

function ManageEvents() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("news");
  const [searchQuery, setSearchQuery] = useState("");

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const token = localStorage.getItem("adminToken");

  // ============================================
  // FETCH ITEMS
  // ============================================
  const fetchItems = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (activeTab) params.append("type", activeTab);
      if (searchQuery.trim()) params.append("search", searchQuery.trim());

      const url = `${SERVER_URL}/api/news-events${
        params.toString() ? `?${params.toString()}` : ""
      }`;
      const response = await axios.get(url);
      const data = response.data.data || [];
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch failed:", err);
      toast.error("Could not load news/events");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, searchQuery]);

 
  // FILE HANDLING

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    if (selected.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(selected);
    } else {
      setPreview(null);
    }
  };

  // FORM OPENERS

  const openAddForm = () => {
    setEditingItem(null);
    resetForm();
    setShowForm(true);
  };

  const openEditForm = (item) => {
    setEditingItem(item);
    setTitle(item.title || "");
    setDate(item.date ? item.date.slice(0, 10) : "");
    setTime(item.time || "");
    setLocation(item.location || "");
    setExcerpt(item.excerpt || "");
    setContent(item.content || "");
    setFile(null);
    setPreview(null);
    setShowForm(true);
  };

  const resetForm = () => {
    setTitle("");
    setDate("");
    setTime("");
    setLocation("");
    setExcerpt("");
    setContent("");
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };


  // SAVE

  const handleSave = async (e) => {
    e.preventDefault();

    if (!title.trim()) return toast.error("Title is required");
    if (activeTab === "event" && (!date || !location.trim())) {
      return toast.error("Events need a date and location");
    }

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("type", activeTab);
    formData.append("date", date);
    if (time) formData.append("time", time);
    if (location) formData.append("location", location);
    if (excerpt) formData.append("excerpt", excerpt);
    if (content) formData.append("content", content);
    if (file) formData.append("image", file);

    try {
      setSaving(true);
      let response;
      if (editingItem) {
        response = await axios.put(
          `${SERVER_URL}/api/news-events/${editingItem._id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );
        toast.success("✅ Item updated");
      } else {
        response = await axios.post(`${SERVER_URL}/api/news-events`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: token ? `Bearer ${token}` : "",
          },
        });
        toast.success("✅ Item created");
      }

      setShowForm(false);
      resetForm();
      await fetchItems();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Save failed";
      console.error("Save error:", err);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  // DELETE

  const handleDelete = async (id, itemTitle) => {
    if (!window.confirm(`Delete "${itemTitle}"? This cannot be undone.`)) return;
    try {
      await axios.delete(`${SERVER_URL}/api/news-events/${id}`, {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      toast.success("🗑️ Deleted");
      await fetchItems();
    } catch (err) {
      toast.error("Delete failed");
      console.error(err);
    }
  };

  // COPY

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied!");
  };

  
  // RENDER

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Decorative background circles */}
      <div className="fixed top-20 -left-20 w-72 h-72 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-20 -right-20 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 p-6">
        {/* HEADER */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-xl shadow-lg">
              <Newspaper className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-slate-800">News & Events Manager</h2>
              <p className="text-slate-500 text-sm mt-1">
                Keep alumni informed with the latest stories and gatherings.
              </p>
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200 p-1.5 mb-8 inline-flex gap-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-200 scale-105"
                  : "text-slate-600 hover:text-indigo-700 hover:bg-indigo-50"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* SEARCH + ADD */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm font-medium text-slate-700"
            />
          </div>
          <button
            onClick={openAddForm}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 hover:from-indigo-700 hover:to-blue-700 transition-all active:scale-95"
          >
            <Sparkles size={18} />
            Add {activeTab === "news" ? "Article" : "Event"}
          </button>
        </div>

        {/* CONTENT AREA */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
            <p className="text-slate-500 font-medium animate-pulse">
              Loading {activeTab === "news" ? "articles" : "events"}...
            </p>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 bg-white/60 backdrop-blur-md rounded-3xl border border-dashed border-slate-300 mx-4">
            <div className="p-4 bg-indigo-100 rounded-full mb-4">
              <CalendarDays size={40} className="text-indigo-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-700">No {activeTab === "news" ? "news articles" : "events"} yet</h3>
            <p className="text-slate-500 mt-2 max-w-sm text-center">
              {activeTab === "news"
                ? "Share the first alumni story."
                : "Create your first upcoming event."}
            </p>
            <button
              onClick={openAddForm}
              className="mt-6 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold rounded-xl shadow-md shadow-indigo-200 hover:from-indigo-700 transition-all"
            >
              Create Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {items.map((item) => (
              <div
                key={item._id}
                className="group bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* Image */}
                <div className="relative h-48 bg-gradient-to-br from-indigo-100 to-blue-50 overflow-hidden">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <CalendarDays className="w-12 h-12 text-indigo-300 mx-auto mb-2" />
                        <span className="text-indigo-400 text-sm font-medium">No Image</span>
                      </div>
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-indigo-700 text-xs font-bold rounded-full shadow">
                      {item.type === "event" ? "📅 Event" : "📰 News"}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5">
                  <h3 className="font-bold text-slate-800 text-lg leading-tight mb-2 line-clamp-2">
                    {item.title}
                  </h3>

                  <div className="flex flex-wrap gap-2 text-xs text-slate-500 mb-4">
                    <span className="flex items-center gap-1">
                      <CalendarDays size={14} />
                      {item.date
                        ? new Date(item.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "No date"}
                    </span>
                    {item.type === "event" && (
                      <>
                        {item.time && (
                          <span className="flex items-center gap-1">
                            ⏰ {item.time}
                          </span>
                        )}
                        {item.location && (
                          <span className="flex items-center gap-1 truncate">
                            📍 {item.location}
                          </span>
                        )}
                      </>
                    )}
                  </div>

                  {item.excerpt && (
                    <p className="text-slate-600 text-sm line-clamp-3 mb-4">
                      {item.excerpt}
                    </p>
                  )}

                  <div className="flex gap-2 pt-4 border-t border-slate-100">
                    <button
                      onClick={() => openEditForm(item)}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs font-semibold text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                    >
                      <Edit3 size={14} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item._id, item.title)}
                      className="px-3 py-2 text-xs font-semibold text-rose-600 bg-rose-50 rounded-lg hover:bg-rose-100 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ============ FORM MODAL ============ */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="absolute inset-0" onClick={() => setShowForm(false)} />

            <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 animate-slide-up">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-xl">
                    {activeTab === "news" ? (
                      <Newspaper size={20} className="text-white" />
                    ) : (
                      <CalendarDays size={20} className="text-white" />
                    )}
                  </div>
                  <h3 className="text-xl font-black text-slate-800">
                    {editingItem ? "Edit" : "Create"}{" "}
                    {activeTab === "news" ? "News Article" : "Event"}
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                >
                  <X size={22} />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-5">
                {/* Title */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-700 font-medium"
                    placeholder="Enter a compelling title"
                    required
                  />
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">
                    Date {activeTab === "event" && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-700"
                  />
                </div>

                {/* Time & Location – only for events */}
                {activeTab === "event" && (
                  <>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1.5">
                        Time
                      </label>
                      <input
                        type="text"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        placeholder="e.g., 10:00 AM - 2:00 PM"
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-700"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1.5">
                        Location <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Venue or virtual link"
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-700"
                        required
                      />
                    </div>
                  </>
                )}

                {/* Excerpt (for news) */}
                {activeTab === "news" && (
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">
                      Excerpt
                    </label>
                    <textarea
                      value={excerpt}
                      onChange={(e) => setExcerpt(e.target.value)}
                      rows={2}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-700"
                      placeholder="Short description for previews"
                    />
                  </div>
                )}

                {/* Content */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">
                    Full Content / Description
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={5}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-700"
                    placeholder="Tell the full story or describe the event..."
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">
                    Cover Image
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="flex-1 px-4 py-3 border border-slate-200 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 transition-all"
                    />
                    {file && (
                      <button
                        type="button"
                        onClick={() => {
                          setFile(null);
                          setPreview(null);
                          if (fileInputRef.current) fileInputRef.current.value = "";
                        }}
                        className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X size={18} />
                      </button>
                    )}
                  </div>
                  {preview && (
                    <img
                      src={preview}
                      alt="Preview"
                      className="mt-3 w-full max-h-48 object-cover rounded-xl border border-slate-200"
                    />
                  )}
                  {editingItem?.image && !preview && (
                    <div className="mt-2">
                      <p className="text-xs text-slate-500 mb-1">Current image:</p>
                      <img
                        src={editingItem.image}
                        alt="Current"
                        className="w-32 h-20 object-cover rounded-xl border border-slate-200"
                      />
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      resetForm();
                    }}
                    className="flex-1 py-3 px-4 border-2 border-slate-200 rounded-xl text-slate-700 font-bold hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className={`flex-1 py-3 px-4 rounded-xl font-bold text-white transition-all ${
                      saving
                        ? "bg-slate-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-lg shadow-indigo-200 active:scale-95"
                    }`}
                  >
                    {saving ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 size={18} className="animate-spin" />
                        Saving...
                      </span>
                    ) : editingItem ? (
                      "Update Item"
                    ) : (
                      "Publish"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Global Animations */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
        .animate-slide-up { animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>
    </div>
  );
}

export default ManageEvents;