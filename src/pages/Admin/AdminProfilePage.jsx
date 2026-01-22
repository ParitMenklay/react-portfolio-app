import React, { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { toast } from "sonner";

// shadcn/ui components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

export default function AdminProfilePage() {
  const [isLoading, setIsLoading] = useState(false);

  // State สำหรับจัดการข้อมูลในฟอร์มทั้งหมด
  const [profile, setProfile] = useState({
    name: "Thompson P.",
    username: "thompson",
    email: "thompson.p@gmail.com",
    bio: "I am a pet enthusiast and freelance writer who specializes in animal behavior and care. With a deep love for cats, I enjoy sharing insights on feline companionship and wellness.\n\nWhen i'm not writing, I spends time volunteering at my local animal shelter, helping cats find loving homes.",
  });

  // ฟังก์ชันสำหรับ Handle การพิมพ์ของทุก Input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (!profile.name.trim() || !profile.email.trim()) {
      toast.custom((t) => (
        <div className="bg-red text-white p-5 rounded-2xl shadow-lg flex justify-between items-start w-[380px] animate-in slide-in-from-right-5 font-poppins border border-white/10">
          <div className="flex flex-col gap-1">
            <h3 className="text-xl font-bold">Error!</h3>
            <p className="text-white/90 text-sm">
              Please fill in all required fields.
            </p>
          </div>
          <button
            onClick={() => toast.dismiss(t)}
            className="cursor-pointer hover:bg-white/20 p-1 rounded-full transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      ));
      return;
    }

    setIsLoading(true);

    try {
      // จำลองการบันทึกข้อมูล
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.custom((t) => (
        <div className="bg-green text-white p-5 rounded-2xl shadow-lg flex justify-between items-start w-[380px] animate-in slide-in-from-right-5 font-poppins border border-white/10">
          <div className="flex flex-col gap-1">
            <h3 className="text-xl font-bold">Success!</h3>
            <p className="text-white/90 text-sm">
              Profile updated successfully.
            </p>
          </div>
          <button
            onClick={() => toast.dismiss(t)}
            className="cursor-pointer hover:bg-white/20 p-1 rounded-full transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      ));
    } catch (error) {
      toast.error("Save failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-10 font-poppins min-h-screen w-full">
      {/* Header Area */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#231F20]">Profile</h2>
        <Button
          onClick={handleSave}
          disabled={isLoading}
          className="bg-[#231F20] hover:bg-black text-white rounded-full px-8 h-12 cursor-pointer font-bold transition-all active:scale-95 shadow-md flex items-center gap-2 min-w-[120px]"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save"
          )}
        </Button>
      </div>

      <Separator className="mb-10" />

      {/* Profile Picture Section */}
      <div className="flex items-center gap-6 mb-10">
        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-100 shadow-sm">
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop"
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <Button
          variant="outline"
          className="rounded-full px-6 h-11 border-gray-300 text-[#231F20] font-bold hover:bg-gray-50 cursor-pointer transition-all active:scale-95"
        >
          Upload profile picture
        </Button>
      </div>

      {/* Form Fields */}
      <div className="grid gap-8 max-w-xl">
        {/* Name */}
        <div className="grid gap-2">
          <label className="text-[15px] font-bold text-gray-500">Name</label>
          <Input
            name="name"
            value={profile.name}
            onChange={handleChange}
            className="h-12 bg-white border-gray-200 rounded-xl focus-visible:ring-1 focus-visible:ring-gray-300 shadow-sm text-lg"
          />
        </div>

        {/* Username */}
        <div className="grid gap-2">
          <label className="text-[15px] font-bold text-gray-500">
            Username
          </label>
          <Input
            name="username"
            value={profile.username}
            onChange={handleChange}
            className="h-12 bg-white border-gray-200 rounded-xl focus-visible:ring-1 focus-visible:ring-gray-300 shadow-sm text-lg"
          />
        </div>

        {/* Email - พิมพ์ได้เหมือนช่องอื่นแล้ว */}
        <div className="grid gap-2">
          <label className="text-[15px] font-bold text-gray-500">Email</label>
          <Input
            type="email"
            name="email"
            value={profile.email}
            onChange={handleChange}
            className="h-12 bg-white border-gray-200 rounded-xl focus-visible:ring-1 focus-visible:ring-gray-300 shadow-sm text-lg"
          />
        </div>

        {/* Bio */}
        <div className="grid gap-2">
          <label className="text-[15px] font-bold text-gray-500">
            Bio (max 120 letters)
          </label>
          <Textarea
            name="bio"
            value={profile.bio}
            onChange={handleChange}
            className="min-h-[160px] bg-white border-gray-200 rounded-xl focus-visible:ring-1 focus-visible:ring-gray-300 shadow-sm text-lg leading-relaxed resize-none"
            maxLength={120}
          />
        </div>
      </div>
    </div>
  );
}
