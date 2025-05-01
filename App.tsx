import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AppNavigator } from "./navigation/AppNavigator";
import { OnboardingScreen } from "./screens/OnboardingScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Provider, useDispatch } from "react-redux";
import './i18n';
import { I18nextProvider, useTranslation } from 'react-i18next';
import i18n from './i18n';

import { store } from "./redux/store";
import { setLanguage } from "./redux/languageSlice";

import { Image, View, Text } from "react-native";
import { fetchMetadata } from "./redux/dataSlice";

const RootStack = createNativeStackNavigator();

function AppInitializer() {
  const dispatch = useDispatch();
  const { i18n } = useTranslation();

  useEffect(() => {
    const initialLang = i18n.language === 'cs' ? 'cz' : i18n.language;
    dispatch(setLanguage(initialLang as 'cz' | 'en' | 'de'));
  }, []);


  return null; // nenápadná komponenta bez UI
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const checkOnboarding = async () => {
      const value = await AsyncStorage.getItem("hasOnboarded");
      if (value !== null) {
        setHasOnboarded(true);
      }
      setIsLoading(false);
    };

    checkOnboarding();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Načítání...</Text>
      </View>
    );
  }

  return (
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <AppInitializer /> 
        <NavigationContainer>
          <RootStack.Navigator screenOptions={{ headerShown: false }}>
            {!hasOnboarded && (
              <RootStack.Screen name="Onboarding" component={OnboardingScreen} />
            )}
            <RootStack.Screen name="MainApp" component={AppNavigator} />
          </RootStack.Navigator>

          {/* ✅ TESTOVACÍ ZOBRAZENÍ OBRÁZKU */}
          {imageUrl && (
            <Image
              source={{ uri: imageUrl }}
              style={{ width: 100, height: 100, position: "absolute", bottom: 20, right: 20 }}
            />
          )}
        </NavigationContainer>
      </I18nextProvider>
    </Provider>
  );
}
