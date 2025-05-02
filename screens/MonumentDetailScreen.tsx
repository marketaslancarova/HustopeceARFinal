import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Modal,
  Linking,
  Platform,
  Animated,
  ScrollView
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useRef, useEffect } from "react";
import { Audio } from "expo-av";
import { extractMediaPathsFromItem } from "../utils/extractMediaPathsFromItem";
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { useTranslation } from "react-i18next";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


export function MonumentDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { item } = route.params || {};
  const { t } = useTranslation();

  const flatListRef = useRef(null);

  const [images, setImages] = useState([]);
  const [audioUrl, setAudioUrl] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [durationMillis, setDurationMillis] = useState(0);
  const [positionMillis, setPositionMillis] = useState(0);
  const [backOpacity] = useState(new Animated.Value(1));
  const [forwardOpacity] = useState(new Animated.Value(1));

  useEffect(() => {
    let currentSound = null;

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
    let currentSound = null;

    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: false,
    });

    const loadAudio = async (url) => {
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
    let interval;
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

  const animateOpacity = (val) => {
    Animated.sequence([
      Animated.timing(val, { toValue: 0.5, duration: 150, useNativeDriver: true }),
      Animated.timing(val, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();
  };

  const formatTime = (millis) => {
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
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <View style={styles.backContent}>
              <Text style={styles.backArrow}>‹</Text>
              <Text style={styles.backText}>{t("back")}</Text>
            </View>
          </TouchableOpacity>

          <View style={{ height: hp('25%') }}>
            <FlatList
              ref={flatListRef}
              data={images}
              keyExtractor={(_, index) => index.toString()}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={(e) => setCurrentIndex(Math.floor(e.nativeEvent.contentOffset.x / wp('100%')))}
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
                getItemLayout={(_, i) => ({ length: wp('100%'), offset: wp('100%') * i, index: i })}
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
            <TouchableOpacity style={styles.modelButton} onPress={() => navigation.navigate('ARTest')} >
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
        </ScrollView>

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
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  scrollContent: { paddingBottom: hp('20%') },
  image: { width: wp('100%'), height: hp('25%'), resizeMode: "cover" },
  imageFull: { width: wp('100%'), height: hp('100%'), resizeMode: "contain", backgroundColor: "black" },
  modalBackground: { flex: 1, backgroundColor: "black", justifyContent: "center", alignItems: "center" },
  closeButton: { position: "absolute", top: hp('5%'), right: wp('5%') },
  backButton: { marginTop: hp('2.5%'), marginLeft: wp('4%'), marginBottom: hp('1.5%') },
  backContent: { flexDirection: "row", alignItems: "center" },
  backArrow: { fontSize: wp('8%'), marginRight: wp('-0.5%'), marginTop: hp('-0.5%') },
  backText: { marginLeft: wp('2%'), fontSize: wp('4.5%'), fontWeight: "bold" },
  iconRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: wp('4%'), marginTop: hp('1%'), gap: wp('2.5%'), flexWrap: "wrap" },
  icon: { marginRight: wp('1%') },
  distance: { marginRight: wp('2%'), fontSize: wp('3.5%') },
  modelButton: { borderWidth: 1, borderColor: "#5C873A", borderRadius: wp('2%'), paddingVertical: hp('0.5%'), paddingHorizontal: wp('3%'), marginLeft: wp('2%') },
  modelButtonText: { color: "#5C873A", fontWeight: "bold", fontSize: wp('3.5%') },
  content: { paddingHorizontal: wp('4%'), paddingTop: hp('2%') },
  sectionTitle: { fontSize: wp('4.5%'), fontWeight: "bold", marginBottom: hp('0.5%') },
  description: { fontSize: wp('3.5%'), color: "#333", marginBottom: hp('2%') },
  audioControlsFixed: {
    backgroundColor: "#F5F5F5",
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('4%'),
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    marginBottom: Platform.OS === 'ios' ? hp('4%') : hp('9%')
  },
  progressBar: { height: hp('0.5%'), width: "100%", backgroundColor: "#ddd", borderRadius: hp('0.5%'), overflow: "hidden", marginBottom: hp('0.5%'), marginTop: hp('1%') },
  progress: { height: "100%", backgroundColor: "#5C873A" },
  audioTimes: { flexDirection: "row", justifyContent: "space-between" },
  timeText: { fontSize: wp('3%'), color: "#333" },
  audioButtons: { flexDirection: "row", justifyContent: "space-evenly", alignItems: "center", marginTop: hp('1.5%') },
});
