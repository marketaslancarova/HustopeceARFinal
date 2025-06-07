import { View, Text, StyleSheet, TextInput, FlatList, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchMetadata } from "../redux/dataSlice";
import { getMediaURL } from "../utils/getMediaURL";
import { MediaListItem } from "../components/MediaListItem";
import { useTranslation } from "react-i18next";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SafeAreaView } from "react-native-safe-area-context";

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
    <LinearGradient colors={["#C45500", "#5E2900"]} style={styles.container}>
    <SafeAreaView style={styles.SafeArea}>
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
    
    </SafeAreaView>
    </LinearGradient>
  );
}


const styles = StyleSheet.create({
  SafeArea: {
    flex: 1,

  },
  container: {
    flex: 1,
   
    paddingHorizontal: wp('4%'),
  },
  title: {
    color: "white",
    fontSize: wp('6%'),
    fontWeight: "bold",
    marginBottom: hp('2%'),
    marginLeft: wp('4%'),
  },
  searchInput: {
    backgroundColor: "white",
    borderRadius: wp('3%'),
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1.5%'),
    marginBottom: hp('2%'),
    alignSelf: "center",
    width: wp('81%'),
  },
  listContent: {
    alignItems: "center",
    paddingBottom: hp('2%'),
  },
  card: {
    backgroundColor: "white",
    borderRadius: wp('4%'),
    flexDirection: "row",
    marginBottom: hp('2%'),
    overflow: "hidden",
    elevation: 4,
    width: wp('90%'),
  },
  cardImage: {
    width: wp('24%'),
    height: wp('24%'),
  },
  cardContent: {
    flex: 1,
    padding: wp('2%'),
    justifyContent: "center",
  },
  cardTitle: {
    fontWeight: "bold",
    fontSize: wp('4%'),
    marginBottom: hp('0.5%'),
  },
  cardDescription: {
    fontSize: wp('3%'),
    color: "#757575",
    marginBottom: hp('0.8%'),
  },
  distanceRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  distanceIcon: {
    fontSize: wp('3.5%'),
    marginRight: wp('1%'),
  },
  distanceText: {
    fontSize: wp('3.5%'),
    fontWeight: "bold",
  },
  backButton: {
    marginTop: hp('2.5%'),
    marginLeft: wp('4%'),
    marginBottom: hp('1.5%'),
  },
  backContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backArrow: {
    fontSize: wp('8%'),
    color: 'white',
    marginRight: wp('-0.5%'),
    marginTop: hp('-0.5%'),
  },
  backText: {
    marginLeft: wp('2%'),
    fontSize: wp('4%'),
    fontWeight: "bold",
    color: 'white',
  },
});

