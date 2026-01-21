import { useState, useEffect, useRef, useCallback } from "react"; // 1. เพิ่ม useCallback
import { Search, X } from "lucide-react";
import axios from "axios";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import BlogCard from "./BlogCard";
import { Spinner } from "@/components/ui/spinner";
import { Link } from "react-router-dom";

function ArticleSection() {
  const categories = ["All", "Highlight", "Cat", "Inspiration", "General"];

  // --- States ---
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchText, setSearchText] = useState("");
  const [blogPosts, setBlogPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isMoreLoading, setIsMoreLoading] = useState(false);

  // --- Dropdown Logic ---
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);

  // --- Data Fetching (Wrapped with useCallback) ---
  // การใช้ useCallback ช่วยให้ฟังก์ชันไม่ถูกสร้างใหม่ทุกครั้งที่ render 
  // เว้นแต่ selectedCategory หรือ searchText จะเปลี่ยน
  const fetchData = useCallback(async (currentPage, isNewSearch = false) => {
    if (isNewSearch) {
      setLoading(true);
    } else {
      setIsMoreLoading(true);
    }

    try {
      const categoryParam = selectedCategory === "All" ? "" : selectedCategory;
      const response = await axios.get(
        `https://blog-post-project-api.vercel.app/posts`,
        {
          params: {
            page: currentPage,
            limit: 6,
            category: categoryParam,
            keyword: searchText,
          },
        }
      );

      const newPosts = response.data.posts;

      if (isNewSearch) {
        setBlogPosts(newPosts);
        if (searchText.trim().length > 0) {
          setShowDropdown(true);
        }
      } else {
        setBlogPosts((prev) => [...prev, ...newPosts]);
      }

      setHasMore(response.data.currentPage < response.data.totalPages);
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
      setIsMoreLoading(false);
    }
  }, [selectedCategory, searchText]); // Dependencies สำหรับ fetchData

  // 1. จัดการการค้นหาและเปลี่ยนหมวดหมู่ (Debounce)
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setPage(1);
      fetchData(1, true);
    }, 200);

    return () => clearTimeout(delayDebounceFn);
  }, [fetchData]); // ใส่ fetchData เป็น dependency ได้อย่างปลอดภัย

  // 2. จัดการเมื่อกด "View More"
  useEffect(() => {
    if (page > 1) {
      fetchData(page, false);
    }
  }, [page, fetchData]); // เพิ่ม fetchData ตามกฎ ESLint

  // 3. ปิด Dropdown เมื่อคลิกนอกพื้นที่
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- Handlers ---
  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    setSearchText("");
    setShowDropdown(false);
  };

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  return (
    <div className="w-full font-poppins">
      <section className="flex flex-col h-auto md:px-32 md:py-20">
        <h3 className="p-4 text-2xl font-bold text-brown-600">
          Latest articles
        </h3>

        {/* Toolbar: Category & Search */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center bg-brown-200 p-4 gap-4 lg:rounded-xl">
          {/* Desktop Category Tabs */}
          <div className="hidden lg:flex">
            <Tabs value={selectedCategory} onValueChange={handleCategoryChange}>
              <TabsList className="bg-transparent gap-2">
                {categories.map((category) => (
                  <TabsTrigger
                    key={category}
                    value={category}
                    className="text-brown-400 data-[state=active]:text-brown-600 data-[state=active]:font-bold transition-all cursor-pointer"
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* Search Box & Dropdown */}
          <div className="relative w-full lg:w-[350px]" ref={searchRef}>
            <InputGroup className="bg-white h-12 rounded-lg border border-brown-300 shadow-sm overflow-hidden focus-within:ring-2 focus-within:ring-brown-300">
              <InputGroupInput
                placeholder="Search..."
                className="text-brown-600 border-none focus-visible:ring-0"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onFocus={() => searchText.length > 0 && setShowDropdown(true)}
              />
              <InputGroupAddon align="inline-end" className="pr-3">
                <Search className="w-4 h-4 text-brown-400" />
              </InputGroupAddon>
            </InputGroup>

            {/* Quick Search Dropdown */}
            {showDropdown && searchText && blogPosts.length > 0 && (
              <div className="absolute top-14 left-0 w-full bg-white rounded-xl shadow-2xl z-50 border border-brown-200 overflow-hidden max-h-[300px] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
                {blogPosts.slice(0, 5).map((post) => (
                  <Link
                    key={`drop-${post.id}`}
                    to={`/post/${post.id}`}
                    onClick={() => {
                      setShowDropdown(false);
                      setSearchText("");
                    }}
                    className="flex items-center gap-3 p-3 hover:bg-brown-50 border-b border-gray-100 last:border-none group"
                  >
                    <img
                      src={post.image}
                      alt=""
                      className="w-10 h-10 rounded-md object-cover shrink-0"
                    />
                    <div className="flex flex-col overflow-hidden text-left">
                      <p className="text-sm font-bold text-brown-600 truncate">
                        {post.title}
                      </p>
                      <p className="text-[11px] text-brown-400 truncate">
                        {post.category}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Category Select */}
          <div className="lg:hidden flex flex-col gap-1">
            <Label className="text-brown-400 text-xs ml-1">Category</Label>
            <Select
              value={selectedCategory}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger className="w-full h-12! bg-white text-brown-600 border border-brown-300 rounded-lg shadow-sm focus:ring-2 focus:ring-brown-300 focus:outline-none cursor-pointer">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-brown-300 rounded-lg shadow-lg" position="popper">
                {categories.map((category) => (
                  <SelectItem
                    key={category}
                    value={category}
                    className="text-brown-600 hover:bg-brown-100 focus:bg-brown-100 cursor-pointer transition-colors"
                  >
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Main Blog Post Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:px-28 min-h-[400px]">
        {loading ? (
          <div className="col-span-full flex flex-col items-center justify-center py-20 gap-4">
            <Spinner className="h-12 w-12 text-brown-600" />
            <p className="text-brown-400 animate-pulse font-medium">
              Finding articles...
            </p>
          </div>
        ) : blogPosts.length > 0 ? (
          blogPosts.map((post) => <BlogCard key={post.id} {...post} />)
        ) : (
          <div className="col-span-full text-center py-32 text-brown-400">
            <Search className="w-12 h-12 mx-auto opacity-10 mb-4" />
            <p className="text-xl font-bold text-brown-600">
              No results found for "{searchText}"
            </p>
            <p className="text-sm opacity-70 mt-2">
              Try a different category or search term.
            </p>
          </div>
        )}
      </div>

      {/* Pagination: View More Button */}
      {!loading && hasMore && blogPosts.length > 0 && (
        <div className="flex justify-center pt-8 pb-32">
          <Button
            variant="outline"
            onClick={handleLoadMore}
            disabled={isMoreLoading}
            className="border-2 border-brown-600 text-brown-600 hover:bg-brown-600 hover:text-white px-12 h-14 rounded-full font-bold transition-all shadow-md flex items-center gap-3 active:scale-95 cursor-pointer"
          >
            {isMoreLoading ? (
              <>
                <Spinner className="h-4 w-4" />
                <span>Loading...</span>
              </>
            ) : (
              "View More"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

export default ArticleSection;