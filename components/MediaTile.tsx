import { useEffect, useState } from "react";
import { TouchableOpacity, Text, Image, View, StyleSheet } from "react-native";
import { getMediaURL } from "../utils/getMediaURL";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

interface MediaTileProps {
  item: any;
  mediaPath: string;
  buttonColor: string;
  navigateTo: string;
}

export function MediaTile({ item, mediaPath, buttonColor, navigateTo }: MediaTileProps) {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    getMediaURL(mediaPath).then(setImageUrl);
  }, [mediaPath]);

  return (
    <TouchableOpacity style={styles.tile} onPress={() => navigation.navigate(navigateTo, { item })}>
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.tileImage} />
      ) : (
        <View style={[styles.tileImage, { justifyContent: "center", alignItems: "center" }]}>
          <Text>{t("loading")}</Text>
        </View>
      )}
      <Text style={styles.tileTitle}>{item.title}</Text>
      <Text style={styles.tileDescription} numberOfLines={3}>{item.description}</Text>
      <TouchableOpacity
        style={[styles.tileButton, { backgroundColor: buttonColor }]}
        onPress={() => navigation.navigate(navigateTo, { item })}
      >
        <Text style={styles.tileButtonText}>{t("more")}</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tile: {
    width: wp('40%'),
    height: hp('28%'),
    backgroundColor: "#F5F5F5",
    borderRadius: wp('2%'),
    marginRight: wp('4%'),
    overflow: "hidden",
    paddingBottom: hp('1%'),
  },
  tileImage: {
    width: "100%",
    height: hp('13%'),
    borderTopLeftRadius: wp('2%'),
    borderTopRightRadius: wp('2%'),
    backgroundColor: "#ddd"
  },
  tileTitle: {
    fontSize: hp('1.8%'),
    fontWeight: "700",
    color: "#333",
    textAlign: "left",
    marginTop: hp('1%'),
    marginLeft: wp('2.5%'),
  },
  tileDescription: {
    fontSize: hp('1.4%'),
    fontWeight: "400",
    color: "#333",
    marginTop: hp('0.5%'),
    marginHorizontal: wp('2.5%'),
    textAlign: "left",
  },
  tileButton: {
    alignSelf: "flex-start",
    marginLeft: wp('2.5%'),
    marginTop: hp('1%'),
    paddingVertical: hp('0.4%'),
    paddingHorizontal: wp('3%'),
    borderRadius: wp('1%'),
  },
  tileButtonText: {
    color: "#F5F5F5",
    fontSize: hp('1.2%'),
    fontWeight: "300",
  },
});
