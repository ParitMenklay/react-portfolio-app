import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
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
} from "@/components/ui/alert-dialog";

// --- ข้อมูลจำลองสำหรับ Comments ---
const mockComments = [
  {
    id: 1,
    user: "Jacob Lash",
    date: "12 September 2024 at 18:30",
    avatar: "https://i.pravatar.cc/150?u=jacob",
    content:
      "I loved this article! It really explains why my cat is so independent yet loving. The purring section was super interesting.",
  },
  {
    id: 2,
    user: "Ahri",
    date: "12 September 2024 at 18:30",
    avatar: "https://i.pravatar.cc/150?u=ahri",
    content:
      "Such a great read! I've always wondered why my cat slow blinks at me—now I know it's her way of showing trust!",
  },
  {
    id: 3,
    user: "Mimi mama",
    date: "12 September 2024 at 18:30",
    avatar: "https://i.pravatar.cc/150?u=mimi",
    content:
      "This article perfectly captures why cats make such amazing pets. I had no idea their purring could help with healing. Fascinating stuff!",
  },
];

// --- Reusable Author Card ---
const AuthorCard = ({ post }) => (
  <div className="bg-brown-200 rounded-3xl p-6 lg:p-8 flex flex-col gap-4 border border-brown-300">
    <div className="flex items-center gap-4">
      <img
        className="w-12 h-12 lg:w-16 lg:h-16 rounded-full object-cover border-2 border-white shadow-sm"
        src="https://res.cloudinary.com/dcbpjtd1r/image/upload/v1728449784/my-blog-post/xgfy0xnvyemkklcqodkg.jpg"
        alt={post?.author}
      />
      <div className="flex flex-col">
        <span className="body-3 text-brown-400 uppercase tracking-widest text-[10px] lg:text-xs font-bold">
          Author
        </span>
        <h4 className="text-brown-500 font-bold text-lg">{post?.author}</h4>
      </div>
    </div>
    <hr className="border-brown-300" />
    <p className="text-brown-400 body-1 leading-relaxed italic">
      I am a pet enthusiast and freelance writer who specializes in animal
      behavior and care. With a deep love for cats, I enjoy sharing insights on
      feline companionship and wellness.
    </p>
  </div>
);

function ViewPostPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [comment, setComment] = useState("");
  // เพิ่ม State สำหรับควบคุมการเปิด-ปิด Alert Dialog
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }

    const fetchPost = async () => {
      try {
        const response = await axios.get(
          `https://blog-post-project-api.vercel.app/posts/${id}`
        );
        setPost(response.data);
      } catch (error) {
        console.error("Error fetching post:", error);
        toast.error("Failed to load post");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
    window.scrollTo(0, 0);
  }, [id]);

  const isLoggedIn = !!user;

  // --- ฟังก์ชันจัดการการส่ง Comment ---
  const handleSendComment = () => {
    // 1. ตรวจสอบว่า Login หรือยัง
    if (!isLoggedIn) {
      setComment(""); // ล้างค่าในช่องพิมพ์ทันที
      setIsAlertOpen(true); // เปิดหน้าต่างแจ้งเตือนให้สมัครสมาชิก
      return;
    }

    // 2. ตรวจสอบว่าพิมพ์ข้อความหรือยัง (กรณี Login แล้ว)
    if (!comment.trim()) {
      return toast.custom(
        (t) => (
          <div className="bg-red text-white p-5 rounded-2xl shadow-lg flex justify-between items-start w-full max-w-[400px] relative animate-in slide-in-from-right-5">
            <div className="flex flex-col gap-1 font-poppins">
              <h3 className="text-xl font-bold">Error!</h3>
              <p className="text-white/90 text-sm">
                Please write something before sending.
              </p>
            </div>
            <button
              onClick={() => toast.dismiss(t)}
              className="text-white/80 hover:text-white cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ),
        { duration: 3000 }
      );
    }

    // 3. จำลองการส่งสำเร็จ
    toast.custom(
      (t) => (
        <div className="bg-green text-white p-5 rounded-2xl shadow-lg flex justify-between items-start w-full max-w-[400px] relative animate-in slide-in-from-right-5">
          <div className="flex flex-col gap-1 font-poppins">
            <h3 className="text-xl font-bold">Success!</h3>
            <p className="text-white/90 text-sm">
              Your comment has been sent successfully.
            </p>
          </div>
          <button
            onClick={() => toast.dismiss(t)}
            className="text-white/80 hover:text-white cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      ),
      { duration: 3000 }
    );

    setComment("");
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      toast.custom(
        (t) => (
          <div className="bg-green text-white p-5 rounded-2xl shadow-lg flex justify-between items-start w-full max-w-[400px] relative">
            <div className="flex flex-col gap-1 font-poppins">
              <h3 className="text-xl font-bold">Copied!</h3>
              <p className="text-white/90 text-sm">
                This article has been copied to your clipboard.
              </p>
            </div>
            <button
              onClick={() => toast.dismiss(t)}
              className="text-white/80 hover:text-white cursor-pointer"
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
      <div className="flex flex-col items-center justify-center py-40 gap-4 font-poppins">
        <Spinner className="h-12 w-12 text-brown-600" />
        <p className="text-brown-400 animate-pulse font-medium body-1">
          Loading article...
        </p>
      </div>
    );

  if (!post)
    return (
      <div className="text-center py-40 font-bold text-xl text-brown-600 font-poppins">
        Post not found.
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-10 flex flex-col gap-6 lg:gap-10 font-poppins">
      {/* Alert Dialog สำหรับผู้ที่ยังไม่ได้ Login */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent className="bg-brown-100 rounded-[32px] border-none p-10 w-[90%] max-w-[621px] flex flex-col items-center">
          <AlertDialogCancel className="absolute right-6 top-6 border-none bg-transparent hover:bg-transparent p-0 w-auto h-auto cursor-pointer">
            <X className="h-6 w-6 text-brown-400" />
          </AlertDialogCancel>
          <AlertDialogHeader className="flex flex-col items-center gap-4">
            <AlertDialogTitle className="text-brown-600 text-2xl lg:text-[40px] font-bold text-center leading-tight">
              Create an account to continue
            </AlertDialogTitle>
            <AlertDialogDescription className="sr-only">
              Please create an account or login to proceed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex flex-col items-center gap-6 mt-8 w-full">
            <AlertDialogAction
              className="w-full rounded-full bg-brown-600 hover:opacity-90 text-white body-1 h-14 transition-all cursor-pointer shadow-md"
              onClick={() => navigate("/signup")}
            >
              Create account
            </AlertDialogAction>
            <div className="flex items-center gap-2">
              <span className="text-brown-400 body-1">
                Already have an account?
              </span>
              <Button
                variant="link"
                onClick={() => navigate("/login")}
                className="text-brown-600 body-1 underline underline-offset-4 cursor-pointer p-0 h-auto font-bold"
              >
                Log in
              </Button>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* 1. Featured Image */}
      <img
        src={post.image}
        className="w-full h-56 sm:h-72 lg:h-[500px] object-cover rounded-[32px] shadow-sm"
        alt={post.title}
      />

      {/* 2. Content Wrapper */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">
        <div className="flex-1 flex flex-col gap-6 w-full">
          <div className="flex items-center gap-2">
            <span className="bg-green-100 rounded-full px-3 py-1 body-2 text-green font-semibold">
              {post.category}
            </span>
            <span className="text-brown-200">|</span>
            <span className="body-1 text-brown-400">
              {formatDate(post.date)}
            </span>
          </div>

          <h1 className="text-3xl lg:text-5xl font-bold text-brown-600 leading-tight">
            {post.title}
          </h1>
          <p className="text-lg lg:text-xl text-brown-500 leading-relaxed italic border-l-4 border-brown-300 pl-4">
            {post.description}
          </p>

          <div className="markdown prose prose-stone max-w-none text-brown-600 leading-relaxed body-1">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>

          <div className="lg:hidden mt-4">
            <AuthorCard post={post} />
          </div>

          {/* Interaction Box */}
          <div className="bg-brown-100 flex flex-col w-full rounded-[32px] p-6 md:p-10 gap-6 border border-brown-200 mt-8 shadow-sm">
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 md:gap-6">
              <Button
                variant="outline"
                onClick={() => !isLoggedIn && setIsAlertOpen(true)}
                className="w-full md:w-28 h-12 px-8 rounded-full bg-white border-brown-300 text-brown-600 font-bold flex items-center justify-center gap-2 hover:bg-brown-50 cursor-pointer transition-all active:scale-95"
              >
                <Smile
                  className={`w-6 h-6 ${
                    isLoggedIn ? "text-brown-500" : "text-brown-400"
                  }`}
                />{" "}
                {post.likes || 0}
              </Button>

              <div className="flex flex-col md:flex-row items-center justify-end md:flex-1 gap-4">
                <Button
                  variant="outline"
                  className="w-full md:w-auto h-12 px-8 rounded-full bg-white border-brown-300 text-brown-600 font-bold flex items-center justify-center gap-2 hover:bg-brown-50 cursor-pointer shadow-sm"
                  onClick={handleCopyLink}
                >
                  <Copy className="w-4 h-4 text-brown-400" /> Copy link
                </Button>
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

          {/* Comment Input Section */}
          <div className="grid w-full gap-4 mt-12">
            <Label
              htmlFor="message"
              className="text-xl font-bold text-brown-600"
            >
              Comment
            </Label>
            <Textarea
              placeholder="What are your thoughts?"
              id="message"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[150px] rounded-2xl border-brown-200 focus:ring-1 focus:ring-brown-300 p-4 body-1 text-brown-600"
            />
            <div className="justify-self-end">
              <Button
                onClick={handleSendComment}
                className="h-12 w-32 rounded-full bg-brown-600 hover:opacity-90 text-white font-bold shadow-lg transition-all active:scale-95 cursor-pointer"
              >
                Send
              </Button>
            </div>
          </div>

          {/* Comment List */}
          <div className="flex flex-col gap-10 mt-10 mb-20">
            {mockComments.map((item, index) => (
              <div
                key={item.id}
                className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.avatar}
                    alt={item.user}
                    className="w-12 h-12 rounded-full object-cover border border-brown-100 shadow-sm"
                  />
                  <div className="flex flex-col">
                    <span className="font-bold text-brown-600 text-lg leading-tight">
                      {item.user}
                    </span>
                    <span className="text-sm text-brown-300">{item.date}</span>
                  </div>
                </div>
                <p className="text-brown-500 body-1 leading-relaxed">
                  {item.content}
                </p>
                {index !== mockComments.length - 1 && (
                  <hr className="border-brown-100 mt-4" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Sidebar */}
        <div className="hidden lg:block lg:w-[400px]">
          <div className="sticky top-24">
            <AuthorCard post={post} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewPostPage;
