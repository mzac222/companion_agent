import { useState } from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import blogs from "../../data/data"
import { useNavigate } from 'react-router-dom';

export default function BlogSection() {
  // Use the imported blogs from the pasted file
 
  
  const [activeTab, setActiveTab] = useState('all');
  const navigate=useNavigate();
  
  // Get unique categories from blogs for dynamic tabs
  const categories = ['all', ...new Set(blogs.map(blog => blog.category))];
  
  // Filter blogs based on active tab
  const filteredBlogs = activeTab === 'all'
    ? blogs
    : blogs.filter(blog => blog.category === activeTab);
  
  // Format category name for display
  const formatCategoryName = (category) => {
    if (category === 'all') return 'All';
    return category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ');
  };
  
  // Get color based on category for card accents
  const getCategoryColor = (category) => {
    const colors = {
      anxiety: 'bg-blue-100 text-blue-800',
      mindfulness: 'bg-green-100 text-green-800',
      stress: 'bg-orange-100 text-orange-800',
      relationships: 'bg-purple-100 text-purple-800',
      depression: 'bg-red-100 text-red-800',
      resilience: 'bg-yellow-100 text-yellow-800',
      'seasonal-affective-disorder': 'bg-indigo-100 text-indigo-800',
      wellness: 'bg-teal-100 text-teal-800'
    };
    
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <section id="blog" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Mental Health Resources</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our collection of articles written by mental health professionals to support your well-being.
          </p>
        </div>
        
        {/* Filter tabs - scrollable on mobile */}
        <div className="mb-12 overflow-x-auto pb-2">
          <div className="flex space-x-2 min-w-max px-4">
            {categories.slice(0, 8).map(category => (
              <button
                key={category}
                onClick={() => setActiveTab(category)}
                className={`px-6 py-2 rounded-full transition-all duration-200 whitespace-nowrap ${
                  activeTab === category 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {formatCategoryName(category)}
              </button>
            ))}
          </div>
        </div>
        
        {/* Blog cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBlogs.slice(0, 4).map(blog => (
            <div key={blog.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100 flex flex-col h-full">
              {/* Category label at top of card */}
              <div className="pt-4 px-6">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getCategoryColor(blog.category)}`}>
                  {formatCategoryName(blog.category)}
                </span>
              </div>
              
              <div className="px-6 pb-6 flex-1 flex flex-col">
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2 mt-3">
                    <span className="text-xs text-gray-500">{blog.date}</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-3 text-gray-900 line-clamp-2">{blog.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{blog.excerpt}</p>
                </div>
                
                <a 
                  href={blog.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-indigo-600 font-medium inline-flex items-center hover:text-indigo-800 mt-2 group"
                >
                  Read more
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          ))}
        </div>
        
        {filteredBlogs.length > 6 && (
          <div className="text-center mt-12">
            <button onClick={() => navigate('/all-articles')} className="bg-white hover:bg-gray-50 text-indigo-600 font-medium px-6 py-3 rounded-full shadow-sm border border-gray-200 inline-flex items-center transition-colors">
              Browse all articles
              <ChevronDown className="ml-2 h-4 w-4" />
            </button>
          </div>
        )}
        
        {filteredBlogs.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500">No articles found in this category.</p>
          </div>  
        )}
      </div>
    </section>
  );
}
