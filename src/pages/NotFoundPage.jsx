import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { CircleAlert } from 'lucide-react';

 function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
      {/* ไอคอนเครื่องหมายตกใจ */}
      <CircleAlert className="w-18 h-18"/>
      
      <h2 className="text-2xl font-bold text-brown-600">Page Not Found</h2>
      
      <Button 
        onClick={() => navigate("/")}
        className="bg-black text-white hover:bg-gray-800 px-8 py-2 rounded-full cursor-pointer"
      >
        Go To Homepage
      </Button>
    </div>
  );
}
export default NotFoundPage