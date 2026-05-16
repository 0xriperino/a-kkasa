import {
  HeroSection,
  ProblemSolutionSection,
  HowItWorksSection,
  TrustLayerSection,
  MonadIntegrationSection,
  CTASection,
} from "@/components/landing/LandingSections";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ProblemSolutionSection />
      <HowItWorksSection />
      <TrustLayerSection />
      <MonadIntegrationSection />
      <CTASection />
    </>
  );
}