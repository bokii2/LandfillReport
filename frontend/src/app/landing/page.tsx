import HeroSection from "@/components/landing/HeroSection";
import HowItWorks from "@/components/landing/HowItWorks";
import LandingMap from "@/components/landing/LandingMap";
import LoginButton from "@/components/landing/LoginButton";
import { Box } from "@chakra-ui/react";

export default function LandingPage() {
  return (
    <Box>
      <HeroSection />
      <LoginButton />
      <LandingMap />
      <HowItWorks />
    </Box>
  );
}