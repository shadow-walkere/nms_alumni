import React, { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import {
  Video,
  Trash2,
  UploadCloud,
  Copy,
  Trees,
  Tent,
  CalendarDays,
  Layers,
} from "lucide-react";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const TABS = [
  { id: "all", label: "All", icon: <Layers size={16} /> },
  { id: "tree-planting", label: "Tree Planting", icon: <Trees size={16} /> },
  { id: "events", label: "Events", icon: <CalendarDays size={16} /> },
  { id: "scouts", label: "Scouts", icon: <Tent size={16} /> },
  { id: "videos", label: "Video Stories", icon: <Video size={16} /> },
];

const CATEGORY_IDS = ["tree-planting", "events", "scouts", "entertainment"];

function ManageMedia() {
  const [loading, setLoading] = useState(true);
  const [media, setMedia] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("image");
  const [searchQuery, setSearchQuery] = useState("");

  // Upload State
  const [title, setTitle] = useState("");
  const fileInputRef = useRef(null);

  const token = localStorage.getItem("adminToken");

  // --- FETCH MEDIA ---
  const fetchMedia = async () => {
    try {
      setLoading(true);

      // Build query params according to backend expectations: type + optional category + search
      const params = new URLSearchParams();

      if (activeTab === "videos") {
        params.set("type", "video");
      } else if (activeTab === "all") {
        // no type/category filter -> fetch everything
      } else if (CATEGORY_IDS.includes(activeTab)) {
        params.set("type", "image");
        params.set("category", activeTab);
      } else if (activeTab === "image") {
        params.set("type", "image");
      }

      if (searchQuery && searchQuery.trim() !== "") {
        params.set("search", searchQuery.trim());
      }

      const q = params.toString() ? `?${params.toString()}` : "";
      const res = await fetch(`${SERVER_URL}/api/gallery${q}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to load media");

      // Handle response structure { success: true, data: [...] }
      if (data.success && Array.isArray(data.data)) {
        setMedia(data.data);
      } else if (Array.isArray(data)) {
        setMedia(data);
      } else {
        setMedia([]);
      }
    } catch (err) {
      toast.error(err.message || "Could not load media");
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch when tab, search changes
  useEffect(() => {
    fetchMedia();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, searchQuery]);

  // --- UPLOAD HANDLER ---
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!fileInputRef.current?.files[0]) {
      return toast.error("Please select a file to upload");
    }

    const fd = new FormData();
    // 'media' must match the field name expected by your Multer middleware
    fd.append("media", fileInputRef.current.files[0]);
    fd.append("title", title);
    // Determine upload type and category to send to backend
    const uploadType = activeTab === "videos" ? "video" : "image";
    fd.append("type", uploadType);

    if (CATEGORY_IDS.includes(activeTab)) {
      fd.append("category", activeTab);
    }

    try {
      setUploading(true);
      const res = await fetch(`${SERVER_URL}/api/gallery/upload`, {
        method: "POST",
        headers: { Authorization: token ? `Bearer ${token}` : undefined },
        body: fd,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed");

      toast.success("Media uploaded successfully!");

      // Reset form
      setTitle("");
      if (fileInputRef.current) fileInputRef.current.value = "";

      fetchMedia();
    } catch (err) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // --- DELETE HANDLER ---
  const handleRemove = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      const res = await fetch(`${SERVER_URL}/api/gallery/${id}`, {
        method: "DELETE",
        headers: { Authorization: token ? `Bearer ${token}` : undefined },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Delete failed");

      toast.success("Item removed");
      fetchMedia();
    } catch (err) {
      toast.error(err.message || "Failed to remove media");
    }
  };

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    toast.success("URL copied to clipboard");
  };

  if (loading && !uploading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="ml-3 text-gray-500">Loading gallery...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Media Gallery</h2>
        <p className="text-gray-500 text-sm">
          Manage images and videos for the public gallery.
        </p>
      </div>

      {/* --- UPLOAD SECTION --- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b pb-1 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-slate-50 text-blue-700 border-b-2 border-blue-600 bg-gradient-to-t from-blue-50/50 to-transparent"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Search (server-side) */}
        <div className="mt-4 mb-4">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title (server-side)"
            className="w-full md:w-1/2 p-2 border rounded-lg"
          />
        </div>

        {/* Upload Form */}
        <form
          onSubmit={handleUpload}
          className="flex flex-col md:flex-row gap-4 items-end"
        >
          <div className="flex-1 w-full">
            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">
              Title / Caption
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50"
              placeholder="e.g., Annual Camp 2025"
            />
          </div>

          <div className="flex-1 w-full">
            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">
              File
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept={
                activeTab === "videos" || activeTab === "video"
                  ? "video/*"
                  : "image/*"
              }
              className="w-full p-2 border border-slate-200 rounded-xl bg-slate-50 text-sm file:mr-4 file:py-1.5 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={uploading}
            className={`px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium shadow-md hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center gap-2 mb-0.5 ${
              uploading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {uploading ? (
              "Uploading..."
            ) : (
              <>
                <UploadCloud size={18} /> Upload
              </>
            )}
          </button>
        </form>
      </div>

      {/* --- GALLERY GRID --- */}
      {media.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-dashed border-gray-300 text-gray-400">
          No media found for "{activeTab}".
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {media.map((m) => (
            <div
              key={m._id || m.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group"
            >
              {/* Preview Area */}
              <div className="h-48 bg-gray-100 relative">
                {m.type === "image" || (!m.type && activeTab === "image") ? (
                  <img
                    src={m.url}
                    alt={m.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <video
                    src={m.url}
                    className="w-full h-full object-cover"
                    controls
                  />
                )}

                {/* Overlay Badge */}
                <div className="absolute top-2 right-2">
                  <span className="bg-black/50 text-white text-[10px] px-2 py-1 rounded uppercase font-bold backdrop-blur-sm">
                    {m.category || m.type || activeTab}
                  </span>
                </div>
              </div>

              {/* Info Area */}
              <div className="p-4">
                <h4 className="font-semibold text-gray-800 truncate mb-1">
                  {m.title || "Untitled Media"}
                </h4>
                <p className="text-xs text-gray-400 mb-4 font-mono truncate">
                  ID: {m.public_id || m._id}
                </p>

                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                  <button
                    onClick={() => copyToClipboard(m.url)}
                    className="text-slate-500 hover:text-blue-600 text-xs font-medium flex items-center gap-1 transition-colors"
                  >
                    <Copy size={14} /> Copy URL
                  </button>
                  <button
                    onClick={() => handleRemove(m._id || m.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded transition-colors"
                    title="Delete Media"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ManageMedia;