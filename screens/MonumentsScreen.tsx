import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useMemo, useState } from "react";
import * as Location from 'expo-location';
import { useAppSelector } from '../redux/hooks';
import { calculateDistance } from '../utils/calculateDistance';
import { MediaListItem } from "../components/MediaListItem";
import { useTranslation } from 'react-i18next';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { SafeAreaView } from "react-native-safe-area-context";

export function MonumentsScreen() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const navigation = useNavigation();
  const monuments = useAppSelector((state) => state.data.monuments);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

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
      return { ...m, distance: `${dist.toFixed(1)} km` };
    });
  }, [monuments, userLocation]);

  const filteredMonuments = enrichedMonuments.filter((monument) =>
    monument.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <LinearGradient colors={["#5C873A", "#141C0D"]} style={styles.container}>
      <SafeAreaView style={styles.SafeArea}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
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