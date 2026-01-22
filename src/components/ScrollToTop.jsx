import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]); // ทุกครั้งที่เปลี่ยน Path (เปลี่ยนหน้า) ให้เลื่อนขึ้นบนสุด

  return null;
}