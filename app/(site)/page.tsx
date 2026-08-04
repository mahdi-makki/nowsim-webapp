import { Hero } from "@/components/sections/home/Hero";
import { Destinations } from "@/components/sections/home/Destinations";
import { About } from "@/components/sections/home/About";
import { HowItWorks } from "@/components/sections/home/HowItWorks";
import { Benefits } from "@/components/sections/home/Benefits";
import { EveryMoment } from "@/components/sections/home/EveryMoment";
import { Faq } from "@/components/sections/Faq";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Destinations />
      <About />
      <HowItWorks />
      <Benefits />
      <EveryMoment />
      <Faq />
    </>
  );
}
