import React, { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";

// shadcn/ui components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

// --- Configuration ---
const CATEGORIES = ["All", "Highlight", "Cat", "Inspiration", "General"];
const STATUS_OPTIONS = ["All", "Published", "Draft"];

export default function ArticleManagementPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // --- Filter & Pagination States ---
  const [searchText, setSearchText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // --- Fetch Data Function ---
  const fetchArticles = useCallback(async () => {
    setLoading(true);
    try {
      const categoryParam = selectedCategory === "All" ? "" : selectedCategory;
      const response = await axios.get(
        `https://blog-post-project-api.vercel.app/posts`,
        {
          params: {
            page: page,
            limit: 6,
            category: categoryParam,
            keyword: searchText,
          },
        }
      );
      setArticles(response.data.posts);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("Failed to load articles");
    } finally {
      setLoading(false);
    }
  }, [page, selectedCategory, searchText]);

  // รวม useEffect เป็นตัวเดียวเพื่อป้องกัน double loading
  useEffect(() => {
    const delayDebounceFn = setTimeout(
      () => {
        fetchArticles();
      },
      searchText ? 400 : 0
    ); // ใช้ debounce เฉพาะตอนมีการพิมพ์ search

    return () => clearTimeout(delayDebounceFn);
  }, [fetchArticles, searchText]);

  // Reset page เมื่อเปลี่ยน filter
  useEffect(() => {
    setPage(1);
  }, [searchText, selectedCategory, selectedStatus]);

  const handleDelete = async (id) => {
    try {
      // ตัวอย่าง: await axios.delete(`.../posts/${id}`)
      setArticles(articles.filter((a) => a.id !== id));

      toast.custom(
        (t) => (
          <div className="bg-red text-white p-5 rounded-2xl shadow-lg flex justify-between items-start w-[380px] animate-in slide-in-from-right-5 font-poppins">
            <div className="flex flex-col gap-1">
              <h3 className="text-xl font-bold">Deleted!</h3>
              <p className="text-white/90 text-sm">
                Article has been removed from the system.
              </p>
            </div>
            <button
              onClick={() => toast.dismiss(t)}
              className="cursor-pointer hover:opacity-70 transition-opacity"
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
    <div className="p-10 font-poppins">
      {/* Header Area */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#231F20]">
          Article management
        </h2>
        <Button
          onClick={() => navigate("/admin/create")}
          className="bg-[#231F20] hover:bg-black text-white rounded-full px-6 h-12 cursor-pointer flex gap-2 font-bold transition-all active:scale-95 shadow-md"
        >
          <Plus size={20} /> Create article
        </Button>
      </div>
      <Separator className="mb-8" />

      {/* Toolbar */}
      <div className="flex gap-4 mb-8">
        <div className="relative w-80">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <Input
            placeholder="Search articles..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="pl-10 h-11 bg-white border-gray-200 rounded-xl focus-visible:ring-1 focus-visible:ring-gray-300"
          />
        </div>

        <div className="flex gap-3">
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[250px] h-11! cursor-pointer bg-white rounded-xl border-gray-200">
              <span className="text-gray-400 mr-2">Status:</span>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl" position="popper">
              {STATUS_OPTIONS.map((status) => (
                <SelectItem
                  key={status}
                  value={status}
                  className="cursor-pointer"
                >
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[250px] h-11! cursor-pointer bg-white rounded-xl border-gray-200">
              <span className="text-gray-400 mr-2">Category:</span>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl" position="popper">
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat} className="cursor-pointer">
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table Area */}
      <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
        <Table>
          <TableHeader className="bg-[#FDFDFD]">
            <TableRow>
              <TableHead className="w-[50%] p-5 font-bold text-gray-400 uppercase text-[10px] tracking-widest">
                Article title
              </TableHead>
              <TableHead className="p-5 font-bold text-gray-400 uppercase text-[10px] tracking-widest">
                Category
              </TableHead>
              <TableHead className="p-5 font-bold text-gray-400 uppercase text-[10px] tracking-widest">
                Status
              </TableHead>
              <TableHead className="text-right p-5 font-bold text-gray-400 uppercase text-[10px] tracking-widest">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-64 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <Spinner className="w-8 h-8 text-black" />
                    <p className="text-sm text-gray-400">Loading data...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : articles.length > 0 ? (
              articles.map((item) => (
                <TableRow
                  key={item.id}
                  className="hover:bg-gray-50/50 border-gray-50 transition-colors"
                >
                  <TableCell className="p-5 font-medium text-gray-700 max-w-md truncate">
                    {item.title}
                  </TableCell>
                  <TableCell className="p-5">
                    <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs font-semibold">
                      {item.category}
                    </span>
                  </TableCell>
                  <TableCell className="p-5">
                    <div className="flex items-center gap-2 text-green text-sm font-bold">
                      <span className="w-2 h-2 bg-green rounded-full"></span>
                      Published
                    </div>
                  </TableCell>
                  <TableCell className="p-5 text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(`/admin/edit/${item.id}`)}
                        className="text-gray-400 hover:text-black rounded-full cursor-pointer"
                      >
                        <Pencil size={18} />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-400 hover:text-red rounded-full cursor-pointer"
                          >
                            <Trash2 size={18} />
                          </Button>
                        </AlertDialogTrigger>

                        <AlertDialogContent className="rounded-[32px] border-none max-w-[440px] p-8">
                          <div className="absolute right-6 top-6">
                            <AlertDialogCancel className="border-none p-0 h-auto hover:bg-transparent cursor-pointer">
                              <X className="w-6 h-6 text-gray-400" />
                            </AlertDialogCancel>
                          </div>

                          <AlertDialogHeader className="flex flex-col items-center gap-4">
                            <AlertDialogTitle className="text-[28px] font-bold text-[#231F20] mt-4">
                              Delete article
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-gray-500 text-lg text-center font-medium">
                              Do you want to delete this article?
                            </AlertDialogDescription>
                          </AlertDialogHeader>

                          <AlertDialogFooter className="flex flex-row justify-center gap-4 mt-8 sm:justify-center">
                            <AlertDialogCancel className="flex-1 h-14 rounded-full border border-gray-300 text-lg font-bold text-[#231F20] hover:bg-gray-50 cursor-pointer transition-all active:scale-95">
                              Cancel
                            </AlertDialogCancel>

                            <AlertDialogAction
                              onClick={() => handleDelete(item.id)}
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
                  colSpan={4}
                  className="h-64 text-center text-gray-400"
                >
                  No articles found matching your criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination Controls */}
        <div className="mt-auto p-6 border-t border-gray-50 flex justify-between items-center">
          <p className="text-sm text-gray-400 font-medium">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-xl cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronLeft size={18} className="mr-1" /> Previous
            </Button>
            <Button
              variant="outline"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-xl cursor-pointer disabled:cursor-not-allowed"
            >
              Next <ChevronRight size={18} className="ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
