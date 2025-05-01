import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { setLanguage } from '../redux/languageSlice';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

type MenuScreenProps = {
  onClose: () => void;
};

export function MenuScreen({ onClose }: MenuScreenProps) {
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const dispatch = useAppDispatch();
  const currentLanguageRedux = useAppSelector((state) => state.language.currentLanguage);

  const changeLanguage = (lang: "cs" | "en") => {
    i18n.changeLanguage(lang);
    dispatch(setLanguage(lang === "cs" ? "cz" : "en")); // synchronizace s Reduxem
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("Home")} activeOpacity={0.7}>
          <Image source={require("../assets/icons/logo.png")} style={styles.logo} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton} activeOpacity={0.7}>
          <Image source={require("../assets/icons/close.png")} style={styles.closeIcon} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.menuItem}>
        <Text style={styles.menuText}>{t("about_project")}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem}>
        <Text style={styles.menuText}>{t("contact_us")}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem}>
        <Text style={styles.menuText}>{t("downloaded_files")}</Text>
      </TouchableOpacity>

      <View style={styles.container}>
        <Text style={styles.title}>{t("select_language")}</Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            onPress={() => changeLanguage("cs")}
            style={[styles.langButton, currentLanguage === "cs" && styles.selected]}
          >
            <Text style={styles.langText}>🇨🇿 CZ</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => changeLanguage("en")}
            style={[styles.langButton, currentLanguage === "en" && styles.selected]}
          >
            <Text style={styles.langText}>🇬🇧 EN</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingTop: hp('7.5%'),
    paddingHorizontal: wp('6%'),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp('5%'),
  },
  logo: {
    width: wp('10%'),
    height: wp('10%'),
    borderRadius: wp('5%'),
  },
  closeButton: {
    padding: wp('2%'),
  },
  closeIcon: {
    width: wp('7%'),
    height: wp('7%'),
  },
  menuItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#5C873A",
    paddingVertical: hp('2.5%'),
  },
  menuText: {
    fontSize: wp('4.5%'),
    color: "#5C873A",
    fontWeight: "bold",
  },
  title: {
    fontSize: wp('4.5%'),
    marginBottom: hp('2.5%'),
  },
  buttonRow: {
    flexDirection: "row",
    gap: wp('2.5%'),
  },
  langButton: {
    backgroundColor: "#ddd",
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1%'),
    borderRadius: wp('2%'),
  },
  selected: {
    backgroundColor: "#5C873A",
  },
  langText: {
    fontSize: wp('4%'),
    fontWeight: "600",
    color: "#000",
  },
});

