import { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { getMediaURL } from "../utils/getMediaURL";
import { fetchMetadata } from "../redux/dataSlice";
import * as Location from "expo-location";
import { calculateDistance } from "../utils/calculateDistance";
import { useNavigation } from "@react-navigation/native";

export function MapScreen() {
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);
  const [imageMap, setImageMap] = useState<{ [key: string]: string | null }>({});
  const [distanceMap, setDistanceMap] = useState<{ [key: string]: string }>({});
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const monuments = useAppSelector((state) => state.data.monuments);

  useEffect(() => {
    dispatch(fetchMetadata());
  }, [dispatch]);

  useEffect(() => {
    const loadImagesAndDistances = async () => {
      const imageMapTemp: { [key: string]: string | null } = {};
      const distanceMapTemp: { [key: string]: string } = {};

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.warn("Přístup k poloze odepřen.");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const userLat = location.coords.latitude;
      const userLon = location.coords.longitude;
      setUserLocation({ latitude: userLat, longitude: userLon });

      for (const monument of monuments) {
        if (monument.image) {
          imageMapTemp[monument.id] = await getMediaURL(monument.image);
        } else if (monument.assets?.images?.[0]) {
          imageMapTemp[monument.id] = await getMediaURL(monument.assets.images[0]);
        } else {
          imageMapTemp[monument.id] = null;
        }

        const distance = calculateDistance(userLat, userLon, monument.latitude, monument.longitude);
        distanceMapTemp[monument.id] = `${distance.toFixed(1)} km`;
      }

      setImageMap(imageMapTemp);
      setDistanceMap(distanceMapTemp);
    };

    if (monuments.length > 0) {
      loadImagesAndDistances();
    }
  }, [monuments]);

  const handleMarkerPress = (id: string) => {
    setSelectedMarkerId(id);
  };

  const handleDetailNavigation = (monument: any) => {
    navigation.navigate("MonumentDetail", { item: monument });
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 48.9396,
          longitude: 16.7350,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {monuments.map((location) => (
          <Marker
            key={location.id}
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            onPress={() => handleMarkerPress(location.id)}
            onCalloutPress={() => handleDetailNavigation(location)}
            onDeselect={() => setSelectedMarkerId(null)}
            image={
              selectedMarkerId === location.id
                ? require("../assets/icons/marker-selected.png")
                : require("../assets/icons/marker-default.png")
            }
          >
            <Callout tooltip={false}>
              <View style={styles.callout}>
                <Image
                  source={
                    imageMap[location.id]
                      ? { uri: imageMap[location.id]! }
                      : require("../assets/monuments/Monument.png")
                  }
                  style={styles.calloutImage}
                />
                <View style={styles.calloutContent}>
                  <Text style={styles.title}>{location.title}</Text>
                  <Text numberOfLines={2} style={styles.description}>
                    {location.description}
                  </Text>
                  <View style={styles.distanceRow}>
                    <Text style={styles.distanceIcon}>📍</Text>
                    <Text style={styles.distanceText}>
                      {distanceMap[location.id] || "Načítám..."}
                    </Text>
                  </View>
                </View>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  callout: {
    width: 250,
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  calloutImage: {
    width: 90,
    height: 90,
  },
  calloutContent: {
    flex: 1,
    padding: 8,
    justifyContent: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: "#757575",
    marginBottom: 6,
  },
  distanceRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  distanceIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  distanceText: {
    fontSize: 14,
    fontWeight: "bold",
  },
});
