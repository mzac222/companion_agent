import { MessageCircle, Shield, Clock, BookOpen, Heart, ArrowRight } from 'lucide-react';

export default function FeaturesSection() {
  return (
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
  );
}