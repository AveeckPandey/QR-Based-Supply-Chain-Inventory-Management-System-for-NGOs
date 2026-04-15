import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./src/services/firebase";
import { useEffect, useState } from "react";
import { NavigationContainer, DarkTheme, DefaultTheme } from "@react-navigation/native";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import AuthNavigator from "./src/navigation/AuthNavigator";
import AppNavigator from "./src/navigation/AppNavigator";
import { AppThemeContext, palettes } from "./src/theme/AppThemeContext";

const THEME_KEY = "inventory-app-theme";

export default function App() {
  const [user, setUser] = useState(null);
  const systemTheme = useColorScheme();
  const [themeName, setThemeName] = useState(systemTheme === "dark" ? "dark" : "light");

  useEffect(() => {
    const loadTheme = async () => {
      const storedTheme = await AsyncStorage.getItem(THEME_KEY);
      if (storedTheme === "dark" || storedTheme === "light") {
        setThemeName(storedTheme);
        return;
      }

      setThemeName(systemTheme === "dark" ? "dark" : "light");
    };

    loadTheme();
  }, [systemTheme]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  const toggleTheme = async () => {
    const nextTheme = themeName === "dark" ? "light" : "dark";
    setThemeName(nextTheme);
    await AsyncStorage.setItem(THEME_KEY, nextTheme);
  };

  const appPalette = palettes[themeName];
  const navigationTheme = {
    ...(themeName === "dark" ? DarkTheme : DefaultTheme),
    colors: {
      ...(themeName === "dark" ? DarkTheme.colors : DefaultTheme.colors),
      background: appPalette.background,
      card: appPalette.surface,
      text: appPalette.text,
      border: appPalette.border,
      primary: appPalette.primary
    }
  };

  return (
    <AppThemeContext.Provider
      value={{
        theme: appPalette,
        themeName,
        toggleTheme
      }}
    >
      <NavigationContainer theme={navigationTheme}>
        <StatusBar style={themeName === "dark" ? "light" : "dark"} />
        {user ? <AppNavigator /> : <AuthNavigator />}
      </NavigationContainer>
    </AppThemeContext.Provider>
  );
}
