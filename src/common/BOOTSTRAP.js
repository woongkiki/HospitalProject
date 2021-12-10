import React from 'react';
import { TouchableOpacity, TextInput, Platform, Dimensions } from 'react-native';
import { Box, Text, Image, Input, HStack} from 'native-base';
import Font from '../common/Font';


const {width} = Dimensions.get('window');

export const DefText = ({text, style}) => {
    return (
        <Text  style={[{fontSize:width > 360 ? 14 : 13, lineHeight:20,color:'#000', fontFamily:Font.NotoSansRegular}, style]}>{text}</Text>
    )
}

export const Button = ({disabled, onPress, text, buttonStyle, textStyle}) => {
    return (
        <TouchableOpacity 
            style={[{width:'100%', height:50, backgroundColor:'#696968', alignItems:'center', justifyContent:'center'}, buttonStyle]}
            onPress={onPress}
            disabled = {disabled}
        >
            <DefText text={text} style={[{color:'#fff'}, textStyle]} />
        </TouchableOpacity>
    )
}

export const Button2 = ({disabled, onPress, text, buttonStyle, textStyle, imgSource, imgAlt, imgStyle}) => {
    return (
        <TouchableOpacity 
            style={[{width:'100%', height:50, backgroundColor:'#696968', alignItems:'center', justifyContent:'center'}, buttonStyle]}
            onPress = {onPress}
            disabled = {disabled}
        >
            <HStack alignItems='center'>
                <Image source={imgSource} alt={imgAlt} style={[imgStyle]} />
                <DefText text={text} style={[{color:'#fff'}, textStyle]} />
            </HStack>
        </TouchableOpacity>
    )
}

export const DefInput = ({placeholderText, keyboardType, inputValue, onChangeText, multiline, maxLength, inputStyle, secureTextEntry, onPressOut, disabled, textAlignVertical}) => {
    return (
        <Input 
            placeholder={placeholderText}
            placeholderTextColor='#ABB3BB'
            _focus='transparent'
            backgroundColor='#FFFFFF'
            keyboardType={keyboardType ? keyboardType : 'default'}
            height='48px'
            value={inputValue}
            onChangeText={onChangeText}
            multiline = {multiline ? multiline : false}
            maxLength = {maxLength}
            secureTextEntry={secureTextEntry}
            style={[{fontSize:14},inputStyle]}
            onPressOut={onPressOut}
            disabled={disabled}
            textAlignVertical={textAlignVertical ? textAlignVertical : 'center'}
        />
    )
}