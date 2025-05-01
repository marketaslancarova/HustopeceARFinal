// components/steps/ResultStep.tsx
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

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
    backgroundColor: '#EADBC8',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24
  },
  owl: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 20
  },
  speechBubble: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 20,
    marginBottom: 10,
    borderColor: '#D6C3AC',
    borderWidth: 2,
    width: '90%',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,

  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#3E2723',
    textAlign: 'center',
    marginBottom: 10,
  },
  bubbleText: {
    fontSize: 16,
    color: '#3E2723',
    textAlign: 'center',
    
  },
  button: {
    backgroundColor: '#FFD54F',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 3
  },
  buttonText: {
    fontSize: 18,
    color: '#3E2723',
    fontWeight: 'bold',
  }
});
