import { Navbar, Footer } from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import ArticleSection from "./components/ArticleSection";

export default function App() {
  return (
    <>
      <Navbar></Navbar>
      <HeroSection></HeroSection>
      <ArticleSection></ArticleSection>
      <Footer></Footer>
    </>
  );
}
