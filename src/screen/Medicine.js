import React, { useEffect, useState } from 'react';
import { Box, VStack, HStack, Image, Modal } from 'native-base';
import { TouchableOpacity, ScrollView, StyleSheet, Dimensions, ImageBackground, Text, View } from 'react-native';
import { DefText } from '../common/BOOTSTRAP';
import HeaderMedicine from '../components/HeaderMedicine';


const {width} = Dimensions.get('window');

const Medicine = (props) => {

    const { navigation } = props;

    const [medicineModal, setMedicineModal] = useState(false);

    const MedicineListButton = () =>{
        navigation.navigate('MedicineList');
    }

    const MedicineFormReplace = async () => {
        await setMedicineModal(false);
        await navigation.navigate('MedicineForm');
    }

    const MedicineFormReplace2 = async () => {
        await setMedicineModal(false);
        await navigation.navigate('MedicineForm2');
    }

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderMedicine navigation={navigation} headerTitle='복약관리' medicineList={MedicineListButton} />
            <ScrollView>
                <Box px={5} py={5}>
                    <HStack height='150px' justifyContent='space-between' px={4} backgroundColor='#F1F1F1' borderRadius='30px' alignItems='center'>
                        <Box>
                            <DefText text='약먹기이야기' style={{fontSize:16, fontWeight:'bold'}} />
                            <DefText text='약을 잘먹으면 큰병을 예방할 수 있습니다.' style={{fontSize:15}} />
                            <TouchableOpacity
                                style={{
                                    width:100,
                                    height:30,
                                    backgroundColor:'#696968',
                                    borderRadius:10,
                                    alignItems:'center',
                                    justifyContent:'center',
                                    marginTop:20
                                }}
                            >
                                <DefText text='알아보기' style={{color:'#fff', fontSize:15}} />
                            </TouchableOpacity>
                        </Box>
                        <Image source={require('../images/checkIcons.png')} alt='복약관리체크' />
                    </HStack>
                    <Box mt={5} backgroundColor='#F1F1F1' borderRadius='30px' height='30px' justifyContent='center' px={4} >
                        <DefText text='복약순응도 (전체) : 88%' style={{fontSize:14,color:'#696968'}} />
                    </Box>
                    <VStack mt={8}>
                        <Box> 
                            <HStack>
                                <Box width='20%' p={2.5} marginRight='15px' alignItems='center'>
                                    <DefText text='8:00 AM' style={{fontSize:12, color:'#77838F'}} />
                                </Box>
                                <Box width='78%'>
                                    <Box p={2.5} backgroundColor='#fff' borderRadius={20} shadow={8} >
                                        <HStack alignItems='center'>
                                            <Image source={require('../images/medicineIcon1.png')} alt='약 복용' />
                                            <Box style={{marginLeft:15}}>
                                                <DefText text='대들보의원 처방약' style={{fontSize:14}} />
                                                <DefText text='2형 당뇨병' style={{fontSize:14, color:'#77838F'}} />
                                            </Box>
                                        </HStack>
                                        
                                    </Box>
                                    <Box p={2.5} backgroundColor='#fff' borderRadius={20} shadow={8} mt={4}>
                                        <HStack alignItems='center'>
                                            <Image source={require('../images/medicineIcon1.png')} alt='약 복용' />
                                            <Box style={{marginLeft:15}}>
                                                <DefText text='대들보의원 처방약' style={{fontSize:14}} />
                                                <DefText text='2형 당뇨병' style={{fontSize:14, color:'#77838F'}} />
                                            </Box>
                                        </HStack>
                                        
                                    </Box>
                                </Box>
                            </HStack>

                            <HStack mt={5} paddingBottom={5}>
                                <Box width='20%' p={2.5} marginRight='15px' alignItems='center'>
                                    <DefText text='12:30 PM' style={{fontSize:12, color:'#77838F'}} />
                                </Box>
                                <Box width='78%'>
                                    <Box p={2.5} backgroundColor='#fff' borderRadius={20} shadow={8} >
                                        <HStack alignItems='center'>
                                            <Image source={require('../images/medicineIcon1.png')} alt='약 복용' />
                                            <Box style={{marginLeft:15}}>
                                                <DefText text='대들보의원 처방약' style={{fontSize:14}} />
                                                <DefText text='2형 당뇨병' style={{fontSize:14, color:'#77838F'}} />
                                            </Box>
                                        </HStack>
                                        
                                    </Box>
                                    <Box p={2.5} backgroundColor='#fff' borderRadius={20} shadow={8} mt={4}>
                                        <HStack alignItems='center'>
                                            <Image source={require('../images/medicineIcon2.png')} alt='약 복용' />
                                            <Box style={{marginLeft:15}}>
                                                <DefText text='항생제' style={{fontSize:14}} />
                                                <DefText text='1 capsule, (50 mg)' style={{fontSize:14, color:'#77838F'}} />
                                            </Box>
                                        </HStack>
                                        
                                    </Box>
                                </Box>
                            </HStack>
                        </Box>
                    </VStack>
                </Box>
            </ScrollView>
            <Box style={{position:'absolute', bottom:20, right:20}}>
                <TouchableOpacity onPress={()=>{setMedicineModal(!medicineModal)}}>
                    <Image source={require('../images/medicinePlus.png')} alt='복약관리 추가' />
                </TouchableOpacity>
            </Box>
            <Modal isOpen={medicineModal} onClose={() => setMedicineModal(false)}>
            
                <Modal.Content maxWidth={width-40}>
                    <Modal.Body>
                        <Text style={{textAlign:'center'}}>
                        조제약과 건강보조식품 중{'\n'}
                        어떤 것을 기록하실 건가요?
                        </Text>
                        <VStack px={10}>
                            <TouchableOpacity style={styles.modalButtons} onPress={MedicineFormReplace2}>
                                <DefText text='조제약(의사 처방이 필요한 약)' style={styles.modalButtonsText} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalButtons} onPress={MedicineFormReplace}>
                                <DefText text='건강보조식품(영양제)' style={styles.modalButtonsText} />
                            </TouchableOpacity>
                        </VStack>
                    </Modal.Body>
                </Modal.Content>
            </Modal>
        </Box>
    );
};

const styles = StyleSheet.create({
    modalButtons : {
        padding:10,
        backgroundColor:'#666',
        borderRadius:10,
        justifyContent:'center',
        alignItems:'center',
        marginTop:10
    },
    modalButtonsText : {
        color:'#fff',
        fontSize:14,
    }
})

export default Medicine;