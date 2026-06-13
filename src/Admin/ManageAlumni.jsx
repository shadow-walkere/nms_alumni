import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Plus, Trash2, Edit3, Upload, X, Loader2, GraduationCap, Search, Sparkles
} from "lucide-react";
import SERVER_URL from "../config";

const CLASS_YEARS = Array.from({ length: 2030 - 2000 + 1 }, (_, i) => 2000 + i);

function ManageAlumni() {
  const [loading, setLoading] = useState(true);
  const [alumni, setAlumni] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [saving, setSaving] = useState(false);

  // Form
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState("");
  const [classYear, setClassYear] = useState(2016);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [profession, setProfession] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const token = localStorage.getItem("adminToken");

  const fetchAlumni = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.append("search", searchQuery.trim());
      const url = `${SERVER_URL}/api/alumni${params.toString() ? `?${params}` : ""}`;
      const res = await axios.get(url);
      setAlumni(res.data.data || []);
    } catch (err) {
      toast.error("Failed to load alumni");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlumni();
  }, [searchQuery]);

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(selected);
  };

  const openAdd = () => {
    resetForm();
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (alum) => {
    setEditingId(alum._id);
    setName(alum.name);
    setClassYear(alum.classYear);
    setEmail(alum.email || "");
    setPhone(alum.phone || "");
    setLocation(alum.location || "");
    setProfession(alum.profession || "");
    setFile(null);
    setPreview(null);
    setShowForm(true);
  };

  const resetForm = () => {
    setName("");
    setClassYear(2016);
    setEmail("");
    setPhone("");
    setLocation("");
    setProfession("");
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Name is required");

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("classYear", classYear);
    if (email) formData.append("email", email.trim());
    if (phone) formData.append("phone", phone.trim());
    if (location) formData.append("location", location.trim());
    if (profession) formData.append("profession", profession.trim());
    if (file) formData.append("image", file);

    try {
      setSaving(true);
      if (editingId) {
        await axios.put(`${SERVER_URL}/api/alumni/${editingId}`, formData, {
          headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
        });
        toast.success("Alumni updated");
      } else {
        await axios.post(`${SERVER_URL}/api/alumni`, formData, {
          headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
        });
        toast.success("Alumni added");
      }
      setShowForm(false);
      resetForm();
      fetchAlumni();
    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, alumName) => {
    if (!window.confirm(`Delete ${alumName}?`)) return;
    try {
      await axios.delete(`${SERVER_URL}/api/alumni/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Deleted");
      fetchAlumni();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-6">
      <div className="mb-8 flex items-center gap-3">
        <div className="p-2 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-xl shadow-lg">
          <GraduationCap className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-black text-slate-800">Alumni Manager</h2>
          <p className="text-slate-500 text-sm">Add, edit, and organize alumni records.</p>
        </div>
      </div>

      {/* Search + Add */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name, profession..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 hover:from-indigo-700 transition-all active:scale-95"
        >
          <Sparkles size={18} /> Add Alumni
        </button>
      </div>

      {/* Alumni List */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-12 h-12 text-indigo-600 animate-spin" /></div>
      ) : alumni.length === 0 ? (
        <p className="text-center text-slate-500 py-20">No alumni found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {alumni.map((alum) => (
            <div key={alum._id} className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <img src={alum.image || "https://ui-avatars.com/api/?name=Alumni&background=6366f1&color=fff&size=80"} alt={alum.name} className="w-12 h-12 rounded-full object-cover border-2 border-indigo-200" />
                <div>
                  <h3 className="font-bold text-slate-800">{alum.name}</h3>
                  <span className="text-sm text-indigo-600 font-semibold">Class of {alum.classYear}</span>
                </div>
              </div>
              <div className="space-y-1 text-sm text-slate-600 mb-4">
                {alum.profession && <p>💼 {alum.profession}</p>}
                {alum.location && <p>📍 {alum.location}</p>}
                {alum.email && <p>✉️ {alum.email}</p>}
                {alum.phone && <p>📞 {alum.phone}</p>}
              </div>
              <div className="flex gap-2 pt-4 border-t border-gray-100">
                <button onClick={() => openEdit(alum)} className="flex-1 flex items-center justify-center gap-1 text-xs font-semibold text-indigo-600 bg-indigo-50 rounded-lg py-2 hover:bg-indigo-100"><Edit3 size={14} /> Edit</button>
                <button onClick={() => handleDelete(alum._id, alum.name)} className="text-xs font-semibold text-rose-600 bg-rose-50 rounded-lg py-2 px-3 hover:bg-rose-100"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-slate-800">{editingId ? "Edit" : "Add"} Alumni</h3>
              <button onClick={() => setShowForm(false)} className="p-1.5 hover:bg-red-50 rounded-full"><X size={22} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Name *</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Class Year *</label>
                <select value={classYear} onChange={(e) => setClassYear(parseInt(e.target.value))} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none">
                  {CLASS_YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Phone</label>
                  <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Location</label>
                  <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Profession</label>
                  <input type="text" value={profession} onChange={(e) => setProfession(e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Photo</label>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-indigo-600 file:text-white hover:file:bg-indigo-700" />
                {preview && <img src={preview} alt="Preview" className="mt-2 max-h-32 rounded-xl" />}
                {editingId && !preview && alumni.find(a => a._id === editingId)?.image && (
                  <img src={alumni.find(a => a._id === editingId).image} alt="Current" className="mt-2 max-h-32 rounded-xl" />
                )}
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-3 border-2 border-slate-200 rounded-xl font-bold text-slate-700">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold rounded-xl shadow-md shadow-indigo-200 disabled:opacity-50">
                  {saving ? "Saving..." : editingId ? "Update" : "Add Alumni"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageAlumni;