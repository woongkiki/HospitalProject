import React, { useEffect, useState } from 'react';
import { Box, VStack, HStack, Image, Modal, CheckIcon, Input } from 'native-base';
import { TouchableOpacity, ScrollView, StyleSheet, Dimensions, ImageBackground, Text, View, TouchableWithoutFeedback } from 'react-native';
import { DefText, DefInput } from '../common/BOOTSTRAP';
import HeaderMedicine from '../components/HeaderMedicine';
import HeaderComponents from '../components/HeaderComponents';
import {medicineAdd} from '../Utils/DummyData';
import ToastMessage from '../components/ToastMessage';

const {width} = Dimensions.get('window');

const MedicineAdd = (props) => {

    const {navigation} = props;

    const [medicineData, setMedicineData] = useState(medicineAdd);

    const selectMedicine = (medicine) => {
        navigation.navigate('MedicineForm2', medicine);
    }

    const medicineDataList = medicineData.map((item, index)=> {
        return(
            <Box key={index} p={5} backgroundColor='#fff' shadow={6} borderRadius={10} mb={5}>
                <HStack justifyContent='space-between' alignItems='center'>
                    <Image source={require('../images/medicineLIstIcon1.png')} alt='약 아이콘' style={{marginRight:10}} />
                    <Box width={(width-80) * 0.5}>
                        <DefText text={item.medicineName} style={{fontSize:14,color:'#333'}} />
                    </Box>
                    <HStack>
                        <TouchableOpacity onPress={()=>selectMedicine(item.medicineName)} style={[styles.buttons, {marginRight:5}]}>
                            <DefText text='선택' style={[styles.buttonText]} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>navigation.navigate('MedicineView', item)} style={[styles.buttons]}>
                            <DefText text='정보' style={[styles.buttonText]} />
                        </TouchableOpacity>
                    </HStack>
                </HStack>
            </Box>
        )
    });

    const [schText, setSchText] = useState('');
    const schTextChange = (text) => {
        setSchText(text);
    }

    const schButtons = () => {
        if(schText.length==0){
            console.log('검색어를 입력하세요.');
            return false;
        }

        ToastMessage(schText);
    }

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderComponents headerTitle='복약추가' navigation={navigation} />
            <ScrollView>
                <Box p={5}>
                    <Box>
                        <HStack alignItems='center' height='50px' backgroundColor='#F1F1F1' borderRadius={5}>
                            <Input
                                placeholder='질병명으로 검색하세요.'
                                height='45px'
                                width={width-80}
                                backgroundColor='transparent'
                                borderWidth={0}
                                onSubmitEditing={schButtons}
                                value={schText}
                                onChangeText={schTextChange}
                            />
                            <TouchableOpacity >
                                <Image source={require('../images/schIcons.png')} alt='검색' />
                            </TouchableOpacity>
                        </HStack>
                    </Box>
                    <VStack mt={5}>
                        {medicineDataList}
                    </VStack>
                </Box>
            </ScrollView>
        </Box>
    );
};

const styles = StyleSheet.create({
    buttons : {
        height: 30,
        backgroundColor:'#686868',
        borderRadius:5,
        paddingHorizontal:10,
        alignItems:'center',
        justifyContent:'center'
    },
    buttonText: {
        fontSize:14,
        color:'#fff'
    }
})

export default MedicineAdd;