import React, { useEffect, useState } from 'react';
import { Box, VStack, HStack, Image, Modal } from 'native-base';
import { TouchableOpacity, ScrollView, StyleSheet, Dimensions, ImageBackground, Text, View, FlatList, ActivityIndicator } from 'react-native';
import { AddButton, DefText } from '../common/BOOTSTRAP';
import HeaderMedicine from '../components/HeaderMedicine';
import { medicineDatas, medicineDatasType1, medicineDatasType2 } from '../Utils/DummyData';
import { connect } from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import Api from '../Api';
import ToastMessage from '../components/ToastMessage';
import Font from '../common/Font';


const { width, height } = Dimensions.get('window');
const ButtonWidth = width * 0.3 - 5;


const MedicineList = ( props ) => {

    const {navigation, userInfo} = props;

    //console.log('userInfo::::::',userInfo);

    const [medicineLoadings, setmedicineLoadings] = useState(false);

    const [medicineCate, setMedicineCate] = useState('');
    const [medicineModal, setMedicineModal] = useState(false);

    const medicineCateButtons = (category) => {
        setMedicineCate(category);
    }


    const MedicineListButton = () =>{
        navigation.navigate('Medicine');
    }

    const [medicineDataR, setMedicineDataR] = useState(medicineDatas)


    const [drugScheduleDatas, setDrugScheduleDatas] = useState('');

    const drugScheduleHandler2 = async () => {
        await setmedicineLoadings(false);
        await Api.send('drug_schedule2', {'id':userInfo.id,  'token':userInfo.appToken, 'dtype':medicineCate}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                console.log('복약 스케줄 정보: ', arrItems);
                setDrugScheduleDatas(arrItems);
                
                //console.log(arrItems);
            }else{
                console.log('결과 출력 실패!', resultItem);
               
            }
        });
        await setmedicineLoadings(true);
    }


    useEffect(()=>{
        drugScheduleHandler2();
    },[])

    useEffect(()=>{
        drugScheduleHandler2();
    },[medicineCate])

    const _renderItem = ({item, index}) => {

        let days;
        if(item.days == 0){
            days = '매일'
        }else{
            days = item.days + '일';
        }


        return (
            <TouchableOpacity onPress={()=>navigation.navigate('MedicineListView', {'medicineIdx':item.idx})} onLongPress={()=>DeleteIdx(item.idx)} key={index} style={[ {paddingHorizontal:20, marginBottom:20}, index == 0 && {marginTop:10}, index+1 == drugScheduleDatas.length && {marginBottom:100}]}>


                <Box backgroundColor={ item.finished == 'N' ? '#fff' : '#eee'} p={5} px={5} borderRadius='10px' alignItems='center' shadow={8}>
                {
                    item.finished == 'Y' &&
                    <Box position={'absolute'} right={'20px'} top={'20px'}>
                        <DefText text='복약종료' style={{color:'#f00'}} />
                    </Box>
                }
                
                    <HStack alignItems='center' width='100%' flexWrap={'wrap'} justifyContent={'center'}>
                        <Box height='100%' alignItems='flex-start' justifyContent='flex-start' marginRight={2.5}>
                            {
                                item.type == '조제약' ?
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
                        <Box width='60%' marginLeft={2.5} >
                            
                            <DefText text={item.type} style={{fontSize:13, color:'#000'}} />
                            <DefText text={item.name} style={{fontSize:15, color:'#000', fontWeight:'bold'}} />
                            <HStack mt={2.5} flexWrap={'wrap'}>
                                <HStack alignItems='center' mr={2.5}>
                                    <DefText text='복약순응도' style={{fontSize:14, color:'#000', marginRight:5}} />
                                    <DefText text={item.percent + '%'} style={{fontSize:14, color:'#000', fontWeight:'bold'}} />
                                </HStack>
                                <HStack alignItems='center'>
                                    <DefText text='복약기간' style={{fontSize:14, color:'#000', marginRight:5}} />
                                    <DefText text={item.cdate + '일차'} style={{fontSize:14, color:'#000', fontWeight:'bold'}} />
                                </HStack>
                            </HStack>
                            <Text style={{fontSize:14, marginTop:10}}>
                                {item.subinfo}
                            </Text>
                        </Box>
                        {
                            item.dtype != 'P' ?
                            <Image source={{uri:item.upfile}} alt='약 샘플' style={{width:60, height:60}} resizeMode='stretch' />
                            :
                            <Box style={{width:60, height:60}} />
                        }
                        
                    </HStack>
                </Box>

            </TouchableOpacity>
        )
    }

    // const MedicineFormReplace = async () => {
    //     await setMedicineModal(false);
    //     await navigation.navigate('MedicineForm');
    // }

    // const MedicineFormReplace2 = async () => {
    //     await setMedicineModal(false);
    //     await navigation.navigate('MedicineForm2');
    // }

    const MedicineFormReplace = async () => {
        await setMedicineModal(false);
        await navigation.navigate('MedicineForm', {'dateTimeText':'', 'scheduleText':'', 'isMedicineDate':'', 'selectCategory':'', 'selectIdxCategory':''});
    }

    const MedicineFormReplace2 = async () => {
        await setMedicineModal(false);
        await navigation.navigate('MedicineForm2',{'diseaseDatas':'', 'scheduleText':'', 'isMedicineDate':'', 'selectCategory':'', 'medicine':'', 'medicineIdx':''});
    }

    //삭제모달
    const [deleteIdx, setDeleteIdx] = useState('');
    const [deleteModal, setDeleteModal] = useState(false);

    const DeleteIdx = (idx) => {
        setDeleteIdx(idx);
        setDeleteModal(true);
    }

    const DeleteSubmit = () => {
        //console.log('deleteIdx:::', deleteIdx);

        Api.send('drug_delete', {'id':userInfo.id,  'token':userInfo.appToken, idx:deleteIdx}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               // console.log('결과 정보: ', arrItems);
                ToastMessage(resultItem.message);
                setDeleteModal(false);
                drugScheduleHandler2();
            }else{
                console.log('결과 출력 실패!', resultItem);
              // ToastMessage(resultItem.message);
            }
        });
    }

    return (
        <Box flex={1} backgroundColor='#fff' >
            <HeaderMedicine navigation={navigation} headerTitle='복약관리' medicineList={MedicineListButton} />
            <Box px={5} py={3}>
                <HStack
                    alignItems='center'
                    justifyContent='space-between'
                >
                    <TouchableOpacity
                        style={[ styles.medicineButton, medicineCate === '' && {backgroundColor:'#696968'} ]}
                        onPress={()=>medicineCateButtons('')}
                    >
                        <DefText 
                            text='ALL' 
                            style={[{color:'#000', fontFamily:Font.NotoSansMedium, fontWeight:'500'}, medicineCate === '' && {color:'#fff'}]}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[ styles.medicineButton, medicineCate === 'P' && {backgroundColor:'#696968'}] }
                        onPress={()=>medicineCateButtons('P')}
                    >
                        <DefText 
                            text='조제약' 
                            style={[{color:'#000', fontFamily:Font.NotoSansMedium, fontWeight:'500'}, medicineCate === 'P' && {color:'#fff'}]}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.medicineButton, medicineCate === 'N' && {backgroundColor:'#696968'}]}
                        onPress={()=>medicineCateButtons('N')}
                    >
                        <DefText 
                            text='영양제' 
                            style={[{color:'#000', fontFamily:Font.NotoSansMedium, fontWeight:'500'}, medicineCate === 'N' && {color:'#fff'}]}
                        />
                    </TouchableOpacity>
                </HStack>
            </Box>
            
            {
                !medicineLoadings ?
                <Box alignItems='center' justifyContent='center' flex={1}>
                    <ActivityIndicator size='large' color='#000' />
                </Box>
                :
                <FlatList
                    nestedScrollEnabled
                    data={drugScheduleDatas}
                    renderItem={_renderItem}
                    keyExtractor={(item, index)=>index.toString()}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <Box alignItems='center' height={height-200} justifyContent='center'>
                             <Image source={require('../images/medicineIconsG.png')} alt={'복약을 관리하세요'} />
                            <DefText text='복약사항을 추가하여 간편하게 관리하세요.' style={{marginTop:20, color:'#666'}} />
                        </Box>                
                    }
                />
            }

            {/* <Box p={2.5} px={5}>
                <TouchableOpacity onPress={()=>{setMedicineModal(!medicineModal)}} style={[styles.buttonDef]}>
                   <DefText text='복약관리 추가' style={styles.buttonDefText} />
                </TouchableOpacity>
            </Box> */}

            <Box position={'absolute'} right={'30px'} bottom={'30px'}>
                <AddButton onPress={()=>{setMedicineModal(!medicineModal)}} />
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

            <Modal isOpen={deleteModal} onClose={() => setDeleteModal(false)}>
            
                <Modal.Content maxWidth={width-40}>
                    <Modal.Body>
                        <DefText text='복약기록을 삭제하시겠습니까?' style={{textAlign:'center'}}/>
                        <HStack justifyContent='space-between' mt={5}>
                            <TouchableOpacity style={styles.logoutButton} onPress={DeleteSubmit}>
                                <DefText text='확인' style={styles.logoutButtonText} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.logoutButton} onPress={()=>setDeleteModal(false)}>
                                <DefText text='취소' style={styles.logoutButtonText} />
                            </TouchableOpacity>
                        </HStack>
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
    },
    buttonDef:{
        height:40,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#666',
        borderRadius:5
    },
    buttonDefText:{
        fontSize:14,
        color:'#fff'
    },

    logoutButton : {
        height:40,
        width:(width-80) *0.47,
        borderRadius:10,
        backgroundColor:'#696968',
        alignItems:'center',
        justifyContent:'center'
    },
    logoutButtonText: {
        fontSize:15,
        color:'#fff'
    }
})

export default connect(
    ({ User }) => ({
        userInfo: User.userInfo, //회원정보
    }),
    (dispatch) => ({
        member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
        member_info: (user) => dispatch(UserAction.member_info(user)), //회원 정보 조회
        
    })
)(MedicineList);