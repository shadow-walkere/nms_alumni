
"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import {
  Sparkles,
  Camera,
  Heart,
  Users,
  Coffee,
  Home,
  TreePine,
  PartyPopper,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

export default function Gallery() {
  const [filter, setFilter] = useState("All");
  const [images, setImages] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch images from backend
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch(`${SERVER_URL}/api/gallery`);
        const data = await res.json();
        if (data.success) setImages(data.data);
      } catch (err) {
        console.error("Failed to fetch images:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  // ✅ Filter images by category
  const filteredImages =
    filter === "All"
      ? images
      : images.filter((img) => img.category === filter);

  const nextImage = () =>
    setSelectedIndex((prev) => (prev + 1) % filteredImages.length);
  const prevImage = () =>
    setSelectedIndex(
      (prev) => (prev - 1 + filteredImages.length) % filteredImages.length
    );

  // ✅ Keyboard controls
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") setSelectedIndex(null);
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  });

  const categories = [
    "All",
    "Weddings",
    "Food & Drinks",
    "Accommodation",
    "Team Building",
    "Picnics",
    "Adventure playground",
  ];

  return (
    <div className="bg-gradient-to-b from-green-50 to-white overflow-x-hidden">
      {/* 🌿 Hero Section */}
      <section
        className="relative h-[50vh] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/nature1.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-center text-white px-6"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold mb-3 drop-shadow-lg">
            The Heart of The Thorn & Thatch
          </h1>
          <p className="text-lg text-green-100 max-w-2xl mx-auto">
            Wander through nature, laughter, and memories—captured in every frame.
          </p>
        </motion.div>
      </section>

      {/* 🌸 Filter Section */}
      <section className="py-12 text-center">
        <h2 className="text-3xl font-semibold text-green-800 mb-8">
          Explore by Category
        </h2>
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((cat) => (
            <motion.button
              key={cat}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2 rounded-full border text-sm font-medium transition-all flex items-center gap-2 shadow-sm ${
                filter === cat
                  ? "bg-green-700 text-white border-green-700"
                  : "bg-white text-green-700 border-green-500 hover:bg-green-50"
              }`}
            >
              <Sparkles className="w-4 h-4" /> {cat}
            </motion.button>
          ))}
        </div>
      </section>

      {/* 🖼️ Gallery Grid */}
      <LayoutGroup>
        <motion.section
          layout
          className="px-6 pb-20 max-w-6xl mx-auto grid gap-6 sm:grid-cols-2 md:grid-cols-3"
        >
          {loading ? (
            <p className="text-center text-gray-500 col-span-full">Loading images...</p>
          ) : filteredImages.length === 0 ? (
            <p className="text-center text-gray-500 col-span-full">No images found.</p>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredImages.map((img, index) => (
                <motion.div
                  key={img._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  onClick={() => setSelectedIndex(index)}
                  className="relative overflow-hidden rounded-3xl shadow-lg cursor-pointer group"
                >
                  <img
                    src={img.imageUrl}
                    alt={img.category}
                    className="w-full h-72 object-cover transform group-hover:scale-110 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-green-800/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                    <Camera className="text-white w-10 h-10" />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </motion.section>
      </LayoutGroup>

      {/* 💫 Lightbox Viewer */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              onClick={() => setSelectedIndex(null)}
              className="absolute top-6 right-6 text-white p-2 rounded-full hover:bg-white/10"
            >
              <X size={36} />
            </button>

            <motion.div
              key={filteredImages[selectedIndex].imageUrl}
              className="max-w-[90%] max-h-[80vh]"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.8}
              onDragEnd={(e, info) => {
                if (info.offset.x > 100) prevImage();
                else if (info.offset.x < -100) nextImage();
              }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <img
                src={filteredImages[selectedIndex].imageUrl}
                alt="Selected"
                className="w-full h-full object-contain rounded-2xl shadow-2xl"
              />
            </motion.div>

            <button
              onClick={prevImage}
              className="absolute left-6 text-white p-3 rounded-full hover:bg-white/10"
            >
              <ChevronLeft size={40} />
            </button>

            <button
              onClick={nextImage}
              className="absolute right-6 text-white p-3 rounded-full hover:bg-white/10"
            >
              <ChevronRight size={40} />
            </button>

            <p className="absolute bottom-10 text-white text-sm bg-black/40 px-4 py-2 rounded-full">
              {filteredImages[selectedIndex].category} — {selectedIndex + 1} /{" "}
              {filteredImages.length}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
