import React from 'react';
import { Box, VStack, HStack, Image } from 'native-base';
import { TouchableOpacity, ScrollView, StyleSheet, Dimensions, ImageBackground, View } from 'react-native';
import { DefText } from '../common/BOOTSTRAP';
import Font from '../common/Font';

const HeaderFood = ( props ) => {

    const {navigation, headerTitle, diaryButton} = props;

    return (
        <Box height={'50px'} px={5} shadow={5} backgroundColor='#fff'>
            <Box width={'100%'} height={'50px'} alignItems={'center'} justifyContent={'center'}>
                <DefText text={headerTitle} style={{fontSize:20, lineHeight:50, fontFamily:Font.NotoSansMedium, position:'absolute', left:'50%', marginLeft:-40, color:'#696969'}} />
                <TouchableOpacity
                    onPress={()=>{navigation.goBack()}}
                    style={{
                        paddingRight:20,
                        
                        position: 'absolute',
                        height: 50,
                        left: 0,
                        top:0, 
                        alignItems:'center',
                        justifyContent:'center'
                    }}
                >
                    <Image source={require('../images/headerArr.png')} alt='뒤로가기' />
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={diaryButton}
                    style={{
                        
                        position: 'absolute',
                        height: 50,
                        right: 0,
                        top:0,
                        alignItems:'center',
                        justifyContent:'center'
                    }}
                >
                        <Image
                            source={require('../images/headerMenuNew.png')}
                            alt='식단일기'
                            style={{width:29, height:23, resizeMode:'contain'}}
                        />
                    </TouchableOpacity>
            </Box>
        </Box>
    );
};

export default HeaderFood;