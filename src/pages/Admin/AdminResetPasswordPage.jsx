import React, { useState } from "react";
import { X, Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

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

export default function AdminResetPasswordPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // State สำหรับจัดการข้อมูลรหัสผ่าน
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // State สำหรับจัดการการมองเห็นรหัสผ่านแยกแต่ละช่อง
  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const [errors, setErrors] = useState({});

  // ฟังก์ชันสลับการมองเห็น (Eye/EyeOff)
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
    setIsLoading(true);

    try {
      // จำลองการทำงาน 1.2 วินาที
      await new Promise((resolve) => setTimeout(resolve, 1200));

      toast.custom((t) => (
        <div className="bg-green text-white p-5 rounded-2xl shadow-lg flex justify-between items-start w-[380px] animate-in slide-in-from-right-5 font-poppins border border-white/10">
          <div className="flex flex-col gap-1 text-left">
            <h3 className="text-xl font-bold">Success!</h3>
            <p className="text-white/90 text-sm">
              Your password has been reset successfully.
            </p>
          </div>
          <button
            onClick={() => toast.dismiss(t)}
            className="cursor-pointer hover:bg-white/20 p-1 rounded-full transition-colors shrink-0 text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      ));

      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error("Failed to update password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-10 font-poppins min-h-screen max-w-4xl">
      {/* Header Area */}
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
              <span>Resetting...</span>
            </div>
          ) : (
            "Reset password" // ข้อความปุ่มตามดีไซน์
          )}
        </Button>
      </div>

      <Separator className="mb-10" />

      {/* Main Form Area */}
      <div className="grid gap-8 max-w-xl">
        {["currentPassword", "newPassword", "confirmPassword"].map((field) => (
          <div key={field} className="grid gap-2">
            <label className="text-[15px] font-bold text-gray-500 capitalize">
              {field.replace(/([A-Z])/g, " $1")} {/* แสดง Label ตามชื่อฟิลด์ */}
            </label>
            <div className="relative">
              <Input
                type={showPasswords[field] ? "text" : "password"}
                name={field}
                value={passwords[field]}
                onChange={handleChange}
                placeholder={field.replace(/([A-Z])/g, " $1")} // Placeholder ตามดีไซน์
                className={`h-12 bg-white border-gray-200 rounded-xl focus-visible:ring-1 shadow-sm text-lg pr-12 ${
                  errors[field]
                    ? "border-red ring-1 ring-red"
                    : "focus-visible:ring-gray-300"
                }`}
              />
              <button
                type="button"
                onClick={() => toggleVisibility(field)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer p-1"
              >
                {showPasswords[field] ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>
            {errors[field] && (
              <p className="text-red text-sm font-medium ml-1">
                {errors[field]}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* AlertDialog ยืนยันการ Reset */}
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
              Do you want to reset your password?
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
