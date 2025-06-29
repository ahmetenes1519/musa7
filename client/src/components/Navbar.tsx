import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Bell, MessageCircle, User, Settings, LogOut, Menu, X, Star, Bookmark } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import ThemeToggle from './ThemeToggle';

const Navbar: React.FC = () => {
  const { user, signOut } = useAuth();
  const { theme } = useTheme();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const navItems = [
    { icon: Home, label: 'Ana Sayfa', href: '/' },
    { icon: Search, label: 'Keşfet', href: '/explore' },
    { icon: Bookmark, label: 'Kaydedilenler', href: '/bookmarks' },
    { icon: Bell, label: 'Bildirimler', href: '/notifications' },
    { icon: MessageCircle, label: 'Mesajlar', href: '/messages' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLoginClick = () => {
    setShowLoginModal(true);
    // Trigger login modal in parent component
    window.dispatchEvent(new CustomEvent('openLoginModal'));
  };

  return (
    <>
      <nav className={`
        sticky top-0 z-50 backdrop-blur-md border-b transition-all duration-300
        ${theme === 'islamic' ? 'bg-gradient-to-r from-emerald-900/90 to-teal-900/90 border-emerald-700/20' :
          theme === 'ramadan' ? 'bg-gradient-to-r from-yellow-600/90 to-amber-600/90 border-yellow-700/20' :
          'bg-white/80 dark:bg-gray-900/80 border-gray-200 dark:border-gray-700'
        }
      `}>
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 sm:space-x-3 min-w-0">
              <div className={`
                p-1.5 sm:p-2 rounded-xl transition-all duration-300 animate-pulse-glow flex-shrink-0
                ${theme === 'islamic' ? 'bg-emerald-600 text-white' :
                  theme === 'ramadan' ? 'bg-yellow-500 text-white' :
                  'bg-emerald-600 text-white'
                }
              `}>
                <span className="text-lg">🕌</span>
              </div>
              <h1 className={`
                text-lg sm:text-xl font-bold font-arabic truncate
                ${theme === 'islamic' || theme === 'ramadan' ? 'text-white' : 
                  'text-gray-900 dark:text-white'
                }
              `}>
                IslamConnect
              </h1>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1 lg:space-x-4">
              {navItems.map(({ icon: Icon, label, href }) => (
                <Link
                  key={href}
                  to={href}
                  className={`
                    flex items-center space-x-1 lg:space-x-2 px-2 lg:px-3 py-2 rounded-lg transition-all duration-200
                    hover:scale-105 hover:shadow-md
                    ${isActive(href) 
                      ? (theme === 'islamic' || theme === 'ramadan' ? 'bg-white/20 text-white' : 'bg-primary-100 text-primary-700')
                      : (theme === 'islamic' || theme === 'ramadan' ? 'text-white hover:bg-white/10' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800')
                    }
                  `}
                  title={label}
                >
                  <Icon size={18} />
                  <span className="hidden lg:block text-sm">{label}</span>
                </Link>
              ))}
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="hidden sm:block">
                <ThemeToggle />
              </div>
              
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className={`
                      flex items-center space-x-2 p-1.5 sm:p-2 rounded-lg transition-all duration-200
                      hover:scale-105
                      ${theme === 'islamic' || theme === 'ramadan' ? 
                        'text-white hover:bg-white/10' : 
                        'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }
                    `}
                  >
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs sm:text-sm font-semibold">
                        {user.name?.[0] || user.email?.[0]?.toUpperCase()}
                      </span>
                    </div>
                  </button>

                  {/* Profile Dropdown */}
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 animate-slide-up z-50">
                      <div className="py-2">
                        <Link 
                          to="/profile"
                          className="flex items-center space-x-2 w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          <User size={16} />
                          <span>Profil</span>
                        </Link>
                        <Link 
                          to="/settings"
                          className="flex items-center space-x-2 w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          <Settings size={16} />
                          <span>Ayarlar</span>
                        </Link>
                        <hr className="my-1 border-gray-200 dark:border-gray-700" />
                        <button 
                          onClick={() => {
                            signOut();
                            setIsProfileMenuOpen(false);
                          }}
                          className="flex items-center space-x-2 w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <LogOut size={16} />
                          <span>Çıkış Yap</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button 
                  onClick={handleLoginClick}
                  className={`
                    px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 text-sm
                    ${theme === 'islamic' ? 'bg-emerald-600 hover:bg-emerald-700' :
                      theme === 'ramadan' ? 'bg-yellow-600 hover:bg-yellow-700' :
                      'bg-primary-500 hover:bg-primary-600'
                    }
                    text-white
                  `}
                >
                  Giriş Yap
                </button>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`
                  md:hidden p-1.5 sm:p-2 rounded-lg
                  ${theme === 'islamic' || theme === 'ramadan' ? 
                    'text-white hover:bg-white/10' : 
                    'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }
                `}
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-3 border-t border-gray-200 dark:border-gray-700 animate-slide-up">
              <div className="space-y-1">
                {navItems.map(({ icon: Icon, label, href }) => (
                  <Link
                    key={href}
                    to={href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`
                      flex items-center space-x-3 w-full px-3 py-2 rounded-lg transition-colors text-sm
                      ${isActive(href)
                        ? (theme === 'islamic' || theme === 'ramadan' ? 'bg-white/20 text-white' : 'bg-primary-100 text-primary-700')
                        : (theme === 'islamic' || theme === 'ramadan' ? 'text-white hover:bg-white/10' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800')
                      }
                    `}
                  >
                    <Icon size={18} />
                    <span>{label}</span>
                  </Link>
                ))}
                
                {/* Mobile Theme Toggle */}
                <div className="px-3 py-2">
                  <ThemeToggle />
                </div>
                
                {!user && (
                  <button
                    onClick={() => {
                      handleLoginClick();
                      setIsMenuOpen(false);
                    }}
                    className={`
                      flex items-center space-x-3 w-full px-3 py-2 rounded-lg transition-colors text-sm
                      ${theme === 'islamic' || theme === 'ramadan' ? 'text-white hover:bg-white/10' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}
                    `}
                  >
                    <User size={18} />
                    <span>Giriş Yap</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;