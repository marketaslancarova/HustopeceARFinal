// components/steps/ResultStep.tsx
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default function ResultScreen({ data, nextStep }: any) {
  return (
    <View style={styles.container}>
      {/* Průvodce (sova) */}
      <Image source={{ uri: data.guideUrl }} style={styles.owl} />

      {/* Bublina s textem */}
      <View style={styles.speechBubble}>
        <Text style={styles.title}>{data.title}</Text>
        <Text style={styles.bubbleText}>{data.audioText}</Text>
      </View>

      {/* Tlačítko */}
      <TouchableOpacity style={styles.button} onPress={nextStep}>
        <Text style={styles.buttonText}>Pokračovat</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5EEDD",
    justifyContent: "center",
    alignItems: "center",
    padding: wp("6%"),
  },
  owl: {
    width: wp("50%"),
    height: wp("50%"),
    resizeMode: "contain",
    marginBottom: hp("2.5%"),
  },
  speechBubble: {
    backgroundColor: "#fff",
    padding: wp("4%"),
    borderRadius: wp("5%"),
    marginBottom: hp("1.5%"),
    borderColor: "#D6C3AC",
    borderWidth: 2,
    width: wp("90%"),
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  title: {
    fontSize: wp("5.5%"),
    fontWeight: "bold",
    color: "#3E2723",
    textAlign: "center",
    marginBottom: hp("1.2%"),
  },
  bubbleText: {
    fontSize: wp("4%"),
    color: "#3E2723",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#FFD54F",
    paddingVertical: hp("2%"),
    paddingHorizontal: wp("10%"),
    borderRadius: wp("8%"),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 3,
  },
  buttonText: {
    fontSize: wp("4.5%"),
    color: "#3E2723",
    fontWeight: "bold",
  },
});
