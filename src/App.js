import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./page/Home";
import Alumni from "./page/alumni";
import Auth from "./page/Auth";
import Donations from "./page/Donation";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/alumni" element={<Alumni />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/donations" element={<Donations />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;