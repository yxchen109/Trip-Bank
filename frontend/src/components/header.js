import React from "react"
import { View, StyleSheet, Pressable } from "react-native";
import { Entypo } from '@expo/vector-icons';
import Constants from 'expo-constants';

export function Header({children, headerLeft=undefined, headerRight=undefined, position='relative', height=70, style=undefined}) {
  return (
		<View style={[styles.header, {position: position, height: height, }, style]}>
			<HeaderLeft content={headerLeft}/>
			<HeaderCenter content={children}/>
			<HeaderRight content={headerRight}/>
		</View>
	)
}
export function HeaderLeft({content}) {
	return (
		<View style={styles.headerLeft}>
			{content} 
		</View>
	)
}

export function HeaderCenter({content}) {
	return (
		<View style={styles.headerCenter}>
			{content} 
		</View>
	)
}
export function HeaderRight({content}) {
	return (
		<View style={styles.headerRight}>
			{content} 
		</View>
	)
}
export function Setting({color="black"}) {
	return (
		<Pressable onPress={() => alert('This is a button!')}>
			<Entypo name="cog" size={40} color={color} />
		</Pressable>
	)
}
const styles = StyleSheet.create({
	header: {
		position: 'absolute',
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'center',
		marginTop: Constants.statusBarHeight,
	},
	headerLeft: {
		alignItems: 'center',
		alignSelf: 'center',
		position: 'absolute',
		// top: 15,
		left: 15,
	},
	headerCenter: {
    // backgroundColor: 'gold',
    justifyContent: 'center',
    alignItems: 'center',
	},
	headerRight: {
    alignItems: 'center',
    // elevation: 3,
    position: 'absolute',
	alignSelf: 'center',
    right: 15,
	},
});

