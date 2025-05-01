import { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  FlatList,
  TouchableOpacity
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchMetadata } from '../redux/dataSlice';
import { MediaTile } from "../components/MediaTile";
import { useTranslation } from "react-i18next";

export function MainScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const dispatch = useAppDispatch();
  const { mysteries, monuments } = useAppSelector(state => state.data);
  const language = useAppSelector((state) => state.language.currentLanguage);

  useEffect(() => {
    dispatch(fetchMetadata());
  }, [dispatch, language]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={{ paddingBottom: hp('20%') }}>
        <View style={styles.bannerContainer}>
          <Image source={require("../assets/icons/banner.png")} style={styles.bannerImage} />
          <View style={styles.bannerContent}>
            <View style={styles.header}>
              <TouchableOpacity style={styles.menuButton} onPress={() => console.log("Logo clicked")} activeOpacity={0.7}>
                <Image source={require("../assets/icons/logo.png")} style={styles.logo} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate("Menu")} activeOpacity={0.7}>
                <Image source={require("../assets/icons/menu.png")} style={styles.menuIcon} />
              </TouchableOpacity>
            </View>
            <View style={styles.bannerTextContainer}>
              <Text style={styles.bannerText}>{t("banner_text")}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("title_mysteries")}</Text>
          <FlatList
            data={mysteries}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <MediaTile
                item={item}
                mediaPath={item.backgroundUrl}
                buttonColor="#E3772E"
                navigateTo="MysteryDetail"
              />
            )}
          />
          <TouchableOpacity onPress={() => navigation.navigate("MysteriesScreen")}>
            <Text style={styles.linkTextOrange}>{t("view_mysteries")}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("title_monuments")}</Text>
          <FlatList
            data={monuments}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <MediaTile
                item={item}
                mediaPath={item.assets.images[0]}
                buttonColor="#5C873A"
                navigateTo="MonumentDetail"
              />
            )}
          />
          <TouchableOpacity onPress={() => navigation.navigate("MonumentsStack")}>
            <Text style={styles.linkTextGreen}>{t("view_monuments")}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF"
  },
  bannerContainer: {
    height: hp('32%'),
    position: "relative",
    borderBottomLeftRadius: wp('6%'),
    borderBottomRightRadius: wp('6%'),
    overflow: "hidden"
  },
  bannerImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
    resizeMode: "cover"
  },
  bannerContent: {
    flex: 1,
    justifyContent: "space-between"
  },
  header: {
    marginTop: hp('4%'),
    marginHorizontal: wp('4%'),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  menuButton: {
    width: wp('12%'),
    height: wp('12%'),
    justifyContent: "center",
    alignItems: "center"
  },
  logo: {
    width: wp('10%'),
    height: wp('10%'),
    resizeMode: "contain"
  },
  menuIcon: {
    width: wp('6%'),
    height: wp('6%'),
    resizeMode: "contain"
  },
  bannerTextContainer: {
    paddingHorizontal: wp('4%'),
    paddingBottom: hp('2%')
  },
  bannerText: {
    color: "white",
    fontSize: hp('1.7%'),
    fontWeight: "bold",
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: hp('1%'),
    borderRadius: wp('3%')
  },
  section: {
    marginTop: hp('3%'),
    paddingHorizontal: wp('4%')
  },
  sectionTitle: {
    fontSize: hp('2.8%'),
    fontWeight: "700",
    marginBottom: hp('1.5%'),
    textAlign: "left",
    color: "#000"
  },
  listContent: {
    paddingRight: wp('4%')
  },
  linkTextOrange: {
    color: "#E3772E",
    fontSize: hp('1.9%'),
    fontWeight: "600",
    marginTop: hp('3.2%'),
    textDecorationLine: "underline"
  },
  linkTextGreen: {
    color: "#5C873A",
    fontSize: hp('2%'),
    fontWeight: "600",
    marginTop: hp('1.5%'),
    textDecorationLine: "underline"
  }
});
