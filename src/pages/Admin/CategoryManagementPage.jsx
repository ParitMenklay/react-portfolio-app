import React, { useState, useEffect } from "react";
import { Search, Plus, Pencil, Trash2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// shadcn/ui components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator"; // เพิ่ม Separator ให้เหมือนหน้า Article
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

// --- Static Categories ---
const CATEGORIES = ["Highlight", "Cat", "Inspiration", "General"];

export default function CategoryManagementPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [searchText, setSearchText] = useState("");

  // --- Initialize Categories ---
  useEffect(() => {
    const initialCategories = CATEGORIES.map((name, index) => ({
      id: index + 1,
      name: name,
    }));
    setCategories(initialCategories);
  }, []);

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleDelete = async (name) => {
    try {
      setCategories((prev) => prev.filter((cat) => cat.name !== name));

      toast.custom(
        (t) => (
          <div className="bg-red text-white p-5 rounded-2xl shadow-lg flex justify-between items-start w-[380px] animate-in slide-in-from-right-5 font-poppins border border-white/10">
            <div className="flex flex-col gap-1">
              <h3 className="text-xl font-bold">Deleted!</h3>
              <p className="text-white/90 text-sm">
                Category has been removed.
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
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="p-10 font-poppins min-h-screen">
      {/* Header Area - ปรับ font size 2xl และปุ่ม h-12 เหมือน Article */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#231F20]">
          Category management
        </h2>
        <Button
          onClick={() => navigate("/admin/category/create")}
          className="bg-[#231F20] hover:bg-black text-white rounded-full px-6 h-12 cursor-pointer flex gap-2 font-bold transition-all active:scale-95 shadow-md"
        >
          <Plus size={20} /> Create category
        </Button>
      </div>

      <Separator className="mb-8" />

      {/* Search Bar - ปรับความกว้าง w-80 และความสูง h-11 เหมือน Article */}
      <div className="relative w-80 mb-8">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={18}
        />
        <Input
          placeholder="Search..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="pl-10 h-11 bg-white border-gray-200 rounded-xl focus-visible:ring-1 focus-visible:ring-gray-300 shadow-sm"
        />
      </div>

      {/* Table Area - ปรับ padding p-5 และขนาด font text-gray-700 font-medium */}
      <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
        <Table>
          <TableHeader className="bg-[#FDFDFD]">
            <TableRow className="hover:bg-transparent border-gray-50">
              <TableHead className="p-5 font-bold text-gray-400 uppercase text-[10px] tracking-widest">
                Category
              </TableHead>
              <TableHead className="text-right p-5 font-bold text-gray-400 uppercase text-[10px] tracking-widest">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCategories.length > 0 ? (
              filteredCategories.map((item) => (
                <TableRow
                  key={item.name}
                  className="hover:bg-gray-50/50 border-gray-50 transition-colors"
                >
                  <TableCell className="p-5 text-gray-700 font-medium">
                    {item.name}
                  </TableCell>
                  <TableCell className="p-5 text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          navigate(`/admin/category/edit/${item.name}`)
                        }
                        className="text-gray-400 hover:text-black rounded-full cursor-pointer h-10 w-10"
                      >
                        <Pencil size={18} />
                      </Button>

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
                        <AlertDialogContent className="rounded-[32px] border-none max-w-[440px] p-8 shadow-2xl">
                          <div className="absolute right-6 top-6">
                            <AlertDialogCancel className="border-none p-0 h-auto hover:bg-transparent cursor-pointer">
                              <X className="w-6 h-6 text-gray-400" />
                            </AlertDialogCancel>
                          </div>
                          <AlertDialogHeader className="flex flex-col items-center gap-4">
                            <AlertDialogTitle className="text-[28px] font-bold text-[#231F20] mt-4">
                              Delete category
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-gray-500 text-lg text-center font-medium">
                              Do you want to delete this category?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="flex flex-row justify-center gap-4 mt-8 sm:justify-center">
                            <AlertDialogCancel className="flex-1 h-14 rounded-full border border-gray-300 text-lg font-bold text-[#231F20] hover:bg-gray-50 cursor-pointer transition-all active:scale-95">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(item.name)}
                              className="flex-1 h-14 bg-[#231F20] hover:bg-black text-white rounded-full text-lg font-bold cursor-pointer transition-all active:scale-95 shadow-md"
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
                <TableCell
                  colSpan={2}
                  className="h-64 text-center text-gray-400"
                >
                  {searchText
                    ? `No categories found matching "${searchText}"`
                    : "No categories available"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
