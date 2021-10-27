import React from 'react';
import { Box, VStack, HStack, Image } from 'native-base';
import { TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { DefText } from '../common/BOOTSTRAP';

const HeaderMain = ( props ) => {

    const { navigation } = props;

    return (
        <Box py={2.5} px={5} shadow={5} backgroundColor='#fff'>
            <HStack justifyContent='space-between' alignItems='center'>
                <TouchableOpacity 
                    activeOpacity={0.7}
                >
                    <HStack alignItems='center'>
                        <Image 
                            source={require('../images/hospitalLogo.png')} 
                            alt='hospital logo'
                            style={{marginRight:10}}
                        />
                        <DefText text='더 힐링치과 ' style={{marginRight:10}} />
                        {/* <Image 
                            source={require('../images/mainHeadArr.png')}
                            alt='아래로 내리기'
                            
                        /> */}
                    </HStack>
                </TouchableOpacity>
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

export default HeaderMain;