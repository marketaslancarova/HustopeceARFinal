import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, Dimensions, Modal, Linking, Platform, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useRef, useEffect } from "react";
import { Audio } from "expo-av";
import { extractMediaPathsFromItem } from "../utils/extractMediaPathsFromItem";
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { useTranslation } from "react-i18next";

export function MonumentDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { item } = route.params || {};
  const { t } = useTranslation();

  const screenWidth = Dimensions.get('window').width;
  const flatListRef = useRef<FlatList>(null);

  const [images, setImages] = useState<string[]>([]);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [durationMillis, setDurationMillis] = useState(0);
  const [positionMillis, setPositionMillis] = useState(0);
  const [backOpacity] = useState(new Animated.Value(1));
  const [forwardOpacity] = useState(new Animated.Value(1));

  useEffect(() => {
    let currentSound: Audio.Sound | null = null;

    const loadMedia = async () => {
      const netInfo = await NetInfo.fetch();
      if (!netInfo.isConnected || netInfo.type !== 'wifi') {
        const stored = await AsyncStorage.getItem(`monument_${item.id}_media`);
        if (stored) {
          const localMedia = JSON.parse(stored);
          setImages(localMedia.images || []);
          setAudioUrl(localMedia.audio || null);
          return;
        }
      }

      const media = await extractMediaPathsFromItem(item);
      setImages(media.images);
      setAudioUrl(media.audio);
    };

    loadMedia();

    return () => {
      if (currentSound) currentSound.unloadAsync();
    };
  }, [item]);

  useEffect(() => {
    let currentSound: Audio.Sound | null = null;

    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: false,
    });

    const loadAudio = async (url: string) => {
      try {
        const { sound } = await Audio.Sound.createAsync(
          { uri: url },
          { shouldPlay: false },
          (status) => {
            if (status.isLoaded) {
              setDurationMillis(status.durationMillis || 0);
            }
          }
        );
        setSound(sound);
        currentSound = sound;
      } catch (e) {
        console.error("Failed to load audio", e);
      }
    };

    if (audioUrl) loadAudio(audioUrl);

    return () => {
      if (currentSound) currentSound.unloadAsync();
    };
  }, [audioUrl]);

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(async () => {
        if (sound) {
          const status = await sound.getStatusAsync();
          if (status.isLoaded) setPositionMillis(status.positionMillis);
        }
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, sound]);

  const playPauseAudio = async () => {
    if (!sound) return;
    const status = await sound.getStatusAsync();
    if (status.isPlaying) {
      await sound.pauseAsync();
      setIsPlaying(false);
    } else {
      await sound.playAsync();
      setIsPlaying(true);
    }
  };

  const skipBackward = async () => {
    if (!sound) return;
    const status = await sound.getStatusAsync();
    if (status.isLoaded) {
      await sound.setPositionAsync(Math.max(status.positionMillis - 10000, 0));
      animateOpacity(backOpacity);
    }
  };

  const skipForward = async () => {
    if (!sound) return;
    const status = await sound.getStatusAsync();
    if (status.isLoaded) {
      await sound.setPositionAsync(Math.min(status.positionMillis + 10000, status.durationMillis));
      animateOpacity(forwardOpacity);
    }
  };

  const animateOpacity = (val: Animated.Value) => {
    Animated.sequence([
      Animated.timing(val, { toValue: 0.5, duration: 150, useNativeDriver: true }),
      Animated.timing(val, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();
  };

  const formatTime = (millis: number) => {
    const totalSeconds = Math.floor(millis / 1000);
    return `${Math.floor(totalSeconds / 60)}:${String(totalSeconds % 60).padStart(2, '0')}`;
  };

  const openMaps = () => {
    const url = Platform.select({
      ios: `http://maps.apple.com/?daddr=${item.latitude},${item.longitude}`,
      android: `google.navigation:q=${item.latitude},${item.longitude}`,
    });
    if (url) Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <View style={styles.backContent}>
          <Text style={styles.backArrow}>‹</Text>
          <Text style={styles.backText}>{t("back")}</Text>
        </View>
      </TouchableOpacity>

      <View style={{ height: 200 }}>
        <FlatList
          ref={flatListRef}
          data={images}
          keyExtractor={(_, index) => index.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={(e) => setCurrentIndex(Math.floor(e.nativeEvent.contentOffset.x / screenWidth))}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Image source={{ uri: item }} style={styles.image} />
            </TouchableOpacity>
          )}
        />
      </View>

      <Modal visible={modalVisible} transparent>
        <View style={styles.modalBackground}>
          <FlatList
            data={images}
            keyExtractor={(_, i) => i.toString()}
            horizontal
            pagingEnabled
            initialScrollIndex={currentIndex}
            getItemLayout={(_, i) => ({ length: screenWidth, offset: screenWidth * i, index: i })}
            renderItem={({ item }) => (
              <Image source={{ uri: item }} style={styles.imageFull} />
            )}
          />
          <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
            <Ionicons name="close" size={36} color="white" />
          </TouchableOpacity>
        </View>
      </Modal>

      <View style={styles.iconRow}>
        <Ionicons name="location-outline" size={20} style={styles.icon} />
        <Text style={styles.distance}>{item.distance || "?"} km</Text>
        <Ionicons name="volume-high-outline" size={20} style={styles.icon} />
        <Ionicons name="bookmark-outline" size={20} style={styles.icon} />
        <TouchableOpacity style={styles.modelButton}>
          <Text style={styles.modelButtonText}>{t("model")}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.modelButton} onPress={openMaps}>
          <Text style={styles.modelButtonText}>{t("navigate")}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>

        <Text style={styles.sectionTitle}>{t("history")}</Text>
        <Text style={styles.description}>{item.assets.text || t("no_info_available")}</Text>
      </View>

      {audioUrl && (
        <View style={styles.audioControlsFixed}>
          <View style={styles.progressBar}>
            <View style={[styles.progress, { width: durationMillis ? `${(positionMillis / durationMillis) * 100}%` : "0%" }]} />
          </View>
          <View style={styles.audioTimes}>
            <Text style={styles.timeText}>{formatTime(positionMillis)}</Text>
            <Text style={styles.timeText}>{formatTime(durationMillis)}</Text>
          </View>
          <View style={styles.audioButtons}>
            <TouchableOpacity onPress={skipBackward}>
              <Animated.View style={{ opacity: backOpacity }}>
                <Ionicons name="play-skip-back" size={32} />
              </Animated.View>
            </TouchableOpacity>
            <TouchableOpacity onPress={playPauseAudio}>
              <Ionicons name={isPlaying ? "pause" : "play"} size={32} />
            </TouchableOpacity>
            <TouchableOpacity onPress={skipForward}>
              <Animated.View style={{ opacity: forwardOpacity }}>
                <Ionicons name="play-skip-forward" size={32} />
              </Animated.View>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  image: { width: screenWidth, height: 200, resizeMode: "cover" },
  imageFull: { width: screenWidth, height: "100%", resizeMode: "contain", backgroundColor: "black" },
  modalBackground: { flex: 1, backgroundColor: "black", justifyContent: "center", alignItems: "center" },
  closeButton: { position: "absolute", top: 40, right: 20 },
  backButton: { marginTop: 20, marginLeft: 16, marginBottom: 10 },
  backContent: { flexDirection: "row", alignItems: "center" },
  backArrow: { fontSize: 32, marginRight: -2, marginTop: -5 },
  backText: { marginLeft: 8, fontSize: 16, fontWeight: "bold" },
  iconRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, marginTop: 8, gap: 10, flexWrap: "wrap" },
  icon: { marginRight: 4 },
  distance: { marginRight: 8, fontSize: 14 },
  modelButton: { borderWidth: 1, borderColor: "#5C873A", borderRadius: 8, paddingVertical: 4, paddingHorizontal: 12, marginLeft: 8 },
  modelButtonText: { color: "#5C873A", fontWeight: "bold", fontSize: 14 },
  content: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 150 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 4 },
  description: { fontSize: 14, color: "#333", marginBottom: 16 },
  audioControlsFixed: { position: "absolute", bottom: 70, width: "100%", backgroundColor: "#F5F5F5", paddingVertical: 9, alignItems: "center" },
  progressBar: { height: 4, width: "80%", backgroundColor: "#ddd", borderRadius: 2, overflow: "hidden", marginBottom: 5, marginTop: 8 },
  progress: { height: "100%", backgroundColor: "#5C873A" },
  audioTimes: { width: "80%", flexDirection: "row", justifyContent: "space-between" },
  timeText: { fontSize: 12, color: "#333" },
  audioButtons: { flexDirection: "row", justifyContent: "center", gap: 30 },
});
