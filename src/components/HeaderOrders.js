import React from 'react';
import { Box, VStack, HStack, Image } from 'native-base';
import { TouchableOpacity, ScrollView, StyleSheet, Dimensions, ImageBackground, View } from 'react-native';
import { DefText } from '../common/BOOTSTRAP';
import Font from '../common/Font';

const HeaderOrders = (props) => {

    const {navigation, headerTitle} = props;

    return (
        <Box height={'50px'} px={5} shadow={5} backgroundColor='#fff'>
            <HStack justifyContent='space-between' alignItems='center' height={'50px'}>
                <Box></Box>
                <DefText text={headerTitle} style={{ fontSize:20, lineHeight:50, fontFamily:Font.NotoSansMedium, color:'#696969'}} />
                <Box></Box>
            </HStack>
        </Box>
    );
};

export default HeaderOrders;