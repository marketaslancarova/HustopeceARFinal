import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useTranslation } from "react-i18next";

export default function TaskStep({ data, nextStep }: any) {
  const [selected, setSelected] = useState<string | null>(null);
  const isCorrect = selected === data.correctAnswer;
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.topContent}>
        {data.guideUrl && (
          <Image source={{ uri: data.guideUrl }} style={styles.owl} />
        )}
        {data.question && <Text style={styles.question}>{data.question}</Text>}

        {data.options &&
          data.options.map((option: string, idx: number) => (
            <TouchableOpacity
              key={idx}
              style={[
                styles.optionButton,
                selected === option &&
                  (isCorrect ? styles.correct : styles.incorrect),
              ]}
              onPress={() => setSelected(option)}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}

        {selected && isCorrect && (
          <TouchableOpacity style={styles.button} onPress={nextStep}>
            <Text style={styles.buttonText}>{t("task_continue")}</Text>
          </TouchableOpacity>
        )}

        {selected && !isCorrect && (
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#ccc" }]}
            onPress={() => setSelected(null)}
          >
            <Text style={[styles.buttonText, { color: "#000" }]}>
              {t("task_try_again")}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5EEDD",
    justifyContent: "center",
    alignItems: "center",
    padding: wp("5%"),
  },
  topContent: {
    alignItems: "center",
    width: "100%",
  },
  owl: {
    width: wp("35%"),
    height: wp("35%"),
    resizeMode: "contain",
    marginBottom: hp("2%"),
  },
  question: {
    fontSize: wp("5%"),
    color: "#3E2723",
    textAlign: "center",
    marginBottom: hp("2.5%"),
    fontStyle: "italic",
  },
  optionButton: {
    paddingVertical: hp("1.8%"),
    paddingHorizontal: wp("5%"),
    borderRadius: wp("5%"),
    backgroundColor: "#FFF8DC",
    borderColor: "#BDB76B",
    borderWidth: 1,
    marginVertical: hp("0.8%"),
    minWidth: wp("70%"),
    alignItems: "center",
  },
  optionText: {
    fontSize: wp("4%"),
    color: "#4B3B2A",
    fontWeight: "600",
  },
  correct: {
    backgroundColor: "#B4CC5B",
  },
  incorrect: {
    backgroundColor: "#FFA07A",
  },
  button: {
    backgroundColor: "#FFD12C",
    padding: hp("2%"),
    borderRadius: wp("5%"),
    marginTop: hp("2.5%"),
  },
  buttonText: {
    fontSize: wp("4%"),
    fontWeight: "bold",
  },
});
