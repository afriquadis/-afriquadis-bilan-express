"use client";

import Link from 'next/link';
import Logo from './Logo';
import { useState, useEffect } from 'react';
import { Bars3Icon, XMarkIcon, BellIcon } from '@heroicons/react/24/outline';

const Header = () => {
  // Simulation d'état de connexion
  const isLoggedIn = false;
  const userName = 'Patient';
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-40 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-medium border-b border-neutral-200' 
        : 'bg-white/80 backdrop-blur-sm shadow-soft'
    }`}>
      <nav className="container mx-auto px-4 lg:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
            <Logo size={36} />
            <span className="text-xl font-bold text-darkBlue-800 group-hover:text-afriquadis-600 transition-colors tracking-tight">
              BILAN EXPRESS
            </span>
          </Link>

          {/* Navigation Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/dashboard" className="nav-link group">
              <span className="relative">
                Tableau de Bord
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-afriquadis-500 to-orange-500 group-hover:w-full transition-all duration-300"></span>
              </span>
            </Link>
            <Link href="/diagnostic" className="nav-link group">
              <span className="relative">
                Diagnostic
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-afriquadis-500 to-orange-500 group-hover:w-full transition-all duration-300"></span>
              </span>
            </Link>
            <Link href="/contact" className="nav-link group">
              <span className="relative">
                Contact
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-afriquadis-500 to-orange-500 group-hover:w-full transition-all duration-300"></span>
              </span>
            </Link>
            
            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <button 
                  className="relative p-2 text-neutral-600 hover:text-afriquadis-600 transition-colors"
                  aria-label="Notifications"
                >
                  <BellIcon className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full animate-pulse"></span>
                </button>
                <Link href="/account" className="flex items-center gap-2 text-neutral-700 hover:text-afriquadis-600 transition-colors">
                  <div className="w-8 h-8 bg-gradient-to-br from-afriquadis-500 to-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-white">
                      {userName.charAt(0)}
                    </span>
                  </div>
                  <span className="font-medium">{userName}</span>
                </Link>
              </div>
            ) : (
              <Link href="/login" className="btn-secondary text-sm py-2 px-4 bg-gradient-to-r from-afriquadis-500 to-darkBlue-600 hover:from-afriquadis-600 hover:to-darkBlue-700 text-white border-0 shadow-lg">
                Connexion
        </Link>
            )}
          </div>

          {/* Menu Mobile Button */}
          <button
            className="md:hidden p-2 text-neutral-600 hover:text-primary-600 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3Icon className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Menu Mobile */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-b border-neutral-200 shadow-lg">
            <div className="flex flex-col space-y-1 p-4">
              <Link 
                href="/dashboard" 
                className="mobile-nav-link"
                onClick={() => setIsMenuOpen(false)}
              >
                Tableau de Bord
          </Link>
              <Link 
                href="/diagnostic" 
                className="mobile-nav-link"
                onClick={() => setIsMenuOpen(false)}
              >
                Diagnostic
          </Link>
              <Link 
                href="/contact" 
                className="mobile-nav-link"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
          </Link>
              
          {isLoggedIn ? (
            <>
                  <Link 
                    href="/account" 
                    className="mobile-nav-link"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Mon Compte
                  </Link>
                  <button className="mobile-nav-link text-left">
                    Déconnexion
              </button>
            </>
          ) : (
                <Link 
                  href="/login" 
                  className="mobile-nav-link bg-primary-50 text-primary-700 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                Connexion
              </Link>
              )}
            </div>
            </div>
          )}
      </nav>
    </header>
  );
};

export default Header;
