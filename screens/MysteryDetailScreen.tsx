import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useEffect, useState } from "react";
import { getMediaURL } from "../utils/getMediaURL";
import { getGameFlowAssets } from "../utils/getGameFlowAssets";

export function MysteryDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { item } = route.params || {};

  const [backgroundUrl, setBackgroundUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchImage = async () => {
      if (item?.backgroundUrl) {
        const url = await getMediaURL(item.backgroundUrl);
        setBackgroundUrl(url);
      }
    };
    fetchImage();
  }, [item]);

  const handleStartGame = async () => {
    setLoading(true);
    const enrichedFlow = await getGameFlowAssets(item.gameFlow || []);
    navigation.navigate("GameScreen", { gameFlow: enrichedFlow });

  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <View style={styles.backContent}>
          <Text style={styles.backArrow}>‹</Text>
          <Text style={styles.backText}>Zpátky</Text>
        </View>
      </TouchableOpacity>

      <Image
        source={{uri:backgroundUrl}}
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.content}>
        <Text style={styles.title}>{item.title}</Text>
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
            <Text style={styles.infoText}>{item.strollerFriendly ? "S kočárkem" : "Bez kočárku"}</Text>
          </View>

          <View style={styles.infoItem}>
            <Icon name="map-marker-path" size={24} color="#4B3621" />
            <Text style={styles.infoText}>{item.stops} zastavení</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleStartGame} disabled={loading}>
          {loading ? <ActivityIndicator color="black" /> : <Text style={styles.buttonText}>Spustit hru</Text>}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF8E1" },
  image: { width: "100%", height: 250, backgroundColor: "#eee" },
  content: { padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", color: "#E65100", marginBottom: 10 },
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
});
