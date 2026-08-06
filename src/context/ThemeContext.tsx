'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Theme = 'dark' | 'light';

export interface ThemeTokens {
  bg: string;
  cardBg: string;
  cardBorder: string;
  cardItemBg: string;
  cardItemBorder: string;
  titleText: string;
  subText: string;
  label: string;
  inputBg: string;
  inputBorder: string;
  inputText: string;
  accent: string;
  accentGradient: string;
  accentShadow: string;
  headerBg: string;
  headerBorder: string;
  navLinkText: string;
  navLinkActiveText: string;
  footerBg: string;
  footerBorder: string;
  tableHeaderBg: string;
  tableRowBorder: string;
  priceColor: string;
  shadow: string;
  badgeGreenBg: string;
  badgeGreenText: string;
  badgeGreenBorder: string;
  badgeYellowBg: string;
  badgeYellowText: string;
  badgeYellowBorder: string;
  modalOverlayBg: string;
  modalBg: string;
  modalBorder: string;
}

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
  t: ThemeTokens;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('travelo_theme') as Theme | null 
      || localStorage.getItem('travelo_admin_theme') as Theme | null;
    if (savedTheme === 'light' || savedTheme === 'dark') {
      setTheme(savedTheme);
    } else {
      setTheme('dark');
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('travelo_theme', nextTheme);
    localStorage.setItem('travelo_admin_theme', nextTheme);
  };

  const isDark = theme === 'dark';

  const t: ThemeTokens = {
    bg: isDark ? '#060F22' : '#f8fafc',
    cardBg: isDark ? '#0B1B3A' : '#ffffff',
    cardBorder: isDark ? 'rgba(255, 255, 255, 0.1)' : '#e2e8f0',
    cardItemBg: isDark ? '#0E2248' : '#ffffff',
    cardItemBorder: isDark ? 'rgba(255, 255, 255, 0.08)' : '#e2e8f0',
    titleText: isDark ? '#ffffff' : '#0f172a',
    subText: isDark ? '#93A5C4' : '#64748b',
    label: isDark ? '#e2e8f0' : '#334155',
    inputBg: isDark ? '#060F22' : '#ffffff',
    inputBorder: isDark ? 'rgba(255, 255, 255, 0.15)' : '#cbd5e1',
    inputText: isDark ? '#ffffff' : '#0f172a',
    accent: isDark ? '#5B93FF' : '#0284c7',
    accentGradient: isDark ? 'linear-gradient(135deg, #2E6FF2 0%, #1b53c7 100%)' : 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
    accentShadow: isDark ? '0 4px 14px rgba(46, 111, 242, 0.4)' : '0 4px 14px rgba(2, 132, 199, 0.25)',
    headerBg: isDark ? 'rgba(6, 15, 34, 0.95)' : 'rgba(255, 255, 255, 0.95)',
    headerBorder: isDark ? 'rgba(255, 255, 255, 0.1)' : '#e2e8f0',
    navLinkText: isDark ? '#93A5C4' : '#475569',
    navLinkActiveText: isDark ? '#5B93FF' : '#0284c7',
    footerBg: isDark ? '#040916' : '#0f172a',
    footerBorder: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.1)',
    tableHeaderBg: isDark ? '#060F22' : '#f8fafc',
    tableRowBorder: isDark ? 'rgba(255, 255, 255, 0.05)' : '#f1f5f9',
    priceColor: isDark ? '#5B93FF' : '#059669',
    shadow: isDark ? '0 10px 30px rgba(0,0,0,0.4)' : '0 4px 20px rgba(0,0,0,0.04)',
    badgeGreenBg: isDark ? 'rgba(74, 222, 128, 0.15)' : '#ecfdf5',
    badgeGreenText: isDark ? '#4ade80' : '#059669',
    badgeGreenBorder: isDark ? 'rgba(74, 222, 128, 0.3)' : '#a7f3d0',
    badgeYellowBg: isDark ? 'rgba(251, 191, 36, 0.15)' : '#fffbeb',
    badgeYellowText: isDark ? '#fbbf24' : '#d97706',
    badgeYellowBorder: isDark ? 'rgba(251, 191, 36, 0.3)' : '#fde68a',
    modalOverlayBg: isDark ? 'rgba(3, 8, 20, 0.85)' : 'rgba(15, 23, 42, 0.65)',
    modalBg: isDark ? '#0B1B3A' : '#ffffff',
    modalBorder: isDark ? 'rgba(255, 255, 255, 0.15)' : '#e2e8f0',
  };

  useEffect(() => {
    if (mounted) {
      document.body.style.backgroundColor = t.bg;
      document.body.style.color = t.titleText;
    }
  }, [theme, mounted, t.bg, t.titleText]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark, t }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    // Fallback if rendered outside ThemeProvider
    const isDark = true;
    const t: ThemeTokens = {
      bg: '#060F22',
      cardBg: '#0B1B3A',
      cardBorder: 'rgba(255, 255, 255, 0.1)',
      cardItemBg: '#0E2248',
      cardItemBorder: 'rgba(255, 255, 255, 0.08)',
      titleText: '#ffffff',
      subText: '#93A5C4',
      label: '#e2e8f0',
      inputBg: '#060F22',
      inputBorder: 'rgba(255, 255, 255, 0.15)',
      inputText: '#ffffff',
      accent: '#5B93FF',
      accentGradient: 'linear-gradient(135deg, #2E6FF2 0%, #1b53c7 100%)',
      accentShadow: '0 4px 14px rgba(46, 111, 242, 0.4)',
      headerBg: 'rgba(6, 15, 34, 0.95)',
      headerBorder: 'rgba(255, 255, 255, 0.1)',
      navLinkText: '#93A5C4',
      navLinkActiveText: '#5B93FF',
      footerBg: '#040916',
      footerBorder: 'rgba(255, 255, 255, 0.08)',
      tableHeaderBg: '#060F22',
      tableRowBorder: 'rgba(255, 255, 255, 0.05)',
      priceColor: '#5B93FF',
      shadow: '0 10px 30px rgba(0,0,0,0.4)',
      badgeGreenBg: 'rgba(74, 222, 128, 0.15)',
      badgeGreenText: '#4ade80',
      badgeGreenBorder: 'rgba(74, 222, 128, 0.3)',
      badgeYellowBg: 'rgba(251, 191, 36, 0.15)',
      badgeYellowText: '#fbbf24',
      badgeYellowBorder: 'rgba(251, 191, 36, 0.3)',
      modalOverlayBg: 'rgba(3, 8, 20, 0.85)',
      modalBg: '#0B1B3A',
      modalBorder: 'rgba(255, 255, 255, 0.15)',
    };
    return { theme: 'dark' as Theme, toggleTheme: () => {}, isDark: true, t };
  }
  return context;
};
