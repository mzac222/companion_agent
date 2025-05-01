import { useState, useEffect } from 'react';
import Navigation from './Navigation';
import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import AboutSection from './AboutUs';
import BlogSection from './BlogSection';
import NewsletterSection from './News';
import Footer from './Footer';

export default function MentalHealthLandingPage() {
  // Fade in elements when they are in view
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fadeIn');
        }
      });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.fade-in-section').forEach(section => {
      observer.observe(section);
    });
    
    return () => observer.disconnect();
  }, []);
  
  return (
    <div className="font-sans text-gray-800">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <AboutSection />
      <BlogSection />
      <NewsletterSection />
      <Footer />
      
      {/* Add custom CSS for animations */}
      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 1s ease forwards;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}