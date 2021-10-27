import React, {useState, useEffect} from 'react';
import { TouchableOpacity, Dimensions, Text, ScrollView, StyleSheet, FlatList } from 'react-native';
import { Box, Image, HStack, VStack, Input, Modal } from 'native-base';
import { DefText } from '../common/BOOTSTRAP';
import HeaderComponents from '../components/HeaderComponents';
import {diseaseDatas1, diseaseDatas2} from '../Utils/DummyData';
import ToastMessage from '../components/ToastMessage';
import { StackActions } from '@react-navigation/native';

const {width} = Dimensions.get('window');

const MyDiseaseReport = (props) => {

    const {navigation} = props;

    const [selectDisease, setSelectDisease] = useState('');

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

    const diseaseDataList1 = diseaseDatas1.map((item, index)=>{
        return(
            <TouchableOpacity key={index} style={[styles.disButton, selectDisease === item.diseaseName && {backgroundColor:'#666'} ]} onPress={()=>diseaseSelectButton(item.diseaseName)}>
                <DefText text={item.diseaseName} style={[styles.disText, selectDisease === item.diseaseName && {color:'#fff'}]} />
            </TouchableOpacity>
        )
    })

    const diseaseSelectButton = (buttonText) => {
        setSelectDisease(buttonText)
    }
 
    const diseaseSave = () => {

        if(selectDisease.length==0){
            ToastMessage('질환명을 선택하거나 입력하세요.');
            return false;
        }
        
        navigation.navigate('HealthReport', {'selectDisease':selectDisease})
        
           // navigation.replace('HealthReport', selectDisease);
    }

    const [diseaseModal, setDiseaseModal] = useState(false);
    const [diseaseInput, setDiseaseInput] = useState('');
    const diseaseChange = (text) => {
        setDiseaseInput(text);
    }

    const diseaseInputSubmit = () => {
        if(diseaseInput.length==0){
            ToastMessage('질환명을 입력하세요.');
        }

        setSelectDisease(diseaseInput);
        setDiseaseModal(false);
        setDiseaseInput('');
    }

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderComponents navigation={navigation} headerTitle='질환기록' />
            <ScrollView>
                <Box p={5}>
                    <Box>
                        <DefText text='선택한 질환' />
                        {
                            selectDisease == '' ?
                            <Box py={5} alignItems='center' justifyContent='center'>
                                <DefText text='선택된 질환이 없습니다.' style={{fontSize:14,color:'#666'}} />
                            </Box>
                            :
                            <HStack>
                                <Box style={[styles.disButton, {backgroundColor:'#666'} ]}>
                                    <DefText text={selectDisease} style={[styles.disText, {color:'#fff'}]} />
                                </Box>
                            </HStack>
                          
                        }
                        
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
                            <DefText text='연령대 별 다빈도 질환' />
                            <DefText text='만35세 기준' style={{fontSize:13,color:'#999', marginLeft:10}} />
                        </HStack>
                        
                        <HStack flexWrap='wrap'>
                        {
                            diseaseDataList1.length>0 && 
                            diseaseDataList1
                        }
                        </HStack>
                    </Box>
                    <TouchableOpacity onPress={()=>setDiseaseModal(true)} style={[styles.inputEnters]}>
                        <DefText text='기타질환을 직접 입력해주세요.' />
                    </TouchableOpacity>
                </Box>
            </ScrollView>
            <Box p={2.5}>
                <TouchableOpacity onPress={diseaseSave} style={styles.medicineButtons}>
                    <DefText text='저장' style={styles.medicineButtonsText} />
                </TouchableOpacity>
            </Box>

            <Modal isOpen={diseaseModal} onClose={() => setDiseaseModal(false)}>
            
                <Modal.Content maxWidth={width-40}>
                    <Modal.Body>
                        <DefText text='직접 입력' style={{textAlign:'center'}}/>
                        <Input
                            _focus='transparent'
                            height={46}
                            backgroundColor='#fff'
                            placeholder='기타질환을 직접 입력하세요.'
                            mt={3}
                            value={diseaseInput}
                            onChangeText={diseaseChange}
                        />
                        <HStack justifyContent='space-between' mt={2.5}>
                            <TouchableOpacity style={styles.folderAddButtons} onPress={diseaseInputSubmit}>
                                <DefText text='확인' style={styles.folderButtonText} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.folderAddButtons} onPress={()=>setDiseaseModal(false)}>
                                <DefText text='취소' style={styles.folderButtonText} />
                            </TouchableOpacity>
                        </HStack>
                    </Modal.Body>
                </Modal.Content>
            </Modal>
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
        
    },
    inputEnters:{
        height:35,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#70A86E',
        borderRadius:10,
        marginTop:20
    },
    folderAddButtons : {
        height:45,
        width:(width-80) *0.47,
        borderRadius:10,
        backgroundColor:'#696968',
        alignItems:'center',
        justifyContent:'center'
    },
    folderButtonText: {
        fontSize:15,
        color:'#fff'
    }
})

export default MyDiseaseReport;