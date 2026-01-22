import React, { useState, useEffect } from "react";
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

const CATEGORIES = ["Highlight", "Cat", "Inspiration", "General"];

export default function ArticleFormPage() {
  const { id } = useParams(); // ดึง ID จาก URL (/admin/edit/:id)
  const navigate = useNavigate();
  const isEditMode = Boolean(id); // ถ้ามี ID แปลว่าเป็นโหมดแก้ไข

  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeType, setActiveType] = useState(null);

  // State สำหรับเก็บข้อมูล Form
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    author: "",
    introduction: "",
    content: "",
    image: null,
  });

  // --- 1. ดึงข้อมูลเดิมมาแสดง (กรณี Edit Mode) ---
  useEffect(() => {
    if (isEditMode) {
      const fetchArticleDetail = async () => {
        setIsLoadingData(true);
        try {
          // จำลองการดึงข้อมูลจาก API จริง
          const response = await axios.get(
            `https://blog-post-project-api.vercel.app/posts/${id}`
          );
          const data = response.data;

          setFormData({
            title: data.title || "",
            category: data.category?.toLowerCase() || "",
            author: data.author || "",
            introduction: data.description || "",
            content: data.content || "",
            image: data.image || null,
          });
        } catch (error) {
          toast.error("Failed to load article data");
          navigate("/admin");
        } finally {
          setIsLoadingData(false);
        }
      };
      fetchArticleDetail();
    }
  }, [id, isEditMode, navigate]);

  // --- 2. ฟังก์ชันจัดการการบันทึก ---
  const handleMockSubmit = async (type) => {
    setIsSubmitting(true);
    setActiveType(type);

    setTimeout(() => {
      setIsSubmitting(false);
      setActiveType(null);

      const isPublish = type === "publish";
      // ปรับข้อความ Toast ตามโหมด (Create vs Update)
      const actionText = isEditMode
        ? "updated"
        : isPublish
        ? "published"
        : "saved as draft";
      const title = isEditMode
        ? "Article Updated"
        : isPublish
        ? "Create article and published"
        : "Create article and saved as draft";
      const description = isEditMode
        ? "Your changes have been saved."
        : isPublish
        ? "Your article has been successfully published"
        : "You can publish article later";

      toast.custom(
        (t) => (
          <div className="bg-green text-white p-4 rounded-2xl shadow-xl flex justify-between items-center w-full max-w-[500px] animate-in slide-in-from-bottom-5 font-poppins border border-white/10">
            <div className="flex flex-col min-w-0">
              <h3 className="text-lg font-bold truncate leading-tight">
                {title}
              </h3>
              <p className="text-white/90 text-sm truncate leading-tight mt-0.5">
                {description}
              </p>
            </div>
            <button
              onClick={() => toast.dismiss(t)}
              className="cursor-pointer hover:bg-white/20 p-1.5 rounded-full transition-colors ml-4 shrink-0"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        ),
        { duration: 4000 }
      );

      setTimeout(() => navigate("/admin"), 1000);
    }, 1500);
  };

  if (isLoadingData) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center gap-4">
        <Spinner className="w-10 h-10 text-black" />
        <p className="text-gray-500 font-medium">Loading article data...</p>
      </div>
    );
  }

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
              onClick={() => handleMockSubmit("draft")}
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
            onClick={() => handleMockSubmit("publish")}
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
            <div className="w-full md:w-[400px] aspect-video bg-gray-100 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400 overflow-hidden">
              {formData.image ? (
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <ImageIcon size={48} strokeWidth={1} />
              )}
            </div>
            <Button
              variant="outline"
              className="rounded-full px-6 h-11 border-gray-300 text-gray-600 font-semibold cursor-pointer shadow-sm"
            >
              Upload thumbnail image
            </Button>
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
              <SelectContent className="rounded-xl">
                {CATEGORIES.map((cat) => (
                  <SelectItem
                    key={cat}
                    value={cat.toLowerCase()}
                    className="cursor-pointer"
                  >
                    {cat}
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
              onChange={(e) =>
                setFormData({ ...formData, author: e.target.value })
              }
              placeholder="Thompson P."
              className="h-12 bg-[#F9F9F9] border-none rounded-xl focus-visible:ring-1 focus-visible:ring-gray-300"
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
