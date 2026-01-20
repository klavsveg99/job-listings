import React from 'react'
import { useTheme } from '../contexts/ThemeContext'

interface ThemeToggleProps {
  variant?: 'fixed' | 'inline'
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ variant = 'fixed' }) => {
  const { theme, toggleTheme } = useTheme()

  const buttonStyle: React.CSSProperties = {
    padding: '0.5rem',
    borderRadius: '50%',
    border: '2px solid var(--color-primary)',
    background: 'var(--color-card)',
    color: 'var(--color-primary)',
    cursor: 'pointer',
    fontSize: '1.2rem',
    width: '44px',
    height: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    ...(variant === 'fixed' && {
      position: 'fixed',
      top: '1rem',
      right: '1rem',
      zIndex: 1000,
    }),
  }

  return (
    <button
      onClick={toggleTheme}
      style={buttonStyle}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.1)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)'
      }}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  )
}