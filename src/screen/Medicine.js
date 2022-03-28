import React, { useEffect, useState } from 'react';
import { Box, VStack, HStack, Image, Modal, CheckIcon } from 'native-base';
import { TouchableOpacity, ScrollView, StyleSheet, Dimensions, ImageBackground, Text, View, ActivityIndicator } from 'react-native';
import { AddButton, DefText } from '../common/BOOTSTRAP';
import HeaderMedicine from '../components/HeaderMedicine';
import { connect } from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import Api from '../Api';
import { useFocusEffect } from '@react-navigation/native';
import ToastMessage from '../components/ToastMessage';
import Font from '../common/Font';

const {width} = Dimensions.get('window');

const Medicine = (props) => {

    const { navigation, userInfo } = props;

    //console.log(userInfo);


    const [medicineLoading, setMedicineLoading] = useState(false);

    const [medicineModal, setMedicineModal] = useState(false);

    const MedicineListButton = () =>{
        navigation.navigate('MedicineList');
    }

    const MedicineFormReplace = async () => {
        await setMedicineModal(false);
        await navigation.navigate('MedicineForm', {'dateTimeText':'', 'scheduleText':'', 'isMedicineDate':'', 'selectCategory':'', 'selectIdxCategory':''});
    }

    const MedicineFormReplace2 = async () => {
        await setMedicineModal(false);
        await navigation.navigate('MedicineForm2',{'diseaseDatas':'', 'scheduleText':'', 'isMedicineDate':'', 'selectCategory':'', 'medicine':'', 'medicineIdx':''});
    }

    //복약순응동 전체
    const [drugSchedulePercent, setSchedulePercent] = useState('');

    //복약 리스트
    const [drugScheduleData, setDrugScheduleData] = useState('');

    //아침
    const [drugScheduleMoringBefore, setDrugScheduleMorningBefore] = useState([]);
    const [drugScheduleMoringAfter, setDrugScheduleMorningAfter] = useState([]);

    //점심
    const [drugScheduleLunchBefore, setDrugScheduleLunchBefore] = useState([]);
    const [drugScheduleLunchAfter, setDrugScheduleLunchAfter] = useState([]);

    //저녁
    const [drugScheduleDinnerBefore, setDrugScheduleDinnerBefore] = useState([]);
    const [drugScheduleDinnerAfter, setDrugScheduleDinnerAfter] = useState([]);

    //잠들기 전
    const [drugScheduleNightBefore, setDrugScheduleNightBefore] = useState([]);


    //email@email.com
    const drugScheduleHandler = async () => {
        await setMedicineLoading(false);
        await Api.send('drug_percent', {'id':userInfo.id,  'token':userInfo.appToken}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                //console.log('복약 스케줄 정보: ', arrItems);
                setSchedulePercent(arrItems);
                
                console.log(arrItems);
            }else{
                console.log('결과 출력 실패!1', resultItem);
               
            }
        });

        await Api.send('drug_schedule', {'id':userInfo.id,  'token':userInfo.appToken}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                console.log('복약 스케줄 정보: ', arrItems);
                setDrugScheduleData(arrItems);
                
                console.log(arrItems);
            }else{
                console.log('결과 출력 실패!2', resultItem);
               
            }
        });

        await setMedicineLoading(true);
    }
    

    useEffect(()=>{
        drugScheduleHandler();
    }, [])


    useEffect(()=>{
       // setDrugScheduleMorningBefore(drugScheduleData[1]);
       setDrugScheduleMorningBefore(drugScheduleData[1]);
       setDrugScheduleMorningAfter(drugScheduleData[2]);

       setDrugScheduleLunchBefore(drugScheduleData[3]);
       setDrugScheduleLunchAfter(drugScheduleData[4]);

       setDrugScheduleDinnerBefore(drugScheduleData[5]);
       setDrugScheduleDinnerAfter(drugScheduleData[6]);

       setDrugScheduleNightBefore(drugScheduleData[7]);

        
    }, [drugScheduleData])

   useEffect(()=>{
       // console.log(drugSchedulePercent);    
   }, [drugSchedulePercent])


   useFocusEffect(
        React.useCallback(()=>{
            // screen is focused
            drugScheduleHandler();

            return () => {
                // screen is unfocused
                console.log('포커스 nono');
            };
        },[])
    );


    const navigationMove = () => {
        navigation.navigate('Tab_Navigation', {
            screen: 'Community',
            params: 'drug'
        });
    }

    const [medicineCheckModal, setMedicineCheckModal] = useState(false);
    const [checkDatas, setCheckDatas] = useState('');


    const drugDataCheck = (item) => {

        if(item.check){
            ToastMessage('이미 복약체크된 약입니다.');
            return false;
        }
        //console.log('아침식전 데이터', item);
        setCheckDatas(item);
        setMedicineCheckModal(true);
    }


    useEffect(()=>{
        console.log(checkDatas);

        

    }, [checkDatas])


    const medicineCheckSubmit = () => {
        
        Api.send('drug_check', {'id':userInfo.id,  'token':userInfo.appToken, 'sidx':checkDatas.sidx, 'timer':checkDatas.timer}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                console.log('복약 스케줄 정보: ', arrItems);
             
                ToastMessage(resultItem.message);
                setMedicineCheckModal(false);
                drugScheduleHandler();

            }else{
                console.log('결과 출력 실패!', resultItem);
               
            }
        });
        
    }

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderMedicine navigation={navigation} headerTitle='복약관리' medicineList={MedicineListButton} />
            {
                medicineLoading ? 
                <Box flex={1}>
                    {
                        drugScheduleData == '' ?
                        <Box justifyContent='center' alignItems='center' flex={1}>
                            <Image source={require('../images/medicineIconsG.png')} alt={'복약을 관리하세요'} />
                            <DefText text='복약사항을 추가하여 간편하게 관리하세요.' style={{marginTop:20, color:'#696969', fontFamily:Font.NotoSansMediu, fontWeight:'500'}} />
                            {/* <ActivityIndicator size='large' color='#333' /> */}
                        </Box>
                        :
                        <ScrollView>
                            <Box p={5}>
                                <HStack height='141px' justifyContent='space-between' px={4} backgroundColor='#F1F1F1' borderRadius='10px' alignItems='center'>
                                    <Box width={(width * 0.65) + 'px'}>
                                        <DefText text='약먹기이야기' style={{fontSize:16, fontWeight:'bold'}} />
                                        <DefText text='약을 잘먹으면 큰병을 예방할 수 있어요.' style={{fontSize:14, fontFamily:Font.NotoSansDemiLight}} />
                                        <TouchableOpacity
                                            style={{
                                                width:100,
                                                height:30,
                                                backgroundColor:'#090A73',
                                                borderRadius:10,
                                                alignItems:'center',
                                                justifyContent:'center',
                                                marginTop:10
                                            }}
                                            onPress={navigationMove}
                                        >
                                            <DefText text='알아보기' style={{color:'#fff', fontSize:18, lineHeight:30, fontFamily:Font.NotoSansDemiLight}} />
                                        </TouchableOpacity>
                                    </Box>
                                    <Image source={require('../images/medicineIconNew.png')} alt='복약관리체크' style={{width:73, height:73, resizeMode:'contain'}} />
                                </HStack>
                                <Box mt={5} backgroundColor='#F1F1F1' borderRadius='30px' height='30px' justifyContent='center' px={4} >
                                    <DefText text={'복약순응도 (전체) : ' + drugSchedulePercent.percent + '%'} style={{fontSize:14,color:'#000', fontFamily:Font.NotoSansMedium}} />
                                </Box>
                
                                <VStack>
                                    <Box>
                                        {/* 아침 식전 김*/}
                       
                                        {
                                            /* 아침식전 */
                                            drugScheduleMoringBefore &&
                                            <HStack alignItems='center' justifyContent='space-between'>
                                                <Box width='23%' p={2.5} marginRight='15px' alignItems='center'>
                                                    {/* <DefText text='7:30 AM' style={{fontSize:12, color:'#77838F'}} /> */}
                                                </Box>
                                                <Box width='72%' flexWrap='wrap'>
                                                {
                                                    drugScheduleMoringBefore.map((item, index)=>{
                                                        return(
                                                            <TouchableOpacity onPress={()=>drugDataCheck(item)} key={index} activeOpacity={0.9}>
                                                                <Box  px={2.5} backgroundColor='#fff' borderRadius={10} shadow={5} mt={4}>
                                                                    <HStack alignItems='center' flexWrap='wrap' justifyContent='space-between'>
                                                                        <Box>
                                                                            {
                                                                                item.type == 'P' ?
                                                                                <ImageBackground
                                                                                    source={require('../images/mgreenBox.png')}
                                                                                    style={{
                                                                                        width:60,
                                                                                        height:60,
                                                                                        resizeMode:'contain',
                                                                                        justifyContent:'center',
                                                                                        alignItems:'center',
                                                                                        marginLeft:-3,
                                                                                        marginBottom:-2
                                                                                    }}
                                                                                >
                                                                                    <Image source={require('../images/medicinePIcon.png')} alt={item.name} style={{width:24, height:24, resizeMode:'contain', marginLeft:-6, marginTop:-6}} />
                                                                                </ImageBackground>
                                                                                :
                                                                                <ImageBackground
                                                                                    source={require('../images/mgreenBox.png')}
                                                                                    style={{
                                                                                        width:60,
                                                                                        height:60,
                                                                                        resizeMode:'contain',
                                                                                        justifyContent:'center',
                                                                                        alignItems:'center',
                                                                                        marginLeft:-3,
                                                                                        marginBottom:-2
                                                                                    }}
                                                                                >
                                                                                    <Image source={require('../images/medicineNIcon.png')} alt={item.name} style={{width:22, height:22, resizeMode:'contain', marginLeft:-5, marginTop:-5}} />
                                                                                </ImageBackground>
                                                                            }
                                                                        
                                                                        </Box>
                                                                        <Box style={{marginLeft:0, width:'75%'}}>
                                                                            <DefText text={item.name} style={[{fontSize:14, fontFamily:Font.NotoSansMedium}, item.check && {textDecorationLine: 'line-through', textDecorationStyle: 'solid'}]} />
                                                                            <DefText text={item.subinfo} style={[{fontSize:14, color:'#77838F'}, item.check && {textDecorationLine: 'line-through', textDecorationStyle: 'solid'}]} />
                                                                        </Box>
                                                                        
                                                                        {
                                                                            item.check && 
                                                                            <Box position='absolute' right='20px' top='17px' >
                                                                                <CheckIcon color='#000' style={{width:12, height:12}} />
                                                                            </Box>
                                                                        }
                                                                        
                                                                    </HStack>
                                                                </Box>
                                                            </TouchableOpacity>
                                                        )
                                                        })
                                                    }
                                                </Box>
                                            </HStack>
                                        }
                                        {/* 아침 */}
                                        <HStack alignItems='center' justifyContent='space-between' mt={5}>
                                            <Box width='23%' p={2.5} marginRight='15px' alignItems='center'>
                                                <DefText text='7:30 AM' style={{fontSize:12, color:'#77838F'}} />
                                            </Box>
                                            <Box shadow={5} width='72%' backgroundColor={'#fff'} px={2.5} borderRadius={10}>
                                                <HStack  alignItems='center'>
                                                    <ImageBackground
                                                        source={require('../images/mskyBox.png')}
                                                        style={{
                                                            width:60,
                                                            height:60,
                                                            resizeMode:'contain',
                                                            justifyContent:'center',
                                                            alignItems:'center',
                                                            marginLeft:-3,
                                                            marginBottom:-2
                                                        }}
                                                    >
                                                        <Image source={require('../images/medicineEatIcon.png')} alt='아침' style={{width:26, height:26, resizeMode:'contain', marginLeft:-5, marginTop:-5}} />
                                                    </ImageBackground>
                                                    <Box width='75%' pl='5px'>
                                                        <DefText text={drugScheduleData[1.5]} style={{fontSize:14, color:'#000', fontFamily:Font.NotoSansMedium}} />
                                                    </Box>
                                                </HStack>
                                            </Box>
                                        </HStack>
                                        {
                                            /* 아침식후 영 */
                                            drugScheduleMoringAfter &&
                                            <HStack justifyContent='flex-end'>
                                                <Box width='72%'>
                                                {
                                                    drugScheduleMoringAfter.map((item, index)=>{
                                                        return(
                                                            <TouchableOpacity onPress={()=>drugDataCheck(item)} key={index} activeOpacity={0.9}>
                                                                <Box key={index}  px={2.5} backgroundColor='#fff' borderRadius={10} shadow={8} mt={4}>
                                                                    <HStack alignItems='center' justifyContent='space-between'>
                                                                        <Box>
                                                                            {
                                                                                item.type == 'P' ?
                                                                                <ImageBackground
                                                                                    source={require('../images/mgreenBox.png')}
                                                                                    style={{
                                                                                        width:60,
                                                                                        height:60,
                                                                                        resizeMode:'contain',
                                                                                        justifyContent:'center',
                                                                                        alignItems:'center',
                                                                                        marginLeft:-3,
                                                                                        marginBottom:-2
                                                                                    }}
                                                                                >
                                                                                    <Image source={require('../images/medicinePIcon.png')} alt={item.name} style={{width:24, height:24, resizeMode:'contain', marginLeft:-6, marginTop:-6}} />
                                                                                </ImageBackground>
                                                                                :
                                                                                <ImageBackground
                                                                                    source={require('../images/mgreenBox.png')}
                                                                                    style={{
                                                                                        width:60,
                                                                                        height:60,
                                                                                        resizeMode:'contain',
                                                                                        justifyContent:'center',
                                                                                        alignItems:'center',
                                                                                        marginLeft:-3,
                                                                                        marginBottom:-2
                                                                                    }}
                                                                                >
                                                                                    <Image source={require('../images/medicineNIcon.png')} alt={item.name} style={{width:26, height:26, resizeMode:'contain', marginLeft:-5, marginTop:-5}} />
                                                                                </ImageBackground>
                                                                            }
                                                                        
                                                                        </Box>
                                                                        <Box style={{marginLeft:0, width:'75%'}}>
                                                                            <DefText text={item.name} style={[{fontSize:14, fontFamily:Font.NotoSansMedium}, item.check && {textDecorationLine: 'line-through', textDecorationStyle: 'solid'}]} />
                                                                            <DefText text={item.subinfo} style={[{fontSize:14, color:'#77838F'}, item.check && {textDecorationLine: 'line-through', textDecorationStyle: 'solid'}]} />
                                                                        </Box>

                                                                        {
                                                                            item.check && 
                                                                            <Box position='absolute' right='20px' top='17px' >
                                                                                <CheckIcon color='#000' style={{width:12, height:12}} />
                                                                            </Box>
                                                                        }
                                                                    </HStack>
                                                                </Box>
                                                            </TouchableOpacity>
                                                        )
                                                        })
                                                    }
                                                </Box>
                                            </HStack>
                                        }
                                    </Box>
                                    <Box>
                                        {/* 점심 */}
                                        {/* 점심 식전 */}
                                        {
                                            /* 점심 식전 */
                                            drugScheduleLunchBefore &&
                                            <HStack justifyContent='flex-end'>
                                                <Box width='72%'>
                                                {
                                                    drugScheduleLunchBefore.map((item, index)=>{
                                                        return(
                                                            <TouchableOpacity onPress={()=>drugDataCheck(item)} key={index} activeOpacity={0.9}>
                                                                <Box key={index}  px={2.5} backgroundColor='#fff' borderRadius={10} shadow={8} mt={4}>
                                                                    <HStack alignItems='center' justifyContent='space-between'>
                                                                        <Box>
                                                                            {
                                                                                item.type == 'P' ?
                                                                                <ImageBackground
                                                                                    source={require('../images/mgreenBox.png')}
                                                                                    style={{
                                                                                        width:60,
                                                                                        height:60,
                                                                                        resizeMode:'contain',
                                                                                        justifyContent:'center',
                                                                                        alignItems:'center',
                                                                                        marginLeft:-3,
                                                                                        marginBottom:-2
                                                                                    }}
                                                                                >
                                                                                    <Image source={require('../images/medicinePIcon.png')} alt={item.name} style={{width:24, height:24, resizeMode:'contain', marginLeft:-6, marginTop:-6}} />
                                                                                </ImageBackground>
                                                                                :
                                                                                <ImageBackground
                                                                                    source={require('../images/mgreenBox.png')}
                                                                                    style={{
                                                                                        width:60,
                                                                                        height:60,
                                                                                        resizeMode:'contain',
                                                                                        justifyContent:'center',
                                                                                        alignItems:'center',
                                                                                        marginLeft:-3,
                                                                                        marginBottom:-2
                                                                                    }}
                                                                                >
                                                                                    <Image source={require('../images/medicineNIcon.png')} alt={item.name} style={{width:22, height:22, resizeMode:'contain', marginLeft:-5, marginTop:-5}} />
                                                                                </ImageBackground>
                                                                            }
                                                                        
                                                                        </Box>
                                                                        <Box style={{marginLeft:0, width:'75%'}}>
                                                                            <DefText text={item.name} style={[{fontSize:14, fontFamily:Font.NotoSansMedium}, item.check && {textDecorationLine: 'line-through', textDecorationStyle: 'solid'}]} />
                                                                            <DefText text={item.subinfo} style={[{fontSize:14, color:'#77838F'}, item.check && {textDecorationLine: 'line-through', textDecorationStyle: 'solid'}]} />
                                                                        </Box>
                                                                        {
                                                                            item.check && 
                                                                            <Box position='absolute' right='20px' top='17px' >
                                                                                <CheckIcon color='#000' style={{width:12, height:12}} />
                                                                            </Box>
                                                                        }
                                                                    </HStack>
                                                                </Box>
                                                            </TouchableOpacity>
                                                        )
                                                        })
                                                    }
                                                </Box>
                                            </HStack>
                                        }
                                        <HStack alignItems='center' justifyContent='space-between' mt={5}>
                                            <Box width='23%' p={2.5} marginRight='15px' alignItems='center'>
                                                <DefText text='12:30 PM' style={{fontSize:12, color:'#77838F'}} />
                                            </Box>
                                            <Box shadow={5} width='72%' backgroundColor={'#fff'} px={2.5} borderRadius={10}>
                                                <HStack  alignItems='center'>
                                                    <ImageBackground
                                                        source={require('../images/mskyBox.png')}
                                                        style={{
                                                            width:60,
                                                            height:60,
                                                            resizeMode:'contain',
                                                            justifyContent:'center',
                                                            alignItems:'center',
                                                            marginLeft:-3,
                                                            marginBottom:-2
                                                        }}
                                                    >
                                                        <Image source={require('../images/medicineEatIcon.png')} alt='점심' style={{width:26, height:26, resizeMode:'contain', marginLeft:-5, marginTop:-5}} />
                                                    </ImageBackground>
                                                    <Box width='75%' pl='5px'>
                                                        <DefText text={drugScheduleData[3.5]} style={{fontSize:14, color:'#000', fontFamily:Font.NotoSansMedium}} />
                                                    </Box>
                                                </HStack>
                                            </Box>
                                          
                                        </HStack>
                                        {/* 점심 식후 */}
                                        {
                                            /* 점심 식후 */
                                            drugScheduleLunchAfter &&
                                            <HStack justifyContent='flex-end'>
                                                <Box width='72%'>
                                                {
                                                    drugScheduleLunchAfter.map((item, index)=>{
                                                        return(
                                                            <TouchableOpacity onPress={()=>drugDataCheck(item)} key={index} activeOpacity={0.9}>
                                                                <Box key={index}  px={2.5} backgroundColor='#fff' borderRadius={10} shadow={8} mt={4}>
                                                                    <HStack alignItems='center' justifyContent='space-between'>
                                                                        <Box>
                                                                            {
                                                                                item.type == 'P' ?
                                                                                <ImageBackground
                                                                                    source={require('../images/mgreenBox.png')}
                                                                                    style={{
                                                                                        width:60,
                                                                                        height:60,
                                                                                        resizeMode:'contain',
                                                                                        justifyContent:'center',
                                                                                        alignItems:'center',
                                                                                        marginLeft:-3,
                                                                                        marginBottom:-2
                                                                                    }}
                                                                                >
                                                                                    <Image source={require('../images/medicinePIcon.png')} alt={item.name} style={{width:24, height:24, resizeMode:'contain', marginLeft:-6, marginTop:-6}} />
                                                                                </ImageBackground>
                                                                                :
                                                                                <ImageBackground
                                                                                    source={require('../images/mgreenBox.png')}
                                                                                    style={{
                                                                                        width:60,
                                                                                        height:60,
                                                                                        resizeMode:'contain',
                                                                                        justifyContent:'center',
                                                                                        alignItems:'center',
                                                                                        marginLeft:-3,
                                                                                        marginBottom:-2
                                                                                    }}
                                                                                >
                                                                                    <Image source={require('../images/medicineNIcon.png')} alt={item.name} style={{width:22, height:22, resizeMode:'contain', marginLeft:-5, marginTop:-5}} />
                                                                                </ImageBackground>
                                                                            }
                                                                        
                                                                        </Box>
                                                                        <Box style={{marginLeft:0, width:'75%'}}>
                                                                            <DefText text={item.name} style={[{fontSize:14, fontFamily:Font.NotoSansMedium}, item.check && {textDecorationLine: 'line-through', textDecorationStyle: 'solid'}]} />
                                                                            <DefText text={item.subinfo} style={[{fontSize:14, color:'#77838F'}, item.check && {textDecorationLine: 'line-through', textDecorationStyle: 'solid'}]} />
                                                                        </Box>
                                                                        {
                                                                            item.check && 
                                                                            <Box position='absolute' right='20px' top='17px' >
                                                                                <CheckIcon color='#000' style={{width:12, height:12}} />
                                                                            </Box>
                                                                        }
                                                                    </HStack>
                                                                </Box>
                                                            </TouchableOpacity>
                                                        )
                                                        })
                                                    }
                                                </Box>
                                            </HStack>
                                        }
                                    </Box>
                                    <Box>
                                        {/* 저녁 식전 */}
                                        {
                                            /* 저녁 식후 */
                                            drugScheduleDinnerBefore &&
                                            <HStack justifyContent='flex-end'>
                                                <Box width='72%'>
                                                {
                                                    drugScheduleDinnerBefore.map((item, index)=>{
                                                        return(
                                                            <TouchableOpacity onPress={()=>drugDataCheck(item)} key={index} activeOpacity={0.9}>
                                                                <Box key={index}  px={2.5} backgroundColor='#fff' borderRadius={10} shadow={8} mt={4}>
                                                                    <HStack alignItems='center' justifyContent='space-between'>
                                                                        <Box >
                                                                            {
                                                                                item.type == 'P' ?
                                                                                <ImageBackground
                                                                                    source={require('../images/mgreenBox.png')}
                                                                                    style={{
                                                                                        width:60,
                                                                                        height:60,
                                                                                        resizeMode:'contain',
                                                                                        justifyContent:'center',
                                                                                        alignItems:'center',
                                                                                        marginLeft:-3,
                                                                                        marginBottom:-2
                                                                                    }}
                                                                                >
                                                                                    <Image source={require('../images/medicinePIcon.png')} alt={item.name} style={{width:24, height:24, resizeMode:'contain', marginLeft:-6, marginTop:-6}} />
                                                                                </ImageBackground>
                                                                                :
                                                                                <ImageBackground
                                                                                    source={require('../images/mgreenBox.png')}
                                                                                    style={{
                                                                                        width:60,
                                                                                        height:60,
                                                                                        resizeMode:'contain',
                                                                                        justifyContent:'center',
                                                                                        alignItems:'center',
                                                                                        marginLeft:-3,
                                                                                        marginBottom:-2
                                                                                    }}
                                                                                >
                                                                                    <Image source={require('../images/medicineNIcon.png')} alt={item.name} style={{width:22, height:22, resizeMode:'contain', marginLeft:-5, marginTop:-5}} />
                                                                                </ImageBackground>
                                                                            }
                                                                        
                                                                        </Box>
                                                                        <Box style={{marginLeft:0, width:'75%'}}>
                                                                            <DefText text={item.name} style={[{fontSize:14, fontFamily:Font.NotoSansMedium}, item.check && {textDecorationLine: 'line-through', textDecorationStyle: 'solid'}]} />
                                                                            <DefText text={item.subinfo} style={[{fontSize:14, color:'#77838F'}, item.check && {textDecorationLine: 'line-through', textDecorationStyle: 'solid'}]} />
                                                                        </Box>
                                                                        {
                                                                            item.check && 
                                                                            <Box position='absolute' right='20px' top='17px' >
                                                                                <CheckIcon color='#000' style={{width:12, height:12}} />
                                                                            </Box>
                                                                        }
                                                                    </HStack>
                                                                </Box>
                                                            </TouchableOpacity>
                                                        )
                                                        })
                                                    }
                                                </Box>
                                            </HStack>
                                        }
                                        <HStack alignItems='center' justifyContent='space-between' mt={5}>
                                            <Box width='23%' p={2.5} marginRight='15px' alignItems='center'>
                                                <DefText text='6:00 PM' style={{fontSize:12, color:'#77838F'}} />
                                            </Box>
                                            <Box shadow={5} width='72%' backgroundColor={'#fff'} px={2.5} borderRadius={10}>
                                                <HStack  alignItems='center'>
                                                    <ImageBackground
                                                        source={require('../images/mskyBox.png')}
                                                        style={{
                                                            width:60,
                                                            height:60,
                                                            resizeMode:'contain',
                                                            justifyContent:'center',
                                                            alignItems:'center',
                                                            marginLeft:-3,
                                                            marginBottom:-2
                                                        }}
                                                    >
                                                        <Image source={require('../images/medicineEatIcon.png')} alt='저녁' style={{width:26, height:26, resizeMode:'contain', marginLeft:-5, marginTop:-5}} />
                                                    </ImageBackground>
                                                    <Box width='75%' pl='5px'>
                                                        <DefText text={drugScheduleData[5.5]} style={{fontSize:14, color:'#000', fontFamily:Font.NotoSansMedium}} />
                                                    </Box>
                                                </HStack>
                                            </Box>
                                        </HStack>
                                        {
                                            /* 저녁 식후 */
                                            drugScheduleDinnerAfter &&
                                            <HStack justifyContent='flex-end'>
                                                <Box width='72%'>
                                                {
                                                    drugScheduleDinnerAfter.map((item, index)=>{
                                                        return(
                                                            <TouchableOpacity onPress={()=>drugDataCheck(item)} key={index} activeOpacity={0.9}>
                                                                <Box key={index}  px={2.5} backgroundColor='#fff' borderRadius={10} shadow={8} mt={4}>
                                                                    <HStack alignItems='center' justifyContent='space-between'>
                                                                        <Box >
                                                                            {
                                                                                item.type == 'P' ?
                                                                                <ImageBackground
                                                                                    source={require('../images/mgreenBox.png')}
                                                                                    style={{
                                                                                        width:60,
                                                                                        height:60,
                                                                                        resizeMode:'contain',
                                                                                        justifyContent:'center',
                                                                                        alignItems:'center',
                                                                                        marginLeft:-3,
                                                                                        marginBottom:-2
                                                                                    }}
                                                                                >
                                                                                    <Image source={require('../images/medicinePIcon.png')} alt={item.name} style={{width:24, height:24, resizeMode:'contain', marginLeft:-6, marginTop:-6}} />
                                                                                </ImageBackground>
                                                                                :
                                                                                <ImageBackground
                                                                                    source={require('../images/mgreenBox.png')}
                                                                                    style={{
                                                                                        width:60,
                                                                                        height:60,
                                                                                        resizeMode:'contain',
                                                                                        justifyContent:'center',
                                                                                        alignItems:'center',
                                                                                        marginLeft:-3,
                                                                                        marginBottom:-2
                                                                                    }}
                                                                                >
                                                                                    <Image source={require('../images/medicineNIcon.png')} alt={item.name} style={{width:22, height:22, resizeMode:'contain', marginLeft:-5, marginTop:-5}} />
                                                                                </ImageBackground>
                                                                            }
                                                                        
                                                                        </Box>
                                                                        <Box style={{marginLeft:0, width:'75%'}}>
                                                                            <DefText text={item.name} style={[{fontSize:14, fontFamily:Font.NotoSansMedium}, item.check && {textDecorationLine: 'line-through', textDecorationStyle: 'solid'}]} />
                                                                            <DefText text={item.subinfo} style={[{fontSize:14, color:'#77838F'}, item.check && {textDecorationLine: 'line-through', textDecorationStyle: 'solid'}]} />
                                                                        </Box>
                                                                        {
                                                                            item.check && 
                                                                            <Box position='absolute' right='20px' top='17px' >
                                                                                <CheckIcon color='#000' style={{width:12, height:12}} />
                                                                            </Box>
                                                                        }
                                                                    </HStack>
                                                                </Box>
                                                            </TouchableOpacity>
                                                        )
                                                        })
                                                    }
                                                </Box>
                                            </HStack>
                                        }
                                    </Box>
                                    <Box>
                                        {/* 잠들기 전 */}
                                        {
                                            /* 잠들기 전 */
                                            drugScheduleNightBefore &&
                                            <HStack justifyContent='flex-end'>
                                                <Box width='72%'>
                                                {
                                                    drugScheduleNightBefore.map((item, index)=>{
                                                        return(
                                                            <TouchableOpacity onPress={()=>drugDataCheck(item)} key={index} activeOpacity={0.9}>
                                                                <Box key={index}  px={2.5} backgroundColor='#fff' borderRadius={10} shadow={8} mt={4}>
                                                                    <HStack alignItems='center' justifyContent='space-between'>
                                                                        <Box>
                                                                            {
                                                                                item.type == 'P' ?
                                                                                <ImageBackground
                                                                                    source={require('../images/mgreenBox.png')}
                                                                                    style={{
                                                                                        width:60,
                                                                                        height:60,
                                                                                        resizeMode:'contain',
                                                                                        justifyContent:'center',
                                                                                        alignItems:'center',
                                                                                        marginLeft:-3,
                                                                                        marginBottom:-2
                                                                                    }}
                                                                                >
                                                                                    <Image source={require('../images/medicinePIcon.png')} alt={item.name} style={{width:24, height:24, resizeMode:'contain', marginLeft:-6, marginTop:-6}} />
                                                                                </ImageBackground>
                                                                                :
                                                                                <ImageBackground
                                                                                    source={require('../images/mgreenBox.png')}
                                                                                    style={{
                                                                                        width:60,
                                                                                        height:60,
                                                                                        resizeMode:'contain',
                                                                                        justifyContent:'center',
                                                                                        alignItems:'center',
                                                                                        marginLeft:-3,
                                                                                        marginBottom:-2
                                                                                    }}
                                                                                >
                                                                                    <Image source={require('../images/medicineNIcon.png')} alt={item.name} style={{width:22, height:22, resizeMode:'contain', marginLeft:-5, marginTop:-5}} />
                                                                                </ImageBackground>
                                                                            }
                                                                        
                                                                        </Box>
                                                                        <Box style={{marginLeft:0, width:'75%'}}>
                                                                            <DefText text={item.name} style={[{fontSize:14, fontFamily:Font.NotoSansMedium}, item.check && {textDecorationLine: 'line-through', textDecorationStyle: 'solid'}]} />
                                                                            <DefText text={item.subinfo} style={[{fontSize:14, color:'#77838F'}, item.check && {textDecorationLine: 'line-through', textDecorationStyle: 'solid'}]} />
                                                                        </Box>
                                                                        {
                                                                            item.check && 
                                                                            <Box position='absolute' right='20px' top='17px' >
                                                                                <CheckIcon color='#000' style={{width:12, height:12}} />
                                                                            </Box>
                                                                        }
                                                                    </HStack>
                                                                </Box>
                                                            </TouchableOpacity>
                                                        )
                                                        })
                                                    }
                                                </Box>
                                            </HStack>
                                        }
                                       
                                        <HStack alignItems='center' justifyContent='space-between' mt={5} mb='80px'>
                                            <Box width='23%' p={2.5} marginRight='15px' alignItems='center'>
                                                <DefText text='10:00 PM' style={{fontSize:12, color:'#77838F'}} />
                                            </Box>
                                            <Box shadow={5} width='72%' backgroundColor={'#fff'} px={2.5} borderRadius={10}>
                                                <HStack  alignItems='center'>
                                                    <ImageBackground
                                                        source={require('../images/mskyBox.png')}
                                                        style={{
                                                            width:60,
                                                            height:60,
                                                            resizeMode:'contain',
                                                            justifyContent:'center',
                                                            alignItems:'center',
                                                            marginLeft:-3,
                                                            marginBottom:-2
                                                        }}
                                                    >
                                                        <Image source={require('../images/moonIcons.png')} alt='잠들기 전' style={{width:26, height:26, resizeMode:'contain', marginLeft:-5, marginTop:-7}} />
                                                    </ImageBackground>
                                                    <Box width='75%' pl='5px'>
                                                        <DefText text={'잠들기 전'} style={{fontSize:14, color:'#000', fontFamily:Font.NotoSansMedium}} />
                                                    </Box>
                                                </HStack>
                                            </Box>
                                        </HStack>
                                    </Box>
                                </VStack>
                            </Box>
                        </ScrollView>
                    }
                    
                </Box>
                :
                <Box flex={1} alignItems='center' justifyContent='center'>
                    <ActivityIndicator size='large' color='#333' />
                </Box>
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
                        <VStack px={8}>
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

            <Modal isOpen={medicineCheckModal} onClose={() => setMedicineCheckModal(false)}>
            
                <Modal.Content maxWidth={width-40}>
                    <Modal.Body>
                        {
                            checkDatas != '' && 
                            <Box justifyContent='center' alignItems='center' mb={2.5}>
                                <DefText text={checkDatas.time_str + '의 약을 섭취하셨나요?'} />
                            </Box>
                        }
                        <HStack justifyContent='space-between'>
                            <TouchableOpacity style={[styles.modalButtons, {width:(width-80) * 0.45}]} onPress={medicineCheckSubmit}>
                                <DefText text='예' style={styles.modalButtonsText} />
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.modalButtons, {width:(width-80) * 0.45}]} onPress={()=>setMedicineCheckModal(false)}>
                                <DefText text='아니오' style={styles.modalButtonsText} />
                            </TouchableOpacity>
                        </HStack>
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
)(Medicine);