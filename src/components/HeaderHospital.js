import React from 'react';
import { Box, VStack, HStack, Image } from 'native-base';
import { TouchableOpacity, ScrollView, StyleSheet, Dimensions, ImageBackground, View } from 'react-native';
import { DefText } from '../common/BOOTSTRAP';
import Font from '../common/Font';

const {width} = Dimensions.get('window');

const HeaderHospital = ( props ) => {

    const {navigation, headerTitle} = props;

    return (
 
        <Box height='50px' px={5} shadow={5} backgroundColor='#fff' justifyContent='center'>
            <DefText text={headerTitle} style={{fontSize:20, lineHeight:50, fontFamily:Font.NotoSansMedium,position:'absolute', width:width, textAlign:'center', color:'#696969'}} />
            <HStack justifyContent='space-between' alignItems='center'>
                <TouchableOpacity
                    onPress={()=>{navigation.goBack()}}
                    style={{paddingRight:20}}
                >
                    <Image source={require('../images/headerArr.png')} alt='뒤로가기' />
                </TouchableOpacity>
                {/* <TouchableOpacity onPress={()=>navigation.navigate('AlarmList')}>
                    <Image
                        source={require('../images/appStatusIcon.png')}
                        alt='알림'
                    />
                </TouchableOpacity> */}
            </HStack>
        </Box>
    );
};

export default HeaderHospital;