import React from 'react';
import { Box, VStack, HStack, Image } from 'native-base';
import { TouchableOpacity, ScrollView, StyleSheet, Dimensions, ImageBackground, View } from 'react-native';
import { DefText } from '../common/BOOTSTRAP';
import Font from '../common/Font';

const HeaderComponents = ( props ) => {

    const {navigation, headerTitle, bloodSugar, listButton} = props;

    return (
        <Box height={'50px'} px={5} shadow={5} backgroundColor='#fff'>
            <HStack >
                
                <Box width='100%' alignItems={'center'} justifyContent={'center'} height='50px' >
                    <DefText text={headerTitle} style={{ fontSize:20, fontFamily:Font.NotoSansMedium, lineHeight:50, color:'#696969'}} />
                </Box>
                <TouchableOpacity
                    onPress={()=>{ navigation.goBack() }}
                    style={{ paddingRight:20, height:50, position:'absolute', left:0, top:0, justifyContent:'center'}}
                >
                    <Image source={require('../images/headerArr.png')} alt='뒤로가기' />
                </TouchableOpacity>
                <Box>
                {
                    listButton &&
                    <TouchableOpacity 
                        onPress={bloodSugar}
                        style={{
                            
                            alignItems:'center',
                            justifyContent:'center',
                            position: 'absolute',
                            right:0,
                            top:0,
                            height: 50
                        }}
                    >
                        <Image
                            source={require('../images/headerMenuNew.png')}
                            alt='식단일기'
                            style={{width:29, height:23, resizeMode:'contain'}}
                        />
                    </TouchableOpacity>
                }
               </Box>

            </HStack>
        </Box>
    );
};

export default HeaderComponents;