// const express = require("express");
// const router = express.Router();
// const Visitor = require("../models/Visitor");
// const jwt = require("jsonwebtoken");

// // Middleware to verify admin token (for protected routes)
// const verifyAdmin = (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return res.status(401).json({ message: "No token provided" });
//   }

//   const token = authHeader.split(" ")[1];

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.admin = decoded;
//     next();
//   } catch (error) {
//     return res.status(401).json({ message: "Invalid or expired token" });
//   }
// };

// // Track Visitor (PUBLIC - no auth needed)
// router.post("/track-visitor", async (req, res) => {
//   try {
//     const today = new Date();
//     const date = today.toISOString().split("T")[0]; // YYYY-MM-DD
//     const day = today.toLocaleString("en-US", { weekday: "long" });

//     // Upsert + return updated document
//     const visitor = await Visitor.findOneAndUpdate(
//       { date },
//       { $setOnInsert: { day }, $inc: { visitorCount: 1 } },
//       { upsert: true, new: true }
//     );

//     console.log(`✅ Visitor tracked for ${date} (${day})`);
//     res.status(200).json({ visitorCount: visitor.visitorCount });
//   } catch (error) {
//     console.error("❌ Error in /track-visitor:", error);
//     res.status(500).json({ message: "Error tracking visitor" });
//   }
// });

// // Get total visitor count across all days (PROTECTED)
// router.get("/visitor-count", verifyAdmin, async (req, res) => {
//   try {
//     // Get total count across all days
//     const result = await Visitor.aggregate([
//       {
//         $group: {
//           _id: null,
//           totalVisitors: { $sum: "$visitorCount" },
//         },
//       },
//     ]);

//     const totalVisitors = result.length > 0 ? result[0].totalVisitors : 0;

//     res.status(200).json({ visitorCount: totalVisitors });
//   } catch (error) {
//     console.error("❌ Error in /visitor-count:", error);
//     res.status(500).json({ message: "Error fetching visitor count" });
//   }
// });

// // Get today's visitor count (PROTECTED - optional, you can make it public)
// router.get("/today-count", verifyAdmin, async (req, res) => {
//   try {
//     const today = new Date().toISOString().split("T")[0];
//     const visitorData = await Visitor.findOne({ date: today });
//     res.status(200).json({ visitorCount: visitorData?.visitorCount || 0 });
//   } catch (error) {
//     console.error("❌ Error in /today-count:", error);
//     res.status(500).json({ message: "Error fetching today's visitor count" });
//   }
// });

// // Weekly Stats (PROTECTED)
// router.get("/weekly-stats", verifyAdmin, async (req, res) => {
//   try {
//     const weeklyData = await Visitor.find({})
//       .sort({ date: -1 })
//       .limit(7)
//       .lean();

//     const formatted = weeklyData
//       .map(({ day = "N/A", visitorCount = 0 }) => ({
//         name: day.slice(0, 3),
//         visitors: visitorCount,
//       }))
//       .reverse();

//     res.json(formatted);
//   } catch (error) {
//     console.error("❌ Error fetching weekly stats:", error);
//     res.status(500).json({ message: "Failed to get weekly data" });
//   }
// });

// module.exports = router;




const express = require("express");
const router = express.Router();
const Visitor = require("../models/Visitor");
const jwt = require("jsonwebtoken");

// Helper function to get consistent local YYYY-MM-DD
const getLocalDateString = (dateObj) => {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Middleware to verify admin token
const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Track Visitor (PUBLIC)
router.post("/track-visitor", async (req, res) => {
  try {
    const today = new Date();
    // Use consistent local time to prevent UTC midnight mismatches
    const date = getLocalDateString(today); 
    const day = today.toLocaleString("en-US", { weekday: "long" });

    // Upsert + return updated document
    const visitor = await Visitor.findOneAndUpdate(
      { date },
      { $setOnInsert: { day }, $inc: { visitorCount: 1 } },
      { upsert: true, new: true }
    );

    res.status(200).json({ visitorCount: visitor.visitorCount });
  } catch (error) {
    console.error("❌ Error in /track-visitor:", error);
    res.status(500).json({ message: "Error tracking visitor" });
  }
});

// Get total visitor count across all days (PROTECTED)
router.get("/visitor-count", verifyAdmin, async (req, res) => {
  try {
    const result = await Visitor.aggregate([
      {
        $group: {
          _id: null,
          totalVisitors: { $sum: "$visitorCount" },
        },
      },
    ]);

    const totalVisitors = result.length > 0 ? result[0].totalVisitors : 0;
    res.status(200).json({ visitorCount: totalVisitors });
  } catch (error) {
    console.error("❌ Error in /visitor-count:", error);
    res.status(500).json({ message: "Error fetching visitor count" });
  }
});

// Get today's visitor count (PROTECTED)
router.get("/today-count", verifyAdmin, async (req, res) => {
  try {
    const today = getLocalDateString(new Date());
    const visitorData = await Visitor.findOne({ date: today });
    res.status(200).json({ visitorCount: visitorData?.visitorCount || 0 });
  } catch (error) {
    console.error("❌ Error in /today-count:", error);
    res.status(500).json({ message: "Error fetching today's visitor count" });
  }
});

// Weekly Stats - Generates a contiguous 7-day array (PROTECTED)
router.get("/weekly-stats", verifyAdmin, async (req, res) => {
  try {
    // 1. Generate the last 7 calendar days to ensure no missing gaps
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      
      const dateStr = getLocalDateString(d);
      const dayName = d.toLocaleString("en-US", { weekday: "short" }); // e.g. "Mon"
      
      // Initialize each day with 0 visitors
      last7Days.push({ date: dateStr, name: dayName, visitors: 0 });
    }

    // 2. Query the DB for ONLY those specific 7 dates
    const dateStrings = last7Days.map(day => day.date);
    const weeklyData = await Visitor.find({ date: { $in: dateStrings } }).lean();

    // 3. Map actual DB records into our perfect 7-day calendar array
    weeklyData.forEach(record => {
      const match = last7Days.find(d => d.date === record.date);
      if (match) {
        match.visitors = record.visitorCount;
      }
    });

    // 4. Return just the formatted data for the Recharts graph
    const formatted = last7Days.map(d => ({ name: d.name, visitors: d.visitors }));

    res.json(formatted);
  } catch (error) {
    console.error("❌ Error fetching weekly stats:", error);
    res.status(500).json({ message: "Failed to get weekly data" });
  }
});

module.exports = router;