import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/landing/Hero";
import PopularSeries from "@/components/landing/PopularSeries";
import LiveMatches from "@/components/landing/LiveMatches";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <PopularSeries />
      <LiveMatches />
      <Footer />
    </>
  );
}