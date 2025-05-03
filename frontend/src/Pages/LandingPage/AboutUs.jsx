import about from '../../assets/about.jpg';

export default function AboutSection() {
  return (
    <section id="about" className="py-24 bg-gradient-to-br from-indigo-50 via-purple-50 to-violet-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          
          {/* Left Image */}
          <div className="lg:w-1/2 fade-in-section opacity-0">
            <img
              src={about}
              alt="Mental health illustration"
              className="rounded-3xl w-full h-auto max-w-[520px] shadow-2xl transform transition-transform duration-300 hover:scale-105"
            />
          </div>

          {/* Right Content */}
          <div className="lg:w-1/2 fade-in-section opacity-0">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tight">
              About <span className="text-indigo-600">MindfulChat</span>
            </h2>
            <p className="text-lg text-gray-700 mb-5">
              MindfulChat is a heartfelt project by two students dedicated to bridging the gap between technology and mental health. Our aim is to provide a space where anyone can feel heard, supported, and empowered to face life’s challenges.
            </p>
            <p className="text-lg text-gray-700 mb-8">
              While we aren't professionals, every line of code is built with empathy, careful research, and an open heart. We're committed to growing and improving—one conversation at a time.
            </p>

            <div className="grid grid-cols-2 gap-6">
              {[
                { title: "2", subtitle: "Students" },
                { title: "100%", subtitle: "Built with Passion" },
                { title: "Open", subtitle: "To Feedback" },
                { title: "Always", subtitle: "Improving" }
              ].map((item, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl shadow-lg text-center hover:shadow-xl transition-shadow">
                  <p className="text-4xl font-bold text-indigo-600">{item.title}</p>
                  <p className="text-gray-600 mt-1">{item.subtitle}</p>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
