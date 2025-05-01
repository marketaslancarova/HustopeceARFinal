import { useEffect } from "react";
import { View, Text, StyleSheet, Image, ScrollView, FlatList, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchMetadata } from '../redux/dataSlice';
import { MediaTile } from "../components/MediaTile";
import { useTranslation } from "react-i18next";

export function MainScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const dispatch = useAppDispatch();
  const { mysteries, monuments } = useAppSelector(state => state.data);

  const language = useAppSelector((state) => state.language.currentLanguage); // 💡 jazyk z Reduxu

  useEffect(() => {
    dispatch(fetchMetadata()); // refetch při každé změně jazyka
  }, [dispatch, language]);

  console.log("Mysteries from Redux:", mysteries);
  console.log("Monuments from Redux:", monuments);
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={{ paddingBottom: 150 }}>
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
  safeArea: { flex: 1, backgroundColor: "#FFFFFF" },
  bannerContainer: {
    height: 260,
    position: "relative",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
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
    marginTop: 40,
    marginHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  menuButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center"
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: "contain"
  },
  menuIcon: {
    width: 24,
    height: 24,
    resizeMode: "contain"
  },
  bannerTextContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20
  },
  bannerText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 10,
    borderRadius: 12
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "700",
    fontFamily: "Lato",
    marginBottom: 12,
    textAlign: "left",
    color: "#000"
  },
  listContent: {
    paddingRight: 16
  },
  linkTextOrange: {
    color: "#E3772E",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 12,
    textDecorationLine: "underline"
  },
  linkTextGreen: {
    color: "#5C873A",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 12,
    textDecorationLine: "underline"
  }
});
