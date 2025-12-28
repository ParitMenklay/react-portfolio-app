import Image_HeroSection from "../assets/images/img_herosection.jpg";
function HeroSection() {
  return (
    <>
      <section className="bg-brown-100 flex w-full h-auto flex-col items-center px-4 py-10 gap-10 lg:flex-row lg:justify-center  lg:gap-[60px]">
        <div className="flex flex-col justify-center items-center text-center gap-4 w-[343px] h-[184px] lg:text-end lg:gap-6 lg:w-[347px] lg:h-[276px]">
          <h1 className="hidden lg:flex">Stay Informed, Stay Inspired</h1>
          <h2 className="lg:hidden">Stay Informed, Stay Inspired</h2>
          <span className="body-1 text-brown-400">
            Discover a World of Knowledge at Your Fingertips. Your Daily Dose of
            Inspiration and Information.
          </span>
        </div>
        <div
          className="
    w-[343px] lg:w-[386px]
    h-[470px] lg:h-[529px]
    rounded-4xl
    overflow-hidden
    bg-[linear-gradient(0deg,#FFFFFF,#FFFFFF),linear-gradient(0deg,rgba(190,187,177,0.25),rgba(190,187,177,0.25))]
  "
        >
          <img
            src={Image_HeroSection}
            alt="image"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col w-[343px] h-[284px] gap-3">
          <div className="flex flex-col w-[343px] h-[56px] gap-1">
            <span className="body-3 text-brown-400">-Author</span>
            <h3>Thompson P.</h3>
          </div>

          <p className="body-1 text-brown-400">
            I am a pet enthusiast and freelance writer who specializes in animal
            behavior and care. With a deep love for cats, I enjoy sharing
            insights on feline companionship and wellness. When i’m not writing,
            I spends time volunteering at my local animal shelter, helping cats
            find loving homes.
          </p>
        </div>
      </section>
    </>
  );
}
export default HeroSection;
