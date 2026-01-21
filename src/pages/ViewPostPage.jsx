import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Spinner } from "@/components/ui/spinner";
import { formatDate } from "../utils/formatDate";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Smile, Copy, Facebook, Linkedin, Twitter, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
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

// Reusable Author Card
const AuthorCard = ({ post }) => (
  <div className="bg-brown-200 rounded-3xl p-6 lg:p-8 flex flex-col gap-4 border ">
    <div className="flex items-center gap-4">
      <img
        className="w-12 h-12 lg:w-16 lg:h-16 rounded-full object-cover border-2 border-white shadow-sm"
        src="https://res.cloudinary.com/dcbpjtd1r/image/upload/v1728449784/my-blog-post/xgfy0xnvyemkklcqodkg.jpg"
        alt={post?.author}
      />
      <div className="flex flex-col">
        <span className="body-3 text-brown-400 uppercase tracking-widest">
          Author
        </span>
        <h4 className=" text-brown-500">{post?.author}</h4>
      </div>
    </div>
    <hr className="border-brown-300" />
    <p className="text-brown-400 body-1 leading-relaxed  lg:text-base italic">
      I am a pet enthusiast and freelance writer who specializes in animal
      behavior and care. With a deep love for cats, I enjoy sharing insights on
      feline companionship and wellness.
    </p>
  </div>
);

function ViewPostPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const isLoggedIn = false;

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(
          `https://blog-post-project-api.vercel.app/posts/${id}`
        );
        setPost(response.data);
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
    window.scrollTo(0, 0);
  }, [id]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      toast.custom(
        (t) => (
          <div className="bg-green text-white p-5 rounded-2xl shadow-lg flex justify-between items-start w-full max-w-[350px] relative">
            <div className="flex flex-col gap-1">
              <h3 className="text-xl font-bold">Copied!</h3>
              <p className="text-white/90 text-sm">
                This article has been copied to your clipboard.
              </p>
            </div>
            <button
              onClick={() => toast.dismiss(t)}
              className="text-white/80 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ),
        { duration: 3000 }
      );
    });
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <Spinner className="h-12 w-12 text-[#433E3F]" />
        <p className="text-gray-400 animate-pulse font-medium">
          Loading article...
        </p>
      </div>
    );

  if (!post)
    return (
      <div className="text-center py-20 font-bold text-xl">Post not found.</div>
    );

  const LoginRequiredAlert = ({ children }) => (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="bg-brown-100 rounded-[32px] border-none p-10 w-[343px] lg:w-[621px] h-[272px] lg:h-[352px]">
        {/* ปุ่มกากบาท (X) สำหรับปิดที่มุมขวาบน */}
        <AlertDialogCancel className="absolute right-6 top-6 border-none bg-transparent hover:bg-transparent p-0 w-auto h-auto cursor-pointer">
          <X className="h-6 w-6 text-gray-400" />
        </AlertDialogCancel>

        <AlertDialogHeader className="flex flex-col items-center gap-4">
          <AlertDialogTitle className="text-brown-600 text-2xl lg:text-[40px] font-bold text-center leading-tight">
            Create an account to continue
          </AlertDialogTitle>

          {/* ซ่อน Description เดิมไว้เพื่อความถูกต้องของโครงสร้าง Accessibility แต่ไม่ให้แสดงผล (เพราะในรูปไม่มี) */}
          <AlertDialogDescription className="sr-only">
            Please create an account or login to proceed.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex flex-col items-center gap-6 mt-4">
          {/* ปุ่มหลัก: Create account */}
          <AlertDialogAction className="w-full rounded-full bg-brown-600 hover:bg-[#1A1A1A] text-white body-1 h-14  transition-colors cursor-pointer">
            Create account
          </AlertDialogAction>

          {/* ข้อความด้านล่าง: Already have an account? Log in */}
          <div className="flex items-center gap-2">
            <span className="text-brown-400 body-1">
              Already have an account?
            </span>
            <Button
              variant="link"
              onClick={() => {
                /* ลอจิกไปหน้า Login */
              }}
              className="text-brown-600 body-1 underline underline-offset-4 cursor-pointer"
            >
              Log in
            </Button>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-10 flex flex-col gap-6 lg:gap-10">
      {/* 1. Main Featured Image */}
      <img
        src={post.image}
        className="w-full h-56 sm:h-72 lg:h-[500px] object-cover rounded-3xl shadow-sm"
        alt={post.title}
      />

      {/* 2. Content Wrapper (Switches to Row at 'lg' breakpoint) */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">
        {/* Left Side: Main Content */}
        <div className="flex-1 flex flex-col gap-6 w-full">
          <div className="flex items-center gap-2">
            <span className="bg-green-light rounded-full px-3 py-1 body-2 text-green">
              {post.category}
            </span>
            <span className="text-gray-300">|</span>
            <span className="body-1 text-brown-400">
              {formatDate(post.date)}
            </span>
          </div>

          <h1 className="text-3xl lg:text-5xl font-bold text-brown-600 leading-tight">
            {post.title}
          </h1>

          <p className="text-lg lg:text-xl text-brown-500 leading-relaxed italic border-l-4 border-brown-200 pl-4">
            {post.description}
          </p>

          <div className="markdown prose prose-sm lg:prose-base prose-stone max-w-none text-[#433E3F] leading-relaxed">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>

          {/* Author Card for Mobile/Tablet (Visible until 'lg') */}
          <div className="lg:hidden mt-4">
            <AuthorCard post={post} />
          </div>

          {/* Interaction Box (Like/Share/Copy) */}
          <div className="bg-brown-100 flex flex-col w-full rounded-3xl p-6 md:p-10 gap-6 border border-brown-200 mt-8 shadow-sm">
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 md:gap-6">
              <div className="w-full md:w-auto md:shrink-0">
                {!isLoggedIn ? (
                  <LoginRequiredAlert>
                    <Button
                      variant="outline"
                      className="w-full md:w-28 h-12 px-8 rounded-full bg-white border-brown-300 text-brown-600 font-bold flex items-center justify-center gap-2 hover:bg-brown-50 cursor-pointer transition-all active:scale-95"
                    >
                      <Smile className="w-6 h-6 text-brown-400" /> {post.likes}
                    </Button>
                  </LoginRequiredAlert>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full md:w-auto h-14 px-8 rounded-full bg-white border-brown-300 text-brown-600 font-bold flex items-center justify-center gap-2 cursor-pointer hover:bg-brown-50 transition-all active:scale-[0.98]"
                  >
                    <Smile className="w-6 h-6" /> {post.likes}
                  </Button>
                )}
              </div>

              <div className="flex flex-col md:flex-row items-center justify-end md:flex-1 gap-4">
                {/* ปุ่ม Copy Link */}
                <Button
                  variant="outline"
                  className="w-full md:w-auto h-12 px-8 rounded-full bg-white border-brown-300 text-brown-600 font-bold flex items-center justify-center gap-2 hover:bg-brown-50 cursor-pointer transition-all active:scale-95 shadow-sm"
                  onClick={handleCopyLink}
                >
                  <Copy className="w-4 h-4 text-brown-400" /> Copy link
                </Button>

                {/* Social Media Icons */}
                <div className="flex items-center gap-3">
                  <a
                    href="#"
                    className="bg-[#1877F2] p-3 rounded-full text-white hover:scale-110 transition-transform cursor-pointer shadow-md"
                  >
                    <Facebook className="w-5 h-5 fill-current" />
                  </a>
                  <a
                    href="#"
                    className="bg-[#0077B5] p-3 rounded-full text-white hover:scale-110 transition-transform cursor-pointer shadow-md"
                  >
                    <Linkedin className="w-5 h-5 fill-current" />
                  </a>
                  <a
                    href="#"
                    className="bg-[#1DA1F2] p-3 rounded-full text-white hover:scale-110 transition-transform cursor-pointer shadow-md"
                  >
                    <Twitter className="w-5 h-5 fill-current" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Comment Section */}
          <div className="grid w-full gap-4 mt-8">
            <Label
              htmlFor="message"
              className="text-xl font-bold text-[#433E3F]"
            >
              Comment
            </Label>
            <Textarea
              placeholder="What are your thoughts?"
              id="message"
              className="min-h-[150px] rounded-2xl border-gray-200 focus:ring-1 focus:ring-gray-300 p-4"
            />
            <div className="justify-self-end">
              {!isLoggedIn ? (
                // ถ้าไม่ได้ Login ให้แสดง Modal แจ้งเตือน
                <LoginRequiredAlert>
                  <Button className="h-12 w-32 rounded-full bg-[#433E3F] hover:bg-[#2D2A2A] text-white font-bold shadow-lg transition-all active:scale-95 cursor-pointer">
                    Send
                  </Button>
                </LoginRequiredAlert>
              ) : (
                // ถ้า Login แล้ว ให้ทำงานตามปกติ (เช่น เรียกฟังก์ชันส่งคอมเมนต์)
                <Button
                  onClick={() => {
                    /* ลอจิกการส่งคอมเมนต์ของคุณ */
                  }}
                  className="h-12 w-32 rounded-full bg-[#433E3F] hover:bg-[#2D2A2A] text-white font-bold shadow-lg transition-all active:scale-95 cursor-pointer"
                >
                  Send
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Desktop Sidebar (Sticky from 'lg' breakpoint) */}
        <div className="hidden lg:block lg:w-[400px]">
          <div className="sticky top-10">
            <AuthorCard post={post} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewPostPage;
