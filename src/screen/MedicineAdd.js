import React, { useEffect, useState } from 'react';
import { Box, VStack, HStack, Image, Modal, CheckIcon, Input } from 'native-base';
import { TouchableOpacity, ScrollView, StyleSheet, Dimensions, ImageBackground, Text, View, ActivityIndicator } from 'react-native';
import { DefText, DefInput } from '../common/BOOTSTRAP';
import HeaderMedicine from '../components/HeaderMedicine';
import HeaderComponents from '../components/HeaderComponents';
import {medicineAdd} from '../Utils/DummyData';
import ToastMessage from '../components/ToastMessage';
import { connect } from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import Api from '../Api';

const {width} = Dimensions.get('window');

const MedicineAdd = (props) => {

    const {navigation, userInfo, route} = props;

    const { params } = route;

    //console.log(userInfo);
    console.log(params);

    const selectMedicine = (medicine, medicineIdx) => {


        if(params.medicine.includes(medicine)){
            ToastMessage('이미 선택한 약품입니다.');
            return false;
        }

        navigation.navigate('MedicineForm2', {'dateTimeText':params.dateTimeText, 'scheduleText':params.scheduleText, 'isMedicineDate':params.isMedicineDate, 'selectCategory':params.selectCategory,'selectIdxCategory':params.selectIdxCategory,'medicine':medicine, 'medicineIdx':medicineIdx});
    }

    const [schText, setSchText] = useState('');
    const schTextChange = (text) => {
        setSchText(text);
    }

    const [disaseLoading, setDisaseLoading] = useState(false);
    const [disaseSchResult, setDisaseSchResult] = useState([]);

    const schButtons = async () => {
        if(schText.length==0){
            console.log('검색어를 입력하세요.');
            return false;
        }

        //ToastMessage(schText);
        //콜레라
        await setDisaseLoading(false);

        await Api.send('drug_list', {'id':userInfo.id,  'token':userInfo.appToken, 'schText':schText}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                //console.log('복약 스케줄 정보: ', arrItems);
                //setDrugScheduleData(arrItems);
                setDisaseSchResult(arrItems);
                //console.log(arrItems);
            }else{
                console.log('결과 출력 실패!', resultItem);
               
            }
        });

        await setDisaseLoading(true);
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
                            <TouchableOpacity onPress={schButtons} >
                                <Image source={require('../images/schIcons.png')} alt='검색' />
                            </TouchableOpacity>
                        </HStack>
                    </Box>
                    <VStack mt={5}>
                        {
                            disaseSchResult.length > 0 ?
                            disaseLoading ?
                                disaseSchResult.map((item, index)=> {
                                    return(
                                        <Box key={index} p={5} backgroundColor='#fff' shadow={6} borderRadius={10} mb={5}>
                                            <HStack justifyContent='space-between' alignItems='center'>
                                                <Image source={require('../images/medicineLIstIcon1.png')} alt='약 아이콘' style={{marginRight:10}} />
                                                <Box width={(width-80) * 0.5}>
                                                    <DefText text={item.name} style={{fontSize:14,color:'#333'}} />
                                                </Box>
                                                <HStack>
                                                    <TouchableOpacity onPress={()=>selectMedicine(item.name, item.idx)} style={[styles.buttons, {marginRight:5}]}>
                                                        <DefText text='선택' style={[styles.buttonText]} />
                                                    </TouchableOpacity>
                                                    <TouchableOpacity onPress={()=>navigation.navigate('MedicineView', item)} style={[styles.buttons]}>
                                                        <DefText text='정보' style={[styles.buttonText]} />
                                                    </TouchableOpacity>
                                                </HStack>
                                            </HStack>
                                        </Box>
                                    )
                                })
                                :
                                <Box alignItems='center' justifyContent='center' height='300px'>
                                    <ActivityIndicator size='large' color='#000' />
                                </Box>
                            :
                            <Box py={5} justifyContent='space-between' alignItems='center'>
                                <DefText text='복약정보가 없습니다.' style={{color:'#666'}} />
                            </Box>
                        }
                        
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

export default connect(
    ({ User }) => ({
        userInfo: User.userInfo, //회원정보
    }),
    (dispatch) => ({
        member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
        member_info: (user) => dispatch(UserAction.member_info(user)), //회원 정보 조회
        
    })
)(MedicineAdd);