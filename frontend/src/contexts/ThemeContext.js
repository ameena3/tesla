import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const localData = localStorage.getItem('theme');
    return localData ? localData : 'liquid'; // Default to liquid theme
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    // Apply theme to the html element, e.g. by setting a data-theme attribute
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
