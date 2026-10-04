import dynamic from "next/dynamic";
import { getColleges } from "@/lib/db";
import StatsRow from "@/components/home/StatsRow";
import TierSection from "@/components/home/TierSection";
import CollegePreview from "@/components/home/CollegePreview";

// HeroSection and FeaturesScroll use WebGL — skip SSR to avoid hydration issues
const HeroSection = dynamic(() => import("@/components/home/HeroSection"), { ssr: false });
const FeaturesScroll = dynamic(() => import("@/components/home/FeaturesScroll"), { ssr: false });

export const metadata = {
  title: "Hamro College | हाम्रो कलेज — Compare colleges with real costs in NPR",
};

export default async function HomePage() {
  const colleges = await getColleges();

  return (
    <>
      <HeroSection />
      <StatsRow />
      <TierSection />
      <FeaturesScroll />
      <CollegePreview colleges={colleges} />
    </>
  );
}
