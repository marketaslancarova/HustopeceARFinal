import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, Alert, Modal } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useEffect, useState } from "react";
import NetInfo from "@react-native-community/netinfo";

import { getMediaURL } from "../utils/getMediaURL";
import { getGameFlowAssets } from "../utils/getGameFlowAssets";
import { getGameFlowAssetsOffline } from "../utils/getGameFlowOfflineAssets";
import { downloadMysteryAssets } from "../utils/downloadMysteryAssets";

import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { addDownloadedMystery } from "../redux/dataSlice";
import { useTranslation } from "react-i18next";

export function MysteryDetailScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { item } = route.params || {};

  const dispatch = useAppDispatch();
  const downloadedMysteries = useAppSelector((state) => state.data.downloadedMysteries);
  const isDownloaded = downloadedMysteries.includes(item.id);

  const [backgroundUrl, setBackgroundUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchImage = async () => {
      if (item?.backgroundUrl) {
        const url = await getMediaURL(item.backgroundUrl);
        setBackgroundUrl(url);
      }
    };
    fetchImage();
  }, [item]);

  const handleDownload = async () => {
    const netInfo = await NetInfo.fetch();

    if (!netInfo.isConnected) {
      Alert.alert(t("no_connection"));
      return;
    }

    if (netInfo.type !== "wifi") {
      Alert.alert(t("wifi_only"));
      return;
    }

    try {
      setModalVisible(true);
      await downloadMysteryAssets(item, dispatch);
      Alert.alert(t("downloaded"));
    } catch (error) {
      Alert.alert(t("download_failed"));
    } finally {
      setModalVisible(false);
    }
  };

  const handleStartGame = async () => {
    if (!isDownloaded) {
      await handleDownload();
      return;
    }

    setLoading(true);
    const gameFlow = isDownloaded
      ? await getGameFlowAssetsOffline(item.gameFlow || [])
      : await getGameFlowAssets(item.gameFlow || []);

    navigation.navigate("GameScreen", { gameFlow });
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <View style={styles.backContent}>
          <Text style={styles.backArrow}>‹</Text>
          <Text style={styles.backText}>{t("back")}</Text>
        </View>
      </TouchableOpacity>

      <Image source={{ uri: backgroundUrl }} style={styles.image} resizeMode="cover" />

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{item.title}</Text>
          <TouchableOpacity onPress={handleDownload} disabled={isDownloaded}>
            <Icon
              name={isDownloaded ? "cloud-check-outline" : "cloud-download-outline"}
              size={24}
              color={isDownloaded ? "green" : "#999"}
              style={{ marginLeft: 8 }}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.description}>{item.description}</Text>

        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Icon name="clock-outline" size={24} color="#4B3621" />
            <Text style={styles.infoText}>{item.duration}</Text>
          </View>
          <View style={styles.infoItem}>
            <Icon name="baby-face" size={24} color="#4B3621" />
            <Text style={styles.infoText}>{item.ageRange}</Text>
          </View>
          <View style={styles.infoItem}>
            <Icon name="baby-carriage" size={24} color="#4B3621" />
            <Text style={styles.infoText}>{item.strollerFriendly ? t("with_stroller") : t("without_stroller")}</Text>
          </View>
          <View style={styles.infoItem}>
            <Icon name="map-marker-path" size={24} color="#4B3621" />
            <Text style={styles.infoText}>{t("stops", { count: item.stops })}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleStartGame} disabled={loading}>
          {loading ? <ActivityIndicator color="black" /> : <Text style={styles.buttonText}>{t("start")}</Text>}
        </TouchableOpacity>
      </View>

      <Modal transparent visible={modalVisible} animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <ActivityIndicator size="large" color="#000" />
            <Text style={{ marginTop: 12 }}>{t("downloading")}</Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF8E1" },
  image: { width: "100%", height: 250, backgroundColor: "#eee" },
  content: { padding: 20 },
  titleRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  title: { fontSize: 24, fontWeight: "bold", color: "#E65100" },
  description: { fontSize: 16, color: "#5D4037", marginBottom: 20 },
  button: { backgroundColor: '#FFCC00', borderRadius: 12, paddingVertical: 12, alignItems: "center" },
  buttonText: { color: "black", fontSize: 18, fontWeight: "bold" },
  backContent: { flexDirection: 'row', alignItems: 'center' },
  backArrow: { fontSize: 32, color: 'black', marginRight: -2, marginTop: -5 },
  backText: { marginLeft: 8, fontSize: 16, fontWeight: "bold" },
  backButton: { marginTop: 20, marginLeft: 16, marginBottom: 10 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 20 },
  infoItem: { alignItems: 'center', flex: 1 },
  infoText: { fontSize: 14, marginTop: 4, color: '#4B3621' },
  modalBackground: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: 'white', padding: 24, borderRadius: 12, alignItems: 'center' },
});
