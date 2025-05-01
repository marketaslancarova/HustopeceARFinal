import { View, Text, StyleSheet, TextInput, FlatList, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchMetadata } from "../redux/dataSlice";
import { getMediaURL } from "../utils/getMediaURL";
import { MediaListItem } from "../components/MediaListItem";
import { useTranslation } from "react-i18next";

export function MysteriesScreen() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { mysteries } = useAppSelector((state) => state.data);

  const [imageMap, setImageMap] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    dispatch(fetchMetadata());
  }, []);

  useEffect(() => {
    const loadImages = async () => {
      const map: { [key: string]: string } = {};
      for (const mystery of mysteries) {
        if (mystery.backgroundUrl) {
          const url = await getMediaURL(mystery.backgroundUrl);
          map[mystery.id] = url;
        }
      }
      setImageMap(map);
    };
    loadImages();
  }, [mysteries]);

  const filteredMysteries = mysteries.filter((mystery) =>
    mystery.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <LinearGradient colors={["#FDD083", "#F5A623"]} style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <View style={styles.backContent}>
          <Text style={styles.backArrow}>‹</Text>
          <Text style={styles.backText}>{t("back")}</Text>
        </View>
      </TouchableOpacity>

      <Text style={styles.title}>{t("title_mysteries_all")}</Text>

      <TextInput
        style={styles.searchInput}
        placeholder={t("search_placeholder")}
        placeholderTextColor="#ccc"
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
      />

      <FlatList
        data={filteredMysteries}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <MediaListItem
            item={{ ...item, backgroundUrl: imageMap[item.id] }}
            type="mystery"
          />
        )}
      />
    </LinearGradient>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 16 },
  
  title: { color: "black", fontSize: 24, fontWeight: "bold", marginBottom: 16,marginLeft: 16 },
  searchInput: { backgroundColor: "white", borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, marginBottom: 16, alignSelf: "center", width: "90%" },
  listContent: { alignItems: "center", paddingBottom: 16 },
  card: { backgroundColor: "white", borderRadius: 16, flexDirection: "row", marginBottom: 16, overflow: "hidden", elevation: 4, width: "90%" },
  cardImage: { width: 90, height: 90 },
  cardContent: { flex: 1, padding: 8, justifyContent: "center" },
  cardTitle: { fontWeight: "bold", fontSize: 16, marginBottom: 4, color: "#E3772E" },
  cardDescription: { fontSize: 12, color: "#757575", marginBottom: 6 },
  distanceRow: { flexDirection: "row", alignItems: "center" },
  distanceIcon: { fontSize: 14, marginRight: 4 },
  distanceText: { fontSize: 14, fontWeight: "bold" },
  backContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backArrow: {
    fontSize: 32,    // aby šipka byla dostatečně velká
    color: 'black',
    marginRight: -2,
    marginTop: -5  // mezera mezi šipkou a textem
  },
  backText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "bold",
  },
  backButton: {
    marginTop: 20,
    marginLeft: 16,
    marginBottom: 10,

  },
});
