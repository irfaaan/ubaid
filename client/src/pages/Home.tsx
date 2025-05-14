import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import AdvisorTool from "@/components/home/AdvisorTool";
import PopularComparisons from "@/components/home/PopularComparisons";
import FeatureGuides from "@/components/home/FeatureGuides";
import Newsletter from "@/components/home/Newsletter";

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <AdvisorTool />
      <PopularComparisons />
      <FeatureGuides />
      <Newsletter />
    </>
  );
}
