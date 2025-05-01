import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

export default function TaskStep({ data, nextStep }: any) {
  const [selected, setSelected] = useState<string | null>(null);
  const isCorrect = selected === data.correctAnswer;

  return (
    <View style={styles.container}>
      <View style={styles.topContent}>
        {data.guideUrl && <Image source={{ uri: data.guideUrl }} style={styles.owl} />}
        {data.question && <Text style={styles.question}>{data.question}</Text>}

        {data.options && data.options.map((option: string, idx: number) => (
          <TouchableOpacity
            key={idx}
            style={[
              styles.optionButton,
              selected === option && (isCorrect ? styles.correct : styles.incorrect)
            ]}
            onPress={() => setSelected(option)}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}

        {selected && isCorrect && (
        <TouchableOpacity style={styles.button} onPress={nextStep}>
            <Text style={styles.buttonText}>Správně, pokračuj!</Text>
        </TouchableOpacity>
        )}

        {selected && !isCorrect && (
        <TouchableOpacity style={[styles.button, { backgroundColor: '#ccc' }]} onPress={() => setSelected(null)}>
            <Text style={[styles.buttonText, { color: '#000' }]}>Zkus to znovu</Text>
        </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4ECD8',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  topContent: {
    alignItems: 'center',
    width: '100%',
  },
  owl: {
    width: 140,
    height: 140,
    resizeMode: 'contain',
    marginBottom: 16,
  },
  question: {
    fontSize: 20,
    color: '#3E2723',
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic'
  },
  optionButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#FFF8DC',
    borderColor: '#BDB76B',
    borderWidth: 1,
    marginVertical: 6,
    minWidth: '70%',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    color: '#4B3B2A',
    fontWeight: '600',
  },
  correct: {
    backgroundColor: '#B4CC5B',
  },
  incorrect: {
    backgroundColor: '#FFA07A',
  },
  button: {
    backgroundColor: '#FFD12C',
    padding: 14,
    borderRadius: 20,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
