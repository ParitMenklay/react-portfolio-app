import React, { useState, useEffect } from "react";
import { Search, Plus, Pencil, Trash2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios"; // เพิ่ม axios

// shadcn/ui components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner"; // สมมติว่าคุณมี Spinner
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function CategoryManagementPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // --- 1. Fetch Categories จาก API ---
  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/categories`);
      // ตรวจสอบโครงสร้างข้อมูล (data.data ตามที่คุณเขียนไว้ใน API)
      setCategories(response.data?.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load categories");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // --- 2. Filter ข้อมูล ---
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchText.toLowerCase())
  );

  // --- 3. Handle Delete ผ่าน API ---
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/categories/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      // ลบออกจาก State เพื่ออัปเดต UI ทันที
      setCategories((prev) => prev.filter((cat) => cat.id !== id));

      toast.custom(
        (t) => (
          <div className="bg-green text-white p-5 rounded-2xl shadow-lg flex justify-between items-start w-[380px] animate-in slide-in-from-right-5 font-poppins border border-white/10">
            <div className="flex flex-col gap-1">
              <h3 className="text-xl font-bold">Deleted!</h3>
              <p className="text-white/90 text-sm">Category has been removed.</p>
            </div>
            <button onClick={() => toast.dismiss(t)} className="cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
        ),
        { duration: 3000 }
      );
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="p-10 font-poppins min-h-screen">
      {/* Header Area */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#231F20]">Category management</h2>
        <Button
          onClick={() => navigate("/admin/category/create")}
          className="bg-[#231F20] hover:bg-black text-white rounded-full px-6 h-12 cursor-pointer flex gap-2 font-bold transition-all active:scale-95 shadow-md"
        >
          <Plus size={20} /> Create category
        </Button>
      </div>

      <Separator className="mb-8" />

      {/* Search Bar */}
      <div className="relative w-80 mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <Input
          placeholder="Search..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="pl-10 h-11 bg-white border-gray-200 rounded-xl shadow-sm"
        />
      </div>

      {/* Table Area */}
      <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
        <Table>
          <TableHeader className="bg-[#FDFDFD]">
            <TableRow className="hover:bg-transparent border-gray-50">
              <TableHead className="p-5 font-bold text-gray-400 uppercase text-[10px] tracking-widest">
                Category Name
              </TableHead>
              <TableHead className="text-right p-5 font-bold text-gray-400 uppercase text-[10px] tracking-widest">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={2} className="h-64 text-center">
                  <Spinner className="inline-block" />
                </TableCell>
              </TableRow>
            ) : filteredCategories.length > 0 ? (
              filteredCategories.map((item) => (
                <TableRow key={item.id} className="hover:bg-gray-50/50 border-gray-50 transition-colors">
                  <TableCell className="p-5 text-gray-700 font-medium">{item.name}</TableCell>
                  <TableCell className="p-5 text-right">
                    <div className="flex justify-end gap-1">
                      {/* ปุ่ม Edit ใช้ ID */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(`/admin/category/edit/${item.id}`)}
                        className="text-gray-400 hover:text-black rounded-full cursor-pointer h-10 w-10"
                      >
                        <Pencil size={18} />
                      </Button>

                      {/* AlertDialog สำหรับ Delete */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-400 hover:text-red rounded-full cursor-pointer h-10 w-10"
                          >
                            <Trash2 size={18} />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="rounded-[32px] p-8">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-center text-[28px]">Delete category</AlertDialogTitle>
                            <AlertDialogDescription className="text-center text-lg">
                              Do you want to delete "{item.name}"?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="flex justify-center gap-4 mt-8">
                            <AlertDialogCancel className="flex-1 rounded-full h-14 font-bold">Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(item.id)} // ส่ง ID ไปลบ
                              className="flex-1 rounded-full h-14 bg-[#231F20] font-bold"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} className="h-64 text-center text-gray-400">
                  No categories found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}