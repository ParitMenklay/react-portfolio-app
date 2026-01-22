import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { X, ChevronLeft } from "lucide-react";
import { toast } from "sonner";

// shadcn/ui components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner"; // มั่นใจว่ามี component นี้ใน project นะครับ

export default function CategoryFormPage() {
  const navigate = useNavigate();
  const { name: categoryName } = useParams(); // รับค่าจาก path="category/edit/:name"
  const isEditMode = Boolean(categoryName);

  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ถ้าเป็นโหมด Edit ให้ดึงชื่อเดิมมาใส่ใน Input
  useEffect(() => {
    if (isEditMode && categoryName) {
      setName(decodeURIComponent(categoryName));
    }
  }, [isEditMode, categoryName]);

  const handleSave = async () => {
    // --- แก้ไขส่วนเช็คค่าว่างใน handleSave ---
    if (!name.trim()) {
      toast.custom(
        (t) => (
          <div className="bg-red text-white p-5 rounded-2xl shadow-lg flex justify-between items-start w-[380px] animate-in slide-in-from-right-5 font-poppins border border-white/10">
            <div className="flex flex-col gap-1">
              <h3 className="text-xl font-bold">Error!</h3>
              <p className="text-white/90 text-sm">
                Please enter a category name before saving.
              </p>
            </div>
            <button
              onClick={() => toast.dismiss(t)}
              className="cursor-pointer hover:bg-white/20 p-1 rounded-full transition-colors shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ),
        { duration: 3000 }
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // จำลองการเชื่อมต่อ API เหมือนในหน้า ArticleForm
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Toast สไตล์ที่คุณต้องการ (ใช้สีเขียวสำหรับ Success)
      toast.custom(
        (t) => (
          <div className="bg-green text-white p-5 rounded-2xl shadow-lg flex justify-between items-start w-[380px] animate-in slide-in-from-right-5 font-poppins border border-white/10">
            <div className="flex flex-col gap-1">
              <h3 className="text-xl font-bold">
                {isEditMode ? "Category Updated" : "Success!"}
              </h3>
              <p className="text-white/90 text-sm">
                Category has been {isEditMode ? "updated" : "created"}{" "}
                successfully.
              </p>
            </div>
            <button
              onClick={() => toast.dismiss(t)}
              className="cursor-pointer hover:bg-white/20 p-1 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ),
        { duration: 3000 }
      );

      navigate("/admin/category");
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-10 font-poppins min-h-screen max-w-5xl mx-auto">
      {/* Header Area เหมือนสไตล์ ArticleForm */}
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

        {/* ปุ่ม Save สไตล์เดียวกับ ArticleForm */}
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
            placeholder="Category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isSubmitting}
            className="h-12 bg-white border-gray-200 rounded-xl focus-visible:ring-1 focus-visible:ring-gray-300 text-lg shadow-sm disabled:opacity-50"
          />
        </div>
      </div>
    </div>
  );
}
