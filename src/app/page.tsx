import { Header, Footer } from "@/components/layout";
import {
  HeroSection,
  NeuroscienceSection,
  ArchitectureSection,
  StudyInterfaceSection,
  MasteryDensitySection,
  PricingSection,
} from "@/components/landing";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-surface-void dark:bg-surface-base transition-colors duration-300">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <NeuroscienceSection />
        <ArchitectureSection />
        <StudyInterfaceSection />
        <MasteryDensitySection />
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
}

