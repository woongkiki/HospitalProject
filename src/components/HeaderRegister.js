import React, { useState } from 'react';
import {Box, VStack, HStack, Image} from 'native-base';
import {DefText} from '../common/BOOTSTRAP';
import ToastMessage from './ToastMessage';
import { TouchableOpacity, Dimensions } from 'react-native';
import Font from '../common/Font';

const HeaderRegister = (props) => {

    const {navigation, headerText} = props;

    const { width } = Dimensions.get('window');

    return (
        <Box backgroundColor='#fff'>
            <HStack alignItems='center' justifyContent='space-between' py='15px' px={12} >
                <TouchableOpacity
                    onPress={()=>{ navigation.goBack() }}
                    
                >
                    <Image source={require('../images/headerArr.png')} alt='뒤로가기' />
                </TouchableOpacity>
                <Box>
                    <DefText 
                        text={headerText} 
                        style={{fontSize:20, lineHeight:23,color:'#1E3354', fontWeight:'bold'}} 
                    />
                </Box>
                <Box style={{width:9}}></Box>
            </HStack>
        </Box>
    );
};

export default HeaderRegister;