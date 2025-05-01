// components/MediaListItem.tsx
import { useEffect, useState } from "react";
import { TouchableOpacity, Text, Image, View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getMediaURL } from "../utils/getMediaURL";
import { Ionicons } from "@expo/vector-icons";

import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { downloadMonumentAssets } from "../utils/downloadMonumentAssets";
import NetInfo from "@react-native-community/netinfo"; // pro kontrolu dat/Wi-Fi

interface Props {
  item: any;
  type: "mystery" | "monument";
}


export function MediaListItem({ item, type }: Props) {
  
  const navigation = useNavigation();
  const [imageUrl, setImageUrl] = useState<string | null>(null);

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

  const dispatch = useAppDispatch();
  const downloadedMonuments = useAppSelector((state) => state.data.downloadedMonuments);

  const isDownloaded = downloadedMonuments.includes(item.id);

  const handleDownload = async () => {
    const netInfo = await NetInfo.fetch();

    if (!netInfo.isConnected) {
      alert("Nejsi připojený k internetu.");
      return;
    }

    if (netInfo.type !== "wifi") {
      alert("Stahování je povoleno jen přes Wi-Fi.");
      return;
    }

    try {
      await downloadMonumentAssets(item, dispatch);
      alert("Obsah stažen.");
    } catch (e) {
      alert("Chyba při stahování.");
    }
  };


  return (
    <TouchableOpacity
      style={styles.card}
      onPress={async () => {
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
          alert("Obsah není stažený a nejsi na Wi-Fi. Stáhni si ho nejprve.");
        }
      }}
    
      activeOpacity={0.8}
    >
      {imageUrl && <Image source={{ uri: imageUrl }} style={styles.cardImage} />}
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text numberOfLines={2} style={styles.cardDescription}>{item.description}</Text>
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
      </View>
      <TouchableOpacity onPress={handleDownload} style={{ position: "absolute", top: 8, right: 8 }}>
        <Ionicons
          name={isDownloaded ? "checkmark-done-circle-outline" : "cloud-download-outline"}
          size={24}
          color={isDownloaded ? "green" : "black"}
        />
      </TouchableOpacity>
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
});
