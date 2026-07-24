import Navbar from "../components/LandingPage/Navbar";
import Hero from "../components/LandingPage/Hero";
import Stats from "../components/LandingPage/Stats";
import Features from "../components/LandingPage/Features";
import AISection from "../components/LandingPage/Aisection";
import Community from "../components/LandingPage/Community";
import Testimonials from "../components/LandingPage/Testimonials";
import CTA from "../components/LandingPage/Cta";
import Footer from "../components/LandingPage/Footer";

export default function App() {
  return (
     <div className="bg-paper font-body">
      <Navbar />
      <Hero />
      <Stats />
      <Features />
      <AISection />
      <Community />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
}