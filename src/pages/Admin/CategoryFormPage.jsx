import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { X, ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import axios from "axios"; // เพิ่ม axios

// shadcn/ui components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function CategoryFormPage() {
  const navigate = useNavigate();
  const { id } = useParams(); // รับ id จาก URL path เช่น /admin/category/edit/:id
  const isEditMode = Boolean(id);

  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // --- 1. ดึงข้อมูลเดิมมาแสดง (กรณี Edit Mode) ---
  useEffect(() => {
    if (isEditMode) {
      const fetchCategory = async () => {
        setIsLoadingData(true);
        try {
          const response = await axios.get(`${API_BASE_URL}/categories/${id}`);
          // data.data ตามโครงสร้างที่คุณเขียนใน Backend
          setName(response.data?.data?.name || "");
        } catch (error) {
          console.error(error);
          toast.error("Category not found");
          navigate("/admin/category");
        } finally {
          setIsLoadingData(false);
        }
      };
      fetchCategory();
    }
  }, [id, isEditMode, navigate]);

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      };

      if (isEditMode) {
        // --- 2. UPDATE Category (PUT) ---
        await axios.put(
          `${API_BASE_URL}/categories/${id}`,
          { name: name.trim() },
          config
        );
      } else {
        // --- 3. CREATE Category (POST) ---
        await axios.post(
          `${API_BASE_URL}/categories`,
          { name: name.trim() },
          config
        );
      }

      // Success Toast สไตล์ที่คุณต้องการ
      toast.custom(
        (t) => (
          <div className="bg-green text-white p-5 rounded-2xl shadow-lg flex justify-between items-start w-[380px] animate-in slide-in-from-right-5 font-poppins">
            <div className="flex flex-col gap-1">
              <h3 className="text-xl font-bold">
                {isEditMode ? "Category Updated" : "Success!"}
              </h3>
              <p className="text-white/90 text-sm">
                Category has been {isEditMode ? "updated" : "created"} successfully.
              </p>
            </div>
            <button onClick={() => toast.dismiss(t)} className="cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
        ),
        { duration: 2000 }
      );

      setTimeout(() => navigate("/admin/category"), 500);
    } catch (error) {
      console.error(error);
      const message = error.response?.data?.message || "Something went wrong";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // แสดงหน้าโหลดขณะดึงข้อมูลเดิม
  if (isLoadingData) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Spinner className="w-8 h-8 text-black" />
      </div>
    );
  }

  return (
    <div className="p-10 font-poppins min-h-screen max-w-5xl mx-auto">
      {/* Header Area */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/admin/category")}
            className="rounded-full cursor-pointer"
          >
            <ChevronLeft size={24} />
          </Button>
          <h2 className="text-3xl font-bold text-[#231F20]">
            {isEditMode ? "Edit category" : "Create category"}
          </h2>
        </div>

        <Button
          onClick={handleSave}
          disabled={isSubmitting}
          className="bg-[#231F20] hover:bg-black text-white rounded-full px-10 h-12 cursor-pointer font-bold transition-all active:scale-95 shadow-lg flex items-center gap-2 min-w-[160px] justify-center"
        >
          {isSubmitting ? (
            <>
              <Spinner className="w-4 h-4 border-white/30 border-t-white" />
              <span>{isEditMode ? "Updating..." : "Processing..."}</span>
            </>
          ) : isEditMode ? (
            "Save changes"
          ) : (
            "Save"
          )}
        </Button>
      </div>

      <Separator className="mb-10" />

      {/* Form Area */}
      <div className="max-w-[550px] space-y-8">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-500 ml-1">
            Category name
          </label>
          <Input
            placeholder="e.g. Technology, Lifestyle"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isSubmitting}
            onKeyDown={(e) => e.key === "Enter" && handleSave()} // กด Enter เพื่อ Save
            className="h-12 bg-white border-gray-200 rounded-xl focus-visible:ring-1 focus-visible:ring-gray-300 text-lg shadow-sm"
          />
        </div>
      </div>
    </div>
  );
}