'use client';

import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#050814] border-t border-cyan-500/20 py-12 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 via-violet-600 to-pink-500 p-[1px]">
                <div className="w-full h-full bg-[#050814] rounded-[11px] flex items-center justify-center">
                  <span className="text-cyan-400 font-extrabold text-lg">T</span>
                </div>
              </div>
              <span className="text-2xl font-bold text-white">
                Tech<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500">novate</span>
              </span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md text-xs leading-relaxed">
              Explore → Learn → Build → Connect. A student technology discovery platform created by Technovate for college students across all branches and years.
            </p>
          </div>

          {/* Nav Links */}
          <div>
            <h3 className="text-white font-bold text-sm mb-3 font-mono">Platform Navigation</h3>
            <ul className="space-y-2 text-xs text-gray-300">
              <li>
                <a href="#explore" className="hover:text-cyan-400 transition-colors">
                  Technology
                </a>
              </li>
              <li>
                <a href="#topics" className="hover:text-cyan-400 transition-colors">
                  Learning
                </a>
              </li>
              <li>
                <a href="#today" className="hover:text-cyan-400 transition-colors">
                  Events & Today
                </a>
              </li>
              <li>
                <a href="#roadmaps" className="hover:text-cyan-400 transition-colors">
                  Roadmaps
                </a>
              </li>
              <li>
                <a href="#opportunities" className="hover:text-cyan-400 transition-colors">
                  Opportunities
                </a>
              </li>
            </ul>
          </div>

          {/* Technovate Info */}
          <div>
            <h3 className="text-white font-bold text-sm mb-3 font-mono">Technovate Club</h3>
            <ul className="space-y-2.5 text-xs text-gray-300">
              <li className="flex items-start space-x-2">
                <span className="text-cyan-400 font-bold">Email:</span>
                <span>contact@technovate.com</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-cyan-400 font-bold">Campus:</span>
                <span>Rayat Bahra Professional University, Hoshiarpur</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-400 gap-4">
          <p>© {currentYear} Technovate. Built for college students. All rights reserved.</p>
          <div className="flex space-x-4 font-mono text-[11px] text-cyan-400">
            <span>Discover → Learn → Build → Connect</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
