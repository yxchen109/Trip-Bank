import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts } from "expo-font";
import { useCallback } from "react";
import HomeScreen from './HomeScreen';
import SignInScreen from './SignInScreen';
import SignUpScreen from './SignUpScreen';

export default function App () {
  const Stack = createNativeStackNavigator();
  const [FontsLoaded] = useFonts({
    Pixellettersfull: require('./assets/fonts/Pixellettersfull-BnJ5.ttf'),
    BelieveIt: require('./assets/fonts/BelieveIt-DvLE.ttf'),
    ClatteryRegular: require('./assets/fonts/ClatteryRegular-4B2ex.ttf'),
    CorporateGothicNbpRegular: require('./assets/fonts/CorporateGothicNbpRegular-YJJ2.ttf'),
  })
  const onLayoutRootView = useCallback(async () => {
      if(FontsLoaded){
          await SplashScreen.hideAsync();
      }
  }, [FontsLoaded])
  if(!FontsLoaded) return null;
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home' screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Sign In" component={SignInScreen} />
        <Stack.Screen name="Sign Up" component={SignUpScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

