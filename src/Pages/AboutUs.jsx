import React from "react";
import Navbar from "../components/Navbar.jsx";
import AboutHero from "../components/about/AboutHero.jsx";
import VisionMissionTeam from "../components/about/VisionMissionTeam.jsx";
import GlobalPresence from "../components/about/GlobalPresence.jsx";
import Footer from "../components/Footer.jsx";

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <AboutHero />
      <VisionMissionTeam />
      <GlobalPresence />
      <Footer />
    </div>
  );
}