'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ArrowRight, Sparkles } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Tech Hub', href: '#topics' },
    { name: 'Events', href: '#today' },
    { name: 'About', href: '#explore' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#050814]/90 backdrop-blur-xl border-b border-cyan-500/20 shadow-xl shadow-black/50 py-3'
          : 'bg-gradient-to-b from-[#050814]/90 to-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Left: TECHNOVATE Logo/Brand */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 via-violet-600 to-pink-500 p-[1px] shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-[#050814] rounded-[11px] flex items-center justify-center">
                <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500 text-lg">
                  T
                </span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1">
                TECH<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-violet-400 to-pink-500">NOVATE</span>
              </span>
              <span className="text-[9px] uppercase tracking-widest text-cyan-400/80 font-mono -mt-1">
                Tech Hub Platform
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 backdrop-blur-md">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="px-4 py-1.5 rounded-full text-xs font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Right: Join Technovate Button */}
          <div className="hidden md:flex items-center space-x-3">
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSfuzvlLSI34YJvl5Lb4ZJciSWZeUR1wfjwgug_E8bUvHKhSjA/viewform?usp=publish-editor"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-violet-600 to-pink-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.02] transition-all flex items-center space-x-1.5"
            >
              <span>Join Technovate</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Mobile Hamburger Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-gray-300 hover:text-white bg-white/5 border border-white/10"
              aria-label="Toggle Mobile Navigation"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#050814]/95 backdrop-blur-2xl border-b border-cyan-500/20 px-4 pt-4 pb-6 mt-3 shadow-2xl">
          <div className="flex flex-col space-y-2">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white transition-all"
              >
                {item.name}
              </a>
            ))}

            <div className="pt-4 border-t border-white/10">
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSfuzvlLSI34YJvl5Lb4ZJciSWZeUR1wfjwgug_E8bUvHKhSjA/viewform?usp=publish-editor"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-bold text-sm block shadow-lg shadow-cyan-500/20"
              >
                Join Technovate
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
