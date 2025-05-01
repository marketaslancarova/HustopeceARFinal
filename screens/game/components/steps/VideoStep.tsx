// components/steps/FilmStep.tsx
import React, { useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Video } from 'expo-av';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

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
    padding: wp('5%'),
    flex: 1,
    justifyContent: 'center',
  },
  video: {
    width: '100%',
    height: hp('30%'),
    backgroundColor: '#000',
    borderRadius: wp('4%'),
  },
  mainButton: {
    backgroundColor: '#FFD12C',
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('10%'),
    borderRadius: wp('8%'),
    elevation: 3,
    marginTop: hp('4%'),
  },
  mainButtonText: {
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
    color: '#000',
  },
});

