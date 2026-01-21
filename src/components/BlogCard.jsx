import { formatDate } from "../utils/formatDate";
import { Link } from "react-router-dom"; // 1. Import Link เข้ามา

function BlogCard({ id, image, category, title, description, author, date }) { // 2. ใช้ Destructuring แกะค่าออกมาเลย
  return (
    <div className="flex flex-col py-6 px-4 gap-12">
      {/* 3. เปลี่ยน <a> เป็น <Link> และส่งไปที่ path /post/ ตามด้วย id */}
      <Link to={`/post/${id}`} className="relative h-[212px] sm:h-[360px] overflow-hidden rounded-md group">
        <img
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          src={image}
          alt={title}
        />
      </Link>

      <div className="flex flex-col">
        <div className="flex">
          <span className="bg-green-light rounded-full px-3 py-1 body-2 text-green mb-2">
            {category}
          </span>
        </div>
        
        {/* 4. ใส่ Link ที่หัวข้อข่าวด้วย */}
        <Link to={`/post/${id}`}>
          <h4 className="text-start text-brown-600 mb-2 line-clamp-2 hover:underline">
            {title}
          </h4>
        </Link>

        <p className="body-2 text-brown-400 mb-4 grow line-clamp-3">
          {description}
        </p>

        <div className="flex items-center text-sm">
          <img
            className="w-8 h-8 rounded-full mr-2"
            src="https://res.cloudinary.com/dcbpjtd1r/image/upload/v1728449784/my-blog-post/xgfy0xnvyemkklcqodkg.jpg"
            alt={author}
          />
          <span className="body-2 text-brown-500">{author}</span>
          <span className="mx-2 text-gray-300">|</span>
          <span className="body-2 text-brown-400">{formatDate(date)}</span>
        </div>
      </div>
    </div>
  );
}

export default BlogCard;