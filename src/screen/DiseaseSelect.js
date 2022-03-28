import React, { useEffect, useState } from 'react';
import { Box, VStack, HStack, Image, Modal, CheckIcon, Input } from 'native-base';
import { TouchableOpacity, ScrollView, StyleSheet, Dimensions, ImageBackground, Text, View, TouchableWithoutFeedback } from 'react-native';
import { DefText, DefInput } from '../common/BOOTSTRAP';
import HeaderMedicine from '../components/HeaderMedicine';
import HeaderComponents from '../components/HeaderComponents';
import ToastMessage from '../components/ToastMessage';
import {diseaseDatas1, diseaseDatas2} from '../Utils/DummyData';
import { connect } from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import Api from '../Api';


const {width} = Dimensions.get('window');

const DiseaseSelect = (props) => {

    const {navigation, route, userInfo} = props;

    const {params} = route;

    console.log(params);
    
    //console.log(userInfo);
    const [schTextInput, setSchTextInput] = useState('');
    const [schText, setSchText] = useState('');

    const schTextChange = (text) => {
        setSchTextInput(text);
    }

    const [schDisLoading, setSchDisLoading] = useState(false);
    const [schDisData, setSchDisData] = useState([]);

    const schButtons = async () => {
        if(schTextInput.length==0){
            ToastMessage('검색어를 입력하세요.');
            return false;
        }

        await setSchDisLoading(false);
        await Api.send('disease_list', {'id':userInfo.id,  'token':userInfo.appToken, 'schText':schTextInput}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                //console.log('복약 스케줄 정보: ', resultItem);
                console.log('123::', arrItems);
                setSchDisData(arrItems);
                //setReserveList(arrItems)
            }else{
                //console.log('결과 출력 실패!', resultItem);
                ToastMessage(resultItem.message);
            }
        });
        await setSchDisLoading(true);
        //ToastMessage(schText);
    }

    const diseaseSelectButton = (buttonText) => {
        setSchText(buttonText)
    }

    const diseaseDatasSave = () => {
        navigation.navigate('MedicineForm2', {'diseaseDatas':schText, 'scheduleText':params.scheduleText, 'isMedicineDate':params.isMedicineDate, 'selectCategory':params.selectCategory, 'medicine':params.medicine});
    }

    //콜레라
    const [diseaseData, setDiseaseData] = useState('');

    const [diseaseAge, setDiseaseAge] = useState('');

    const diseaseAgeHandler = () => {
        Api.send('disease_age', {'id':userInfo.id,  'token':userInfo.appToken}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                //console.log('복약 스케줄 정보: ', resultItem);
                console.log(arrItems.disease);
                setDiseaseData(arrItems.disease);
                setDiseaseAge(arrItems.age);
                //setReserveList(arrItems)
            }else{
                //console.log('결과 출력 실패!', resultItem);
                ToastMessage(resultItem.message);
            }
        });
    }


    useEffect(()=>{
        diseaseAgeHandler();
    },[])

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderComponents headerTitle='복약관리' navigation={navigation} />
            <ScrollView>
                <Box p={5}>
                    <Box>
                        <DefText text='선택한 질환' />
                        {
                            schText ?
                            <HStack mt={2.5}>
                                <Box py={1} px={4} backgroundColor='#696968' borderRadius={4}>
                                    <DefText text={schText} style={{fontSize:14, color:'#fff'}} />
                                    
                                </Box>
                            </HStack>
                            :
                            <DefText text='질환을 선택하세요.' style={{fontSize:14, color:'#666', marginTop:10}} />
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
                                value={schTextInput}
                                onChangeText={schTextChange}
                            />
                            <TouchableOpacity onPress={schButtons}>
                                <Image source={require('../images/schIcons.png')} alt='검색' />
                            </TouchableOpacity>
                        </HStack>
                    </Box>
                    {   //콜레라
                        schDisData.length > 0 && 
                        <Box mt={5}>
                            <HStack alignItems='flex-end'>
                                <DefText text={schTextInput + '의 질병 검색결과'}/>
                            </HStack>
                            <HStack flexWrap='wrap'>
                                {
                                    schDisData.map((item, index)=>{
                                        return(
                                            <TouchableOpacity key={index} style={[styles.disButton, schText === item.name && {backgroundColor:'#666'} ]} onPress={()=>diseaseSelectButton(item.name)}>
                                                <DefText text={item.name} style={[styles.disText, schText === item.name && {color:'#fff'}]} />
                                            </TouchableOpacity>
                                        )
                                    })
                                }
                            </HStack>
                        </Box>
                    }
                    <Box>
                    </Box>
                    <Box mt={5}>
                        <HStack alignItems='flex-end'>
                            <DefText text='연령별 주요질환' />
                            <DefText text={diseaseAge + '대 기준'} style={{fontSize:13,color:'#999', marginLeft:10}} />
                        </HStack>
                        
                        <HStack flexWrap='wrap'>
                        {
                            diseaseData.length>0 && 
                            diseaseData.map((item, index)=>{
                                return (
                                    <TouchableOpacity key={index} style={[styles.disButton, schText === item.name && {backgroundColor:'#666'} ]} onPress={()=>diseaseSelectButton(item.name)}>
                                        <DefText text={item.name} style={[styles.disText, schText === item.name && {color:'#fff'}]} />
                                    </TouchableOpacity>
                                )
                            })
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
        marginRight:5,
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

export default connect(
    ({ User }) => ({
        userInfo: User.userInfo, //회원정보
    }),
    (dispatch) => ({
        member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
        member_info: (user) => dispatch(UserAction.member_info(user)), //회원 정보 조회
        
    })
)(DiseaseSelect);