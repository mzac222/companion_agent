import React from 'react';
import blogs from '../../data/data';
import Footer from './Footer';
import { ArrowRight } from 'lucide-react';

const AllArticlesPage = () => {
  return (
    <>
      <section className="py-24 bg-gradient-to-br from-white to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-12 text-center tracking-tight">
            Explore All <span className="text-indigo-600">Articles</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <div
                key={blog.id}
                className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <span className="text-sm text-gray-500">{blog.date}</span>
                <h3 className="text-xl font-semibold text-gray-800 mt-2 mb-3 leading-tight">
                  {blog.title}
                </h3>
                <p className="text-gray-600 text-sm mb-5 line-clamp-3">{blog.excerpt}</p>
                <a
                  href={blog.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 font-medium inline-flex items-center hover:text-indigo-800 transition-colors"
                >
                  Read more
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default AllArticlesPage;
