import React, { useEffect, useState } from 'react';
import { Box, VStack, HStack, Image, Modal, CheckIcon, Input } from 'native-base';
import { TouchableOpacity, ScrollView, StyleSheet, Dimensions, ImageBackground, Text, View, TouchableWithoutFeedback } from 'react-native';
import { DefText, DefInput } from '../common/BOOTSTRAP';
import HeaderMedicine from '../components/HeaderMedicine';
import HeaderComponents from '../components/HeaderComponents';
import {medicineAdd} from '../Utils/DummyData';
import ToastMessage from '../components/ToastMessage';

const {width} = Dimensions.get('window');

const MedicineView = (props) => {

    const {navigation, route} = props;

    const {params} = route;

    console.log(params)


    const tableThList = ['기본정보', '생김새', '주성분', '첨가제', '유효기간', '보관방법', '전문/일반', '총량', '포장단위', '업체명'];

    const tabletdList = [params.medicineInfo, params.medicineLook, params.medicineIngredient, params.medicineAdditive, params.medicineTerm, params.medicineKeep, params.medicineType, params.medicineSize,  params.medicineKeepType, params.medicineCompany]

    const tableThs = tableThList.map((table, index)=> {
        return(
            <Box key={index} py={2.5} alignItems='center'>
                <DefText text={table} style={{fontSize:14, color:'#000'}} />
            </Box>
        )
    })


    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderComponents headerTitle='의약품정보' navigation={navigation} />
            <ScrollView>
                <Box p={5}>
                    <Box p={5} py={2.5} backgroundColor='#fff' shadow={6} borderRadius={10} mb={5}>
                        <HStack justifyContent='space-between' alignItems='center'>
                            <Image source={require('../images/medicineLIstIcon1.png')} alt='약 아이콘' style={{marginRight:10}} />
                            <Box width={(width-80) * 0.5}>
                                <DefText text={params.medicineName} style={{fontSize:14,color:'#333'}} />
                            </Box>
                            <Image source={{uri:params.medicineImg}} alt={params.medicineName} style={{width:70, height:70, resizeMode:'contain'}} />
                        </HStack>
                    </Box>
                    
                    <Box p={5} backgroundColor='#fff' shadow={6} borderRadius={10} mb={5}>
                        <DefText text='의약품 정보' style={{fontSize:15, color:'#000', fontWeight:'bold'}} />
                        <Box mt={2.5}>
                            <HStack alignItems='center'  borderBottomWidth={1} borderBottomColor='#dfdfdf'>
                                <Box  alignItems='center' py={2.5} width={(width-80) * 0.3} >
                                    <DefText text='기본설명' style={{fontSize:14, color:'#000', fontWeight:'bold'}} />
                                </Box>
                                <Box px={2.5} borderLeftWidth={1} borderLeftColor='#dfdfdf' width={(width-80) * 0.7}>
                                    <Box py={2.5}>
                                        <DefText text={params.medicineInfo} style={{fontSize:14, color:'#000'}} />
                                    </Box>
                                </Box>
                            </HStack>
                            <HStack alignItems='center'  borderBottomWidth={1} borderBottomColor='#dfdfdf' >
                                <Box  alignItems='center' width={(width-80) * 0.3} >
                                    <DefText text='생김새' style={{fontSize:14, color:'#000', fontWeight:'bold'}} />
                                </Box>
                                <Box px={2.5} borderLeftWidth={1} borderLeftColor='#dfdfdf' width={(width-80) * 0.7}>
                                    <Box py={2.5}>
                                        <DefText text={params.medicineLook} style={{fontSize:14, color:'#000'}} />
                                    </Box>
                                </Box>
                            </HStack>
                            <HStack alignItems='center'  borderBottomWidth={1} borderBottomColor='#dfdfdf' >
                                <Box  alignItems='center' width={(width-80) * 0.3} >
                                    <DefText text='주성분' style={{fontSize:14, color:'#000', fontWeight:'bold'}} />
                                </Box>
                                <Box px={2.5} borderLeftWidth={1} borderLeftColor='#dfdfdf' width={(width-80) * 0.7}>
                                    <Box py={2.5}>
                                        <DefText text={params.medicineIngredient} style={{fontSize:14, color:'#000'}} />
                                    </Box>
                                </Box>
                            </HStack>
                            <HStack alignItems='center'  borderBottomWidth={1} borderBottomColor='#dfdfdf' >
                                <Box  alignItems='center' width={(width-80) * 0.3} >
                                    <DefText text='첨가제' style={{fontSize:14, color:'#000', fontWeight:'bold'}} />
                                </Box>
                                <Box px={2.5} borderLeftWidth={1} borderLeftColor='#dfdfdf' width={(width-80) * 0.7}>
                                    <Box py={2.5}>
                                        <DefText text={params.medicineAdditive} style={{fontSize:14, color:'#000'}} />
                                    </Box>
                                </Box>
                            </HStack>
                            <HStack alignItems='center'  borderBottomWidth={1} borderBottomColor='#dfdfdf' >
                                <Box  alignItems='center' width={(width-80) * 0.3} >
                                    <DefText text='유효기간' style={{fontSize:14, color:'#000', fontWeight:'bold'}} />
                                </Box>
                                <Box px={2.5} borderLeftWidth={1} borderLeftColor='#dfdfdf' width={(width-80) * 0.7}>
                                    <Box py={2.5}>
                                        <DefText text={params.medicineTerm} style={{fontSize:14, color:'#000'}} />
                                    </Box>
                                </Box>
                            </HStack>
                            <HStack alignItems='center'  borderBottomWidth={1} borderBottomColor='#dfdfdf' >
                                <Box  alignItems='center' width={(width-80) * 0.3} >
                                    <DefText text='보관방법' style={{fontSize:14, color:'#000', fontWeight:'bold'}} />
                                </Box>
                                <Box px={2.5} borderLeftWidth={1} borderLeftColor='#dfdfdf' width={(width-80) * 0.7}>
                                    <Box py={2.5}>
                                        <DefText text={params.medicineKeep} style={{fontSize:14, color:'#000'}} />
                                    </Box>
                                </Box>
                            </HStack>
                            <HStack alignItems='center'  borderBottomWidth={1} borderBottomColor='#dfdfdf' >
                                <Box  alignItems='center' width={(width-80) * 0.3} >
                                    <DefText text='전문/일반' style={{fontSize:14, color:'#000', fontWeight:'bold'}} />
                                </Box>
                                <Box px={2.5} borderLeftWidth={1} borderLeftColor='#dfdfdf' width={(width-80) * 0.7}>
                                    <Box py={2.5}>
                                        <DefText text={params.medicineType} style={{fontSize:14, color:'#000'}} />
                                    </Box>
                                </Box>
                            </HStack>
                            <HStack alignItems='center'  borderBottomWidth={1} borderBottomColor='#dfdfdf' >
                                <Box  alignItems='center' width={(width-80) * 0.3} >
                                    <DefText text='총량' style={{fontSize:14, color:'#000', fontWeight:'bold'}} />
                                </Box>
                                <Box px={2.5} borderLeftWidth={1} borderLeftColor='#dfdfdf' width={(width-80) * 0.7}>
                                    <Box py={2.5}>
                                        <DefText text={params.medicineSize} style={{fontSize:14, color:'#000'}} />
                                    </Box>
                                </Box>
                            </HStack>
                            <HStack alignItems='center'  borderBottomWidth={1} borderBottomColor='#dfdfdf' >
                                <Box  alignItems='center' width={(width-80) * 0.3} >
                                    <DefText text='포장단위' style={{fontSize:14, color:'#000', fontWeight:'bold'}} />
                                </Box>
                                <Box px={2.5} borderLeftWidth={1} borderLeftColor='#dfdfdf' width={(width-80) * 0.7}>
                                    <Box py={2.5}>
                                        <DefText text={params.medicineKeepType} style={{fontSize:14, color:'#000'}} />
                                    </Box>
                                </Box>
                            </HStack>
                            <HStack alignItems='center'  borderBottomWidth={1} borderBottomColor='#dfdfdf' >
                                <Box  alignItems='center' width={(width-80) * 0.3} >
                                    <DefText text='업체명' style={{fontSize:14, color:'#000', fontWeight:'bold'}} />
                                </Box>
                                <Box px={2.5} borderLeftWidth={1} borderLeftColor='#dfdfdf' width={(width-80) * 0.7}>
                                    <Box py={2.5}>
                                        <DefText text={params.medicineCompany} style={{fontSize:14, color:'#000'}} />
                                    </Box>
                                </Box>
                            </HStack>
                        </Box>
                        
                    </Box>
                </Box>
            </ScrollView>
        </Box>
    );
};

export default MedicineView;