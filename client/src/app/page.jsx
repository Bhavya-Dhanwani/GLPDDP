import Navbar from "@/components/layout/Navbar";
import Hero from "@/features/landing/ui/jsx/Hero";
import PopularSeries from "@/features/landing/ui/jsx/PopularSeries";
import LiveMatches from "@/features/landing/ui/jsx/LiveMatches";
import Footer from "@/features/landing/ui/jsx/Footer";

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