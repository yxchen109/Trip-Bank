import * as React from 'react';
import { View } from 'react-native';
import { useSwipe } from '@hooks/useSwipe'

export function SwipeComponent(props: any) {
    const { onTouchStart, onTouchEnd } = useSwipe(onSwipeTop, onSwipeDown, 6)
    console.log(props.style)
    function onSwipeTop(){
        console.log('SWIPE_TOP')
    }

    function onSwipeDown(){
        console.log('SWIPE_DOWN')
    }
   
    return (
        <View style={[props.style, {backgroundColor: 'pink'}]} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
            {props.children}
        </View>
    );
}