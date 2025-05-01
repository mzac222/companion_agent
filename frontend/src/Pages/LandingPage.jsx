import { useState, useEffect } from 'react';
import { ArrowRight, MessageCircle, Heart, Shield, Clock, BookOpen, ChevronDown } from 'lucide-react';

export default function MentalHealthLandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  
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
  
  const blogs = [
    {
      id: 1,
      title: "Understanding Anxiety in Daily Life",
      excerpt: "Learn about anxiety triggers and practical coping mechanisms.",
      category: "anxiety",
      image: "/api/placeholder/600/400",
      date: "April 25, 2025"
    },
    {
      id: 2,
      title: "Mindfulness Techniques for Better Sleep",
      excerpt: "Simple exercises to calm your mind before bedtime.",
      category: "mindfulness",
      image: "/api/placeholder/600/400",
      date: "April 18, 2025"
    },
    {
      id: 3,
      title: "Managing Work-Related Stress",
      excerpt: "Effective strategies to maintain balance in high-pressure environments.",
      category: "stress",
      image: "/api/placeholder/600/400",
      date: "April 12, 2025"
    },
    {
      id: 4,
      title: "Building Healthy Relationships",
      excerpt: "Communication skills to foster deeper connections.",
      category: "relationships",
      image: "/api/placeholder/600/400",
      date: "April 5, 2025"
    }
  ];
  
  const filteredBlogs = activeTab === 'all' 
    ? blogs 
    : blogs.filter(blog => blog.category === activeTab);
  
  return (
    <div className="font-sans text-gray-800">
      {/* Navigation */}
      <nav className="bg-white shadow-md fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <MessageCircle className="h-8 w-8 text-indigo-600" />
                <span className="ml-2 text-xl font-bold text-indigo-600">MindfulChat</span>
              </div>
            </div>
            
            {/* Desktop menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-indigo-600 transition-colors">Features</a>
              <a href="#about" className="text-gray-600 hover:text-indigo-600 transition-colors">About</a>
              <a href="#blog" className="text-gray-600 hover:text-indigo-600 transition-colors">Blog</a>
              <a href="#contact" className="text-gray-600 hover:text-indigo-600 transition-colors">Contact</a>
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors">
                Try it free
              </button>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)} 
                className="text-gray-600 hover:text-indigo-600 focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <a href="#features" className="block px-3 py-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-md">Features</a>
              <a href="#about" className="block px-3 py-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-md">About</a>
              <a href="#blog" className="block px-3 py-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-md">Blog</a>
              <a href="#contact" className="block px-3 py-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-md">Contact</a>
              <button className="w-full text-left px-3 py-2 bg-indigo-600 text-white rounded-md">Try it free</button>
            </div>
          </div>
        )}
      </nav>
      
      {/* Hero Section */}
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
                <button className="border border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-medium py-3 px-6 rounded-lg flex items-center justify-center transition-colors">
                  Learn more
                </button>
              </div>
            </div>
            <div className="md:w-1/2 fade-in-section opacity-0">
              <div className="relative">
                <div className="bg-white p-6 rounded-2xl shadow-xl max-w-md mx-auto transform hover:scale-105 transition-transform duration-300">
                  <div className="flex items-center mb-4">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                      <MessageCircle className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div className="ml-3">
                      <h3 className="font-semibold text-gray-900">MindfulChat</h3>
                      <p className="text-sm text-gray-500">Online now</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-indigo-100 p-3 rounded-lg rounded-tl-none max-w-xs">
                      <p className="text-gray-800">Hi there! How are you feeling today?</p>
                    </div>
                    <div className="bg-gray-100 p-3 rounded-lg rounded-tr-none max-w-xs ml-auto">
                      <p className="text-gray-800">I've been feeling a bit overwhelmed lately.</p>
                    </div>
                    <div className="bg-indigo-100 p-3 rounded-lg rounded-tl-none max-w-xs">
                      <p className="text-gray-800">I'm sorry to hear that. Let's talk about it. What's been contributing to those feelings?</p>
                    </div>
                    <div className="bg-gray-100 p-3 rounded-lg rounded-tr-none inline-block ml-auto">
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 bg-indigo-600 text-white p-4 rounded-full shadow-lg animate-bounce">
                  <Heart className="h-6 w-6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 fade-in-section opacity-0">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How MindfulChat Helps You</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI-powered chatbot provides personalized support for your mental well-being journey.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 fade-in-section opacity-0">
              <div className="bg-indigo-100 p-3 rounded-full inline-block mb-4">
                <MessageCircle className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">24/7 Supportive Conversations</h3>
              <p className="text-gray-600">
                Chat anytime, anywhere with our compassionate AI that understands your feelings and provides thoughtful responses.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 fade-in-section opacity-0">
              <div className="bg-indigo-100 p-3 rounded-full inline-block mb-4">
                <Shield className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Complete Privacy</h3>
              <p className="text-gray-600">
                Your conversations are fully encrypted and private. We never share your personal information with third parties.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 fade-in-section opacity-0">
              <div className="bg-indigo-100 p-3 rounded-full inline-block mb-4">
                <Clock className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Daily Check-ins</h3>
              <p className="text-gray-600">
                Establish healthy routines with gentle reminders and mood tracking to monitor your progress over time.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 fade-in-section opacity-0">
              <div className="bg-indigo-100 p-3 rounded-full inline-block mb-4">
                <BookOpen className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Evidence-Based Techniques</h3>
              <p className="text-gray-600">
                Access proven strategies from cognitive behavioral therapy, mindfulness, and positive psychology.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 fade-in-section opacity-0">
              <div className="bg-indigo-100 p-3 rounded-full inline-block mb-4">
                <Heart className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Personalized Experience</h3>
              <p className="text-gray-600">
                The more you interact, the better MindfulChat adapts to your unique needs and preferences.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 fade-in-section opacity-0">
              <div className="bg-indigo-100 p-3 rounded-full inline-block mb-4">
                <ArrowRight className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Crisis Resources</h3>
              <p className="text-gray-600">
                Immediate access to professional support resources when you need more than just a chat.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* About Us Section */}
      <section id="about" className="py-20 bg-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 mb-10 lg:mb-0 fade-in-section opacity-0">
              <img src="/api/placeholder/600/500" alt="Team of mental health professionals" className="rounded-xl shadow-lg" />
            </div>
            <div className="lg:w-1/2 lg:pl-12 fade-in-section opacity-0">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">About MindfulChat</h2>
              <p className="text-lg text-gray-700 mb-6">
                At MindfulChat, we believe everyone deserves accessible mental health support. Our team of psychologists, AI specialists, and developers created a compassionate chatbot that combines cutting-edge technology with evidence-based therapeutic approaches.
              </p>
              <p className="text-lg text-gray-700 mb-8">
                We're committed to breaking down barriers to mental healthcare by providing an always-available companion that offers guidance, support, and practical tools for managing life's challenges.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow text-center">
                  <p className="text-3xl font-bold text-indigo-600">98%</p>
                  <p className="text-gray-600">User satisfaction</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow text-center">
                  <p className="text-3xl font-bold text-indigo-600">250k+</p>
                  <p className="text-gray-600">Active users</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow text-center">
                  <p className="text-3xl font-bold text-indigo-600">12+</p>
                  <p className="text-gray-600">Mental health experts</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow text-center">
                  <p className="text-3xl font-bold text-indigo-600">24/7</p>
                  <p className="text-gray-600">Support availability</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Blog Section */}
      <section id="blog" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 fade-in-section opacity-0">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Mental Health Resources</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our collection of articles written by mental health professionals to support your well-being.
            </p>
          </div>
          
          {/* Filter tabs */}
          <div className="flex flex-wrap justify-center mb-12 fade-in-section opacity-0">
            <button 
              onClick={() => setActiveTab('all')}
              className={`m-2 px-6 py-2 rounded-full ${activeTab === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              All
            </button>
            <button 
              onClick={() => setActiveTab('anxiety')}
              className={`m-2 px-6 py-2 rounded-full ${activeTab === 'anxiety' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Anxiety
            </button>
            <button 
              onClick={() => setActiveTab('mindfulness')}
              className={`m-2 px-6 py-2 rounded-full ${activeTab === 'mindfulness' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Mindfulness
            </button>
            <button 
              onClick={() => setActiveTab('stress')}
              className={`m-2 px-6 py-2 rounded-full ${activeTab === 'stress' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Stress Management
            </button>
            <button 
              onClick={() => setActiveTab('relationships')}
              className={`m-2 px-6 py-2 rounded-full ${activeTab === 'relationships' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Relationships
            </button>
          </div>
          
          {/* Blog cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredBlogs.map(blog => (
              <div key={blog.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow fade-in-section opacity-0">
                <img src={blog.image} alt={blog.title} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <span className="text-xs text-gray-500">{blog.date}</span>
                  <h3 className="font-semibold text-lg mt-2 mb-2 text-gray-900">{blog.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{blog.excerpt}</p>
                  <a href="#" className="text-indigo-600 font-medium inline-flex items-center hover:text-indigo-800">
                    Read more
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12 fade-in-section opacity-0">
            <a href="#" className="inline-flex items-center text-indigo-600 font-medium hover:text-indigo-800">
              Browse all articles
              <ChevronDown className="ml-1 h-4 w-4" />
            </a>
          </div>
        </div>
      </section>
      
      {/* Newsletter Section */}
      <section className="py-20 bg-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 fade-in-section opacity-0">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Stay Updated on Mental Wellness</h2>
            <p className="text-xl text-indigo-100 max-w-3xl mx-auto">
              Join our newsletter for mental health tips, resources, and updates on new features.
            </p>
          </div>
          
            
        </div>
      </section>
      
      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div>
              <div className="flex items-center mb-6">
                <MessageCircle className="h-8 w-8 text-indigo-400" />
                <span className="ml-2 text-xl font-bold text-white">MindfulChat</span>
              </div>
              <p className="text-gray-400 mb-6">
                Your compassionate AI companion for mental well-being, available 24/7.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <i className="fab fa-linkedin-in"></i>
                </a>
              </div>
            </div>
            
            <div >
              <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
              <ul className="gap-10 flex flex-row">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Home</a></li>
                <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#about" className="text-gray-400 hover:text-white transition-colors">About</a></li>
                <li><a href="#blog" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            
            
            
          
          </div>
          
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 mb-4 md:mb-0">
                © 2025 MindfulChat. All rights reserved.
              </p>
              <div className="flex space-x-6">
               
              </div>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Add custom CSS for animations */}
      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 1s ease forwards;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .typing-indicator {
          display: flex;
          padding: 6px;
        }
        
        .typing-indicator span {
          height: 8px;
          width: 8px;
          background: #606060;
          border-radius: 50%;
          margin: 0 2px;
          display: block;
          animation: typing 1.2s infinite ease-in-out;
        }
        
        .typing-indicator span:nth-child(1) {
          animation-delay: 0s;
        }
        
        .typing-indicator span:nth-child(2) {
          animation-delay: 0.2s;
        }
        
        .typing-indicator span:nth-child(3) {
          animation-delay: 0.4s;
        }
        
        @keyframes typing {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
    </div>
  );
}