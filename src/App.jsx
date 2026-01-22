import { Navbar, Footer } from "./components/Navbar";
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import ScrollToTop from "./components/ScrollToTop";

// Pages
import HomePage from "./pages/HomePage";
import ViewPostPage from "./pages/ViewPostPage";
import NotFoundPage from "./pages/NotFoundPage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

// Admin System
import AdminLayout from "./components/Admin/AdminLayout";
import ArticleManagementPage from "./pages/Admin/ArticleManagementPage";
import ArticleFormPage from "./pages/Admin/ArticleFormPage";
import CategoryManagementPage from "./pages/Admin/CategoryManagementPage";
import CategoryFormPage from "./pages/Admin/CategoryFormPage";
import AdminProfilePage from "./pages/Admin/AdminProfilePage";
import NotificationPage from "./pages/Admin/NotificationPage";
import AdminResetPasswordPage from "./pages/Admin/AdminResetPasswordPage";

// --- Layout Definitions ---

// 1. Layout สำหรับหน้าทั่วไป (Full Layout: Navbar + Content + Footer)
const MainLayout = () => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="grow">
      <Outlet />
    </main>
    <Footer />
  </div>
);

// 2. Layout สำหรับหน้า Auth/Settings (Partial Layout: Navbar + Content)
const AuthLayout = () => (
  <main className="min-h-screen">
    <Navbar />
    <Outlet />
  </main>
);

// --- Guard Components ---

// Component สำหรับเช็คสิทธิ์ Admin ก่อนเข้าถึงหน้า Dashboard
const ProtectedAdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  // ตรวจสอบว่ามี User ในระบบและมี Role เป็น admin หรือไม่
  if (!user || user.role !== "admin") {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

// --- Main App Component ---

export default function App() {
  return (
    <BrowserRouter>
      {/* Toast Configuration: รองรับ Custom Toast bg-green/bg-red ที่คุณต้องการ */}
      <Toaster
        position="bottom-right"
        expand={false}
        richColors
        closeButton={false}
      />
      <ScrollToTop />

      <Routes>
        {/* กลุ่มที่ 1: หน้าสำหรับผู้ใช้ทั่วไป (มี Navbar + Footer) */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/post/:id" element={<ViewPostPage />} />
        </Route>

        {/* กลุ่มที่ 2: หน้า Auth และโปรไฟล์ (มี Navbar เท่านั้น) */}
        <Route element={<AuthLayout />}>
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin/login" element={<LoginPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>

        {/* กลุ่มที่ 3: ระบบจัดการหลังบ้าน (Protected Admin Panel พร้อม Sidebar) */}
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminLayout />
            </ProtectedAdminRoute>
          }
        >
          {/* หน้าจัดการบทความ (Index) */}
          <Route index element={<ArticleManagementPage />} />
          {/* เมนูอื่นๆ ภายใน Admin Panel */}

          <Route path="create" element={<ArticleFormPage />} />
          <Route path="edit/:id" element={<ArticleFormPage />} />
          <Route path="category" element={<CategoryManagementPage />} />
          <Route path="category/create" element={<CategoryFormPage />} />
          <Route path="category/edit/:name" element={<CategoryFormPage />} />
          <Route path="profile" element={<AdminProfilePage />} />
          <Route path="notification" element={<NotificationPage />} />
          <Route path="reset-password" element={<AdminResetPasswordPage />} />
        </Route>

        {/* กลุ่มที่ 4: กรณีไม่พบหน้า (404) */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
