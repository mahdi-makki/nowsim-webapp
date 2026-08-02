import { About } from "@/components/sections/home/About";
import { Benefits } from "@/components/sections/home/Benefits";
import { Destinations } from "@/components/sections/home/Destinations";
import { EveryMoment } from "@/components/sections/home/EveryMoment";
import { Faq } from "@/components/sections/home/Faq";
import { Hero } from "@/components/sections/home/Hero";
import { HowItWorks } from "@/components/sections/home/HowItWorks";

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
