import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

// Screens
import { MainScreen } from "../screens/MainScreen";
import { MonumentsScreen } from "../screens/MonumentsScreen";
import { MapScreen } from "../screens/MapScreen";
import { MonumentDetailScreen } from "../screens/MonumentDetailScreen";
import { MenuScreen } from "../screens/MenuScreen";
import { MysteriesScreen } from "../screens/MysteriesScreen";
import { MysteryDetailScreen } from "../screens/MysteryDetailScreen";
import GameScreen from "../screens/game/GameScreen";
import ARTestScreen from "../screens/ARTestScreen";
import { Modal } from "react-native";

// Navigátor typy
export type RootTabParamList = {
  HomeStack: undefined;
  MonumentsStack: undefined;
  MapStack: undefined;
};

export type HomeStackParamList = {
  Home: undefined;
  MonumentDetail: { item: any };
  Menu: undefined;
  MysteriesScreen: undefined;
  MysteryDetail: { item: any };
  GameScreen: undefined;
  ARTest: undefined;
};

export type MonumentsStackParamList = {
  Monuments: undefined;
  MonumentDetail: { item: any };
};

export type MapStackParamList = {
  Map: undefined;
  MonumentDetail: { item: any };
};

// Navigátory
const Tab = createBottomTabNavigator<RootTabParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const MonumentsStack = createNativeStackNavigator<MonumentsStackParamList>();
const MapStack = createNativeStackNavigator<MapStackParamList>();

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="Home" component={MainScreen} />
      <HomeStack.Screen name="MonumentDetail" component={MonumentDetailScreen} />
      <HomeStack.Screen name="Menu" component={MenuScreen} />
      <HomeStack.Screen name="MysteriesScreen" component={MysteriesScreen} />
      <HomeStack.Screen name="MysteryDetail" component={MysteryDetailScreen} />
      <HomeStack.Screen name="GameScreen" component={GameScreen} />
      <HomeStack.Screen name="ARTest" component={ARTestScreen} options={{presentation:"fullScreenModal"}}/>
    </HomeStack.Navigator>
  );
}

function MonumentsStackNavigator() {
  return (
    <MonumentsStack.Navigator screenOptions={{ headerShown: false }}>
      <MonumentsStack.Screen name="Monuments" component={MonumentsScreen} />
      <MonumentsStack.Screen name="MonumentDetail" component={MonumentDetailScreen} />
    </MonumentsStack.Navigator>
  );
}

function MapStackNavigator() {
  return (
    <MapStack.Navigator screenOptions={{ headerShown: false }}>
      <MapStack.Screen name="Map" component={MapScreen} />
      <MapStack.Screen name="MonumentDetail" component={MonumentDetailScreen} />
    </MapStack.Navigator>
  );
}

export function AppNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="HomeStack"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          let iconName = "";
          if (route.name === "MapStack") {
            iconName = focused ? "location" : "location-outline";
          } else if (route.name === "HomeStack") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "MonumentsStack") {
            iconName = focused ? "business" : "business-outline";
          }
          return <Ionicons name={iconName as any} size={24} color={focused ? "#000" : "#9E9E9E"} />;
        },
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
          backgroundColor: "white",
          position: "absolute",
        },
      })}
    >
      <Tab.Screen name="MapStack" component={MapStackNavigator} />
      <Tab.Screen name="HomeStack" component={HomeStackNavigator} />
      <Tab.Screen name="MonumentsStack" component={MonumentsStackNavigator} />
    </Tab.Navigator>
  );
}
