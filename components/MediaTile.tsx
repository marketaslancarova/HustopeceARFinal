import { useEffect, useState } from "react";
import { TouchableOpacity, Text, Image, View, StyleSheet } from "react-native";
import { getMediaURL } from "../utils/getMediaURL"; // Adjust the import path as necessary
import { useNavigation } from "@react-navigation/native";

interface MediaTileProps {
  item: any;
  mediaPath: string;
  buttonColor: string;
  navigateTo: string;
}

export function MediaTile({ item, mediaPath, buttonColor, navigateTo }: MediaTileProps) {
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
          <Text>Načítání...</Text>
        </View>
      )}
      <Text style={styles.tileTitle}>{item.title}</Text>
      <Text style={styles.tileDescription} numberOfLines={3}>{item.description}</Text>
      <TouchableOpacity style={[styles.tileButton, { backgroundColor: buttonColor }]} onPress={() => navigation.navigate(navigateTo, { item })}>
        <Text style={styles.tileButtonText}>Zjistit více</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tile: {
    width: 177,
    height: 256,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    marginRight: 16,
    overflow: "hidden",
    paddingBottom: 10,
  },
  tileImage: {
    width: "100%",
    height: 130,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  tileTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#333",
    textAlign: "left",
    marginTop: 8,
    marginLeft: 10,
  },
  tileDescription: {
    fontSize: 12,
    fontWeight: "400",
    color: "#333",
    marginTop: 6,
    marginHorizontal: 10,
    textAlign: "left",
  },
  tileButton: {
    alignSelf: "flex-start",
    marginLeft: 10,
    marginTop: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  tileButtonText: {
    color: "#F5F5F5",
    fontSize: 9,
    fontWeight: "300",
  },
});
