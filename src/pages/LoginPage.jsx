import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, X } from "lucide-react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import axios from "axios"; // หรือใช้ fetch ก็ได้
import { useAuth } from "@/contexts/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function LoginPage() {
  
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const { login } = useAuth(); 

  const isAdminPage = location.pathname.includes("admin");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    let newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const showErrorToast = (title, message) => {
    toast.custom((t) => (
      <div className="bg-red text-white p-5 rounded-2xl shadow-lg flex justify-between items-start w-full max-w-[400px] relative animate-in slide-in-from-right-5 font-poppins">
        <div className="flex flex-col gap-1">
          <h3 className="text-xl font-bold">{title}</h3>
          <p className="text-white/90 text-sm">{message}</p>
        </div>
        <button onClick={() => toast.dismiss(t)} className="cursor-pointer">
          <X className="w-5 h-5" />
        </button>
      </div>
    ), { duration: 4000 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
  
    setLoading(true);
    try {
      // Step 1: Login → รับ access_token
      const { data: loginData } = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: formData.email,
        password: formData.password,
      });

      const { data: userData } = await axios.get(`${API_BASE_URL}/auth/get-user`, {
        headers: { Authorization: `Bearer ${loginData.access_token}` },
      });

      if (isAdminPage && userData.role !== "admin") {
        showErrorToast("Access Denied!", "You do not have permission to access the Admin Panel.");
        return;
      }

      login(loginData.access_token, userData);

      toast.custom((t) => (
        <div className="bg-green text-white p-5 rounded-2xl shadow-lg flex justify-between items-start w-full max-w-[400px] relative animate-in slide-in-from-right-5 font-poppins">
          <div className="flex flex-col gap-1">
            <h3 className="text-xl font-bold">Login Successful!</h3>
            <p className="text-white/90 text-sm">
              Welcome, {userData.name}!{" "}
              {isAdminPage ? "Accessing Admin Panel..." : "Redirecting..."}
            </p>
          </div>
          <button onClick={() => toast.dismiss(t)} className="cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>
      ), { duration: 2000 });

      setTimeout(() => {
        window.location.href = userData.role === "admin" ? "/admin" : "/";
      }, 1500);

    } catch (error) {
      const message =
        error.response?.data?.error || "Something went wrong. Please try again.";
      showErrorToast("Login Failed!", message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-100 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center gap-4 animate-in fade-in duration-300">
          <Spinner className="h-12 w-12 text-brown-600" />
          <p className="text-brown-600 font-bold font-poppins animate-pulse">
            Authenticating...
          </p>
        </div>
      )}

      {/* พื้นหลัง: Admin = เทาอ่อน (#EEEFEF), User = น้ำตาลอ่อน */}
      <div
        className={`min-h-[calc(100vh-80px)] w-full flex items-center justify-center p-4 font-poppins transition-colors ${
          isAdminPage ? "bg-[#EEEFEF]" : "bg-brown-100"
        }`}
      >
        {/* การ์ด: Admin = พื้นหลังเดียวกับจอและไม่มีขอบ, User = น้ำตาลเข้มขึ้นและมีขอบ */}
        <div
          className={`w-full max-w-[480px] p-10 rounded-[40px] flex flex-col items-center transition-all ${
            isAdminPage
              ? "bg-transparent shadow-none"
              : "bg-brown-200 shadow-sm border border-brown-300"
          }`}
        >
          <div className="text-center mb-10">
            {isAdminPage && (
              <p className="text-orange font-medium text-lg mb-1">
                Admin panel
              </p>
            )}
            <h1
              className={`${
                isAdminPage ? "text-black" : "text-brown-600"
              } font-bold text-5xl`}
            >
              Log in
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
            <div className="flex flex-col gap-1.5 text-left w-full">
              <Label
                className={`body-2 ml-1 ${
                  isAdminPage ? "text-gray-500 font-bold" : "text-brown-500"
                }`}
              >
                Email
              </Label>
              <Input
                type="text"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className={`h-[56px] bg-white border-none rounded-xl px-4 body-1 shadow-sm transition-all focus-visible:ring-1 ${
                  errors.email
                    ? "ring-1 ring-red"
                    : "focus-visible:ring-brown-300"
                }`}
              />
              {errors.email && (
                <span className="text-red body-3 ml-1">{errors.email}</span>
              )}
            </div>

            <div className="flex flex-col gap-1.5 text-left w-full">
              <Label
                className={`body-2 ml-1 ${
                  isAdminPage ? "text-gray-500 font-bold" : "text-brown-500"
                }`}
              >
                Password
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`h-[56px] bg-white border-none rounded-xl px-4 pr-12 body-1 shadow-sm transition-all focus-visible:ring-1 ${
                    errors.password
                      ? "ring-1 ring-red"
                      : "focus-visible:ring-brown-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-brown-400 hover:text-brown-600 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <span className="text-red body-3 ml-1">{errors.password}</span>
              )}
            </div>

            <div className="flex justify-center mt-6">
              <Button
                type="submit"
                className={`w-[180px] h-[56px] text-white body-1 rounded-full font-bold shadow-lg transition-all active:scale-95 cursor-pointer ${
                  isAdminPage
                    ? "bg-[#231F20] hover:bg-black"
                    : "bg-brown-600 hover:bg-brown-500"
                }`}
              >
                Log in
              </Button>
            </div>
          </form>

          {/* ซ่อนลิงก์ Sign up ถ้าอยู่ในหน้า Admin */}
          {!isAdminPage && (
            <div className="mt-12 flex items-center gap-2 body-2 text-brown-400">
              <span>Don’t have any account?</span>
              <Link
                to="/signup"
                className="text-brown-600 font-bold underline underline-offset-4 hover:opacity-70 cursor-pointer"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default LoginPage;
