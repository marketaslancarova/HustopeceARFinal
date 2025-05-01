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
import GameScreen  from "../screens/game/GameScreen";

export type RootTabParamList = {
  HomeStack: undefined;
  MonumentsStack: undefined;
  Map: undefined;
};

export type HomeStackParamList = {
  Home: undefined;
  MonumentDetail: { item: any };
  Menu: undefined;
  MysteriesScreen: undefined;
  MysteryDetail: { item: any };
  GameScreen: undefined;
  RoutesStack: undefined; // <<--- Přidat RoutesStack jako nový screen
};

export type MonumentsStackParamList = {
  Monuments: undefined;
  MonumentDetail: { item: any };
};

const Tab = createBottomTabNavigator<RootTabParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const MonumentsStack = createNativeStackNavigator<MonumentsStackParamList>();

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="Home" component={MainScreen} />
      <HomeStack.Screen name="MonumentDetail" component={MonumentDetailScreen} />
      <HomeStack.Screen name="Menu" component={MenuScreen} />
      <HomeStack.Screen name="MysteriesScreen" component={MysteriesScreen} />
      <HomeStack.Screen name="MysteryDetail" component={MysteryDetailScreen} />
      <HomeStack.Screen name="GameScreen" component={GameScreen} />


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

export function AppNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="HomeStack"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          let iconName = "";
          if (route.name === "Map") {
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
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="HomeStack" component={HomeStackNavigator} />
      <Tab.Screen name="MonumentsStack" component={MonumentsStackNavigator} />
    </Tab.Navigator>
  );
}
