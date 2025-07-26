// src/components/ui/ThemeToggle.tsx
import React from 'react';
import { FaSun, FaMoon, FaAdjust } from 'react-icons/fa';
import { useTheme } from '../../contexts/ThemeContext';
import '../../styles/ThemeToggle.css';

const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();
  
  return (
    <div className="theme-toggle">
      <div className="theme-option">
        <button 
          onClick={() => setTheme('light')}
          className={theme === 'light' ? 'active' : ''}
          aria-label="Light theme"
        >
          <FaSun />
          <span>Light</span>
        </button>
      </div>
      
      <div className="theme-option">
        <button 
          onClick={() => setTheme('system')}
          className={theme === 'system' ? 'active' : ''}
          aria-label="System theme"
        >
          <FaAdjust />
          <span>System</span>
        </button>
      </div>
      
      <div className="theme-option">
        <button 
          onClick={() => setTheme('dark')}
          className={theme === 'dark' ? 'active' : ''}
          aria-label="Dark theme"
        >
          <FaMoon />
          <span>Dark</span>
        </button>
      </div>
    </div>
  );
};

export default ThemeToggle;