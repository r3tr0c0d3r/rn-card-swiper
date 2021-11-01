import React from 'react'
import { StyleProp, StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native'

interface Props {
    title: string;
    style?: StyleProp<ViewStyle>
    textStyle?: StyleProp<TextStyle>
    onPress: (event: Event) => void;
}

const Button = (props: Props) => {
    // console.log('Button: render!!')
    return (
        <TouchableOpacity 
        style={[styles.container, props.style]} 
        activeOpacity={0.8}
        onPress={props.onPress}>
            <Text style={props.textStyle}>{props.title}</Text>
        </TouchableOpacity>
    )
}

export default React.memo(Button);

const styles = StyleSheet.create({
    container: {
        height: 52,
        paddingHorizontal: 12,
        backgroundColor: '#0095FF',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    }
})
