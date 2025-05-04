import about from '../../assets/about.jpg';

export default function AboutSection() {
  return (
    <section id="about" className="py-24 bg-gradient-to-br bg-gradient-to-br from-indigo-100 via-blue-100 to-indigo-200">
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
  MindfulChat is our Major Project, built to bridge the gap between mental health and technology. We've created a space where anyone can feel heard, supported, and empowered to navigate life’s challenges.
</p>
<p className="text-lg text-gray-700 mb-8">
  While we're not licensed professionals, every line of code is written with empathy, thoughtful research, and an open heart. MindfulChat is a work in progress—just like all of us—and we’re committed to growing, learning, and improving one meaningful conversation at a time.
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
