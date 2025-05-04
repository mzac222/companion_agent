import { ArrowRight } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import chat from '../../assets/chat.png';

function HeroSection() {
  const navigate = useNavigate();
  
  return (
    <section className="bg-gradient-to-br from-indigo-100 via-blue-100 to-indigo-200 pt-32 pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col-reverse md:flex-row items-center gap-16">
          
          {/* Left Content */}
          <div className="md:w-1/2 text-center md:text-left fade-in-section opacity-0">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tight">
              A Friend in Every Moment
            </h1>
            <p className="text-lg text-gray-700 mb-8 max-w-xl mx-auto md:mx-0">
              <span className="text-indigo-700 font-medium">MindfulChat</span> supports you 24/7 with empathy, insights, and coping tools. It's okay to not be okay—start your journey toward healing now.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button      onClick={() => navigate("/login")} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-full flex items-center justify-center shadow-md transition-transform hover:scale-105">
                Start Chatting
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>

             
            </div>
          </div>

          {/* Right Image */}
          <div className="md:w-1/2 fade-in-section opacity-0 relative group">
            <div className="relative w-full max-w-lg mx-auto">
              <img
                src={chat}
                alt="MindfulChat interface"
                className="rounded-xl shadow-2xl transform transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute -bottom-5 -right-5 bg-indigo-600 text-white p-3 rounded-full shadow-lg animate-bounce">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default HeroSection;
