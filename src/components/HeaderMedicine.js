import React from 'react';
import { Box, VStack, HStack, Image } from 'native-base';
import { TouchableOpacity, ScrollView, StyleSheet, Dimensions, ImageBackground, View } from 'react-native';
import { DefText } from '../common/BOOTSTRAP';

const HeaderMedicine = ( props ) => {

    const {navigation, headerTitle, medicineList} = props;

    return (
        <Box py={2.5} px={5} shadow={5} backgroundColor='#fff'>
            <HStack justifyContent='space-between' alignItems='center'>
                
                <TouchableOpacity
                    onPress={()=>{navigation.goBack()}}
                >
                    <Image source={require('../images/headerArr.png')} alt='뒤로가기' />
                </TouchableOpacity>
                <DefText text={headerTitle} style={{fontSize:20, lineHeight:23,position:'absolute', left:'50%', marginLeft:-40}} />
                <HStack alignItems='center'>
                    {/* <TouchableOpacity>
                        <Image
                            source={require('../images/reportIcons.png')}
                            alt='리포트'
                            style={{
                                marginRight:10
                            }}
                        />
                    </TouchableOpacity> */}
                    <TouchableOpacity
                        onPress={medicineList}
                    >
                        <Image
                            source={require('../images/reportIcons2.png')}
                            alt='리포트'
                        />
                    </TouchableOpacity>
                </HStack>
            </HStack>
        </Box>
    );
};

export default HeaderMedicine;