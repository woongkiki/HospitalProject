import React, { useEffect, useState } from 'react';
import { Box, VStack, HStack, Image, Modal, CheckIcon } from 'native-base';
import { TouchableOpacity, ScrollView, StyleSheet, Dimensions, ImageBackground, Text, View, TouchableWithoutFeedback } from 'react-native';
import { DefText, DefInput } from '../common/BOOTSTRAP';
import HeaderComponents from '../components/HeaderComponents';

const DiseaseSchedule2 = (props) => {

    const {navigation, route} = props;

    console.log(props);

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderComponents headerTitle='복약관리' navigation={navigation} />
            <ScrollView>
                <Box px={5} py={5}>
                    <HStack height='150px' justifyContent='space-between' px={4} backgroundColor='#F1F1F1' borderRadius='30px' alignItems='center'>
                        <Box>
                            <DefText text='복약주기' style={{fontSize:16, fontWeight:'bold'}} />
                            <DefText text='얼만큼 약을 드셔야 하나요?' style={{fontSize:15, marginTop:10}} />
        
                        </Box>
                        <Image source={require('../images/medicineScheduleIcon.png')} alt='복약관리체크' />
                    </HStack>
                </Box>
            </ScrollView>
        </Box>
    );
};

export default DiseaseSchedule2;