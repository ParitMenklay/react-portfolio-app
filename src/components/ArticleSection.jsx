import { useState } from "react";
import { Search } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import BlogCard from "./BlogCard";
import { blogPosts } from "../data/blogPosts";

function ArticleSection() {
  const categories = ["All", "Highlight", "Cat", "Inspiration", "General"];

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchText, setSearchText] = useState("");
  const [visibleCount, setVisibleCount] = useState(6);

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    setVisibleCount(6);
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
    setVisibleCount(6);
  };

  const filteredPosts = blogPosts.filter((post) => {
    const isCategoryMatch =
      selectedCategory === "All" || post.category === selectedCategory;
      const isSearchMatch = 
      post.title.toLowerCase().includes(searchText.toLowerCase()) || 
      post.description.toLowerCase().includes(searchText.toLowerCase()) || 
      post.author.toLowerCase().includes(searchText.toLowerCase()); 

    return isCategoryMatch && isSearchMatch;
  });

  const handleViewMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  return (
    <>
      <section className="flex flex-col h-auto md:px-32 md:py-20">
        <h3 className="p-4 gap-2.5">Latest articles</h3>
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center bg-brown-200 p-4 h-auto lg:h-20 gap-4 lg:rounded-xl">
          {/* Desktop Tabs */}
          <div className="hidden lg:flex ">
            <Tabs
              value={selectedCategory}
              onValueChange={handleCategoryChange}
              className="w-[400px] h-full gap-0 "
            >
              <TabsList className="gap-4">
                {categories.map((category) => (
                  <TabsTrigger
                    value={category}
                    className="body-1 text-brown-400"
                    key={category}
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* Search Input */}
          <div>
            <InputGroup className="bg-white h-12 w-full lg:w-[320px] ">
              <InputGroupInput
                placeholder="Search"
                className="body-1 text-brown-400"
                value={searchText}
                onChange={handleSearchChange}
              />
              <InputGroupAddon align="inline-end">
                <Search className="w-4 h-4" />
              </InputGroupAddon>
            </InputGroup>
          </div>

          {/* Mobile Select */}
          <div className="lg:hidden flex flex-col gap-1">
            <Label className="body-1 text-brown-400">Category</Label>
            <Select
              value={selectedCategory}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger className="w-full h-12! bg-white body-1 text-brown-400">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent position="popper" sideOffset={0}>
                <SelectGroup>
                  {categories.map((category) => (
                    <SelectItem
                      value={category}
                      className="body-1 text-brown-400"
                      key={category}
                    >
                      {category}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Blog Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:pt-14 md:px-28">
        {filteredPosts.length > 0 ? (
          filteredPosts
            .slice(0, visibleCount)
            .map((post) => (
              <BlogCard
                key={post.id}
                image={post.image}
                category={post.category}
                title={post.title}
                description={post.description}
                author={post.author}
                authorImage={post.authorImage}
                date={post.date}
              />
            ))
        ) : (
          <div className="col-span-2 text-center py-10 text-brown-400">
            No articles found.
          </div>
        )}
      </div>

      {filteredPosts.length > visibleCount && (
        <div className="flex justify-center pt-8 pb-28">
          <Button
            variant="link"
            onClick={handleViewMore}
            className="bg-white font body-1 text-brown-600"
          >
            View More
          </Button>
        </div>
      )}
    </>
  );
}

export default ArticleSection;
