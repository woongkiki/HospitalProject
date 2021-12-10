import React, { useEffect, useState } from 'react';
import { Box, VStack, HStack, Image, Modal, CheckIcon, Input } from 'native-base';
import { TouchableOpacity, ScrollView, StyleSheet, Dimensions, ImageBackground, Text, View, TouchableWithoutFeedback, Linking } from 'react-native';
import { DefText, DefInput } from '../common/BOOTSTRAP';
import HeaderMedicine from '../components/HeaderMedicine';
import HeaderComponents from '../components/HeaderComponents';
import {medicineAdd} from '../Utils/DummyData';
import ToastMessage from '../components/ToastMessage';
import { connect } from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import Api from '../Api';

const {width} = Dimensions.get('window');

const MedicineView = (props) => {

    const {navigation, route, userInfo} = props;

    const {params} = route;

    console.log(params);


    const [medicineView, setMedicineView] = useState([]);

    const drugInfos = () => {
        Api.send('drug_info', {'id':userInfo.id,  'token':userInfo.appToken, 'idx':params.idx}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                console.log('복약 상세 정보: ', arrItems);
                //setDrugScheduleData(arrItems);
                setMedicineView(arrItems);
                //console.log(arrItems);
            }else{
                console.log('결과 출력 실패!', resultItem);
               
            }
        });
    }

    useEffect(()=>{
        if(params){
            drugInfos();
        }
    }, [])


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
                        <HStack alignItems='center' justifyContent='space-between'>
                            <HStack alignItems='center' flexWrap='wrap' width='70%'>
                                <Image source={require('../images/medicineLIstIcon1.png')} alt='약 아이콘' style={{marginRight:10}} />
                                <Box  width='75%'>
                                    <DefText text={medicineView.kdcode} style={{fontSize:13, color:'#666'}} />
                                    <DefText text={medicineView.name} style={{fontSize:14,color:'#333', marginTop:5}} />
                                </Box>
                            </HStack>
                            <Image source={require('../images/medicineSample.png')} alt='약 샘플이미지' />
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
                                        <DefText text={medicineView.summary} style={{fontSize:14, color:'#000'}} />
                                    </Box>
                                </Box>
                            </HStack>
                            <HStack alignItems='center'  borderBottomWidth={1} borderBottomColor='#dfdfdf' >
                                <Box  alignItems='center' width={(width-80) * 0.3} >
                                    <DefText text='생김새' style={{fontSize:14, color:'#000', fontWeight:'bold'}} />
                                </Box>
                                <Box px={2.5} borderLeftWidth={1} borderLeftColor='#dfdfdf' width={(width-80) * 0.7}>
                                    <Box py={2.5}>
                                        <DefText text={medicineView.outfit} style={{fontSize:14, color:'#000'}} />
                                    </Box>
                                </Box>
                            </HStack>
                            <HStack alignItems='center'  borderBottomWidth={1} borderBottomColor='#dfdfdf' >
                                <Box  alignItems='center' width={(width-80) * 0.3} >
                                    <DefText text='주성분' style={{fontSize:14, color:'#000', fontWeight:'bold'}} />
                                </Box>
                                <Box px={2.5} borderLeftWidth={1} borderLeftColor='#dfdfdf' width={(width-80) * 0.7}>
                                    <Box py={2.5}>
                                        <DefText text={medicineView.material} style={{fontSize:14, color:'#000'}} />
                                    </Box>
                                </Box>
                            </HStack>
                            <HStack alignItems='center'  borderBottomWidth={1} borderBottomColor='#dfdfdf' >
                                <Box  alignItems='center' width={(width-80) * 0.3} >
                                    <DefText text='첨가제' style={{fontSize:14, color:'#000', fontWeight:'bold'}} />
                                </Box>
                                <Box px={2.5} borderLeftWidth={1} borderLeftColor='#dfdfdf' width={(width-80) * 0.7}>
                                    <Box py={2.5}>
                                        <DefText text={medicineView.ingredient} style={{fontSize:14, color:'#000'}} />
                                    </Box>
                                </Box>
                            </HStack>
                            <HStack alignItems='center'  borderBottomWidth={1} borderBottomColor='#dfdfdf' >
                                <Box  alignItems='center' width={(width-80) * 0.3} >
                                    <DefText text='유효기간' style={{fontSize:14, color:'#000', fontWeight:'bold'}} />
                                </Box>
                                <Box px={2.5} borderLeftWidth={1} borderLeftColor='#dfdfdf' width={(width-80) * 0.7}>
                                    <Box py={2.5}>
                                        <DefText text={medicineView.expire} style={{fontSize:14, color:'#000'}} />
                                    </Box>
                                </Box>
                            </HStack>
                            <HStack alignItems='center'  borderBottomWidth={1} borderBottomColor='#dfdfdf' >
                                <Box  alignItems='center' width={(width-80) * 0.3} >
                                    <DefText text='보관방법' style={{fontSize:14, color:'#000', fontWeight:'bold'}} />
                                </Box>
                                <Box px={2.5} borderLeftWidth={1} borderLeftColor='#dfdfdf' width={(width-80) * 0.7}>
                                    <Box py={2.5}>
                                        <DefText text={medicineView.save} style={{fontSize:14, color:'#000'}} />
                                    </Box>
                                </Box>
                            </HStack>
                            <HStack alignItems='center'  borderBottomWidth={1} borderBottomColor='#dfdfdf' >
                                <Box  alignItems='center' width={(width-80) * 0.3} >
                                    <DefText text='전문/일반' style={{fontSize:14, color:'#000', fontWeight:'bold'}} />
                                </Box>
                                <Box px={2.5} borderLeftWidth={1} borderLeftColor='#dfdfdf' width={(width-80) * 0.7}>
                                    <Box py={2.5}>
                                        <DefText text={medicineView.specialty} style={{fontSize:14, color:'#000'}} />
                                    </Box>
                                </Box>
                            </HStack>
                            <HStack alignItems='center'  borderBottomWidth={1} borderBottomColor='#dfdfdf' >
                                <Box  alignItems='center' width={(width-80) * 0.3} >
                                    <DefText text='총량' style={{fontSize:14, color:'#000', fontWeight:'bold'}} />
                                </Box>
                                <Box px={2.5} borderLeftWidth={1} borderLeftColor='#dfdfdf' width={(width-80) * 0.7}>
                                    <Box py={2.5}>
                                        <DefText text={medicineView.amount} style={{fontSize:14, color:'#000'}} />
                                    </Box>
                                </Box>
                            </HStack>
                            <HStack alignItems='center'  borderBottomWidth={1} borderBottomColor='#dfdfdf' >
                                <Box  alignItems='center' width={(width-80) * 0.3} >
                                    <DefText text='포장단위' style={{fontSize:14, color:'#000', fontWeight:'bold'}} />
                                </Box>
                                <Box px={2.5} borderLeftWidth={1} borderLeftColor='#dfdfdf' width={(width-80) * 0.7}>
                                    <Box py={2.5}>
                                        <DefText text={medicineView.std} style={{fontSize:14, color:'#000'}} />
                                    </Box>
                                </Box>
                            </HStack>
                            <HStack alignItems='center'  borderBottomWidth={1} borderBottomColor='#dfdfdf' >
                                <Box  alignItems='center' width={(width-80) * 0.3} >
                                    <DefText text='업체명' style={{fontSize:14, color:'#000', fontWeight:'bold'}} />
                                </Box>
                                <Box px={2.5} borderLeftWidth={1} borderLeftColor='#dfdfdf' width={(width-80) * 0.7}>
                                    <Box py={2.5}>
                                        <DefText text={medicineView.brand} style={{fontSize:14, color:'#000'}} />
                                    </Box>
                                </Box>
                            </HStack>
                            {
                                medicineView.manual != "" &&
                                <HStack alignItems='center'  borderBottomWidth={1} borderBottomColor='#dfdfdf' >
                                    <Box  alignItems='center' width={(width-80) * 0.3} >
                                        <DefText text='업체명' style={{fontSize:14, color:'#000', fontWeight:'bold'}} />
                                    </Box>
                                    <Box px={2.5} borderLeftWidth={1} borderLeftColor='#dfdfdf' width={(width-80) * 0.7}>
                                        <Box py={2.5}>
                                            <HStack >
                                                <TouchableOpacity onPress={()=>Linking.openURL(medicineView.manual)} style={{height:35, backgroundColor:'#666', paddingHorizontal:10, alignItems:'center', justifyContent:'center', borderRadius:5}}>
                                                    <DefText text='의학품설명서' style={{color:'#fff'}} />
                                                </TouchableOpacity>
                                            </HStack>
                                            {/* <DefText text={medicineView.manual} style={{fontSize:14, color:'#000'}} /> */}
                                        </Box>
                                    </Box>
                                </HStack>
                            }
                        </Box>
                        
                    </Box>
                </Box>
            </ScrollView>
        </Box>
    );
};

export default connect(
    ({ User }) => ({
        userInfo: User.userInfo, //회원정보
    }),
    (dispatch) => ({
        member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
        member_info: (user) => dispatch(UserAction.member_info(user)), //회원 정보 조회
        
    })
)(MedicineView);