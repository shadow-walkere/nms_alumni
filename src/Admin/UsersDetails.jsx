// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Users, Loader } from "lucide-react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   Legend,
// } from "recharts";

// const SERVER_URL = process.env.REACT_APP_SERVER_URL;

// const UsersDetails = () => {
//   const [visitorCount, setVisitorCount] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [weeklyData, setWeeklyData] = useState([]);
//   const navigate = useNavigate();

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const userToken = localStorage.getItem("adminToken");

//       const visitorResponse = await fetch(
//         `${SERVER_URL}/api/visitors/visitor-count`,
//         {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             ...(userToken && { Authorization: `Bearer ${userToken}` }),
//           },
//         }
//       );

//       if (!visitorResponse.ok) {
//         const errorMessage = await visitorResponse.text();
//         throw new Error(
//           `Failed to fetch visitor count: ${errorMessage} (Status: ${visitorResponse.status})`
//         );
//       }

//       const visitorData = await visitorResponse.json();
//       setVisitorCount(visitorData.visitorCount || 0);

//       const chartResponse = await fetch(
//         `${SERVER_URL}/api/visitors/weekly-stats`,
//         {
//           headers: {
//             ...(userToken && { Authorization: `Bearer ${userToken}` }),
//           },
//         }
//       );

//       if (!chartResponse.ok) throw new Error("Failed to fetch weekly stats.");

//       const chartData = await chartResponse.json();
//       setWeeklyData(chartData);
//     } catch (err) {
//       setError(err.message || "An unexpected error occurred.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const handleLogout = () => {
//     const confirmLogout = window.confirm(
//       "Are you sure you want to log out of the admin dashboard?"
//     );
//     if (confirmLogout) {
//       localStorage.removeItem("adminToken");
//       setVisitorCount(0);
//       setError("You have been logged out.");
//       navigate("/admin");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex flex-col items-center justify-center h-screen text-green-700">
//         <Loader className="animate-spin mb-3" size={42} />
//         <p className="text-lg font-medium">Loading visitor data...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded shadow-md">
//           <strong>Error:</strong> {error}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-8 w-full max-w-5xl mx-auto">
//       <h1 className="text-4xl font-bold text-green-800 mb-10 text-center">
//         👥 User Analytics Overview
//       </h1>

//       {/* Total Visitors Card */}
//       <div className="bg-gradient-to-r from-green-50 to-white rounded-2xl shadow-lg p-6 flex items-center justify-between transition-transform transform hover:scale-[1.02] border border-green-100">
//         <div>
//           <h2 className="text-xl font-semibold text-green-800">
//             Total Visitors
//           </h2>
//           <p className="text-5xl font-bold text-green-600 mt-2 drop-shadow-sm">
//             {visitorCount}
//           </p>
//         </div>
//         <div className="bg-green-100 p-4 rounded-full shadow-inner">
//           <Users className="text-green-600 w-10 h-10" />
//         </div>
//       </div>

//       {/* Bar Chart */}
//       <div className="mt-10 bg-white p-6 rounded-2xl shadow-lg border border-green-100">
//         <h2 className="text-2xl font-semibold text-green-800 mb-4 flex items-center gap-2">
//           📊 Weekly Visitor Activity
//         </h2>
//         <div style={{ width: "100%", height: 320 }}>
//           <ResponsiveContainer width="100%" height="100%">
//             <BarChart
//               data={weeklyData}
//               barSize={50} // width of each bar
//               barCategoryGap="20%" // space between categories
//             >
//               <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//               <XAxis
//                 dataKey="name"
//                 tick={{ fill: "#14532d", fontSize: 13 }}
//                 interval={0}
//               />
//               <YAxis tick={{ fill: "#14532d" }} width={60} />
//               <Tooltip />
//               <Legend />
//               <Bar
//                 dataKey="visitors"
//                 fill="#16a34a"
//                 radius={[10, 10, 0, 0]}
//                 animationDuration={800}
//               />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//       {/* Logout Button */}
//       <div className="mt-10 text-center">
//         <button
//           onClick={handleLogout}
//           className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-3 rounded-full text-lg shadow-lg hover:shadow-2xl transition-transform hover:-translate-y-1"
//         >
//           Logout
//         </button>
//       </div>
//     </div>
//   );
// };

// export default UsersDetails;



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

// SAFEGUARD: Same URL logic from AdminLogin
const SERVER_URL = 
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SERVER_URL) ||
  (typeof process !== 'undefined' && process.env && process.env.REACT_APP_SERVER_URL) || 
  "http://localhost:5000";

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
        throw new Error(`Failed to fetch visitor count. (Status: ${visitorResponse.status})`);
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-yellow-500">
        <Loader className="animate-spin mb-3 w-10 h-10" />
        <p className="text-lg font-medium text-gray-400">Loading analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-6 py-4 rounded-xl shadow-md">
          <strong>Error:</strong> {error}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8 animate-fade-in font-sans">
      
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Analytics Overview
        </h1>
        <p className="text-gray-500 text-sm mt-1">Monitor platform traffic and visitor engagement.</p>
      </div>

      {/* Total Visitors Card */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8 flex items-center justify-between relative overflow-hidden group hover:border-zinc-700 transition-colors">
        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-yellow-500/10 transition-colors"></div>
        
        <div className="relative z-10">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest">
            Total Unique Visitors
          </h2>
          <p className="text-5xl font-black text-white mt-3">
            {visitorCount.toLocaleString()}
          </p>
        </div>
        <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl relative z-10">
          <Users className="text-yellow-500 w-8 h-8" />
        </div>
      </div>

      {/* Bar Chart Card */}
      <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl relative">
        <h2 className="text-lg font-bold text-white mb-6">Weekly Visitor Activity</h2>
        
        <div style={{ width: "100%", height: 350 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={weeklyData}
              barSize={40} 
              barCategoryGap="20%"
            >
              {/* Dark mode grid lines */}
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              
              <XAxis
                dataKey="name"
                tick={{ fill: "#a1a1aa", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                tick={{ fill: "#a1a1aa", fontSize: 12 }} 
                axisLine={false}
                tickLine={false}
                width={40} 
              />
              
              {/* Dark mode tooltip */}
              <Tooltip 
                cursor={{ fill: '#27272a', opacity: 0.4 }}
                contentStyle={{ 
                  backgroundColor: '#09090b', 
                  border: '1px solid #27272a',
                  borderRadius: '12px',
                  color: '#fff'
                }}
                itemStyle={{ color: '#eab308' }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              
              <Bar
                dataKey="visitors"
                name="Page Views"
                fill="#eab308" /* Tailwind yellow-500 */
                radius={[6, 6, 0, 0]}
                animationDuration={1000}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default UsersDetails;