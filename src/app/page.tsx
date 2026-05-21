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
      
            <main>
              {/* Hero Section */}
              <HeroSection />
      
              {/* Neuroscience Validation */}
              <NeuroscienceSection />
      
              {/* Architecture of Learning */}
              <ArchitectureSection />
      
              {/* Study Interface */}
              <StudyInterfaceSection />
      
              {/* Mastery Density */}
              <MasteryDensitySection />
              
              {/* Pricing Section */}
              <PricingSection />
            </main>
      
            <Footer />
    </div>
  );
}
