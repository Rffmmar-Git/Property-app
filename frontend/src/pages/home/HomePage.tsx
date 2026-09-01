import HomeNavbar from "../../features/home/components/HomeNavbar";
import HeroSection from "../../features/home/components/HeroSection";
import ExploreProperties from "../../features/home/components/ExploreProperties";
import HomeFooter from "../../features/home/components/HomeFooter";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <HomeNavbar />

      <main className="flex-1">
        <HeroSection />
        <ExploreProperties />
      </main>

      <HomeFooter />
    </div>
  );
}