import { ArrowRight } from 'lucide-react';
import React from 'react';
import {useNavigate} from 'react-router-dom'
function HeroSection() {
  const navigate=useNavigate();
  return (
    <section className="bg-gradient-to-br from-indigo-50 to-purple-50 pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0 fade-in-section opacity-0">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 animate-pulse">
              Your Personal Mental Health Companion
            </h1>
            <p className="text-lg text-gray-700 mb-8">
              MindfulChat is here for you 24/7, providing compassionate support, valuable insights, and practical tools to help you navigate life's challenges.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center transition-colors">
                Start chatting now
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <button
  onClick={() => navigate("/login")}
  className="border border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-medium py-3 px-6 rounded-lg flex items-center justify-center transition-colors"
>
  Learn more
</button>

            </div>
          </div>
          <div className="md:w-1/2 fade-in-section opacity-0">
            <div className="relative">
              <img 
                src="/api/placeholder/600/500" 
                alt="MindfulChat app interface" 
                className="rounded-2xl shadow-xl transform hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute -bottom-4 -right-4 bg-indigo-600 text-white p-4 rounded-full shadow-lg animate-bounce">
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
export default HeroSection