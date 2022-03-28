import React from 'react';
import { TouchableOpacity, TextInput, Platform, Dimensions } from 'react-native';
import { Box, Text, Image, Input, HStack} from 'native-base';
import Font from '../common/Font';


const {width} = Dimensions.get('window');

export const DefText = ({text, style}) => {
    return (
        <Text  style={[{fontSize: 16, lineHeight:20,color:'#000', fontFamily:Font.NotoSansRegular}, style]}>{text}</Text>
    )
}

export const Button = ({disabled, onPress, text, buttonStyle, textStyle}) => {
    return (
        <TouchableOpacity 
            style={[{width:'100%', height:45, backgroundColor:'#090A73', alignItems:'center', justifyContent:'center'}, buttonStyle]}
            onPress={onPress}
            disabled = {disabled}
        >
            <DefText text={text} style={[{color:'#fff', fontFamily:Font.NotoSansMedium, fontSize:16}, textStyle]} />
        </TouchableOpacity>
    )
}

export const Button2 = ({disabled, onPress, text, buttonStyle, textStyle, imgSource, imgAlt, imgStyle}) => {
    return (
        <TouchableOpacity 
            style={[{width:'100%', height:45, backgroundColor:'#090A73', alignItems:'center', justifyContent:'center'}, buttonStyle]}
            onPress = {onPress}
            disabled = {disabled}
        >
            <HStack alignItems='center'>
                <Image source={imgSource} alt={imgAlt} style={[imgStyle]} />
                <DefText text={text} style={[{color:'#fff', fontFamily:Font.NotoSansMedium, fontSize:16}, textStyle]} />
            </HStack>
        </TouchableOpacity>
    )
}

export const DefInput = ({placeholderText, keyboardType, inputValue, onChangeText, multiline, maxLength, inputStyle, secureTextEntry, onPressOut, disabled, textAlignVertical}) => {
    return (
        <Input 
            placeholder={placeholderText}
            placeholderTextColor='#a3a3a3'
            _focus='transparent'
            backgroundColor='#FFFFFF'
            keyboardType={keyboardType ? keyboardType : 'default'}
            height='45px'
            value={inputValue}
            onChangeText={onChangeText}
            multiline = {multiline ? multiline : false}
            maxLength = {maxLength}
            secureTextEntry={secureTextEntry}
            style={[{fontSize:16, borderColor:'#f1f1f1', fontWeight:'500', borderRadius:10,fontFamily:Font.NotoSansMedium}, inputValue.length> 0 && {backgroundColor:'#f1f1f1'}, inputStyle]}
            onPressOut={onPressOut}
            disabled={disabled}
            textAlignVertical={textAlignVertical ? textAlignVertical : 'center'}
            borderColor='#f1f1f1'
        />
    )
}

export const AddButton = ({onPress}) => {
    return(
        <TouchableOpacity onPress={onPress}>
            <Image source={require('../images/addyellowBtn.png')} alt='추가하기' style={{width:111, height:53, resizeMode:'contain'}} />
            <Box style={{width:111, height:53, position:'absolute', top:0, left:0, justifyContent:'center', paddingLeft:60}}>
                <DefText text='추가' style={{fontSize:20, lineHeight:53,fontFamily:Font.NotoSansMedium, color:'#090A73'}} />
            </Box>
        </TouchableOpacity>
    )
}

export const SaveButton = ({onPress}) => {
    return(
        <TouchableOpacity onPress={onPress} >
            <Image source={require('../images/saveButtonNew.png')} alt='저장' style={{width:111, height:53, resizeMode:'contain'}} />
            <Box style={{width:111, height:53, position:'absolute', top:0, left:0, justifyContent:'center', paddingLeft:60}}>
                <DefText text='저장' style={{fontSize:20, lineHeight:53,fontFamily:Font.NotoSansMedium, color:'#fff'}} />
            </Box>
        </TouchableOpacity>
    )
}