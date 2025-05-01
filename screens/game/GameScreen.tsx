import { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text, ImageBackground } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

import IntroScreen from "../game/components/steps/IntroStep";
import StoryScreen from "../game/components/steps/StoryStep";
import ResultScreen from "../game/components/steps/ResultStep";
import MapScreen from "../game/components/steps/MapStep";
import VideoScreen from "../game/components/steps/VideoStep"
import FinishedScreen from "../game/components/steps/FinishStep"
import TaskScreen from "../game/components/steps/TaskStep";

export default function GameScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { gameFlow } = route.params;
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentStep = gameFlow[currentIndex];

  const goToNext = () => {
    if (currentIndex < gameFlow.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      navigation.navigate("Home");
    }
  };

  const renderStep = () => {
    switch (currentStep.type) {
      case "intro":
        return <IntroScreen data={currentStep} nextStep={goToNext} />;
      case "story":
        return <StoryScreen data={currentStep} nextStep={goToNext} />;
      case "result":
        return <ResultScreen data={currentStep} nextStep={goToNext} />;
    case "task":
        return <TaskScreen data={currentStep} nextStep={goToNext} />;
      case "map":
        return <MapScreen data={currentStep} nextStep={goToNext} />;
      case "video":
        return <VideoScreen data={currentStep} nextStep={goToNext} />;
    case "finished":
        return <FinishedScreen data={currentStep} nextStep={goToNext} />;
      default:
        return <Text>Neznámý typ kroku: {currentStep.type}</Text>;
    }
  };

  console.log("Current step:", currentStep.backgroundImageUrl);
  const background = currentStep.backgroundImageUrl
  ? { uri: currentStep.backgroundImageUrl }
  : null;

  return (
  background ? (
    <ImageBackground source={background} style={styles.container} resizeMode="cover">
      <SafeAreaView style={styles.innerContainer}>{renderStep()}</SafeAreaView>
    </ImageBackground>
  ) : (
    <View style={[styles.container, { backgroundColor: '#F5EEDD' }]}>
      <SafeAreaView style={styles.innerContainer}>{renderStep()}</SafeAreaView>
    </View>
  )
);
}

const styles = StyleSheet.create({
  container: { flex: 1, width:"100%", height: "100%" , alignContent: "center", justifyContent: "center"},
  innerContainer: { flex: 1, alignContent: "center", justifyContent: "center"}
});
