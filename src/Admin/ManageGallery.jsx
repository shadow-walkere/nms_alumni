import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Users,
  Briefcase,
  Trophy,
  Layers,
  Video,
  Upload,
  Trash2,
  Copy,
  Search,
  Plus,
  X,
  Loader2,
  Sparkles,
  Edit3,
} from "lucide-react";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const TABS = [
  { id: "all", label: "All Media", icon: <Layers size={16} /> },
  { id: "reunions", label: "Reunions", icon: <Users size={16} /> },
  { id: "leadership", label: "Leadership", icon: <Users size={16} /> },
  { id: "networking", label: "Networking", icon: <Briefcase size={16} /> },
  { id: "achievements", label: "Achievements", icon: <Trophy size={16} /> },
  { id: "videos", label: "Videos", icon: <Video size={16} /> },
];

const ALUMNI_CATEGORIES = ["all", "reunions", "leadership", "networking", "achievements"];

function ManageGallery() {
  const [loading, setLoading] = useState(true);
  const [media, setMedia] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Form state (shared for add & edit)
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null); // null = add mode
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("all");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const token = localStorage.getItem("adminToken");

  // ── Fetch media ──
  const fetchMedia = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (activeTab === "videos") {
        params.append("type", "video");
      } else if (activeTab !== "all") {
        params.append("type", "image");
        params.append("category", activeTab);
      }
      if (searchQuery.trim()) {
        params.append("search", searchQuery.trim());
      }
      const url = `${SERVER_URL}/api/gallery${params.toString() ? `?${params}` : ""}`;
      const response = await axios.get(url);
      setMedia(response.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Could not load gallery");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [activeTab, searchQuery]);

  // ── File handling ──
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

  // ── Reset form ──
  const resetForm = () => {
    setTitle("");
    setCategory("all");
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ── Open modal for add ──
  const openAddForm = () => {
    setEditingItem(null);
    resetForm();
    setShowForm(true);
  };

  // ── Open modal for edit ──
  const openEditForm = (item) => {
    setEditingItem(item);
    setTitle(item.title || "");
    setCategory(item.category || "all");
    setFile(null);
    setPreview(null); // will show existing image via item.image
    if (fileInputRef.current) fileInputRef.current.value = "";
    setShowForm(true);
  };

  // ── Save (create or update) ──
  const handleSave = async (e) => {
    e.preventDefault();
    if (!title.trim()) return toast.error("Title is required");

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("category", category);
    if (activeTab === "videos") {
      formData.append("type", "video");
    } else {
      formData.append("type", "image");
    }
    // Attach new file only if selected (for update, optional)
    if (file) {
      formData.append("media", file);
    }

    try {
      setUploading(true);
      setUploadProgress(0);

      if (editingItem) {
        // Update
        await axios.put(`${SERVER_URL}/api/gallery/${editingItem._id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: token ? `Bearer ${token}` : "",
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setUploadProgress(percent);
            }
          },
        });
        toast.success("✅ Media updated");
      } else {
        // Create
        await axios.post(`${SERVER_URL}/api/gallery/upload`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: token ? `Bearer ${token}` : "",
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setUploadProgress(percent);
            }
          },
        });
        toast.success("✅ Media uploaded");
      }

      setShowForm(false);
      resetForm();
      fetchMedia();
    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // ── Delete ──
  const handleDelete = async (id, itemTitle) => {
    if (!window.confirm(`Delete "${itemTitle}"?`)) return;
    try {
      await axios.delete(`${SERVER_URL}/api/gallery/${id}`, {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      toast.success("Deleted");
      fetchMedia();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  // ── Copy URL ──
  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    toast.success("URL copied");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <div className="p-2 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-xl shadow-lg">
          <Layers className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-black text-slate-800">Gallery Manager</h2>
          <p className="text-slate-500 text-sm">Upload, edit, and organise alumni memories.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                : "bg-white text-slate-600 border border-slate-200 hover:border-indigo-300"
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Search + Add */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
        <button
          onClick={openAddForm}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 hover:from-indigo-700 transition-all active:scale-95"
        >
          <Plus size={18} /> Add Media
        </button>
      </div>

      {/* Form Modal (Add / Edit) */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-xl p-6 shadow-2xl border border-gray-200 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-slate-800">
                {editingItem ? "Edit Media" : "New Upload"}
              </h3>
              <button
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="p-1.5 hover:bg-red-50 rounded-full"
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              {/* Title */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Class of '22 Reunion"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-700"
                  required
                />
              </div>

              {/* Category – only if not video tab */}
              {activeTab !== "videos" && (
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-700"
                  >
                    {ALUMNI_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat === "all"
                          ? "General (no category)"
                          : cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* File input */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  {editingItem ? "Replace Image" : "File"} {!editingItem && <span className="text-red-500">*</span>}
                </label>
                <div className="flex items-center gap-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={activeTab === "videos" ? "video/*" : "image/*"}
                    onChange={handleFileChange}
                    className="flex-1 px-4 py-3 border border-slate-200 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
                  />
                  {file && (
                    <button
                      type="button"
                      onClick={() => {
                        setFile(null);
                        setPreview(null);
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                      className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
                {file && (
                  <p className="text-xs text-slate-500 mt-1">
                    {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>

              {/* Preview area */}
              {preview ? (
                <img
                  src={preview}
                  alt="New preview"
                  className="w-full max-h-48 object-cover rounded-xl border border-slate-200"
                />
              ) : editingItem?.image && !file ? (
                <div>
                  <p className="text-xs text-slate-500 mb-1">Current image:</p>
                  <img
                    src={editingItem.image}
                    alt="Current"
                    className="w-full max-h-48 object-cover rounded-xl border border-slate-200"
                  />
                </div>
              ) : null}

              {/* Progress bar */}
              {uploading && (
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-indigo-600 h-2 transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="flex-1 py-3 border-2 border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading || (!editingItem && !file)}
                  className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold rounded-xl shadow-md shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      {editingItem ? "Updating..." : "Uploading..."} {uploadProgress}%
                    </>
                  ) : editingItem ? (
                    <>
                      <Edit3 size={18} /> Update
                    </>
                  ) : (
                    <>
                      <Upload size={18} /> Upload
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Media grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
        </div>
      ) : media.length === 0 ? (
        <div className="text-center py-20 bg-white/80 rounded-3xl border border-dashed border-slate-300">
          <Layers size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500">No media found. Click "Add Media" to upload.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {media.map((item) => (
            <div
              key={item._id}
              className="group bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg transition-all"
            >
              <div className="relative h-48 bg-slate-100">
                {item.type === "video" ? (
                  <div className="w-full h-full flex items-center justify-center bg-slate-900">
                    <video
                      src={item.url}
                      className="w-full h-full object-cover opacity-70"
                      muted
                    />
                    <Video size={36} className="absolute text-white/60" />
                  </div>
                ) : (
                  <img
                    src={item.url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                )}
                <span className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded font-bold uppercase">
                  {item.type}
                </span>
              </div>
              <div className="p-4">
                <h4 className="font-bold text-slate-800 text-sm truncate">
                  {item.title || "Untitled"}
                </h4>
                <p className="text-xs text-slate-500 mb-2">
                  {item.category !== "all" ? item.category : "General"}
                </p>
                <div className="flex gap-2 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => copyToClipboard(item.url)}
                    className="flex-1 flex items-center justify-center gap-1 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-lg py-1.5 hover:bg-indigo-100"
                  >
                    <Copy size={14} /> Copy
                  </button>
                  <button
                    onClick={() => openEditForm(item)}
                    className="text-xs font-medium text-amber-600 bg-amber-50 rounded-lg py-1.5 px-3 hover:bg-amber-100"
                    title="Edit"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(item._id, item.title)}
                    className="text-xs font-medium text-rose-600 bg-rose-50 rounded-lg py-1.5 px-3 hover:bg-rose-100"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default ManageGallery;