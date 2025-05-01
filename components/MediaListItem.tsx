// components/MediaListItem.tsx
import { useEffect, useState } from "react";
import { TouchableOpacity, Text, Image, View, StyleSheet, ActivityIndicator, Alert, Modal } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getMediaURL } from "../utils/getMediaURL";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { downloadMonumentAssets } from "../utils/downloadMonumentAssets";
import { downloadMysteryAssets } from "../utils/downloadMysteryAssets";
import NetInfo from "@react-native-community/netinfo";
import { addDownloadedMystery } from "../redux/dataSlice";
import { useTranslation } from "react-i18next";

interface Props {
  item: any;
  type: "mystery" | "monument";
}

export function MediaListItem({ item, type }: Props) {
  const navigation = useNavigation();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const { t } = useTranslation();

  const dispatch = useAppDispatch();
  const downloadedMonuments = useAppSelector((state) => state.data.downloadedMonuments);
  const downloadedMysteries = useAppSelector((state) => state.data.downloadedMysteries);

  const isDownloaded = type === "mystery"
    ? downloadedMysteries.includes(item.id)
    : downloadedMonuments.includes(item.id);

  useEffect(() => {
    const fetchImage = async () => {
      const path = type === "mystery" ? item.backgroundUrl : item.assets?.images?.[0];
      if (path) {
        const url = await getMediaURL(path);
        setImageUrl(url);
      }
    };
    fetchImage();
  }, [item]);

  const handleDownload = async () => {
    const netInfo = await NetInfo.fetch();

    if (!netInfo.isConnected) {
      Alert.alert(t("error"), t("no_internet"));
      return;
    }

    if (netInfo.type !== "wifi") {
      Alert.alert(t("warning"), t("wifi_only"));
      return;
    }

    try {
      setModalVisible(true);
      setLoading(true);
      if (type === "mystery") {
        await downloadMysteryAssets(item, dispatch);
        Alert.alert(t("done"), t("mystery_downloaded"));
      } else {
        await downloadMonumentAssets(item, dispatch);
        Alert.alert(t("done"), t("monument_downloaded"));
      }
    } catch (e) {
      Alert.alert(t("error"), t("download_failed"));
    } finally {
      setLoading(false);
      setModalVisible(false);
    }
  };

  const handlePress = async () => {
    if (type === "mystery") {
      navigation.navigate("MysteryDetail", { item });
      return;
    }

    if (isDownloaded) {
      navigation.navigate("MonumentDetail", { item });
      return;
    }

    const netInfo = await NetInfo.fetch();

    if (netInfo.type === "wifi" && netInfo.isConnected) {
      navigation.navigate("MonumentDetail", { item });
    } else {
      Alert.alert(t("warning"), t("not_downloaded_wifi_required"));
    }
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      {imageUrl && <Image source={{ uri: imageUrl }} style={styles.cardImage} />}
      <View style={styles.cardContent}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={styles.cardTitle}>{item.title}</Text>
        </View>
        <Text numberOfLines={2} style={styles.cardDescription}>{item.description}</Text>
        <View style={styles.distanceBetween}>
          {type === "mystery" && (
            <View style={styles.distanceRow}>
              <Text style={styles.distanceIcon}>🧭</Text>
              <Text style={styles.distanceText}>{item.duration}</Text>
            </View>
          )}
          {type === "monument" && item.distance && (
            <View style={styles.distanceRow}>
              <Text style={styles.distanceIcon}>📍</Text>
              <Text style={styles.distanceText}>{item.distance}</Text>
            </View>
          )}
          <TouchableOpacity onPress={handleDownload} style={{ marginLeft: 8 }}>
            <Icon
              name={isDownloaded ? "cloud-check-outline" : "cloud-download-outline"}
              size={24}
              color={isDownloaded ? "green" : "#999"}
              style={{ marginLeft: 8 }}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal s nápisem "Stahuji…" nebo "Downloading…" */}
      <Modal
        transparent
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <ActivityIndicator size="large" color="black" />
            <Text style={styles.modalText}>{t("downloading")}</Text>
          </View>
        </View>
      </Modal>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: "white", borderRadius: 16, flexDirection: "row", marginBottom: 16, overflow: "hidden", elevation: 4, width: "90%" },
  cardImage: { width: 90, height: 90 },
  cardContent: { flex: 1, padding: 8, justifyContent: "center" },
  cardTitle: { fontWeight: "bold", fontSize: 16, marginBottom: 4, color: "#333" },
  cardDescription: { fontSize: 12, color: "#757575", marginBottom: 6 },
  distanceRow: { flexDirection: "row", alignItems: "center" },
  distanceIcon: { fontSize: 14, marginRight: 4 },
  distanceText: { fontSize: 14, fontWeight: "bold" },
  distanceBetween: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginRight: "5%" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", alignItems: "center" },
  modalBox: { backgroundColor: "white", padding: 24, borderRadius: 12, alignItems: "center" },
  modalText: { marginTop: 12, fontSize: 16, fontWeight: "bold" }
});
