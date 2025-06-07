import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

const slidesData = [
  {
    id: "1",
    cz_title: "Vítejte v aplikaci Hustopeče: Pohled do Minulosti!",
    en_title: "Welcome to the Hustopeče App: A Glimpse into the Past!",
    cz_description:
      "Objevujte tajemství Hustopečí a poznávejte zapomenuté příběhy.",
    en_description:
      "Discover the secrets of Hustopeče and uncover forgotten stories.",
    cz_button: "Objevovat",
    en_button: "Explore",
    image: require("../assets/onboarding1.png"),
  },
  {
    id: "2",
    cz_title: "Vaše soukromí je pro nás priorita!",
    en_title: "Your Privacy is Our Priority!",
    cz_description:
      "Používáme kameru, mikrofon a polohové služby, když je to opravdu potřeba. Vaše data chráníme.",
    en_description:
      "We use the camera, microphone and location only when truly necessary. Your data is protected.",
    cz_button: "Pokračovat",
    en_button: "Continue",
    image: require("../assets/onboarding2.png"),
  },
  {
    id: "3",
    cz_title: "Buďte opatrní při použití aplikace!",
    en_title: "Use the App Safely!",
    cz_description:
      "Dbejte na své okolí při pohybu s aplikací. Bezpečnost je na prvním místě.",
    en_description:
      "Be aware of your surroundings while using the app. Safety comes first.",
    cz_button: "Začít objevovat",
    en_button: "Start Exploring",
    image: require("../assets/onboarding3.png"),
  },
];

export function OnboardingScreen() {
  const navigation = useNavigation();
  const screenWidth = Dimensions.get("window").width;
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const { i18n } = useTranslation();

  const slides = slidesData.map((slide) => ({
    id: slide.id,
    title: i18n.language === "cs" ? slide.cz_title : slide.en_title,
    description:
      i18n.language === "cs" ? slide.cz_description : slide.en_description,
    button: i18n.language === "cs" ? slide.cz_button : slide.en_button,
    image: slide.image,
  }));

  const handleNext = async () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex(currentIndex + 1);
    } else {
      await AsyncStorage.setItem("hasOnboarded", "true");
      navigation.reset({
        index: 0,
        routes: [{ name: "MainApp" }],
      });
    }
  };

  const handleViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        horizontal
        pagingEnabled
        data={slides}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width: screenWidth }]}>
            <Image source={item.image} style={styles.image} />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
            <TouchableOpacity style={styles.button} onPress={handleNext}>
              <Text style={styles.buttonText}>{item.button}</Text>
            </TouchableOpacity>
          </View>
        )}
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  slide: { alignItems: "center", justifyContent: "center", padding: 20 },
  image: { width: 250, height: 250, resizeMode: "contain", marginBottom: 20 },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#5C873A",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  buttonText: { color: "white", fontWeight: "bold", fontSize: 16 },
});
