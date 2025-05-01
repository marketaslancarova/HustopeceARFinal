// components/steps/FilmStep.tsx
import React, { useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Video } from 'expo-av';

export default function FilmScreen({ data, nextStep }: any) {
  const videoRef = useRef<Video | null>(null);

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        style={styles.video}
        source={{ uri: data.videoUrl }}
        useNativeControls
        resizeMode="contain"
        shouldPlay
      />

      <TouchableOpacity style={styles.mainButton} onPress={nextStep}>
        <Text style={styles.mainButtonText}>Pokračovat</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
    flex: 1,
    justifyContent: 'center',
  },
  video: {
    width: '100%',
    height: 250,
    backgroundColor: '#000',
    borderRadius: 16,
  },
  mainButton: {
    backgroundColor: '#FFD12C',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    elevation: 3,
    marginTop: 30,
  },
  mainButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
});
