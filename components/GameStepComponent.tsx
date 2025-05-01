import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Video } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';

interface GameStepProps {
  step: {
    title?: string;
    type?: string;
    text?: string;
    video?: string;
  };
  onNext: () => void;
}

export default function GameStepComponent({ step, onNext }: GameStepProps) {
  return (
    <View style={styles.container}>
      {step.title && <Text style={styles.title}>{step.title}</Text>}
      {step.type && <Text style={styles.type}>{step.type}</Text>}
      {step.text && <Text style={styles.text}>{step.text}</Text>}

      {step.video && (
        <Video
          source={{ uri: step.video }}
          rate={1.0}
          volume={1.0}
          isMuted={false}
          resizeMode="contain"
          useNativeControls
          style={styles.video}
        />
      )}

      <TouchableOpacity style={styles.button} onPress={onNext}>
        <Ionicons name="arrow-forward" size={24} color="white" />
        <Text style={styles.buttonText}>Pokračovat</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  type: {
    fontSize: 16,
    color: 'grey',
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  video: {
    width: '100%',
    height: 200,
    marginBottom: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#5C873A',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
