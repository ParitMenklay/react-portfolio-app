import React, { useState, useEffect, useRef } from "react";
import { X, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// shadcn/ui components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function AdminProfilePage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const [profile, setProfile] = useState({
    name: "",
    username: "",
    email: "",
    bio: "",
    profilePic: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  // --- 1. Toast Helpers (ตามที่คุณส่งมา) ---
  const showSuccessToast = (title, message) => {
    toast.custom(
      (t) => (
        <div className="bg-green text-white p-5 rounded-2xl shadow-lg flex justify-between items-start w-full max-w-[400px] relative animate-in slide-in-from-right-5 font-poppins">
          <div className="flex flex-col gap-1">
            <h3 className="text-xl font-bold">{title}</h3>
            {message && <p className="text-white/90 text-sm">{message}</p>}
          </div>
          <button
            type="button"
            onClick={() => toast.dismiss(t)}
            className="cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      ),
      { duration: 2000 }
    );
  };

  const showErrorToast = (title, message) => {
    toast.custom(
      (t) => (
        <div className="bg-red text-white p-5 rounded-2xl shadow-lg flex justify-between items-start w-full max-w-[400px] relative animate-in slide-in-from-right-5 font-poppins">
          <div className="flex flex-col gap-1">
            <h3 className="text-xl font-bold">{title}</h3>
            {message && <p className="text-white/90 text-sm">{message}</p>}
          </div>
          <button
            type="button"
            onClick={() => toast.dismiss(t)}
            className="cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      ),
      { duration: 4000 }
    );
  };

  // --- 2. Fetch Data ---
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get(`${API_BASE_URL}/auth/get-user`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = response.data;
        setProfile({
          name: data.name || "",
          username: data.username || "",
          email: data.email || "",
          bio: data.bio || "",
          profilePic: data.profilePic || "https://via.placeholder.com/150",
        });
      } catch (error) {
        console.error("Fetch profile error:", error);
        showErrorToast("Error!", "Failed to load profile data.");
      } finally {
        setIsFetching(false);
      }
    };
    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showErrorToast("File too large", "Image size must be less than 2MB.");
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // --- 3. Save Data ---
  const handleSave = async () => {
    if (!profile.name.trim() || !profile.email.trim()) {
      showErrorToast("Required Fields", "Please enter both name and email.");
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("name", profile.name.trim());
      formData.append("username", profile.username.trim());
      formData.append("bio", profile.bio.trim());
      formData.append("email", profile.email.trim());
      formData.append("profilePic", profile.profilePic);

      if (selectedFile) {
        formData.append("profilePicFile", selectedFile);
      }

      await axios.put(`${API_BASE_URL}/auth/update-profile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      showSuccessToast(
        "Profile Updated!",
        "Your changes have been saved. Redirecting..."
      );

      // ไปหน้า Article Management หลังจากผ่านไป 2 วินาที
      setTimeout(() => {
        navigate("/admin/");
      }, 2000);
    } catch (error) {
      console.error("Update profile error:", error);
      const msg = error.response?.data?.error || "Unable to save profile.";
      showErrorToast("Save Failed", msg);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="p-10 font-poppins min-h-screen w-full bg-[#FAFAFA]">
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

      {/* Avatar Section */}
      <div className="flex items-center gap-6 mb-10">
        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white shadow-sm bg-gray-200">
          <img
            src={previewUrl || profile.profilePic}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
        <Button
          variant="outline"
          onClick={() => fileInputRef.current.click()}
          className="rounded-full px-6 h-11 border-gray-300 text-[#231F20] font-bold hover:bg-white cursor-pointer transition-all active:scale-95 flex gap-2"
        >
          <Upload size={18} />
          Upload profile picture
        </Button>
      </div>

      {/* Form Card */}
      <div className="grid gap-8 max-w-xl bg-white p-8 rounded-[24px] border border-gray-100 shadow-sm">
        <div className="grid gap-2">
          <label className="text-[15px] font-bold text-gray-500 ml-1">Name</label>
          <Input
            name="name"
            value={profile.name}
            onChange={handleChange}
            className="h-12 bg-white border-gray-200 rounded-xl focus-visible:ring-1 focus-visible:ring-gray-300 shadow-sm text-lg"
          />
        </div>

        <div className="grid gap-2">
          <label className="text-[15px] font-bold text-gray-500 ml-1">
            Username
          </label>
          <Input
            name="username"
            value={profile.username}
            onChange={handleChange}
            className="h-12 bg-white border-gray-200 rounded-xl focus-visible:ring-1 focus-visible:ring-gray-300 shadow-sm text-lg"
          />
        </div>

        <div className="grid gap-2">
          <label className="text-[15px] font-bold text-gray-500 ml-1 flex justify-between">
            Email
          </label>
          <Input
            type="email"
            name="email"
            value={profile.email}
            disabled
            onChange={handleChange}
            className="h-12 bg-[#F9F9F9] border-gray-200 rounded-xl focus-visible:ring-1 focus-visible:ring-gray-300 shadow-sm text-lg"
          />
        </div>

        <div className="grid gap-2">
          <div className="flex justify-between items-center ml-1">
            <label className="text-[15px] font-bold text-gray-500">Bio</label>
            <span className="text-xs text-gray-400">
              {profile.bio.length}/120
            </span>
          </div>
          <Textarea
            name="bio"
            value={profile.bio}
            onChange={handleChange}
            className="min-h-[160px] bg-white border-gray-200 rounded-xl focus-visible:ring-1 focus-visible:ring-gray-300 shadow-sm text-lg leading-relaxed resize-none p-4"
            maxLength={120}
          />
        </div>
      </div>
    </div>
  );
}