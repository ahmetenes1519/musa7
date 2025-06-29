import React from 'react';
import { Sun, Moon, Fuel as Mosque, Star } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const themes = [
    { name: 'light', icon: Sun, label: 'Aydınlık', color: 'text-yellow-500' },
    { name: 'dark', icon: Moon, label: 'Karanlık', color: 'text-blue-500' },
    { name: 'islamic', icon: Mosque, label: 'İslami', color: 'text-emerald-500' },
    { name: 'ramadan', icon: Star, label: 'Ramazan', color: 'text-yellow-500' },
  ] as const;

  return (
    <div className="flex items-center space-x-1 bg-white dark:bg-gray-800 rounded-lg p-1 shadow-md">
      {themes.map(({ name, icon: Icon, label, color }) => (
        <button
          key={name}
          onClick={() => setTheme(name)}
          className={`
            p-2 rounded-md transition-all duration-200 relative group
            ${theme === name 
              ? `${color} bg-gray-100 dark:bg-gray-700 shadow-md transform scale-105` 
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }
          `}
          title={label}
        >
          <Icon size={18} />
          <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs 
                         bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 
                         transition-opacity duration-200 whitespace-nowrap z-50">
            {label}
          </span>
        </button>
      ))}
    </div>
  );
};

export default ThemeToggle;