import { Dimensions } from 'react-native';
const windowWidth = Dimensions.get('window').width;

export function useSwipe(onSwipeTop?: any, onSwipeDown?: any, rangeOffset = 4) {

    let firstTouch = 0
    
    // set user touch start position
    function onTouchStart(e: any) {
        firstTouch = e.nativeEvent.pageY
    }

    // when touch ends check for swipe directions
    function onTouchEnd(e: any){

        // get touch position and screen size
        const positionY = e.nativeEvent.pageY
        const range = windowWidth / rangeOffset

        // check if position is growing positively and has reached specified range
        if(positionY - firstTouch > range){
            onSwipeDown && onSwipeDown()
        }
        // check if position is growing negatively and has reached specified range
        else if(firstTouch - positionY > range){
            onSwipeTop && onSwipeTop()
        }
    }

    return {onTouchStart, onTouchEnd};
}