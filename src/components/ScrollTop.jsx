import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Optional fade-in animation after scroll
    const body = document.body;
    body.classList.add("page-fade-in");
    const timer = setTimeout(() => body.classList.remove("page-fade-in"), 600);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
