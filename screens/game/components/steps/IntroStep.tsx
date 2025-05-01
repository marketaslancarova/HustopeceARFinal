// components/steps/IntroStep.tsx
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { Audio } from 'expo-av';

export default function IntroScreen({ data, nextStep }: any) {
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
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
      <View style={styles.topContent}>
        <View style={styles.textBubble}>
          <Text style={styles.title}>{data.title}</Text>
          <Text style={styles.text}>{data.text}</Text>
        </View>
        <Image source={{ uri: data.guideUrl }} style={styles.owl} />
        {data.audioUrl && (
          <View style={styles.audioPlayer}>
            <TouchableOpacity onPress={toggleSound}>
              <Text style={styles.icon}>{isPlaying ? '⏸️' : '▶️'}</Text>
            </TouchableOpacity>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBarFill, { width: `${(positionMillis / durationMillis) * 100}%` }]} />
            </View>
          </View>
        )}
        <TouchableOpacity style={styles.button} onPress={nextStep}>
          <Text style={styles.buttonText}>Začít misi</Text>
        </TouchableOpacity>
      </View>

  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  topContent: { alignItems: 'center', padding: 20 },
  textBubble: {
    backgroundColor: '#D2B48C', borderRadius: 20, padding: 20, maxWidth: '90%',
    elevation: 5, shadowColor: '#000', shadowOpacity: 0.2, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4,
  },
  title: { fontSize: 24, fontWeight: 'bold', color: '#4B3B2A', textAlign: 'center', marginBottom: 10 },
  text: { fontSize: 18, color: '#4B3B2A', textAlign: 'center' },
  owl: { width: 200, height: 200, resizeMode: 'contain', marginBottom: 20 },
  audioPlayer: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
  icon: { fontSize: 24, color: '#000', marginRight: 10 },
  progressBarContainer: { flex: 1, height: 6, backgroundColor: '#ccc', borderRadius: 3 },
  progressBarFill: { height: 6, backgroundColor: '#5C873A', borderRadius: 3 },
  button: { backgroundColor: '#FFD12C', padding: 14, borderRadius: 20, marginTop: 20 },
  buttonText: { fontSize: 16, fontWeight: 'bold' },
});
