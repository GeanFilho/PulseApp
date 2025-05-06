// src/contexts/ThemeContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';

const ThemeContext = createContext(null);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    // Obter preferência de tema do localStorage ou usar tema claro como padrão
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });

  // Efeito para sincronizar o tema com localStorage e atributos do documento
  useEffect(() => {
    // Salvar preferência de tema no localStorage
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    // Opcional: Adicionar uma classe ao body do documento para estilização global
    if (isDark) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(prevIsDark => !prevIsDark);
  };

  const value = {
    isDark,
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;