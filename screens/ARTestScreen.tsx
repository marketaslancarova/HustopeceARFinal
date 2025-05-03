import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, Pressable } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { ArViewerView } from 'react-native-ar-viewer';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const modelLinks = [
  'https://github.com/nainglynndw/react-native-ar-viewer/releases/download/v1/AR-Code-1678076062111.usdz',
  'https://github.com/nainglynndw/react-native-ar-viewer/releases/download/v1/Elk_Free.usdz',
];

export default function ARTestScreen() {
  const [localModels, setLocalModels] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const downloadAndSaveModel = async (url: string): Promise<string> => {
    const fileName = url.split('/').pop() || `${Date.now()}.usdz`;
    const localPath = FileSystem.documentDirectory + fileName;
    const fileInfo = await FileSystem.getInfoAsync(localPath);
    if (!fileInfo.exists) {
      await FileSystem.downloadAsync(url, localPath);
    }
    return localPath.replace('file://', '');
  };

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const paths = await Promise.all(modelLinks.map(downloadAndSaveModel));
        setLocalModels(paths);
      } catch (error) {
        console.error('❌ Chyba při stahování modelů:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, []);

  if (loading || localModels.length === 0) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.text}>Stahuji 3D modely…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* ✖️ Zavírací tlačítko */}
      <Pressable style={styles.closeButton} onPress={() => navigation.goBack()}>
        <Ionicons name="close" size={30} color="#fff" />
      </Pressable>

      {/* 🔍 AR Viewer */}
      <ArViewerView
        style={{ flex: 1 }}
        model={localModels[0]}
        lightEstimation
        manageDepth
        allowRotate
        allowScale
        allowTranslate
        disableInstantPlacement
        planeOrientation="horizontal"
        onStarted={() => console.log('✅ AR spuštěno')}
        onEnded={() => console.log('🔚 AR ukončeno')}
        onModelPlaced={() => console.log('📍 Model umístěn')}
        onModelRemoved={() => console.log('❌ Model odstraněn')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' },
  text: { color: 'white', marginTop: 16 },
  closeButton: {
    position: 'absolute',
    top: 80,
    right: 20,
    zIndex: 100,
    backgroundColor: '#00000080',
    borderRadius: 20,
    padding: 6,
  },
});
