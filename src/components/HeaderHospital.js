import React from 'react';
import { Box, VStack, HStack, Image } from 'native-base';
import { TouchableOpacity, ScrollView, StyleSheet, Dimensions, ImageBackground, View } from 'react-native';
import { DefText } from '../common/BOOTSTRAP';

const HeaderHospital = ( props ) => {

    const {navigation, headerTitle} = props;

    return (
        <Box py={2.5} px={5} shadow={5} backgroundColor='#fff'>
            <HStack justifyContent='space-between' alignItems='center'>
                
                <TouchableOpacity
                    onPress={()=>{navigation.goBack()}}
                >
                    <Image source={require('../images/headerArr.png')} alt='뒤로가기' />
                </TouchableOpacity>
                <DefText text={headerTitle} style={{marginRight:10, fontSize:20}} />
                <TouchableOpacity>
                    <Image
                        source={require('../images/appStatusIcon.png')}
                        alt='알림'
                    />
                </TouchableOpacity>
            </HStack>
        </Box>
    );
};

export default HeaderHospital;