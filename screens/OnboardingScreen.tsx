import React, { useRef, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const slides = [
  {
    id: "1",
    title: "Vítejte v aplikaci Hustopeče: Pohled do Minulosti!",
    description: "Objevujte tajemství Hustopečí a poznávejte zapomenuté příběhy.",
    image: require("../assets/onboarding1.png"),
    button: "Objevovat",
  },
  {
    id: "2",
    title: "Vaše soukromí je pro nás priorita!",
    description: "Používáme kameru, mikrofon a polohové služby, když je to opravdu potřeba. Vaše data chráníme.",
    image: require("../assets/onboarding2.png"),
    button: "Pokračovat",
  },
  {
    id: "3",
    title: "Buďte opatrní při používání aplikace!",
    description: "Dbejte na své okolí při pohybu s aplikací. Bezpečnost je na prvním místě.",
    image: require("../assets/onboarding3.png"),
    button: "Začít objevovat",
  },
];

export function OnboardingScreen() {
  const navigation = useNavigation();
  const screenWidth = Dimensions.get("window").width;
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

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
  title: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 10 },
  description: { fontSize: 16, textAlign: "center", paddingHorizontal: 20, marginBottom: 20 },
  button: { backgroundColor: "#5C873A", paddingVertical: 12, paddingHorizontal: 25, borderRadius: 8 },
  buttonText: { color: "white", fontWeight: "bold", fontSize: 16 },
});
