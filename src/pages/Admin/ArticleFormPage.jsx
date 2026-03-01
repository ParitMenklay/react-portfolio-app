import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ImageIcon, ChevronLeft, X } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

// shadcn/ui components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function ArticleFormPage() {
  const { id } = useParams(); // ดึง ID จาก URL (/admin/edit/:id)
  const navigate = useNavigate();
  const isEditMode = Boolean(id); // ถ้ามี ID แปลว่าเป็นโหมดแก้ไข

  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeType, setActiveType] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const fileInputRef = useRef(null);

  // State สำหรับเก็บข้อมูล Form
  const [formData, setFormData] = useState({
    title: "",
    category: "", // store category_id as string
    author: "",
    introduction: "",
    content: "",
    image: null,
  });

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
      { duration: 2000 },
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
      { duration: 4000 },
    );
  };

  // --- Load categories from API ---
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/categories`);
        const raw = response.data?.data ?? response.data ?? [];

        const normalized = Array.isArray(raw)
          ? raw
              .map((item) => {
                if (typeof item === "string") return null;
                return {
                  id: item.id ?? item.category_id ?? item.value,
                  name: item.name ?? item.category,
                };
              })
              .filter((c) => c?.id != null && c?.name)
          : [];

        setCategories(normalized);
      } catch (error) {
        console.error(error);
        showErrorToast("Error", "Failed to load categories");
      }
    };

    fetchCategories();
  }, []);

  // --- เติม Author name จาก user ใน localStorage (โหมด Create) ---
  useEffect(() => {
    if (!isEditMode) {
      const storedUser = localStorage.getItem("user");
      const user = storedUser ? JSON.parse(storedUser) : null;
      const authorName = user?.name ?? user?.username ?? "";
      setFormData((prev) => ({ ...prev, author: authorName }));
    }
  }, [isEditMode]);

  // --- 1. ดึงข้อมูลเดิมมาแสดง (กรณี Edit Mode) ---
  useEffect(() => {
    if (isEditMode) {
      const fetchArticleDetail = async () => {
        setIsLoadingData(true);
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(`${API_BASE_URL}/posts/${id}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          });

          const post = response.data?.data || response.data;
          const categoryIdFromPost =
            post.category_id ??
            categories.find(
              (c) =>
                String(c.name).toLowerCase() ===
                String(post.category ?? "").toLowerCase(),
            )?.id;

          setFormData({
            title: post.title || "",
            category:
              categoryIdFromPost != null ? String(categoryIdFromPost) : "",
            author: post.name || "",
            introduction: post.description || "",
            content: post.content || "",
            image: post.image || null,
          });
        } catch (error) {
          console.error(error);
          showErrorToast("Error", "Failed to load article data");
          navigate("/admin");
        } finally {
          setIsLoadingData(false);
        }
      };
      fetchArticleDetail();
    }
  }, [id, isEditMode, navigate, categories]);

  if (isLoadingData) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center gap-4">
        <Spinner className="w-10 h-10 text-black" />
        <p className="text-gray-500 font-medium">Loading article data...</p>
      </div>
    );
  }
  const handleSubmit = async (type) => {
    try {
      // ตรวจสอบข้อมูลก่อนส่ง
      if (!formData.title || !formData.introduction || !formData.content) {
        showErrorToast(
          "Validation error",
          "Please fill in all required fields",
        );
        return;
      }

      if (!isEditMode && !imageFile) {
        showErrorToast("Thumbnail required", "Please upload a thumbnail image");
        return;
      }

      setIsSubmitting(true);
      setActiveType(type);

      const form = new FormData();
      form.append("title", formData.title);
      const categoryId = Number(formData.category);
      if (!categoryId) {
        showErrorToast("Category required", "Please select a category");
        return;
      }
      form.append("category_id", categoryId);
      form.append("description", formData.introduction);
      form.append("content", formData.content);

      
      const statusId = type === "draft" ? 1 : 2;
      form.append("status_id", statusId);

      // ตอนสร้างโพสต์ใหม่ ส่ง user_id จาก localStorage
      if (!isEditMode) {
        const storedUser = localStorage.getItem("user");
        const user = storedUser ? JSON.parse(storedUser) : null;
        const userId = user?.id ?? user?.user_id;
        if (!userId) {
          showErrorToast("Session error", "Please log in again");
          setIsSubmitting(false);
          setActiveType(null);
          return;
        }
        form.append("user_id", userId);
      }

      // เพิ่มไฟล์ (สำหรับ create หรือ update ที่มีไฟล์ใหม่)
      if (imageFile) {
        form.append("imageFile", imageFile);
      }

      // ดึง token จาก localStorage (ถ้ามี)
      const token = localStorage.getItem("token");

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          ...(token && { Authorization: `Bearer ${token}` }), // เพิ่ม token ถ้ามี
        },
      };

      if (isEditMode) {
        // Update existing article
       
        await axios.put(`${API_BASE_URL}/posts/${id}`, form, config);
        showSuccessToast(
          "Article updated",
          "Your article has been updated successfully.",
        );
      } else {
        // Create new article
        await axios.post(`${API_BASE_URL}/posts`, form, config);

        const successTitle =
          type === "publish" ? "Article published" : "Draft saved";
        const successMessage =
          type === "publish"
            ? "Your article has been published successfully."
            : "Your article has been saved as draft.";

        showSuccessToast(successTitle, successMessage);
      }

      // รอ toast แสดงแล้วค่อย redirect
      setTimeout(() => {
        navigate("/admin");
      }, 1000);
    } catch (err) {
      console.error("Upload error:", err);

      // แสดง error message ที่ชัดเจน
      const errorMessage =
        err.response?.data?.message || err.message || "Upload failed";
      showErrorToast("Upload failed", errorMessage);

      // Log error สำหรับ debug
      if (err.response) {
        console.error("Response error:", err.response.data);
        console.error("Status:", err.response.status);
      }
    } finally {
      setIsSubmitting(false);
      setActiveType(null);
    }
  };

  return (
    <div className="p-10 font-poppins max-w-5xl mx-auto">
      {/* Header Area */}
      <div className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/admin")}
            className="rounded-full cursor-pointer"
          >
            <ChevronLeft size={24} />
          </Button>
          <h2 className="text-3xl font-bold text-[#231F20]">
            {isEditMode ? "Edit article" : "Create article"}
          </h2>
        </div>

        <div className="flex gap-3">
          {!isEditMode && (
            <Button
              variant="outline"
              disabled={isSubmitting}
              onClick={() => handleSubmit("draft")}
              className="rounded-full px-8 h-12 border-gray-300 font-bold cursor-pointer transition-all active:scale-95 flex items-center gap-2"
            >
              {isSubmitting && activeType === "draft" && (
                <Spinner className="w-4 h-4 text-black" />
              )}
              Save as draft
            </Button>
          )}
          <Button
            disabled={isSubmitting}
            onClick={() => handleSubmit("publish")}
            className="rounded-full px-8 h-12 bg-[#231F20] hover:bg-black text-white font-bold cursor-pointer transition-all active:scale-95 shadow-lg flex items-center gap-2 min-w-[180px] justify-center"
          >
            {isSubmitting && activeType === "publish" ? (
              <>
                <Spinner className="w-4 h-4 border-white/30 border-t-white" />
                <span>{isEditMode ? "Updating..." : "Processing..."}</span>
              </>
            ) : isEditMode ? (
              "Save changes"
            ) : (
              "Save and publish"
            )}
          </Button>
        </div>
      </div>

      {/* Form Content */}
      <div className="space-y-8">
        {/* Thumbnail Section */}
        <div className="space-y-4">
          <Label className="text-base font-medium text-gray-700">
            Thumbnail image
          </Label>

          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            {/* Preview */}
            <div className="w-full md:w-[400px] aspect-video bg-gray-100 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400 overflow-hidden">
              {imageFile ? (
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : formData.image ? (
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <ImageIcon size={48} strokeWidth={1} />
              )}
            </div>

            {/* ปุ่มเลือกไฟล์ */}
            <label>
              {/* input file ซ่อน */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;

                  const allowed = [
                    "image/jpeg",
                    "image/png",
                    "image/webp",
                    "image/gif",
                  ];
                  if (!allowed.includes(file.type)) {
                    showErrorToast("Invalid image", "Invalid image type");
                    return;
                  }

                  if (file.size > 5 * 1024 * 1024) {
                    showErrorToast(
                      "Image too large",
                      "Image must be smaller than 5MB",
                    );
                    return;
                  }

                  setImageFile(file);
                }}
              />

              {/* ปุ่มกด */}
              <Button
                type="button"
                variant="outline"
                className="rounded-full px-6 h-11 border-gray-300 text-gray-600 font-semibold cursor-pointer shadow-sm"
                onClick={() => fileInputRef.current?.click()}
              >
                Upload thumbnail image
              </Button>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 max-w-3xl">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-600">
              Category
            </Label>
            <Select
              value={formData.category}
              onValueChange={(val) =>
                setFormData({ ...formData, category: val })
              }
            >
              <SelectTrigger className="h-12! w-[200px] bg-white border-gray-200 rounded-xl cursor-pointer">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="rounded-xl" position="popper">
                {categories.map((cat) => (
                  <SelectItem
                    key={cat.id}
                    value={String(cat.id)}
                    className="cursor-pointer"
                  >
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-600">
              Author name
            </Label>
            <Input
              value={formData.author}
              disabled
              onChange={(e) =>
                setFormData({ ...formData, author: e.target.value })
              }
              className="h-12 bg-white border-gray-200 rounded-xl focus-visible:ring-1 focus-visible:ring-gray-300 shadow-sm"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-600">Title</Label>
            <Input
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Article title"
              className="h-12 bg-white border-gray-200 rounded-xl focus-visible:ring-1 focus-visible:ring-gray-300 shadow-sm"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-600">
              Introduction (max 120 letters)
            </Label>
            <Textarea
              value={formData.introduction}
              maxLength={120}
              onChange={(e) =>
                setFormData({ ...formData, introduction: e.target.value })
              }
              placeholder="Introduction"
              className="min-h-[120px] bg-white border-gray-200 rounded-xl focus-visible:ring-1 focus-visible:ring-gray-300 shadow-sm resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-600">Content</Label>
            <Textarea
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              placeholder="Content"
              className="min-h-[400px] bg-white border-gray-200 rounded-xl focus-visible:ring-1 focus-visible:ring-gray-300 shadow-sm resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
