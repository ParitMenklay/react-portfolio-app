import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, X } from "lucide-react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner"; // นำเข้า Spinner

const MOCK_USER = {
  email: "moodeng.cute@gmail.com",
  password: "password123",
};

function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // เพิ่ม State สำหรับ Loading
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setLoading(true); // เปิด Spinner บังหน้าจอไว้

      // จำลองการโหลดข้อมูล
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (
        formData.email === MOCK_USER.email &&
        formData.password === MOCK_USER.password
      ) {
        // 1. เก็บข้อมูลลง LocalStorage
        localStorage.setItem(
          "user",
          JSON.stringify({
            email: MOCK_USER.email,
            name: "Moodeng ja",
          })
        );

        // 2. แทนที่จะ reload ทันที ให้รอสักพักเพื่อให้แน่ใจว่า Spinner ยังบังอยู่
        // แล้วใช้ window.location.href แทน navigate เพื่อให้หน้าใหม่โหลดมาพร้อมสถานะ Login เลย
        window.location.href = "/"; 
        
        // หมายเหตุ: การใช้ window.location.href จะทำให้หน้าเว็บ Reload ไปที่หน้า Home 
        // โดยที่ User จะไม่เห็นหน้า Login กระพริบขึ้นมา เพราะ Spinner ของหน้าเดิมยังค้างอยู่จนกว่าหน้าใหม่จะมา
      } else {
        setLoading(false);
        toast.custom(
          (t) => (
            <div className="bg-red text-white p-5 rounded-2xl shadow-lg flex justify-between items-start w-full max-w-[400px] md:max-w-[450px] relative animate-in slide-in-from-right-5">
              <div className="flex flex-col gap-1 font-poppins">
                <h3 className="text-xl font-bold">Login Failed!</h3>
                <p className="text-white/90 text-sm">
                  Your password is incorrect or this email doesn't exist.
                </p>
              </div>
              <button onClick={() => toast.dismiss(t)} className="cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
          ),
          { duration: 4000 }
        );
      }
    }
  };

  return (
    <>
      {/* --- Spinner Overlay --- */}
      {loading && (
        <div className="fixed inset-0 z-[100] bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center gap-4 animate-in fade-in duration-300">
          <Spinner className="h-12 w-12 text-brown-600" />
          <p className="text-brown-600 font-bold font-poppins animate-pulse">Authenticating...</p>
        </div>
      )}

      <div className="min-h-screen w-full bg-brown-100 flex items-center justify-center p-4 font-poppins">
        <div className="bg-brown-200 w-full max-w-[480px] p-10 rounded-[40px] flex flex-col items-center shadow-sm border border-brown-300">
          <div className="text-center mb-10">
            <h1 className="text-brown-600 font-bold text-3xl">Log in</h1>
          </div>

          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
            <div className="flex flex-col gap-1.5 text-left w-full">
              <Label className="body-2 text-brown-500 ml-1">Email</Label>
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
                <span className="text-red body-3 ml-1 animate-in fade-in">
                  {errors.email}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1.5 text-left w-full">
              <Label className="body-2 text-brown-500 ml-1">Password</Label>
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
                <span className="text-red body-3 ml-1 animate-in fade-in">{errors.password}</span>
              )}
            </div>

            <div className="flex justify-center mt-6">
              <Button
                type="submit"
                className="w-[180px] h-[56px] bg-brown-600 hover:bg-brown-500 text-white body-1 rounded-full font-bold shadow-lg transition-all active:scale-95 cursor-pointer"
              >
                Log in
              </Button>
            </div>
          </form>

          <div className="mt-12 flex items-center gap-2 body-2 text-brown-400">
            <span>Don’t have any account?</span>
            <Link
              to="/signup"
              className="text-brown-600 font-bold underline underline-offset-4 hover:opacity-70 cursor-pointer transition-opacity"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginPage;