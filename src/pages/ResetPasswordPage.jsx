import React, { useState } from "react";
import { User, RefreshCw, X, Eye, EyeOff } from "lucide-react"; // เพิ่ม Eye, EyeOff
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
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

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // เพิ่ม State สำหรับจัดการการมองเห็นรหัสผ่านแยกแต่ละช่อง
  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // ฟังก์ชันสลับการมองเห็น
  const toggleVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleNavigate = async (path) => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    navigate(path);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    let newErrors = {};
    if (!passwords.currentPassword)
      newErrors.currentPassword = "Current password is required";
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

  const handleReset = async () => {
    setIsDialogOpen(false);
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));

    try {
      toast.custom((t) => (
        <div className="flex items-start justify-between w-full max-w-[400px] bg-[#10B981] text-white p-4 rounded-xl shadow-lg animate-in fade-in slide-in-from-top-2 duration-300 font-poppins border-none">
          <div className="flex flex-col gap-1 text-left">
            <h3 className="text-xl font-bold leading-tight text-white">
              Password Updated
            </h3>
            <p className="text-sm opacity-90 font-medium text-white">
              Your security settings have been updated successfully.
            </p>
          </div>
          <button
            onClick={() => toast.dismiss(t)}
            className="p-1 hover:bg-white/20 rounded-full transition-colors cursor-pointer text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      ));
      navigate("/profile");
    } catch (error) {
      toast.error("Failed to update password");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F3F3F3] flex flex-col items-center justify-center gap-4 animate-in fade-in duration-300">
        <Spinner className="h-12 w-12 text-brown-600" />
        <p className="text-brown-400 animate-pulse font-medium font-poppins">
          Processing...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#F3F3F3] font-poppins">
      {/* Header Navigation */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between lg:justify-start lg:gap-12">
          <div
            onClick={() => handleNavigate("/profile")}
            className="flex items-center gap-2 cursor-pointer text-brown-400 hover:text-brown-600 transition-colors font-medium text-base group"
          >
            <User className="w-5 h-5 text-brown-400 group-hover:text-brown-600" />
            <span>Profile</span>
          </div>
          <div className="flex items-center gap-2 text-brown-600 font-medium text-base">
            <RefreshCw className="w-5 h-5 text-brown-400" />
            <span>Reset password</span>
          </div>
        </div>
      </div>

      {/* Page Title Area */}
      <div className="bg-white border-b border-gray-100 px-6 py-6">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <img
            src="https://placehold.co/40x40/D2691E/white?text=MD"
            alt="Avatar"
            className="w-12 h-12 rounded-full object-cover border border-gray-200 cursor-pointer"
            onClick={() => handleNavigate("/profile")}
          />
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-brown-500 truncate max-w-[120px]">
              Moodeng ja
            </h2>
            <div className="h-6 w-px bg-gray-300 mx-1"></div>
            <h2 className="text-xl font-bold text-brown-600">Reset password</h2>
          </div>
        </div>
      </div>

      {/* Main Form Area */}
      <div className="max-w-md mx-auto px-6 py-12">
        <div className="w-full space-y-6">
          {["currentPassword", "newPassword", "confirmPassword"].map(
            (field) => (
              <div key={field} className="space-y-2">
                <Label className="text-brown-400 text-base font-medium ml-1 capitalize">
                  {field.replace(/([A-Z])/g, " $1")}
                </Label>
                <div className="relative">
                  <Input
                    type={showPasswords[field] ? "text" : "password"}
                    name={field}
                    placeholder={field.replace(/([A-Z])/g, " $1")}
                    value={passwords[field]}
                    onChange={handleChange}
                    className={`h-14 rounded-2xl border-none bg-white shadow-sm focus-visible:ring-1 pr-14 ${
                      errors[field]
                        ? "ring-1 ring-red"
                        : "focus-visible:ring-brown-300"
                    } text-brown-600 text-lg px-6`}
                  />
                  {/* ปุ่มเปิด-ปิดตา */}
                  <button
                    type="button"
                    onClick={() => toggleVisibility(field)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-brown-400 hover:text-brown-600 transition-colors cursor-pointer p-1"
                  >
                    {showPasswords[field] ? (
                      <EyeOff size={22} />
                    ) : (
                      <Eye size={22} />
                    )}
                  </button>
                </div>
                {errors[field] && (
                  <p className="text-red text-sm ml-1 font-medium">
                    {errors[field]}
                  </p>
                )}
              </div>
            )
          )}

          <div className="pt-4 flex justify-center md:justify-start">
            <Button
              onClick={handleOpenDialog}
              className="w-full md:w-auto md:px-12 h-14 rounded-full bg-[#231F20] hover:bg-black text-white text-lg font-bold shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              Reset password
            </Button>
          </div>
        </div>
      </div>

      {/* AlertDialog */}
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent className="rounded-[32px] max-w-[90%] md:max-w-[420px] p-8 border-none shadow-2xl font-poppins">
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
              Do you want to reset your password?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-center gap-4 mt-2">
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
};

export default ResetPasswordPage;
