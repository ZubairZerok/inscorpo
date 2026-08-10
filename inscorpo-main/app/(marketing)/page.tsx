import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { LearningPathsPreview } from "@/components/landing/learning-paths-preview";
import { CareerRoadmap } from "@/components/landing/career-roadmap";
import { TrustedPartners } from "@/components/landing/trusted-partners";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { FAQSection } from "@/components/landing/faq-section";
import { CTASection } from "@/components/landing/cta-section";

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <TrustedPartners />
      <FeaturesSection />
      <LearningPathsPreview />
      <CareerRoadmap />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <CTASection />
    </>
  );
}
