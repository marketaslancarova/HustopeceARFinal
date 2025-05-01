import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useEffect, useState } from "react";
import NetInfo from "@react-native-community/netinfo";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

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
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
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
                size={hp('3%')}
                color={isDownloaded ? "green" : "#999"}
                style={{ marginLeft: wp('2%') }}
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.description}>{item.description}</Text>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Icon name="clock-outline" size={hp('3%')} color="#4B3621" />
              <Text style={styles.infoText}>{item.duration}</Text>
            </View>
            <View style={styles.infoItem}>
              <Icon name="baby-face" size={hp('3%')} color="#4B3621" />
              <Text style={styles.infoText}>{item.ageRange}</Text>
            </View>
            <View style={styles.infoItem}>
              <Icon name="baby-carriage" size={hp('3%')} color="#4B3621" />
              <Text style={styles.infoText}>
                {item.strollerFriendly ? t("with_stroller") : t("without_stroller")}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Icon name="map-marker-path" size={hp('3%')} color="#4B3621" />
              <Text style={styles.infoText}>{t("stops", { count: item.stops })}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleStartGame} disabled={loading}>
            {loading ? <ActivityIndicator color="black" /> : <Text style={styles.buttonText}>{t("start")}</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal transparent visible={modalVisible} animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <ActivityIndicator size="large" color="#000" />
            <Text style={{ marginTop: hp('1.5%') }}>{t("downloading")}</Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFF8E1",
  },
  scrollContent: {
    flexGrow: 1,
  },
  image: {
    width: wp('100%'),
    height: hp('30%'),
    backgroundColor: "#eee",
  },
  content: {
    paddingHorizontal: wp('5%'),
    paddingTop: hp('2%'),
    paddingBottom: hp('4%'),
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp('2%'),
  },
  title: {
    fontSize: hp('3%'),
    fontWeight: "bold",
    color: "#E65100",
    flex: 1,
    flexWrap: "wrap",
  },
  description: {
    fontSize: hp('2%'),
    color: "#5D4037",
    marginBottom: hp('3%'),
  },
  button: {
    backgroundColor: '#FFCC00',
    borderRadius: wp('3%'),
    paddingVertical: hp('1.8%'),
    alignItems: "center",
    marginTop: hp('2%'),
  },
  buttonText: {
    color: "black",
    fontSize: hp('2.2%'),
    fontWeight: "bold",
  },
  backContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backArrow: {
    fontSize: hp('4%'),
    color: 'black',
    marginRight: -2,
    marginTop: -5,
  },
  backText: {
    marginLeft: wp('2%'),
    fontSize: hp('2%'),
    fontWeight: "bold",
  },
  backButton: {
    marginTop: hp('1.5%'),
    marginLeft: wp('4%'),
    marginBottom: hp('1%'),
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: hp('3%'),
    flexWrap: 'wrap',
  },
  infoItem: {
    alignItems: 'center',
    flex: 1,
    marginVertical: hp('1%'),
  },
  infoText: {
    fontSize: hp('1.8%'),
    marginTop: hp('0.8%'),
    color: '#4B3621',
    textAlign: 'center',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: hp('3%'),
    borderRadius: wp('4%'),
    alignItems: 'center',
  },
});
