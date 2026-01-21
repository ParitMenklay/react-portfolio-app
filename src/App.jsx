import { Navbar, Footer } from "./components/Navbar";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ViewPostPage from "./pages/ViewPostPage";
import { Toaster } from "@/components/ui/sonner"
import NotFoundPage from "./pages/NotFoundPage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";

// 1. สร้าง Layout สำหรับหน้าที่ "มี" Navbar/Footer
const MainLayout = () => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="grow">
      <Outlet /> {/* ตรงนี้คือจุดที่เนื้อหาของ HomePage, ViewPostPage จะมาแสดง */}
    </main>
    <Footer />
  </div>
);

// 2. สร้าง Layout สำหรับหน้าที่ "ไม่มี" Navbar/Footer (เช่น หน้า Auth)
const AuthLayout = () => (
  <main className="min-h-screen">
    <Outlet /> {/* ตรงนี้คือจุดที่เนื้อหาของ SignUpPage จะมาแสดง */}
  </main>
);

export default function App() {
  return (
    <>
      <BrowserRouter>
      <Toaster 
          position="bottom-right" 
          expand={false} 
          richColors 
          closeButton
        />
      <Routes>
        {/* กลุ่มหน้าที่ต้องการ Navbar/Footer */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/post/:id" element={<ViewPostPage />} />
        </Route>

        {/* กลุ่มหน้าอื่นๆ ที่ไม่เอา Navbar/Footer */}
        <Route element={<AuthLayout />}>
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          {/* <Route path="/forgot-password" element={<ForgotPassword />} /> */}
        </Route>

        {/* หน้า 404 */}
        <Route path="*" element={<NotFoundPage />} />
        
      </Routes>
    </BrowserRouter>
    </>
  );
}
