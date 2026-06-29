import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { UserCheck, UserX, Trash2, ShieldAlert, Loader2, Search } from "lucide-react";
import SERVER_URL from "../config";

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const token = localStorage.getItem("adminToken");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${SERVER_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data && res.data.success) {
        setUsers(res.data.data);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleApprove = async (id) => {
    try {
      const res = await axios.put(`${SERVER_URL}/api/admin/users/${id}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data && res.data.success) {
        toast.success("User approved successfully");
        setUsers(users.map(u => u._id === id ? { ...u, isApproved: true } : u));
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to approve user");
    }
  };

  const handleRevoke = async (id) => {
    try {
      const res = await axios.put(`${SERVER_URL}/api/admin/users/${id}/revoke`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data && res.data.success) {
        toast.success("User access revoked successfully");
        setUsers(users.map(u => u._id === id ? { ...u, isApproved: false } : u));
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to revoke user access");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to reject/delete this user?")) return;
    try {
      const res = await axios.delete(`${SERVER_URL}/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data && res.data.success) {
        toast.success("User deleted successfully");
        setUsers(users.filter(u => u._id !== id));
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to delete user");
    }
  };

  const filteredUsers = users.filter(u => {
    const q = searchQuery.toLowerCase();
    return (
      (u.name || "").toLowerCase().includes(q) ||
      (u.email || "").toLowerCase().includes(q) ||
      (u.profession || "").toLowerCase().includes(q) ||
      String(u.year || "").includes(q)
    );
  });

  const totalUsers = users.length;
  const pendingCount = users.filter(u => !u.isApproved).length;
  const approvedCount = users.filter(u => u.isApproved).length;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-yellow-500 py-12">
        <Loader2 className="animate-spin mb-3 w-10 h-10" />
        <p className="text-lg font-medium text-gray-400">Loading registered users...</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8 animate-fade-in font-sans text-gray-300">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Manage Users
        </h1>
        <p className="text-gray-500 text-sm mt-1">Approve or reject alumni accounts requesting directory access.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Total Registrations</h3>
          <p className="text-3xl font-black text-white mt-2">{totalUsers}</p>
        </div>
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest text-amber-500">Pending Approvals</h3>
          <p className="text-3xl font-black text-amber-500 mt-2">{pendingCount}</p>
        </div>
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest text-emerald-500">Approved Users</h3>
          <p className="text-3xl font-black text-emerald-500 mt-2">{approvedCount}</p>
        </div>
      </div>

      {/* Filter and Table */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden">
        {/* Search Bar */}
        <div className="p-6 border-b border-zinc-800 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Search users by name, email, year..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/50 border border-zinc-800 text-white rounded-xl pl-11 pr-4 py-2.5 focus:outline-none focus:border-yellow-500 transition-colors placeholder:text-gray-600 text-sm"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          {filteredUsers.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <ShieldAlert className="mx-auto mb-3 text-gray-600" size={40} />
              <p>No registered users found.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-500 text-xs font-bold uppercase tracking-wider bg-zinc-900/20">
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Class Year</th>
                  <th className="px-6 py-4">Profession</th>
                  <th className="px-6 py-4">Registered On</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900 text-sm">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-zinc-900/25 transition-colors">
                    <td className="px-6 py-4 font-bold text-white">{user.name}</td>
                    <td className="px-6 py-4 text-zinc-400">{user.email}</td>
                    <td className="px-6 py-4 text-zinc-400">{user.year}</td>
                    <td className="px-6 py-4 text-zinc-400">{user.profession || "N/A"}</td>
                    <td className="px-6 py-4 text-zinc-500">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      {user.isApproved ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Approved
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {user.isApproved ? (
                        <button
                          onClick={() => handleRevoke(user._id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500 text-black hover:bg-amber-400 transition-colors font-bold text-xs"
                        >
                          <UserX size={14} />
                          Revoke
                        </button>
                      ) : (
                        <button
                          onClick={() => handleApprove(user._id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500 text-black hover:bg-emerald-400 transition-colors font-bold text-xs"
                        >
                          <UserCheck size={14} />
                          Approve
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-red-500 hover:text-white transition-all duration-200 text-red-500 border border-zinc-800 hover:border-red-500 font-bold text-xs"
                      >
                        <Trash2 size={14} />
                        {user.isApproved ? "Delete" : "Reject"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default ManageUsers;
