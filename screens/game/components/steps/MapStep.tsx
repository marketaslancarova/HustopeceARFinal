// components/steps/MapStep.tsx
import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useTranslation } from "react-i18next";

export default function MapScreen({ data, nextStep }: any) {
  const [location, setLocation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Přístup k poloze byl zamítnut");
        return;
      }

      const sub = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, distanceInterval: 1 },
        (loc) => {
          setLocation(loc.coords);
          checkProximity(loc.coords.latitude, loc.coords.longitude);
        }
      );

      setLoading(false);
      return () => sub.remove();
    })();
  }, []);

  const checkProximity = (userLat: number, userLon: number) => {
    const dist = getDistanceFromLatLonInMeters(
      userLat,
      userLon,
      data.latitude,
      data.longitude
    );
    if (dist < 2) {
      nextStep();
    }
  };

  const region = location
    ? {
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.002,
        longitudeDelta: 0.002,
      }
    : {
        latitude: data.latitude,
        longitude: data.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#F5EEDD" />
          <Text>Načítání polohy…</Text>
        </View>
      ) : (
        <>
          <MapView style={styles.map} region={region} showsUserLocation>
            <Marker
              coordinate={{
                latitude: data.latitude,
                longitude: data.longitude,
              }}
              title={data.destination || "Cíl"}
              description="Cíl mise"
            >
              <Text style={styles.icon}>🏰</Text>
            </Marker>
          </MapView>

          <View style={styles.buttonWrapper}>
            <TouchableOpacity style={styles.kidButton} onPress={nextStep}>
              <Text style={styles.kidButtonText}>{t("map_continue")}</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

function getDistanceFromLatLonInMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const R = 6371000;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5EEDD",
  },
  map: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    fontSize: wp("6%"),
  },
  buttonWrapper: {
    paddingBottom: hp("6%"),
    paddingTop: 0,
    backgroundColor: "#F5EEDD",
    borderTopWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
  },
  kidButton: {
    backgroundColor: "#FFB703",
    paddingVertical: hp("2%"),
    paddingHorizontal: wp("8%"),
    marginBottom: Platform.OS === "ios" ? hp("0.01%") : hp("6%"),
    marginTop: Platform.OS === "ios" ? hp("2%") : hp("1%"),
    borderRadius: wp("8%"),
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    minWidth: wp("50%"),
    alignItems: "center",
  },
  kidButtonText: {
    color: "#fff",
    fontSize: wp("5%"),
    fontWeight: "bold",
  },
});
