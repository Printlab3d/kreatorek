import React from 'react';
import HeroSection from '../components/hero/HeroSection';
import ServicesSection from '../components/services/ServicesSection';
import PortfolioSection from '../components/portfolio/PortfolioSection';
import AboutSection from '../components/about/AboutSection';
import ContactSection from '../components/contact/ContactSection';

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <ServicesSection />
      <PortfolioSection />
      <AboutSection />
      <ContactSection />
    </div>
  );
}