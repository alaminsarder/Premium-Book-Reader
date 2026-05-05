import React from 'react';
import { BookOpen, Mail, MessageCircle, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-6">
              <BookOpen className="h-8 w-8 text-amber-400" />
              <span className="text-2xl font-bold tracking-tight">Premium Book Reader</span>
            </Link>
            <p className="text-gray-400 mb-6">
              Your curated destination for literary treasures.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4 text-gray-400">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/membership" className="hover:text-white transition-colors">Membership</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Support</h4>
            <ul className="space-y-4 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Newsletter</h4>
            <form className="space-y-4">
              <input type="email" placeholder="Enter your email" className="w-full bg-gray-800 border-gray-700 rounded-lg py-2 px-4" />
              <button className="w-full bg-indigo-600 text-white font-bold py-2 rounded-lg hover:bg-indigo-700">Subscribe</button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
          <p>© 2024 Premium Book Reader. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
export default Footer;