import React from 'react';
import { Box, VStack, HStack, Image } from 'native-base';
import { TouchableOpacity, ScrollView, StyleSheet, Dimensions, ImageBackground, View } from 'react-native';
import { DefText } from '../common/BOOTSTRAP';

const {width} = Dimensions.get('window');

const HeaderCommunity = ( props ) => {

    const {navigation, headerTitle, goScreen} = props;

    return (
        <Box height='45px' px={5} shadow={5} backgroundColor='#fff' justifyContent='center'>
            <DefText text={headerTitle} style={{fontSize:20, lineHeight:23,position:'absolute', width:width, textAlign:'center'}} />
            <HStack justifyContent='space-between' alignItems='center'>
                <TouchableOpacity
                    onPress={()=>{navigation.goBack()}}
                >
                    <Image source={require('../images/headerArr.png')} alt='뒤로가기' />
                </TouchableOpacity>
                <TouchableOpacity onPress={goScreen}>
                    <Image
                        source={require('../images/communityHeadButton.png')}
                        alt='커뮤니티'
                    />
                </TouchableOpacity>
            </HStack>
        </Box>
    );
};

export default HeaderCommunity;