import React, { useState } from "react";
import { Separator } from "@/components/ui/separator";

// ข้อมูลจำลองสำหรับการแจ้งเตือน
const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    user: {
      name: "Jacob Lash",
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop",
    },
    type: "comment",
    content:
      "Commented on your article: The Fascinating World of Cats: Why We Love Our Furry Friends",
    message:
      "“I loved this article! It really explains why my cat is so independent yet loving. The purring section was super interesting.”",
    time: "4 hours ago",
  },
  {
    id: 2,
    user: {
      name: "Jacob Lash",
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop",
    },
    type: "liked",
    content:
      "liked your article: The Fascinating World of Cats: Why We Love Our Furry Friends",
    time: "4 hours ago",
  },
];

export default function NotificationPage() {
  const [notifications] = useState(INITIAL_NOTIFICATIONS);

  return (
    <div className="p-10 font-poppins min-h-screen">
      {/* Header Area - ปรับความสูง h-12 และ margin ให้เท่ากับหน้าอื่นๆ */}
      <div className="flex justify-between items-center mb-6 h-12">
        <h2 className="text-2xl font-bold text-[#231F20]">Notification</h2>
      </div>

      {/* เส้นคั่นหัวข้อหลัก */}
      <Separator className="mb-8" />

      {/* Notification List Container */}
      <div className="max-w-5xl flex flex-col">
        {notifications.map((noti) => (
          <div key={noti.id}>
            <div className="py-8 flex items-start gap-4 relative group">
              {/* User Avatar */}
              <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-gray-100 shadow-sm">
                <img
                  src={noti.user.avatar}
                  alt={noti.user.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content Area */}
              <div className="flex-1 flex flex-col gap-1 pr-20">
                <div className="text-[15px] leading-relaxed">
                  <span className="font-bold text-[#231F20]">
                    {noti.user.name}
                  </span>{" "}
                  <span className="text-gray-600">{noti.content}</span>
                </div>

                {noti.message && (
                  <p className="text-gray-500 text-[15px] font-medium leading-relaxed italic mt-1">
                    {noti.message}
                  </p>
                )}

                {/* ใช้สี text-orange ตามที่คุณตั้งค่าไว้ใน tailwind.config.js */}
                <span className="text-orange text-sm font-medium mt-1">
                  {noti.time}
                </span>
              </div>

              {/* View Button */}
              <button className="absolute right-0 top-8 text-[#231F20] font-bold text-[15px] underline underline-offset-4 hover:text-black transition-all cursor-pointer active:scale-95">
                View
              </button>
            </div>

            {/* เส้นคั่นระหว่างรายการแจ้งเตือนแต่ละอัน */}
            <Separator />
          </div>
        ))}
      </div>
    </div>
  );
}
