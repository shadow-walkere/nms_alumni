import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./page/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer"; // <-- Added Footer import
import Alumni from "./page/alumni";
import ScrollToTop from "./components/ScrollTop";
import Auth from "./page/Auth";
import Donations from "./page/Donation";
import Gallery from "./page/Gallery";
import NewsEvents from "./page/Events";
import Contact from "./page/ContactUs";

function App() {
  return (
    <BrowserRouter>
      {/* Global wrapper to maintain the black theme and text selection color */}
      <div className="bg-black min-h-screen flex flex-col selection:bg-yellow-500 selection:text-black">
        
        {/* Navbar sits outside the Routes so it renders consistently on every page */}
        <Navbar />

        {/* main container with flex-grow to push footer to the bottom, and top padding so content isn't hidden behind the fixed navbar */}
        <main className="pt-24 flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/alumni" element={<Alumni />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/donations" element={<Donations />} />
            <Route path="/Gallery" element={<Gallery />} />
            <Route path="/events" element={<NewsEvents />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>

        {/* Footer sits outside the Routes so it renders at the bottom of every page */}
        <Footer />
        
      </div>
    </BrowserRouter>
  );
}

export default App;