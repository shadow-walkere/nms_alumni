
// import React, { useEffect, useState, useRef } from "react";
// import axios from "axios";
// import toast from "react-hot-toast";
// import {
//   Video,
//   Trash2,
//   Upload,
//   Copy,
//   Trees,
//   Tent,
//   CalendarDays,
//   Layers,
//   Loader2,
//   Plus,
//   X,
// } from "lucide-react";

// const SERVER_URL = process.env.REACT_APP_SERVER_URL;

// // ✅ FIXED: Unified categories across frontend & backend
// const TABS = [
//   { id: "all", label: "All Media", icon: <Layers size={16} /> },
//   { id: "tree-planting", label: "Tree Planting", icon: <Trees size={16} /> },
//   { id: "events", label: "Events", icon: <CalendarDays size={16} /> },
//   { id: "scouts", label: "Scouts & Brigade", icon: <Tent size={16} /> },
//   { id: "entertainment", label: "Videos", icon: <Video size={16} /> },
// ];

// function ManageGallery() {
//   // State Management
//   const [loading, setLoading] = useState(true);
//   const [media, setMedia] = useState([]);
//   const [uploading, setUploading] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [activeTab, setActiveTab] = useState("all");
//   const [searchQuery, setSearchQuery] = useState("");

//   // Upload Form State
//   const [title, setTitle] = useState("");
//   const [category, setCategory] = useState("all");
//   const [file, setFile] = useState(null);
//   const [preview, setPreview] = useState(null);
//   const fileInputRef = useRef(null);

//   const token = localStorage.getItem("adminToken");

//   // ============================================
//   // FETCH MEDIA
//   // ============================================
//   const fetchMedia = async () => {
//     try {
//       setLoading(true);

//       // ✅ FIX: Build query params correctly
//       const params = new URLSearchParams();

//       // Filter by type
//       if (activeTab === "entertainment") {
//         params.append("type", "video");
//       } else if (activeTab !== "all") {
//         params.append("type", "image");
//         params.append("category", activeTab);
//       }

//       // Add search
//       if (searchQuery.trim()) {
//         params.append("search", searchQuery.trim());
//       }

//       const url = params.toString()
//         ? `${SERVER_URL}/api/gallery?${params.toString()}`
//         : `${SERVER_URL}/api/gallery`;

//       const response = await axios.get(url);
//       const data = response.data.data || [];

//       setMedia(Array.isArray(data) ? data : []);
//     } catch (err) {
//       console.error("Failed to fetch media:", err);
//       toast.error("Could not load media gallery");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Re-fetch when tab or search changes
//   useEffect(() => {
//     fetchMedia();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [activeTab, searchQuery]);

//   // ============================================
//   // HANDLE FILE SELECTION
//   // ============================================
//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files?.[0];
//     if (!selectedFile) return;

//     setFile(selectedFile);

//     // Generate preview for images
//     if (selectedFile.type.startsWith("image/")) {
//       const reader = new FileReader();
//       reader.onloadend = () => setPreview(reader.result);
//       reader.readAsDataURL(selectedFile);
//     } else {
//       setPreview(null); // No preview for videos
//     }
//   };

//   // ============================================
//   // UPLOAD HANDLER
//   // ============================================
//   const handleUpload = async (e) => {
//     e.preventDefault();

//     if (!file) {
//       return toast.error("Please select a file to upload");
//     }

//     if (!title.trim()) {
//       return toast.error("Please enter a title");
//     }

//     const formData = new FormData();

//     // ✅ FIX: Use 'media' as field name (matches backend multer config)
//     formData.append("media", file);

//     // ✅ FIX: Send all required fields
//     formData.append("title", title.trim());
//     formData.append("category", category);

//     try {
//       setUploading(true);
//       setUploadProgress(0);

//       const response = await axios.post(
//         `${SERVER_URL}/api/gallery/upload`,
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//             Authorization: token ? `Bearer ${token}` : "",
//           },
//           onUploadProgress: (progressEvent) => {
//             if (progressEvent.total) {
//               const percent = Math.round(
//                 (progressEvent.loaded * 100) / progressEvent.total
//               );
//               setUploadProgress(percent);
//             }
//           },
//         }
//       );

//       if (response.data.success) {
//         toast.success("✅ Media uploaded successfully!");

//         // Reset form
//         setTitle("");
//         setCategory("all");
//         setFile(null);
//         setPreview(null);
//         if (fileInputRef.current) {
//           fileInputRef.current.value = "";
//         }

//         // Refresh gallery
//         await fetchMedia();
//       }
//     } catch (err) {
//       const errorMsg =
//         err.response?.data?.message || err.message || "Upload failed";
//       console.error("Upload error:", err);
//       toast.error(errorMsg);
//     } finally {
//       setUploading(false);
//       setUploadProgress(0);
//     }
//   };

//   // ============================================
//   // DELETE HANDLER
//   // ============================================
//   const handleDelete = async (id, itemTitle) => {
//     if (
//       !window.confirm(
//         `Delete "${itemTitle}"? This action cannot be undone.`
//       )
//     ) {
//       return;
//     }

//     try {
//       const response = await axios.delete(`${SERVER_URL}/api/gallery/${id}`, {
//         headers: {
//           Authorization: token ? `Bearer ${token}` : "",
//         },
//       });

//       if (response.data.success) {
//         toast.success("🗑️ Media deleted successfully");
//         await fetchMedia();
//       }
//     } catch (err) {
//       const errorMsg =
//         err.response?.data?.message || "Failed to delete media";
//       console.error("Delete error:", err);
//       toast.error(errorMsg);
//     }
//   };

//   // ============================================
//   // COPY URL TO CLIPBOARD
//   // ============================================
//   const copyToClipboard = (url) => {
//     navigator.clipboard.writeText(url);
//     toast.success("URL copied to clipboard! 📋");
//   };

//   // ============================================
//   // RENDER LOADING STATE
//   // ============================================
//   if (loading && media.length === 0) {
//     return (
//       <div className="flex justify-center items-center h-96 bg-gray-50">
//         <div className="text-center">
//           <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
//           <p className="text-gray-600 font-medium">Loading gallery...</p>
//         </div>
//       </div>
//     );
//   }

//   // ============================================
//   // MAIN RENDER
//   // ============================================
//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       {/* HEADER */}
//       <div className="mb-8">
//         <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
//           <Layers size={28} className="text-blue-600" />
//           Media Gallery Manager
//         </h2>
//         <p className="text-gray-600 text-sm mt-1">
//           Upload and manage images and videos for the public gallery.
//         </p>
//       </div>

//       {/* ============ UPLOAD SECTION ============ */}
//       <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8 mb-10">
//         <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
//           <Plus size={20} className="text-blue-600" />
//           Upload New Media
//         </h3>

//         {/* TABS */}
//         <div className="flex gap-2 mb-8 overflow-x-auto pb-2 border-b border-gray-200">
//           {TABS.map((tab) => (
//             <button
//               key={tab.id}
//               onClick={() => setActiveTab(tab.id)}
//               className={`flex items-center gap-2 px-4 py-2 text-sm font-medium whitespace-nowrap rounded-t-lg transition-all duration-200 ${
//                 activeTab === tab.id
//                   ? "bg-blue-50 text-blue-700 border-b-2 border-blue-600"
//                   : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
//               }`}
//             >
//               {tab.icon}
//               {tab.label}
//             </button>
//           ))}
//         </div>

//         {/* SEARCH BAR */}
//         <div className="mb-6">
//           <input
//             type="text"
//             placeholder="Search by title..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
//           />
//         </div>

//         {/* UPLOAD FORM */}
//         <form onSubmit={handleUpload} className="space-y-6">
//           {/* TITLE INPUT */}
//           <div>
//             <label className="block text-sm font-bold text-gray-700 mb-2">
//               Title/Caption <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="text"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               placeholder="e.g., Tree Planting Drive 2025"
//               className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
//             />
//           </div>

//           {/* CATEGORY SELECT */}
//           <div>
//             <label className="block text-sm font-bold text-gray-700 mb-2">
//               Category <span className="text-red-500">*</span>
//             </label>
//             <select
//               value={category}
//               onChange={(e) => setCategory(e.target.value)}
//               className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
//             >
//               <option value="all">-- Select Category --</option>
//               <option value="tree-planting">🌳 Tree Planting</option>
//               <option value="events">📅 Events</option>
//               <option value="scouts">⛺ Scouts & Brigade</option>
//               <option value="entertainment">🎬 Entertainment/Videos</option>
//             </select>
//           </div>

//           {/* FILE INPUT */}
//           <div>
//             <label className="block text-sm font-bold text-gray-700 mb-2">
//               Select File <span className="text-red-500">*</span>
//             </label>
//             <div className="flex items-center gap-4">
//               <input
//                 ref={fileInputRef}
//                 type="file"
//                 accept="image/*,video/*"
//                 onChange={handleFileChange}
//                 className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm file:mr-4 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
//               />
//               {file && (
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setFile(null);
//                     setPreview(null);
//                     if (fileInputRef.current) fileInputRef.current.value = "";
//                   }}
//                   className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//                 >
//                   <X size={18} />
//                 </button>
//               )}
//             </div>
//             {file && (
//               <p className="text-sm text-gray-500 mt-2">
//                 Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
//               </p>
//             )}
//           </div>

//           {/* IMAGE PREVIEW */}
//           {preview && (
//             <div className="border-2 border-dashed border-blue-300 rounded-lg p-4">
//               <p className="text-xs font-bold text-gray-600 mb-2">Preview:</p>
//               <img
//                 src={preview}
//                 alt="Preview"
//                 className="w-full max-h-64 object-contain rounded-lg"
//               />
//             </div>
//           )}

//           {/* UPLOAD PROGRESS */}
//           {uploading && uploadProgress > 0 && (
//             <div className="w-full bg-gray-200 rounded-lg overflow-hidden h-2">
//               <div
//                 className="bg-blue-600 h-full transition-all duration-300"
//                 style={{ width: `${uploadProgress}%` }}
//               ></div>
//             </div>
//           )}

//           {/* SUBMIT BUTTON */}
//           <button
//             type="submit"
//             disabled={uploading || !file || !title.trim()}
//             className={`w-full py-3 px-6 rounded-lg font-bold flex items-center justify-center gap-2 transition-all duration-200 ${
//               uploading || !file || !title.trim()
//                 ? "bg-gray-300 text-gray-600 cursor-not-allowed"
//                 : "bg-blue-600 text-white hover:bg-blue-700 active:scale-95"
//             }`}
//           >
//             {uploading ? (
//               <>
//                 <Loader2 size={18} className="animate-spin" />
//                 Uploading... {uploadProgress > 0 && `${uploadProgress}%`}
//               </>
//             ) : (
//               <>
//                 <Upload size={18} />
//                 Upload Media
//               </>
//             )}
//           </button>
//         </form>
//       </div>

//       {/* ============ GALLERY DISPLAY ============ */}
//       <div className="mb-6">
//         <h3 className="text-lg font-bold text-gray-800">
//           Media Library ({media.length} items)
//         </h3>
//       </div>

//       {media.length === 0 ? (
//         <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-gray-300">
//           <Layers size={40} className="mx-auto text-gray-400 mb-4" />
//           <h3 className="text-lg font-bold text-gray-700">No media found</h3>
//           <p className="text-gray-500 text-sm mt-2">
//             {searchQuery
//               ? "Try adjusting your search query"
//               : "Upload media to get started"}
//           </p>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//           {media.map((item) => (
//             <div
//               key={item._id}
//               className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group"
//             >
//               {/* MEDIA PREVIEW */}
//               <div className="relative h-48 bg-gray-100 overflow-hidden">
//                 {item.type === "video" ? (
//                   <div className="w-full h-full flex items-center justify-center bg-gray-900">
//                     <video
//                       src={item.url}
//                       className="w-full h-full object-cover opacity-70"
//                       muted
//                     />
//                     <Video
//                       size={40}
//                       className="absolute text-white/60"
//                     />
//                   </div>
//                 ) : (
//                   <img
//                     src={item.url}
//                     alt={item.title}
//                     className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
//                   />
//                 )}

//                 {/* BADGE */}
//                 <div className="absolute top-2 right-2">
//                   <span className="bg-black/60 text-white text-xs px-2 py-1 rounded font-bold uppercase tracking-wider">
//                     {item.type}
//                   </span>
//                 </div>
//               </div>

//               {/* INFO SECTION */}
//               <div className="p-4">
//                 <h4 className="font-bold text-gray-800 text-sm truncate mb-1">
//                   {item.title || "Untitled"}
//                 </h4>
//                 <p className="text-xs text-gray-500 font-mono truncate mb-3">
//                   ID: {item._id?.slice(-6)}
//                 </p>

//                 {/* CATEGORY TAG */}
//                 <div className="mb-3">
//                   <span className="inline-block px-2 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded">
//                     {item.category || "all"}
//                   </span>
//                 </div>

//                 {/* ACTIONS */}
//                 <div className="flex gap-2 pt-3 border-t border-gray-100">
//                   <button
//                     onClick={() => copyToClipboard(item.url)}
//                     className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
//                   >
//                     <Copy size={14} />
//                     Copy
//                   </button>
//                   <button
//                     onClick={() => handleDelete(item._id, item.title)}
//                     className="px-3 py-2 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
//                   >
//                     <Trash2 size={14} />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// export default ManageGallery;



import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Video,
  Trash2,
  Upload,
  Copy,
  Users,
  Briefcase,
  Trophy,
  Layers,
  Loader2,
  Plus,
  X,
} from "lucide-react";

const SERVER_URL = 
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SERVER_URL) ||
  (typeof process !== 'undefined' && process.env && process.env.REACT_APP_SERVER_URL) || 
  "http://localhost:5000";

// ✅ Unified alumni categories – exactly the same as the public Gallery
const TABS = [
  { id: "all", label: "All Media", icon: <Layers size={16} /> },
  { id: "reunions", label: "Reunions", icon: <Users size={16} /> },
  { id: "networking", label: "Networking", icon: <Briefcase size={16} /> },
  { id: "achievements", label: "Achievements", icon: <Trophy size={16} /> },
  { id: "videos", label: "Videos", icon: <Video size={16} /> },
];

function ManageGallery() {
  // State Management
  const [loading, setLoading] = useState(true);
  const [media, setMedia] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Upload Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("all");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const token = localStorage.getItem("adminToken");

  // ============================================
  // FETCH MEDIA (mirrors public Gallery logic)
  // ============================================
  const fetchMedia = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      // Same filtering as the public AlumniGallery
      if (activeTab === "videos") {
        params.append("type", "video");
      } else if (activeTab !== "all") {
        params.append("type", "image");
        params.append("category", activeTab);
      }

      if (searchQuery.trim()) {
        params.append("search", searchQuery.trim());
      }

      const url = `${SERVER_URL}/api/gallery${
        params.toString() ? `?${params.toString()}` : ""
      }`;

      const response = await axios.get(url);
      const data = response.data.data || [];
      setMedia(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch media:", err);
      toast.error("Could not load media gallery");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, searchQuery]);

  // ============================================
  // HANDLE FILE SELECTION
  // ============================================
  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    setFile(selectedFile);

    if (selectedFile.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  };

  // ============================================
  // UPLOAD – sends correct alumni category
  // ============================================
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) return toast.error("Please select a file to upload");
    if (!title.trim()) return toast.error("Please enter a title");

    const formData = new FormData();
    formData.append("media", file);
    formData.append("title", title.trim());
    // ✅ The category here must be one of the alumni values
    formData.append("category", category);

    try {
      setUploading(true);
      setUploadProgress(0);

      const response = await axios.post(
        `${SERVER_URL}/api/gallery/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: token ? `Bearer ${token}` : "",
          },
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

      if (response.data.success) {
        toast.success("✅ Media uploaded successfully!");

        // Reset form
        setTitle("");
        setCategory("all");
        setFile(null);
        setPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";

        await fetchMedia();
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || err.message || "Upload failed";
      console.error("Upload error:", err);
      toast.error(errorMsg);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // ============================================
  // DELETE
  // ============================================
  const handleDelete = async (id, itemTitle) => {
    if (!window.confirm(`Delete "${itemTitle}"? This cannot be undone.`))
      return;

    try {
      const response = await axios.delete(`${SERVER_URL}/api/gallery/${id}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (response.data.success) {
        toast.success("🗑️ Media deleted successfully");
        await fetchMedia();
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to delete media";
      console.error("Delete error:", err);
      toast.error(errorMsg);
    }
  };

  // ============================================
  // COPY URL
  // ============================================
  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    toast.success("URL copied to clipboard! 📋");
  };

  // ============================================
  // LOADING STATE
  // ============================================
  if (loading && media.length === 0) {
    return (
      <div className="flex justify-center items-center h-96 bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading gallery...</p>
        </div>
      </div>
    );
  }

  // ============================================
  // MAIN RENDER
  // ============================================
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Layers size={28} className="text-blue-600" />
          Alumni Media Manager
        </h2>
        <p className="text-gray-600 text-sm mt-1">
          Upload and manage images & videos for the public alumni gallery.
        </p>
      </div>

      {/* ============ UPLOAD SECTION ============ */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8 mb-10">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Plus size={20} className="text-blue-600" />
          Add New Memory
        </h3>

        {/* TABS – now alumni categories */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 border-b border-gray-200">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium whitespace-nowrap rounded-t-lg transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-blue-50 text-blue-700 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* SEARCH BAR */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
          />
        </div>

        {/* UPLOAD FORM */}
        <form onSubmit={handleUpload} className="space-y-6">
          {/* TITLE */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Title/Caption <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Class of ’95 Reunion"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          {/* CATEGORY DROPDOWN – alumni values */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="all">-- Select Category --</option>
              <option value="reunions">🎉 Reunions</option>
              <option value="networking">💼 Networking</option>
              <option value="achievements">🏆 Achievements</option>
              <option value="videos">🎬 Videos</option>
            </select>
          </div>

          {/* FILE INPUT */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Select File <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm file:mr-4 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
              />
              {file && (
                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    setPreview(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              )}
            </div>
            {file && (
              <p className="text-sm text-gray-500 mt-2">
                Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          {/* PREVIEW */}
          {preview && (
            <div className="border-2 border-dashed border-blue-300 rounded-lg p-4">
              <p className="text-xs font-bold text-gray-600 mb-2">Preview:</p>
              <img
                src={preview}
                alt="Preview"
                className="w-full max-h-64 object-contain rounded-lg"
              />
            </div>
          )}

          {/* PROGRESS */}
          {uploading && uploadProgress > 0 && (
            <div className="w-full bg-gray-200 rounded-lg overflow-hidden h-2">
              <div
                className="bg-blue-600 h-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={uploading || !file || !title.trim()}
            className={`w-full py-3 px-6 rounded-lg font-bold flex items-center justify-center gap-2 transition-all duration-200 ${
              uploading || !file || !title.trim()
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700 active:scale-95"
            }`}
          >
            {uploading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Uploading... {uploadProgress > 0 && `${uploadProgress}%`}
              </>
            ) : (
              <>
                <Upload size={18} />
                Upload Media
              </>
            )}
          </button>
        </form>
      </div>

      {/* ============ MEDIA LIBRARY ============ */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-800">
          Alumni Memories ({media.length} items)
        </h3>
      </div>

      {media.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-gray-300">
          <Layers size={40} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-bold text-gray-700">No media found</h3>
          <p className="text-gray-500 text-sm mt-2">
            {searchQuery
              ? "Try adjusting your search query"
              : "Upload media to start building the alumni gallery"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {media.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group"
            >
              <div className="relative h-48 bg-gray-100 overflow-hidden">
                {item.type === "video" ? (
                  <div className="w-full h-full flex items-center justify-center bg-gray-900">
                    <video
                      src={item.url}
                      className="w-full h-full object-cover opacity-70"
                      muted
                    />
                    <Video
                      size={40}
                      className="absolute text-white/60"
                    />
                  </div>
                ) : (
                  <img
                    src={item.url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                )}
                <div className="absolute top-2 right-2">
                  <span className="bg-black/60 text-white text-xs px-2 py-1 rounded font-bold uppercase tracking-wider">
                    {item.type}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <h4 className="font-bold text-gray-800 text-sm truncate mb-1">
                  {item.title || "Untitled"}
                </h4>
                <p className="text-xs text-gray-500 font-mono truncate mb-3">
                  ID: {item._id?.slice(-6)}
                </p>

                <div className="mb-3">
                  <span className="inline-block px-2 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded">
                    {item.category || "all"}
                  </span>
                </div>

                <div className="flex gap-2 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => copyToClipboard(item.url)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  >
                    <Copy size={14} />
                    Copy
                  </button>
                  <button
                    onClick={() => handleDelete(item._id, item.title)}
                    className="px-3 py-2 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 size={14} />
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

export default ManageGallery;