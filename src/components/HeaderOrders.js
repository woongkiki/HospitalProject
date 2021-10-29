import React from 'react';
import { Box, VStack, HStack, Image } from 'native-base';
import { TouchableOpacity, ScrollView, StyleSheet, Dimensions, ImageBackground, View } from 'react-native';
import { DefText } from '../common/BOOTSTRAP';

const HeaderOrders = (props) => {

    const {navigation, headerTitle} = props;

    return (
        <Box py={2.5} px={5} shadow={5} backgroundColor='#fff'>
            <HStack justifyContent='space-between' alignItems='center'>
                <Box></Box>
                <DefText text={headerTitle} style={{ fontSize:20}} />
                <Box></Box>
            </HStack>
        </Box>
    );
};

export default HeaderOrders;