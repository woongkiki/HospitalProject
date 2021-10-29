import React, { useEffect, useState } from 'react';
import { Box, VStack, HStack, Image, Modal, CheckIcon, Input } from 'native-base';
import { TouchableOpacity, ScrollView, StyleSheet, Dimensions, ImageBackground, Text, View, TouchableWithoutFeedback } from 'react-native';
import { DefText, DefInput } from '../common/BOOTSTRAP';
import HeaderMedicine from '../components/HeaderMedicine';
import HeaderComponents from '../components/HeaderComponents';
import ToastMessage from '../components/ToastMessage';
import {diseaseDatas1, diseaseDatas2} from '../Utils/DummyData';

const {width} = Dimensions.get('window');

const DiseaseSelect = (props) => {

    const {navigation, route} = props;
    
    console.log(route);

    const [schText, setSchText] = useState('');

    const schTextChange = (text) => {
        setSchText(text);
    }

    const schButtons = () => {
        if(schText.length==0){
            console.log('검색어를 입력하세요.');
            return false;
        }r

        ToastMessage(schText);
    }

    const diseaseSelectButton = (buttonText) => {
        setSchText(buttonText)
    }

    const diseaseDatasSave = () => {
        navigation.navigate('MedicineForm2', {diseaseDatas:schText, isMedicineDate:route.params.isMedicineDate, scheduleText:route.params.scheduleText, selectCategory:route.params.selectCategory});
    }

    const diseaseDataList1 = diseaseDatas1.map((item, index)=>{
        return(
            <TouchableOpacity key={index} style={[styles.disButton, schText === item.diseaseName && {backgroundColor:'#666'} ]} onPress={()=>diseaseSelectButton(item.diseaseName)}>
                <DefText text={item.diseaseName} style={[styles.disText, schText === item.diseaseName && {color:'#fff'}]} />
            </TouchableOpacity>
        )
    })

    const diseaseDataList2 = diseaseDatas2.map((item, index)=>{
        return(
            <TouchableOpacity key={index} style={[styles.disButton, schText === item.diseaseName && {backgroundColor:'#666'}]} onPress={()=>diseaseSelectButton(item.diseaseName)}>
                <DefText text={item.diseaseName} style={[styles.disText, schText === item.diseaseName && {color:'#fff'}]} />
            </TouchableOpacity>
        )
    })

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderComponents headerTitle='복약관리' navigation={navigation} />
            <ScrollView>
                <Box p={5}>
                    <Box>
                        <DefText text='선택한 질환' />
                        <HStack mt={2.5}>
                            <Box py={1} px={4} backgroundColor='#696968' borderRadius={4}>
                                <DefText text='2형 당뇨병' style={{fontSize:14, color:'#fff'}} />
                            </Box>
                        </HStack>
                    </Box>
                    <Box mt={5}>
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
                            <TouchableOpacity onPress={schButtons}>
                                <Image source={require('../images/schIcons.png')} alt='검색' />
                            </TouchableOpacity>
                        </HStack>
                    </Box>
                    <Box mt={5}>
                        <HStack alignItems='flex-end'>
                            <DefText text='연령별 주요질환' />
                            <DefText text='만65세 기준' style={{fontSize:13,color:'#999', marginLeft:10}} />
                        </HStack>
                        
                        <HStack flexWrap='wrap'>
                        {
                            diseaseDataList1.length>0 && 
                            diseaseDataList1
                        }
                        </HStack>
                    </Box>
                    <Box mt={5}>
                        <HStack alignItems='flex-end'>
                            <DefText text='유행성 주요질환' />
                           
                        </HStack>
                        
                        <HStack flexWrap='wrap'>
                        {
                            diseaseDataList2.length>0 && 
                            diseaseDataList2
                        }
                        </HStack>
                    </Box>
                </Box>
            </ScrollView>
            <Box p={2.5}>
                <TouchableOpacity onPress={diseaseDatasSave} style={styles.medicineButtons}>
                    <DefText text='저장' style={styles.medicineButtonsText} />
                </TouchableOpacity>
            </Box>
        </Box>
    );
};

const styles = StyleSheet.create({
    disButton: {
        paddingVertical:5,
        paddingHorizontal:10,
        borderRadius:10,
        height:30,
        backgroundColor:'#f1f1f1',
        marginRight:10,
        marginTop:10
    },
    disText: {
        fontSize:14,
        color:'#333',
        fontWeight:'bold'
    },
    medicineButtons : {
        backgroundColor:'#999',
        borderRadius:5,
        alignItems:'center',
        justifyContent:'center',
        height: 40,
    },
    medicineButtonsText: {
        fontSize:15,
        color:'#fff',
        
    }
})

export default DiseaseSelect;