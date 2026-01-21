import { Navbar, Footer } from "./components/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ViewPostPage from "./pages/ViewPostPage";
import { Toaster } from "@/components/ui/sonner"
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <>
      <BrowserRouter>
      {/* Container หลักที่ทำให้ Footer อยู่ล่างสุด */}
      <div className="flex flex-col min-h-screen">
        <Navbar />

        {/* main พร้อม flex-grow จะยืดตัวเพื่อดัน Footer ลงไปข้างล่าง */}
        <main className="grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/post/:id" element={<ViewPostPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        <Footer />
        <Toaster/>
      </div>
    </BrowserRouter>
    </>
  );
}
