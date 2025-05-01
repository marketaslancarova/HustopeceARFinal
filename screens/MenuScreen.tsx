import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { setLanguage } from '../redux/languageSlice';

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
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  closeButton: {
    padding: 8,
  },
  closeIcon: {
    width: 28,
    height: 28,
  },
  menuItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#5C873A",
    paddingVertical: 20,
  },
  menuText: {
    fontSize: 18,
    color: "#5C873A",
    fontWeight: "bold",
  },
  title: { fontSize: 18, marginBottom: 20 },
  buttonRow: { flexDirection: "row", gap: 10 },
  langButton: {
    backgroundColor: "#ddd",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  selected: {
    backgroundColor: "#5C873A",
  },
  langText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
});
