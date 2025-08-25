import React from "react";
import {View,Text, StyleSheet} from 'react-native';

const Task = (props) => {

    return (
        <View>
            <Text style={{fontSize:17}}>{props.text}</Text>
        </View>
    )
}

const styles = StyleSheet.create({

});

export default Task;