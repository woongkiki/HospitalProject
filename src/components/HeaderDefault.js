import React from 'react';
import { Box, VStack, HStack, Image } from 'native-base';
import { TouchableOpacity, ScrollView, StyleSheet, Dimensions, ImageBackground, View } from 'react-native';
import { DefText } from '../common/BOOTSTRAP';

const {width} = Dimensions.get('window');


const HeaderDefault = ( props ) => {

    const {navigation, headerTitle} = props;

    return (
        <Box py={2.5} px={5} shadow={5} backgroundColor='#fff'>
            <HStack justifyContent='space-between' alignItems='center'>

                <Box width={width - 40 + 'px'}  alignItems='center' position='absolute' left={0}>
                <DefText text={headerTitle} style={{fontSize:20, lineHeight:23}} />
                </Box>
                <TouchableOpacity onPress={()=>{navigation.navigate('AlarmList')}}>
                    <Image
                        source={require('../images/appStatusIcon.png')}
                        alt='알림'
                    />
                </TouchableOpacity>
            </HStack>
        </Box>
    );
};

export default HeaderDefault;