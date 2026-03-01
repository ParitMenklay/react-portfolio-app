import React, { useState } from "react";
import { X, Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext"; // 1. Import useAuth มาใช้งาน

// shadcn/ui components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function AdminResetPasswordPage() {
  const navigate = useNavigate();
  const { logout } = useAuth(); // 2. ดึงฟังก์ชัน logout ออกมา
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const [errors, setErrors] = useState({});

  // --- Helpers: Toast Functions ---
  const showSuccessToast = (title, message) => {
    toast.custom((t) => (
      <div className="bg-green text-white p-5 rounded-2xl shadow-lg flex justify-between items-start w-full max-w-[400px] relative animate-in slide-in-from-right-5 font-poppins">
        <div className="flex flex-col gap-1">
          <h3 className="text-xl font-bold">{title}</h3>
          {message && <p className="text-white/90 text-sm">{message}</p>}
        </div>
        <button type="button" onClick={() => toast.dismiss(t)} className="cursor-pointer">
          <X className="w-5 h-5" />
        </button>
      </div>
    ), { duration: 2500 });
  };

  const showErrorToast = (title, message) => {
    toast.custom((t) => (
      <div className="bg-red text-white p-5 rounded-2xl shadow-lg flex justify-between items-start w-full max-w-[400px] relative animate-in slide-in-from-right-5 font-poppins">
        <div className="flex flex-col gap-1">
          <h3 className="text-xl font-bold">{title}</h3>
          {message && <p className="text-white/90 text-sm">{message}</p>}
        </div>
        <button type="button" onClick={() => toast.dismiss(t)} className="cursor-pointer">
          <X className="w-5 h-5" />
        </button>
      </div>
    ), { duration: 4000 });
  };

  const toggleVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    let newErrors = {};
    if (!passwords.currentPassword) newErrors.currentPassword = "Current password is required";
    if (!passwords.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (passwords.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      newErrors.confirmPassword = "New passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOpenDialog = () => {
    if (validateForm()) setIsDialogOpen(true);
  };

  // --- 3. ฟังก์ชัน Reset และ Logout ---
  const handleReset = async () => {
    setIsDialogOpen(false);
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      
      await axios.put(
        `${API_BASE_URL}/auth/reset-password`,
        {
          oldPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // แสดง Toast แจ้งเตือนก่อนดีดออก
      showSuccessToast(
        "Password Updated!", 
        "Security update successful. Please login again with your new password."
      );

      // หน่วงเวลาให้ User อ่าน Toast แป๊บเดียว (2.5 วินาที)
      setTimeout(() => {
        logout(); // เรียกฟังก์ชันจาก Context เพื่อเคลียร์ State และ LocalStorage
        navigate("/admin/login"); // ส่งไปหน้า Login
      }, 2500);

    } catch (error) {
      console.error("Reset password error:", error);
      const errorMessage = error.response?.data?.error || "Failed to update password";
      showErrorToast("Error!", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-10 font-poppins min-h-screen max-w-4xl">
      <div className="flex justify-between items-center mb-6 h-12">
        <h2 className="text-2xl font-bold text-[#231F20]">Reset password</h2>
        <Button
          onClick={handleOpenDialog}
          disabled={isLoading}
          className="bg-[#231F20] hover:bg-black text-white rounded-full px-8 h-12 cursor-pointer font-bold transition-all active:scale-95 shadow-md min-w-[160px]"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Updating...</span>
            </div>
          ) : (
            "Reset password"
          )}
        </Button>
      </div>

      <Separator className="mb-10" />

      <div className="grid gap-8 max-w-xl">
        {[
          { id: "currentPassword", label: "Current Password" },
          { id: "newPassword", label: "New Password" },
          { id: "confirmPassword", label: "Confirm New Password" },
        ].map((field) => (
          <div key={field.id} className="grid gap-2">
            <label className="text-[15px] font-bold text-gray-500">
              {field.label}
            </label>
            <div className="relative">
              <Input
                type={showPasswords[field.id] ? "text" : "password"}
                name={field.id}
                value={passwords[field.id]}
                onChange={handleChange}
                placeholder={field.label}
                className={`h-12 bg-white border-gray-200 rounded-xl focus-visible:ring-1 shadow-sm text-lg pr-12 ${
                  errors[field.id] ? "border-red ring-1 ring-red" : "focus-visible:ring-gray-300"
                }`}
              />
              <button
                type="button"
                onClick={() => toggleVisibility(field.id)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer p-1"
              >
                {showPasswords[field.id] ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors[field.id] && (
              <p className="text-red text-sm font-medium ml-1">{errors[field.id]}</p>
            )}
          </div>
        ))}
      </div>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent className="rounded-[32px] max-w-[420px] p-8 border-none shadow-2xl font-poppins bg-white">
          <div className="flex justify-end absolute right-6 top-6">
            <AlertDialogCancel className="border-none p-0 h-auto hover:bg-transparent cursor-pointer">
              <X className="w-6 h-6 text-gray-400" />
            </AlertDialogCancel>
          </div>
          <AlertDialogHeader className="space-y-4">
            <AlertDialogTitle className="text-center text-2xl font-bold text-[#231F20]">
              Reset password
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-base text-gray-500 font-medium">
              Do you want to reset your password? <br/> (You will be logged out)
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-center gap-4 mt-6">
            <AlertDialogCancel className="h-14 w-full sm:w-32 rounded-full border border-gray-200 text-lg font-bold hover:bg-gray-50 cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReset}
              className="h-14 w-full sm:w-32 rounded-full bg-[#231F20] hover:bg-black text-white text-lg font-bold cursor-pointer"
            >
              Reset
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}