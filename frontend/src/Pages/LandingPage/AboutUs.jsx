export default function AboutSection() {
    return (
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
    );
  }