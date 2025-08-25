import React, { useCallback } from "react";
import { Slot } from 'expo-router';
import { useFonts } from "expo-font";

import { SessionProvider } from '../ctx';

export default function Root() {
    
  const [FontsLoaded] = useFonts({
    Pixellettersfull: require('@assets/fonts/Pixellettersfull-BnJ5.ttf'),
    BelieveIt: require('@assets/fonts/BelieveIt-DvLE.ttf'),
    ClatteryRegular: require('@assets/fonts/ClatteryRegular-4B2ex.ttf'),
    CorporateGothicNbpRegular: require('@assets/fonts/CorporateGothicNbpRegular-YJJ2.ttf'),
  })

  const onLayoutRootView = useCallback(async () => {
    if(FontsLoaded){
      await SplashScreen.hideAsync();
    }
  }, [FontsLoaded])

  if(!FontsLoaded) return null;

  // Set up the auth context and render our layout inside of it.
  return (
    <SessionProvider>
      <Slot />
    </SessionProvider>
  );
}
