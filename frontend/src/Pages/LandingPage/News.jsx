export default function NewsletterSection() {
    return (
      <section className="py-20 bg-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 fade-in-section opacity-0">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Stay Updated on Mental Wellness</h2>
            <p className="text-xl text-indigo-100 max-w-3xl mx-auto">
              Join our newsletter for mental health tips, resources, and updates on new features.
            </p>
          </div>
          
          <div className="max-w-lg mx-auto fade-in-section opacity-0">
            <form className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                required
              />
              <button
                type="submit"
                className="bg-white text-indigo-600 hover:bg-indigo-50 font-medium px-6 py-3 rounded-lg transition-colors"
              >
                Subscribe
              </button>
            </form>
            <p className="text-indigo-200 text-sm mt-4 text-center">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>
    );
  }