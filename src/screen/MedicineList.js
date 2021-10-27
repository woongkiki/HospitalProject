import React, { useEffect, useState } from 'react';
import { Box, VStack, HStack, Image, Modal } from 'native-base';
import { TouchableOpacity, ScrollView, StyleSheet, Dimensions, ImageBackground, Text, View, FlatList } from 'react-native';
import { DefText } from '../common/BOOTSTRAP';
import HeaderMedicine from '../components/HeaderMedicine';
import { medicineDatas, medicineDatasType1, medicineDatasType2 } from '../Utils/DummyData';

const { width } = Dimensions.get('window');
const ButtonWidth = width * 0.3 - 5;

const MedicineList = ( props ) => {

    const {navigation} = props;

    const [medicineCate, setMedicineCate] = useState('ALL');
    const [medicineModal, setMedicineModal] = useState(false);

    const medicineCateButtons = (category) => {
        setMedicineCate(category);
        if(category=='ALL'){
            setMedicineDataR(medicineDatas);
        }else if(category=='조제약'){
            setMedicineDataR(medicineDatasType1);
        }else if(category=='영양제'){
            setMedicineDataR(medicineDatasType2);
        }
    }


    const MedicineListButton = () =>{
        navigation.navigate('Medicine');
    }

    const [medicineDataR, setMedicineDataR] = useState(medicineDatas)

    const _renderItem = ({item, index}) => {

        
        return (
            <TouchableOpacity key={index} style={[ {paddingHorizontal:20, marginBottom:20}]}>
                <Box backgroundColor='#fff' p={5} borderRadius='10px' alignItems='center'>
                    <HStack alignItems='center'>
                        <Box height='100%' alignItems='flex-start' justifyContent='flex-start' marginRight={2.5}>
                            {
                                item.category == '조제약' ?
                                <Image
                                    source={require('../images/medicineLIstIcon1.png')} 
                                    alt='조제약 아이콘'
                                    
                                />
                                :
                                <Image
                                    source={require('../images/medicineLIstIcon2.png')} 
                                    alt='조제약 아이콘'
                                    
                                />
                            }
                            
                        </Box>
                        <Box  width='70%'>
                            
                            <DefText text={item.category} style={{fontSize:13, color:'#000'}} />
                            <DefText text='2형 당뇨병' style={{fontSize:15, color:'#000', fontWeight:'bold'}} />
                            <HStack mt={2.5}>
                                <HStack alignItems='center' mr={2.5}>
                                    <DefText text='복약순응도' style={{fontSize:14, color:'#000', marginRight:10}} />
                                    <DefText text={item.percent} style={{fontSize:15, color:'#000', fontWeight:'bold'}} />
                                </HStack>
                                <HStack alignItems='center'>
                                    <DefText text='복약기간' style={{fontSize:14, color:'#000', marginRight:10}} />
                                    <DefText text={item.dates + '일차'} style={{fontSize:15, color:'#000', fontWeight:'bold'}} />
                                </HStack>
                            </HStack>
                            <Text style={{fontSize:14, marginTop:10}}>
                                {item.message}
                            </Text>
                        </Box>
                        <Image source={{uri:item.medicineImg}} alt='약 샘플' style={{width:70, height:70}} resizeMode='contain' />
                    </HStack>
                </Box>
            </TouchableOpacity>
        )
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
        <Box flex={1} backgroundColor='#f1f1f1' >
            <HeaderMedicine navigation={navigation} headerTitle='복약관리' medicineList={MedicineListButton} />
            <Box px={5} py={3}>
                <HStack
                    alignItems='center'
                    justifyContent='space-between'
                >
                    <TouchableOpacity
                        style={[ styles.medicineButton, medicineCate === 'ALL' && {backgroundColor:'#696968'} ]}
                        onPress={()=>medicineCateButtons('ALL')}
                    >
                        <DefText 
                            text='ALL' 
                            style={{color:'#fff'}}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[ styles.medicineButton, medicineCate === '조제약' && {backgroundColor:'#696968'}] }
                        onPress={()=>medicineCateButtons('조제약')}
                    >
                        <DefText 
                            text='조제약' 
                            style={{color:'#fff'}}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.medicineButton, medicineCate === '영양제' && {backgroundColor:'#696968'}]}
                        onPress={()=>medicineCateButtons('영양제')}
                    >
                        <DefText 
                            text='영양제' 
                            style={{color:'#fff'}}
                        />
                    </TouchableOpacity>
                </HStack>
            </Box>
            
            <FlatList
                nestedScrollEnabled
                data={medicineDataR}
                renderItem={_renderItem}
                keyExtractor={(item, index)=>index.toString()}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <Box py={10} alignItems='center'>
                        <DefText text='등록된 복약정보가 없습니다.' style={{color:'#666'}} />
                    </Box>                
                }
            />
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
    medicineButton : {
        width:ButtonWidth,
        height:30,
        backgroundColor:'#DBDBDB',
        alignItems:'center',
        justifyContent:'center',
        borderRadius:5,
    },
    medicineButtonText: {
        fontSize:12,
        color:'#fff'
    },
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


export default MedicineList;