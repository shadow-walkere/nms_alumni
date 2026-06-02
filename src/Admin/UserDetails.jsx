import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Loader } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const UsersDetails = () => {
  const [visitorCount, setVisitorCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [weeklyData, setWeeklyData] = useState([]);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setLoading(true);
      const userToken = localStorage.getItem("adminToken");

      const visitorResponse = await fetch(
        `${SERVER_URL}/api/visitors/visitor-count`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(userToken && { Authorization: `Bearer ${userToken}` }),
          },
        }
      );

      if (!visitorResponse.ok) {
        const errorMessage = await visitorResponse.text();
        throw new Error(
          `Failed to fetch visitor count: ${errorMessage} (Status: ${visitorResponse.status})`
        );
      }

      const visitorData = await visitorResponse.json();
      setVisitorCount(visitorData.visitorCount || 0);

      const chartResponse = await fetch(
        `${SERVER_URL}/api/visitors/weekly-stats`,
        {
          headers: {
            ...(userToken && { Authorization: `Bearer ${userToken}` }),
          },
        }
      );

      if (!chartResponse.ok) throw new Error("Failed to fetch weekly stats.");

      const chartData = await chartResponse.json();
      setWeeklyData(chartData);
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = () => {
    const confirmLogout = window.confirm(
      "Are you sure you want to log out of the admin dashboard?"
    );
    if (confirmLogout) {
      localStorage.removeItem("adminToken");
      setVisitorCount(0);
      setError("You have been logged out.");
      navigate("/admin");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-green-700">
        <Loader className="animate-spin mb-3" size={42} />
        <p className="text-lg font-medium">Loading visitor data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded shadow-md">
          <strong>Error:</strong> {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 w-full max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold text-green-800 mb-10 text-center">
        👥 User Analytics Overview
      </h1>

      {/* Total Visitors Card */}
      <div className="bg-gradient-to-r from-green-50 to-white rounded-2xl shadow-lg p-6 flex items-center justify-between transition-transform transform hover:scale-[1.02] border border-green-100">
        <div>
          <h2 className="text-xl font-semibold text-green-800">
            Total Visitors
          </h2>
          <p className="text-5xl font-bold text-green-600 mt-2 drop-shadow-sm">
            {visitorCount}
          </p>
        </div>
        <div className="bg-green-100 p-4 rounded-full shadow-inner">
          <Users className="text-green-600 w-10 h-10" />
        </div>
      </div>

      {/* Bar Chart */}
      <div className="mt-10 bg-white p-6 rounded-2xl shadow-lg border border-green-100">
        <h2 className="text-2xl font-semibold text-green-800 mb-4 flex items-center gap-2">
          📊 Weekly Visitor Activity
        </h2>
        <div style={{ width: "100%", height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={weeklyData}
              barSize={50} // width of each bar
              barCategoryGap="20%" // space between categories
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="name"
                tick={{ fill: "#14532d", fontSize: 13 }}
                interval={0}
              />
              <YAxis tick={{ fill: "#14532d" }} width={60} />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="visitors"
                fill="#16a34a"
                radius={[10, 10, 0, 0]}
                animationDuration={800}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Logout Button */}
      <div className="mt-10 text-center">
        <button
          onClick={handleLogout}
          className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-3 rounded-full text-lg shadow-lg hover:shadow-2xl transition-transform hover:-translate-y-1"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default UsersDetails;
