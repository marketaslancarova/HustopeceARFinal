import { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Audio } from "expo-av";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default function IntroStep({ data, nextStep }: any) {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [positionMillis, setPositionMillis] = useState(0);
  const [durationMillis, setDurationMillis] = useState(1);

  useEffect(() => {
    (async () => {
      if (data.audioUrl) {
        const { sound } = await Audio.Sound.createAsync({ uri: data.audioUrl });
        sound.setOnPlaybackStatusUpdate((status: any) => {
          if (status.isLoaded) {
            setPositionMillis(status.positionMillis);
            setDurationMillis(status.durationMillis || 1);
            setIsPlaying(status.isPlaying);
          }
        });
        setSound(sound);
      }
    })();
    return () => sound?.unloadAsync();
  }, [data]);

  const toggleSound = async () => {
    if (!sound) return;
    isPlaying ? await sound.pauseAsync() : await sound.playAsync();
  };

  const formatTime = (millis: number) => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.topContent}>
        <View style={styles.textBubble}>
          <Text style={styles.title}>{data.title}</Text>
          <Text style={styles.text}>{data.text}</Text>
        </View>
        <Image source={{ uri: data.guideUrl }} style={styles.owl} />
        {data.audioUrl && (
          <View style={styles.audioPlayer}>
            <TouchableOpacity onPress={toggleSound}>
              <Text style={styles.icon}>{isPlaying ? "⏸️" : "▶️"}</Text>
            </TouchableOpacity>
            <View style={styles.progressBarContainer}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${(positionMillis / durationMillis) * 100}%` },
                ]}
              />
            </View>
          </View>
        )}
        <View style={styles.timeWrapper}>
          <Text style={styles.time}>{formatTime(positionMillis)}</Text>
          <Text style={styles.time}>{formatTime(durationMillis)}</Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={nextStep}>
          <Text style={styles.buttonText}>Pokračovat</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: wp("5%"),
  },
  topContent: {
    alignItems: "center",
    padding: wp("5%"),
  },
  textBubble: {
    backgroundColor: "#D2B48C",
    borderRadius: wp("5%"),
    padding: wp("5%"),
    maxWidth: wp("90%"),
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  title: {
    fontSize: wp("6.5%"),
    fontWeight: "bold",
    color: "#4B3B2A",
    textAlign: "center",
    marginBottom: hp("1.2%"),
  },
  text: {
    fontSize: wp("4.5%"),
    color: "#4B3B2A",
    textAlign: "center",
  },
  owl: {
    width: wp("50%"),
    height: wp("50%"),
    resizeMode: "contain",
    marginBottom: hp("2.5%"),
  },
  audioPlayer: {
    flexDirection: "row",
    backgroundColor: "#5C3A1E",
    padding: wp("3%"),
    borderRadius: wp("8%"),
    alignItems: "center",
    justifyContent: "center",
    width: wp("90%"),
    marginBottom: hp("1.5%"),
  },
  progressBarContainer: {
    flex: 1,
    height: hp("0.7%"),
    backgroundColor: "#D2B48C",
    borderRadius: wp("1%"),
    marginHorizontal: wp("2.5%"),
  },
  progressBarFill: {
    height: hp("0.7%"),
    backgroundColor: "#B4CC5B",
    borderRadius: wp("1%"),
  },
  icon: {
    fontSize: wp("6%"),
    color: "#FFF",
  },
  timeWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: wp("90%"),
    marginTop: hp("0.5%"),
    marginBottom: hp("1.5%"),
  },
  time: {
    fontSize: wp("4%"),
    color: "#FFF",
  },
  button: {
    backgroundColor: "#FFCC00",
    paddingVertical: hp("1.8%"),
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
function useTranslation(): { t: any } {
  throw new Error("Function not implemented.");
}
