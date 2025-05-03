import { MessageCircle, Shield, Clock, BookOpen, Heart, ArrowRight, History } from 'lucide-react';

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 fade-in-section opacity-0">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">How MindfulChat Helps You</h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Our AI-powered chatbot provides personalized support for your mental well-being journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 duration-300 ease-in-out border border-gray-100 hover:bg-indigo-50">
            <div className="bg-indigo-100 p-4 rounded-full inline-block mb-6">
              <MessageCircle className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-900">24/7 Supportive Conversations</h3>
            <p className="text-gray-600">
              Chat anytime, anywhere with our compassionate AI that understands your feelings and provides thoughtful responses.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 duration-300 ease-in-out border border-gray-100 hover:bg-indigo-50">
            <div className="bg-indigo-100 p-4 rounded-full inline-block mb-6">
              <Shield className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-900">Complete Privacy</h3>
            <p className="text-gray-600">
              Your conversations are fully encrypted and private. We never share your personal information with third parties.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 duration-300 ease-in-out border border-gray-100 hover:bg-indigo-50">
            <div className="bg-indigo-100 p-4 rounded-full inline-block mb-6">
              <Clock className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-900">Voice Module</h3>
            <p className="text-gray-600">
              Establish healthy routines with voice-based chat.
            </p>
          </div>

          {/* Feature 4 – Replaced with History */}
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 duration-300 ease-in-out border border-gray-100 hover:bg-indigo-50">
            <div className="bg-indigo-100 p-4 rounded-full inline-block mb-6">
              <History className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-900">Conversation History</h3>
            <p className="text-gray-600">
              Easily revisit previous chats and track your emotional growth over time.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 duration-300 ease-in-out border border-gray-100 hover:bg-indigo-50">
            <div className="bg-indigo-100 p-4 rounded-full inline-block mb-6">
              <Heart className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-900">Personalized Experience</h3>
            <p className="text-gray-600">
              The more you interact, the better MindfulChat adapts to your unique needs and preferences.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 duration-300 ease-in-out border border-gray-100 hover:bg-indigo-50">
            <div className="bg-indigo-100 p-4 rounded-full inline-block mb-6">
              <ArrowRight className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-900">Crisis Resources</h3>
            <p className="text-gray-600">
              Immediate access to professional support resources when you need more than just a chat.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
