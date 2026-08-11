import React from "react";
import Navbar from "../components/Navbar.jsx";
import Hero from "../components/Hero.jsx";
import TrustedBy from "../components/TrustedBy.jsx";
import PortalAccess from "../components/PortalAccess.jsx";
import Features from "../components/Features.jsx";
import ClinicalJourney from "../components/ClinicalJourney.jsx";
import Testimonials from "../components/Testimonials.jsx";
import FAQ from "../components/FAQ.jsx";
import CTABanner from "../components/CTABanner.jsx";
import Footer from "../components/Footer.jsx";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <TrustedBy />
      <PortalAccess />
      <Features />
      <ClinicalJourney />
      <Testimonials />
      <FAQ />
      <CTABanner />
      <Footer />
    </div>
  );
}