function BlogCard(props) {
  return (
    <div className="flex flex-col pt-6 px-4 pb-20 gap-12">
      <a href="#" className="relative h-[212px] sm:h-[360px]">
        <img
          className="w-full h-full object-cover rounded-md"
          src={props.image}
          alt="Understanding Cat Behavior: Why Your Feline Friend Acts the Way They Do"
        />
      </a>
      <div className="flex flex-col">
        <div className="flex">
          <span className="bg-green-light rounded-full px-3 py-1 body-2 text-green mb-2">
            {props.category}
          </span>
        </div>
        <a href="#">
          <h4 className="text-start text-brown-600 mb-2 line-clamp-2 hover:underline">
            {props.title}
          </h4>
        </a>
        <p className="body-2 text-brown-400 mb-4 flex-grow line-clamp-3">
          {props.description}
        </p>
        <div className="flex items-center text-sm">
          <img
            className="w-8 h-8 rounded-full mr-2"
            src="https://res.cloudinary.com/dcbpjtd1r/image/upload/v1728449784/my-blog-post/xgfy0xnvyemkklcqodkg.jpg"
            alt="Tomson P."
          />
          <span className="body-2 text-brown-500">{props.author}</span>
          <span className="mx-2 text-gray-300">|</span>
          <span className="body-2 text-brown-400">{props.date}</span>
        </div>
      </div>
    </div>
  );
}
export default BlogCard
