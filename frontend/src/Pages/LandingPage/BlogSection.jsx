import { useState } from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';

export default function BlogSection() {
  const [activeTab, setActiveTab] = useState('all');
  
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
  );
}