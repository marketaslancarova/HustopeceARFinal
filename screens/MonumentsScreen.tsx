import { View, Text, StyleSheet, TextInput, FlatList, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useMemo, useState } from "react";
import * as Location from 'expo-location';
import { useAppSelector } from '../redux/hooks';
import { calculateDistance } from '../utils/calculateDistance';
import { MediaListItem } from "../components/MediaListItem";
import { useTranslation } from 'react-i18next';

export function MonumentsScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigation = useNavigation();
  const monuments = useAppSelector((state) => state.data.monuments);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();
  }, []);

  const enrichedMonuments = useMemo(() => {
    if (!userLocation) return monuments;

    return monuments.map((m) => {
      const dist = calculateDistance(userLocation.latitude, userLocation.longitude, m.latitude, m.longitude);
      return {
        ...m,
        distance: `${dist.toFixed(1)} km`,
      };
    });
  }, [monuments, userLocation]);

  const filteredMonuments = enrichedMonuments.filter((monument) =>
    monument.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <LinearGradient colors={["#5C873A", "#141C0D"]} style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => {
          navigation.navigate("HomeStack", { screen: "Home" });
        }}
      >
        <View style={styles.backContent}>
          <Text style={styles.backArrow}>‹</Text>
          <Text style={styles.backText}>{t("back")}</Text>
        </View>
      </TouchableOpacity>

      <Text style={styles.title}>{t("title_monuments")}</Text>

      <TextInput
        style={styles.searchInput}
        placeholder={t("search_placeholder")}
        placeholderTextColor="#ccc"
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
      />

      <FlatList
        data={filteredMonuments}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <MediaListItem item={item} type="monument" />
        )}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 16 },
  title: { color: "white", fontSize: 24, fontWeight: "bold", marginBottom: 16, marginLeft: 16 },
  searchInput: { backgroundColor: "white", borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, marginBottom: 16, alignSelf: "center", width: "90%" },
  listContent: { alignItems: "center", paddingBottom: 16 },
  card: { backgroundColor: "white", borderRadius: 16, flexDirection: "row", marginBottom: 16, overflow: "hidden", elevation: 4, width: "90%" },
  cardImage: { width: 90, height: 90 },
  cardContent: { flex: 1, padding: 8, justifyContent: "center" },
  cardTitle: { fontWeight: "bold", fontSize: 16, marginBottom: 4 },
  cardDescription: { fontSize: 12, color: "#757575", marginBottom: 6 },
  distanceRow: { flexDirection: "row", alignItems: "center" },
  distanceIcon: { fontSize: 14, marginRight: 4 },
  distanceText: { fontSize: 14, fontWeight: "bold" },
  backButton: {
    marginTop: 20,
    marginLeft: 16,
    marginBottom: 10,
  },
  backContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backArrow: {
    fontSize: 32,
    color: 'white',
    marginRight: -2,
    marginTop: -5
  },
  backText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "bold",
    color: 'white',
  },
});
