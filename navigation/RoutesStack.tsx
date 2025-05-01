import { createNativeStackNavigator } from '@react-navigation/native-stack';
import gameFlow from '../assets/data/gameFlow.json';

// Import všech screen komponent
import IntroScreen from '../screens/game/IntroScreen';
import MapScreen from '../screens/game/MapScreen';
import StoryScreen from '../screens/game/StoryScreen';
import TaskScreen from '../screens/game/TaskScreen';
import FinishedScreen from '../screens/game/FinishedScreen';
import ResultScreen from '../screens/game/ResultScreen';
import FilmScreen from '../screens/game/FilmScreen'; // <--- PŘIDÁNO

const Stack = createNativeStackNavigator();

export default function RouteStack() {
  return (
    <Stack.Navigator initialRouteName="Screen0" screenOptions={{ headerShown: false }}>
      {gameFlow.map((item, index) => {
        let ScreenComponent;
        
        // Vybereme správný komponent podle typu
        switch (item.type) {
          case 'intro':
            ScreenComponent = IntroScreen;
            break;
          case 'result':
            ScreenComponent = ResultScreen;
            break;
          case 'map':
            ScreenComponent = MapScreen;
            break;
          case 'story':
            ScreenComponent = StoryScreen;
            break;
          case 'task':
            ScreenComponent = TaskScreen;
            break;
          case 'finished':
            ScreenComponent = FinishedScreen;
            break;
          case 'film': // <--- PŘIDÁNO
            ScreenComponent = FilmScreen;
            break;
          default:
            return null;
        }

        return (
          <Stack.Screen
            key={index}
            name={`Screen${index}`}
            component={ScreenComponent}
            initialParams={{ data: item, nextScreen: `Screen${index + 1}` }}
          />
        );
      })}
    </Stack.Navigator>
  );
}
