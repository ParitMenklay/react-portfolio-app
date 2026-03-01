import React, { useState } from "react";
import { User, RefreshCw, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom"; // ใช้ useNavigate แทน Link
import { Spinner } from "@/components/ui/spinner";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: "Moodeng ja",
    username: "moodeng.cute",
    email: "moodeng.cute@gmail.com",
    profilePicture: "https://placehold.co/40x40/D2691E/white?text=MD",
  });

  const [loading, setLoading] = useState(false);

  // --- ฟังก์ชันเปลี่ยนหน้าพร้อม Spinner ---
  const handleNavigate = async (path) => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600)); // หน่วงเวลา Spinner สั้นๆ
    navigate(path);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true); // แสดง Spinner เต็มหน้าจอขณะบันทึก

    // จำลองการหน่วงเวลาส่งข้อมูล
    await new Promise((resolve) => setTimeout(resolve, 1200));

    try {
      toast.custom((t) => (
        <div className="flex items-start justify-between w-full max-w-[400px] bg-[#10B981] text-white p-4 rounded-xl shadow-lg animate-in fade-in slide-in-from-top-2 duration-300 font-poppins">
          <div className="flex flex-col gap-1 text-left">
            <h3 className="text-xl font-bold leading-tight">Saved profile</h3>
            <p className="text-sm opacity-90 font-medium">
              Your profile has been successfully updated
            </p>
          </div>
          <button
            onClick={() => toast.dismiss(t)}
            className="p-1 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      ));
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false); // ปิด Spinner เมื่อทำงานเสร็จ
    }
  };

  // --- หน้าจอ Loading แบบ Full-screen ---
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
      {/* Navigation Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between lg:justify-start lg:gap-12">
          {/* เมนู Profile (หน้าปัจจุบัน) */}
          <div className="flex items-center gap-2 cursor-pointer text-brown-600 font-medium text-base">
            <User className="w-5 h-5 text-brown-400" />
            <span>Profile</span>
          </div>

          {/* เมนู Reset Password - เปลี่ยนเป็น onClick เพื่อเรียก Spinner */}
          <div
            onClick={() => handleNavigate("/reset-password")}
            className="flex items-center gap-2 cursor-pointer text-brown-400 hover:text-brown-600 transition-colors font-medium text-base group"
          >
            <RefreshCw className="w-5 h-5 text-brown-400 group-hover:text-brown-600" />
            <span>Reset password</span>
          </div>
        </div>
      </div>

      {/* Page Title Area */}
      <div className="bg-white border-b border-gray-100 px-6 py-6">
        <div className="max-w-4xl mx-auto flex items-center gap-4 font-poppins">
          <img
            src={profile.profilePicture}
            alt="Avatar"
            className="w-12 h-12 rounded-full object-cover border border-gray-200"
          />
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-brown-500 truncate max-w-[120px] md:max-w-none">
              {profile.name}
            </h2>
            <div className="h-6 w-px bg-gray-300 mx-1"></div>
            <h2 className="text-xl font-bold text-brown-600">Profile</h2>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-6 py-12 flex flex-col items-center">
        {/* Profile Picture Upload Section */}
        <div className="flex flex-col items-center gap-6 w-full mb-10">
          <div className="relative">
            <img
              src={profile.profilePicture}
              alt="Profile"
              className="w-40 h-40 lg:w-48 lg:h-48 rounded-full object-cover border-4 border-white shadow-sm"
            />
          </div>
          <Button
            variant="outline"
            className="rounded-full px-8 py-6 border-brown-300 text-brown-600 font-bold hover:bg-brown-50 cursor-pointer w-full max-w-[280px] shadow-sm active:scale-95 transition-all"
          >
            Upload profile picture
          </Button>
        </div>

        {/* Form Section */}
        <div className="w-full space-y-8">
          <div className="space-y-3">
            <Label
              htmlFor="name"
              className="text-brown-400 text-base font-medium ml-1"
            >
              Name
            </Label>
            <Input
              id="name"
              name="name"
              value={profile.name}
              onChange={handleChange}
              className="h-14 rounded-2xl border-none bg-white shadow-sm focus-visible:ring-1 focus-visible:ring-brown-300 text-brown-600 text-lg px-6"
            />
          </div>

          <div className="space-y-3">
            <Label
              htmlFor="username"
              className="text-brown-400 text-base font-medium ml-1"
            >
              Username
            </Label>
            <Input
              id="username"
              name="username"
              value={profile.username}
              onChange={handleChange}
              className="h-14 rounded-2xl border-none bg-white shadow-sm focus-visible:ring-1 focus-visible:ring-brown-300 text-brown-600 text-lg px-6"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-brown-400 text-base font-medium ml-1">
              Email
            </Label>
            <div className="h-14 flex items-center text-brown-300 text-lg px-6 italic font-medium">
              {profile.email}
            </div>
          </div>

          <div className="pt-4 flex justify-center md:justify-start">
            <Button
              onClick={handleSave}
              className="w-full md:w-40 h-14 rounded-full bg-[#231F20] hover:bg-black text-white text-lg font-bold shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
