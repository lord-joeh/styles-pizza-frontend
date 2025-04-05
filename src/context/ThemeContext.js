import React, { createContext, useState, useEffect, useMemo } from 'react';
import {
  createTheme,
  ThemeProvider as MUIThemeProvider,
} from '@mui/material/styles';

export const ThemeContext = createContext();

const isValidTheme = (theme) => ['light', 'dark'].includes(theme);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    try {
      if (typeof window === 'undefined') return 'light';
      const storedTheme = localStorage.getItem('appTheme');
      return isValidTheme(storedTheme) ? storedTheme : 'light';
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      return 'light';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('appTheme', theme);
    } catch (error) {
      console.error('Error saving theme to localStorage:', error);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Using "mode" for clarity inside theme configuration
  const themeConfig = useMemo(
    () =>
      createTheme({
        palette: {
          mode: theme,
          ...(theme === 'light'
            ? {
                primary: { main: '#FF5722' },
                secondary: { main: '#00897B' },
                background: {
                  default: '#F5F5F5',
                  paper: '#FFFFFF',
                },
                text: {
                  primary: '#222',
                  secondary: '#666',
                },
              }
            : {
                primary: { main: '#FF7043' },
                secondary: { main: '#4DB6AC' },
                background: {
                  default: '#303030',
                  paper: '#424242',
                },
                text: {
                  primary: '#fff',
                  secondary: '#ddd',
                },
              }),
        },
        typography: {
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: '8px',
                textTransform: 'none',
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                borderRadius: '12px',
                boxShadow:
                  theme === 'light'
                    ? '0 4px 8px rgba(0, 0, 0, 0.1)'
                    : '0 4px 8px rgba(255, 255, 255, 0.1)',
              },
            },
          },
        },
      }),
    [theme],
  ); // Recreate theme only when theme changes

  const contextValue = useMemo(
    () => ({
      theme,
      toggleTheme,
    }),
    [theme],
  ); // Memoize context value

  return (
    <ThemeContext.Provider value={contextValue}>
      <MUIThemeProvider theme={themeConfig}>{children}</MUIThemeProvider>
    </ThemeContext.Provider>
  );
};
