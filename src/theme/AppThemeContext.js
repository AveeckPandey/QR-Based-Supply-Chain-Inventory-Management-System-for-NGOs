import { createContext, useContext } from 'react';

export const palettes = {
  dark: {
    mode: 'dark',
    background: '#0F0F0F',
    backgroundAlt: '#151515',
    surface: '#1A1A1A',
    surfaceRaised: '#202020',
    border: '#2A2A2A',
    primary: '#C9A84C',
    primarySoft: 'rgba(201,168,76,0.12)',
    primaryText: '#0F0F0F',
    text: '#F0EDE6',
    muted: '#9A958B',
    danger: '#E07070',
    success: '#3FA96B',
    warning: '#D8A14A',
    shadow: '#000000'
  },
  light: {
    mode: 'light',
    background: '#EAF3FF',
    backgroundAlt: '#DCEBFF',
    surface: '#FFFFFF',
    surfaceRaised: '#F7FAFF',
    border: '#BFD4F2',
    primary: '#1F5ED8',
    primarySoft: 'rgba(31,94,216,0.10)',
    primaryText: '#FFFFFF',
    text: '#102447',
    muted: '#6A7C9E',
    danger: '#C85656',
    success: '#2F8D59',
    warning: '#C98A29',
    shadow: '#8CA7D8'
  }
};

export const AppThemeContext = createContext({
  theme: palettes.light,
  themeName: 'light',
  toggleTheme: () => {}
});

export function useAppTheme() {
  return useContext(AppThemeContext);
}
