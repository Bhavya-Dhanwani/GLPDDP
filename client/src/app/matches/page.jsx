import Navbar from "@/components/layout/Navbar";
import FeaturedMatchSection from "@/features/matches/ui/jsx/FeaturedMatchSection";
import MatchHero from "@/features/matches/ui/jsx/MatchHero";
import MatchListsSection from "@/features/matches/ui/jsx/MatchListsSection";


export default function Matches() {
  return (
    <>
      <Navbar />
      <MatchHero/>
      <FeaturedMatchSection/>
      <MatchListsSection/>
    </>
  );
}