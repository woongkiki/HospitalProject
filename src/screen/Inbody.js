import React, {useState, useEffect} from 'react';
import { Box, VStack, HStack, Image } from 'native-base';
import { TouchableOpacity, Dimensions, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import {AddButton, DefInput, DefText} from '../common/BOOTSTRAP';
import HeaderComponents from '../components/HeaderComponents';
import LinearGradient from 'react-native-linear-gradient';
import { StackActions } from '@react-navigation/native';
import { connect } from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import Api from '../Api';
import AsyncStorage from '@react-native-community/async-storage';
import ToastMessage from '../components/ToastMessage';
import { useFocusEffect } from '@react-navigation/native';
import Font from '../common/Font';

const {width} = Dimensions.get('window');

const Inbody = (props) => {

    const {navigation, userInfo} = props;

   //console.log(userInfo);

    const fatDis = 25.5;
    //const fatpercent = 18;
    const fatSto = 0.7;

    const fatStoSum = fatSto * 10;

    const navigationMove = () => {
        navigation.navigate('Tab_Navigation', {
            screen: 'Community',
            params: 'inbody'
        });
    }


    const [inbodyLoading, setInbodyLoading] = useState(true);

    const [allInbody, setAllInbody] = useState('');

    //체중정보
    const [weight, setWeight] = useState('');
    //골격근량
    const [muscle, setMuscle] = useState('');
    //체지방
    const [fatKg, setFatKg] = useState('');

    //비만 동반질환 위험도
    const [bmiAlert, setBmiAlert] = useState('');
    //유형분석
    const [bodyStatus, setBodyStatus] = useState('');    

    //bmi 수치
    const [bmiData, setBmiData] = useState('0');
    //체지방률
    const [fatPercent, setFatPercent] = useState('');
    //복부지방수치
    const [adbFat, setAdbfat] = useState('');

    const BodyProfileReceive = async () => {
        await setInbodyLoading(true);
        
        await Api.send('bodyProfile_info', {'id':userInfo.id,  'token':userInfo.appToken}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {

                console.log('내 바디프로필 정보::::::: ', arrItems);

                setAllInbody(arrItems);

                setWeight(arrItems.weight);
                setMuscle(arrItems.muscle);
                setFatKg(arrItems.fat_kg);
                
                setBmiAlert(arrItems.fat_alert);
                setBodyStatus(arrItems.body_category);
                setFatPercent(arrItems.fat_per)
                setBmiData(arrItems.bmi);
                setAdbfat(arrItems.adb_fat)
               // ToastMessage(resultItem.message);
               
            }else{
                
                console.log(resultItem);
                //ToastMessage(resultItem.message);
            }
        });

        await setInbodyLoading(false);
    }

    // useEffect(()=>{
    //     console.log('복부지방수치::::::::',adbFat);
    // }, [adbFat])

    useEffect(()=>{
        BodyProfileReceive();
    }, [])


    useFocusEffect(
        React.useCallback(()=>{
            // screen is focused
            BodyProfileReceive();

            return () => {
                // screen is unfocused
                console.log('포커스 nono');
            };
        },[])
    );

    const InbodySubmit = () => {
        navigation.navigate('InbodyList');
    }

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderComponents headerTitle='체성분' navigation={navigation} listButton={true} bloodSugar={InbodySubmit} />
            {
                !inbodyLoading ?
                <>
                    {
                        allInbody != '' ? 
                        <ScrollView >
                            <Box p={5}>
                                <HStack height='140px' justifyContent='space-between' px={4} backgroundColor='#F1F1F1' borderRadius='10px' alignItems='center'>
                                    <Box width={(width * 0.65) + 'px'}>
                                        <DefText text='체성분 이야기' style={{fontSize:16, fontWeight:'500', fontFamily:Font.NotoSansMedium}} />
                                        <DefText text='중요한 건강지표 "체성분"에 관해' style={{fontSize:14, fontFamily:Font.NotoSansDemiLight}} />
                                        <DefText text='알아보세요.' style={{fontSize:14, fontFamily:Font.NotoSansDemiLight}} />

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
                                    <Image source={require('../images/inbodyTopImage.png')} style={{width:71, height:71, resizeMode:'contain'}} alt='체크이미지' />
                                </HStack>
                                <Box mt={5}>
                                    {/* <DefText text='식습관 통계' style={[styles.reportLabel, {marginBottom:10}]} /> */}
                                    <DefText text='비만 동반질환 위험도' style={[styles.graphText, {marginBottom:10, color:'#696968', fontFamily:Font.NotoSansMedium}]} />
                                    <Box p={5}  backgroundColor='#f1f1f1' borderRadius={10}>
                                        {
                                            bmiAlert != '' &&
                                            <DefText text={bmiAlert[1]} style={[styles.graphText, {marginBottom:10}]} />
                                        }
                                        <Box>
                                            <LinearGradient height={23} start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['rgba(234,68,22, 0.03)', 'rgba(234,68,22, 0.51)', '#EA4416']} style={[{borderRadius:5, marginTop:10}]}>
                                                
                                            </LinearGradient>
                                            <Box style={[{position:'absolute', bottom:15, left:fatDis+'%'}, bmiAlert != '' && {left:(bmiAlert[0]*10)+'%'}]}>
                                                <Image source={require('../images/markerNew.png')} alt='수치' style={{width:30, height:30, resizeMode:'contain'}} />
                                            </Box> 
                                        </Box>
                                    </Box>
                                </Box>
                                
                                <DefText text='유형분석' style={[styles.graphText, {marginBottom:10, marginTop:20, color:'#696968'}]} />
                                <Box p={5} backgroundColor='#f1f1f1' borderRadius={10}>
                                    {
                                        bodyStatus != '' &&
                                        <>
                                            <DefText text={bodyStatus.category} style={[styles.graphText]}  />
                                            <DefText text={bodyStatus.subinfo} style={[styles.graphText, {marginTop:10}]}  />
                                        </>
                                    }
                                    {/* <DefText text='근육이 발달한 단단한 건강체질입니다.' style={{fontSize:14, marginTop:10 }} /> */}
                                    <VStack mt={2.5}>
                                        <HStack py={2.5} borderBottomWidth={1} borderBottomColor='#999'>
                                            <Box width={(width-80)*0.4}></Box>
                                            <Box width={(width-80)*0.2}>
                                                <DefText text='이하' style={[styles.tableThText]} />
                                            </Box>
                                            <Box width={(width-80)*0.2}>
                                                <DefText text='표준' style={[styles.tableThText]} />
                                            </Box>
                                            <Box width={(width-80)*0.2}>
                                                <DefText text='표준이상' style={[styles.tableThText]} />
                                            </Box>
                                        </HStack>
                                        <HStack alignItems='center' py={2.5} borderBottomWidth={1} borderBottomColor='#999' >
                                            <Box width={(width-80)*0.2}>
                                                <DefText text='체중' style={[styles.tableTdText]} />
                                            </Box>
                                            <Box width={(width-80)*0.2}>
                                                {
                                                    weight != '' ?
                                                    <DefText text={weight+'kg'} style={[styles.graphText, {fontSize:14}]}  />
                                                    :
                                                    <DefText text='-' />
                                                }
                                            </Box>
                                            {
                                                bodyStatus != '' &&
                                                <Box width={(width-80)*0.6}  pl={2.5}>
                                                    {
                                                        bodyStatus.weight_score == 0 &&
                                                        <Box width={ '30%' } height='20px' backgroundColor='#696968' /> 
                                                    }
                                                    {
                                                        bodyStatus.weight_score == 1 &&
                                                        <Box width={ '50%' } height='20px' backgroundColor='#696968' /> 
                                                    }
                                                    {
                                                        bodyStatus.weight_score == 2 &&
                                                        <Box width={ '90%' } height='20px' backgroundColor='#696968' /> 
                                                    }
                                                </Box>
                                            }
                                        </HStack>
                                        <HStack alignItems='center' py={2.5} borderBottomWidth={1} borderBottomColor='#999'>
                                            <Box width={(width-80)*0.2}>
                                                <DefText text='골격근량' style={[styles.tableTdText]} />
                                            </Box>
                                            <Box width={(width-80)*0.2}>
                                                {
                                                    muscle != '' ?
                                                    <DefText text={muscle + 'kg'} style={[styles.graphText, {fontSize:14}]} />
                                                    :
                                                    <DefText text='-' />
                                                }
                                            </Box>
                                            {
                                                bodyStatus != '' &&
                                                <Box width={(width-80)*0.6}  pl={2.5}>
                                                    {
                                                        bodyStatus.muscle_score == 0 &&
                                                        <Box width={ '30%' } height='20px' backgroundColor='#696968' /> 
                                                    }
                                                    {
                                                        bodyStatus.muscle_score == 1 &&
                                                        <Box width={ '50%' } height='20px' backgroundColor='#696968' /> 
                                                    }
                                                    {
                                                        bodyStatus.muscle_score == 2 &&
                                                        <Box width={ '90%' } height='20px' backgroundColor='#696968' /> 
                                                    }
                                                </Box>
                                            }
                                        </HStack>
                                        <HStack alignItems='center' py={2.5} borderBottomWidth={1} borderBottomColor='#999'>
                                            <Box width={(width-80)*0.2}>
                                                <DefText text='체지방량' style={[styles.tableTdText]} />
                                            </Box>
                                            <Box width={(width-80)*0.2}>
                                                {
                                                    fatKg != '' ?
                                                    <DefText text={fatKg +'kg'} style={[styles.graphText, {fontSize:14}]}  />
                                                    :
                                                    <DefText text='-' />
                                                }
                                            </Box>
                                            {
                                                bodyStatus != '' &&
                                                <Box width={(width-80)*0.6}  pl={2.5}>
                                                    {
                                                        bodyStatus.fat_score == 1 &&
                                                        <Box width={ '30%' } height='20px' backgroundColor='#696968' /> 
                                                    }
                                                    {
                                                        bodyStatus.fat_score == 2 &&
                                                        <Box width={ '50%' } height='20px' backgroundColor='#696968' /> 
                                                    }
                                                    {
                                                        bodyStatus.fat_score == 3 &&
                                                        <Box width={ '90%' } height='20px' backgroundColor='#696968' /> 
                                                    }
                                                </Box>
                                            }
                                        </HStack>
                                    </VStack>
                                </Box>
                                {/* <Box  mt={5} p={5} backgroundColor='#f1f1f1' borderRadius={10}>
                                    <HStack justifyContent='space-between' alignItems='center'>
                                        <DefText text='체중' style={[styles.graphText]}  />
                                        {
                                            weight != '' ?
                                            <DefText text={weight+'kg'} style={[styles.graphText, {fontSize:18}]}  />
                                            :
                                            <DefText text='-' />
                                        }
                                        
                                    </HStack>
                                    <HStack justifyContent='space-between' alignItems='center' mt={2.5}>
                                        <DefText text='골격근량' style={[styles.graphText]}  />
                                        {
                                            muscle != '' ?
                                            <DefText text={muscle + 'kg'} style={[styles.graphText, {fontSize:18}]} />
                                            :
                                            <DefText text='-' />
                                        }
                                    </HStack>
                                    <HStack justifyContent='space-between' alignItems='center' mt={2.5}>
                                        <DefText text='체지방량' style={[styles.graphText]}  />
                                        {
                                            fatKg != '' ?
                                            <DefText text={fatKg +'kg'} style={[styles.graphText, {fontSize:18}]}  />
                                            :
                                            <DefText text='-' />
                                        }
                                    
                                    </HStack>
                                </Box> */}
                                <Box  mt={5} p={5} backgroundColor='#f1f1f1' borderRadius={10} mb='80px'>
                                    <Box>
                                        <HStack justifyContent='space-between' alignItems='center'>
                                            <DefText text='BMI' style={[styles.graphText]}  />
                                            {
                                                bmiData != '0' &&
                                                <DefText text={bmiData[0]} style={[styles.graphText, {fontSize:18}]}  />
                                            }
                                            
                                        </HStack>
                                        <HStack justifyContent='space-between' mt={'20px'}>
                                            <Box style={[styles.graphBox, {backgroundColor:'#E5E587'}]}>
                                                <DefText text='저체중' style={styles.graphBoxText} />
                                            </Box>
                                            <Box style={[styles.graphBox, {backgroundColor:'#11FF00'}]}>
                                                <DefText text='정상' style={styles.graphBoxText} />
                                            </Box>
                                            <Box style={[styles.graphBox, {backgroundColor:'#FFA7A7'}]}>
                                                <DefText text='비만전' style={styles.graphBoxText} />
                                            </Box>
                                            <Box style={[styles.graphBox, {backgroundColor:'#FF8686'}]}>
                                                <DefText text='1단계' style={styles.graphBoxText} />
                                            </Box>
                                            <Box style={[styles.graphBox, {backgroundColor:'#FF5656'}]}>
                                                <DefText text='2단계' style={styles.graphBoxText} />
                                            </Box>
                                            <Box style={[styles.graphBox, {backgroundColor:'#FF0000'}]}>
                                                <DefText text='3단계' style={styles.graphBoxText} />
                                            </Box>
                                            {
                                                bmiData != '0' &&
                                                <>
                                                    {
                                                        bmiData[1] == 1 &&
                                                        <Box style={[{position:'absolute', bottom:20, left: '4%'}]}>
                                                            <Image source={require('../images/markerNew.png')} alt='수치' style={{width:30, height:30, resizeMode:'contain'}} />
                                                        </Box> 
                                                    }
                                                    {
                                                        bmiData[1] == 2 &&
                                                        <Box style={[{position:'absolute', bottom:20, left: '20%'}]}>
                                                            <Image source={require('../images/markerNew.png')} alt='수치' style={{width:30, height:30, resizeMode:'contain'}} />
                                                        </Box> 
                                                    }
                                                    {
                                                        bmiData[1] == 3 &&
                                                        <Box style={[{position:'absolute', bottom:20, left: '37%'}]}>
                                                            <Image source={require('../images/markerNew.png')} alt='수치' style={{width:30, height:30, resizeMode:'contain'}} />
                                                        </Box> 
                                                    }
                                                    {
                                                        bmiData[1] == 4 &&
                                                        <Box style={[{position:'absolute', bottom:20, left: '53%'}]}>
                                                            <Image source={require('../images/markerNew.png')} alt='수치' style={{width:30, height:30, resizeMode:'contain'}} />
                                                        </Box> 
                                                    }
                                                    {
                                                        bmiData[1] == 5 &&
                                                        <Box style={[{position:'absolute', bottom:20, left: '70%'}]}>
                                                            <Image source={require('../images/markerNew.png')} alt='수치' style={{width:30, height:30, resizeMode:'contain'}} />
                                                        </Box> 
                                                    }
                                                    {
                                                        bmiData[1] == 6 &&
                                                        <Box style={[{position:'absolute', bottom:20, left: '87%'}]}>
                                                            <Image source={require('../images/markerNew.png')} alt='수치' style={{width:30, height:30, resizeMode:'contain'}} />
                                                        </Box> 
                                                    }
                                                </>
                                            }
                                            
                                        </HStack>
                                    </Box>   
                                    <Box mt={5}>
                                        <HStack justifyContent='space-between' alignItems='center'>
                                            <DefText text='체지방률' style={[styles.graphText]}  />
                                            {
                                                fatPercent != '' &&
                                                <DefText text={fatPercent[0] + '%'} style={[styles.graphText, {fontSize:18}]}  />
                                            }
                                        </HStack>
                                        <HStack justifyContent='space-between' mt={'20px'}>
                                            <Box style={[styles.graphBox, styles.graphBoxFive, {backgroundColor:'#E5E587'}]}>
                                                <DefText text='저체중' style={styles.graphBoxText} />
                                            </Box>
                                            <Box style={[styles.graphBox, styles.graphBoxFive, {backgroundColor:'#11FF00'}]}>
                                                <DefText text='정상' style={styles.graphBoxText} />
                                            </Box>
                                            <Box style={[styles.graphBox, styles.graphBoxFive, {backgroundColor:'#FFA7A7'}]}>
                                                <DefText text='경비만' style={styles.graphBoxText} />
                                            </Box>
                                            <Box style={[styles.graphBox, styles.graphBoxFive, {backgroundColor:'#FF8686'}]}>
                                                <DefText text='중비만' style={styles.graphBoxText} />
                                            </Box>
                                            <Box style={[styles.graphBox, styles.graphBoxFive, {backgroundColor:'#FF5656'}]}>
                                                <DefText text='과비만' style={styles.graphBoxText} />
                                            </Box>
                                            {
                                                fatPercent != '' && userInfo.sex =='M' &&
                                                <>
                                                {
                                                    fatPercent[0] < 17.1 &&
                                                    <Box style={[{position:'absolute', bottom:20, left:'6%'}]}>
                                                        <Image source={require('../images/markerNew.png')} alt='수치' style={{width:30, height:30, resizeMode:'contain'}} />
                                                    </Box> 
                                                }
                                                {
                                                    fatPercent[0] >= 17.1 && fatPercent[0] < 23 &&
                                                    <Box style={[{position:'absolute', bottom:20, left:'25%'}]}>
                                                        <Image source={require('../images/markerNew.png')} alt='수치' style={{width:30, height:30, resizeMode:'contain'}} />
                                                    </Box> 
                                                }
                                                {
                                                    fatPercent[0] >= 23 && fatPercent[0] < 28 &&
                                                    <Box style={[{position:'absolute', bottom:20, left:'45%'}]}>
                                                        <Image source={require('../images/markerNew.png')} alt='수치' style={{width:30, height:30, resizeMode:'contain'}} />
                                                    </Box> 
                                                }
                                                {
                                                    fatPercent[0] >= 28 && fatPercent[0] < 38 &&
                                                    <Box style={[{position:'absolute', bottom:20, left:'65%'}]}>
                                                        <Image source={require('../images/markerNew.png')} alt='수치' style={{width:30, height:30, resizeMode:'contain'}} />
                                                    </Box> 
                                                }
                                                {
                                                    fatPercent[0] >= 38 &&
                                                    <Box style={[{position:'absolute', bottom:20, left:'85%'}]}>
                                                        <Image source={require('../images/markerNew.png')} alt='수치' style={{width:30, height:30, resizeMode:'contain'}} />
                                                    </Box> 
                                                }
                                                </>
                                            }

                                            {
                                                fatPercent != '' && userInfo.sex =='W' &&
                                                <>
                                                {
                                                    fatPercent[0] < 20.1 &&
                                                    <Box style={[{position:'absolute', bottom:20, left:'6%'}]}>
                                                        <Image source={require('../images/markerNew.png')} alt='수치' style={{width:30, height:30, resizeMode:'contain'}} />
                                                    </Box> 
                                                }
                                                {
                                                    fatPercent[0] >= 20.1 && fatPercent[0] < 27 &&
                                                    <Box style={[{position:'absolute', bottom:20, left:'25%'}]}>
                                                        <Image source={require('../images/markerNew.png')} alt='수치' style={{width:30, height:30, resizeMode:'contain'}} />
                                                    </Box> 
                                                }
                                                {
                                                    fatPercent[0] >= 27 && fatPercent[0] < 33 &&
                                                    <Box style={[{position:'absolute', bottom:20, left:'45%'}]}>
                                                        <Image source={require('../images/markerNew.png')} alt='수치' style={{width:30, height:30, resizeMode:'contain'}} />
                                                    </Box> 
                                                }
                                                {
                                                    fatPercent[0] >= 33 && fatPercent[0] < 43 &&
                                                    <Box style={[{position:'absolute', bottom:20, left:'65%'}]}>
                                                        <Image source={require('../images/markerNew.png')} alt='수치' style={{width:30, height:30, resizeMode:'contain'}} />
                                                    </Box> 
                                                }
                                                {
                                                    fatPercent[0] >= 43 &&
                                                    <Box style={[{position:'absolute', bottom:20, left:'85%'}]}>
                                                        <Image source={require('../images/markerNew.png')} alt='수치' style={{width:30, height:30, resizeMode:'contain'}} />
                                                    </Box> 
                                                }
                                                </>
                                            }
                                            
                                        </HStack>
                                    </Box>    
                                    <Box mt={5}>
                                        <HStack justifyContent='space-between' alignItems='center'>
                                            <DefText text='복부지방수치' style={[styles.graphText]}  />
                                            {
                                                adbFat != '' &&
                                                <DefText text={adbFat[0]} style={[styles.graphText, {fontSize:18}]}  />
                                            }
                                            
                                        </HStack>
                                        <HStack justifyContent='space-between' mt={'20px'}>
                                            <Box style={[styles.graphBox, styles.graphBoxFive, {backgroundColor:'#E5E587'}]}>
                                                <DefText text='저체중' style={styles.graphBoxText} />
                                            </Box>
                                            <Box style={[styles.graphBox, styles.graphBoxFive, {backgroundColor:'#11FF00'}]}>
                                                <DefText text='정상' style={styles.graphBoxText} />
                                            </Box>
                                            <Box style={[styles.graphBox, styles.graphBoxFive, {backgroundColor:'#FFA7A7'}]}>
                                                <DefText text='경비만' style={styles.graphBoxText} />
                                            </Box>
                                            <Box style={[styles.graphBox, styles.graphBoxFive, {backgroundColor:'#FF8686'}]}>
                                                <DefText text='중도비만' style={styles.graphBoxText} />
                                            </Box>
                                            <Box style={[styles.graphBox, styles.graphBoxFive, {backgroundColor:'#FF5656'}]}>
                                                <DefText text='고도비만' style={styles.graphBoxText} />
                                            </Box>
                                            {
                                                adbFat != '' &&
                                                <>
                                                    {
                                                        adbFat[1] == 1 &&
                                                        <Box style={[{position:'absolute', bottom:20, left:'6%'}]}>
                                                            <Image source={require('../images/markerNew.png')} alt='수치' style={{width:30, height:30, resizeMode:'contain'}} />
                                                        </Box> 
                                                    }  
                                                    {
                                                        adbFat[1] == 2 &&
                                                        <Box style={[{position:'absolute', bottom:20, left:'25%'}]}>
                                                            <Image source={require('../images/markerNew.png')} alt='수치' style={{width:30, height:30, resizeMode:'contain'}} />
                                                        </Box> 
                                                    }
                                                    {
                                                        adbFat[1] == 4 &&
                                                        <Box style={[{position:'absolute', bottom:20, left:'45%'}]}>
                                                            <Image source={require('../images/markerNew.png')} alt='수치' style={{width:30, height:30, resizeMode:'contain'}} />
                                                        </Box> 
                                                    }   
                                                    {
                                                        adbFat[1] == 5 &&
                                                        <Box style={[{position:'absolute', bottom:20, left:'65%'}]}>
                                                            <Image source={require('../images/markerNew.png')} alt='수치' style={{width:30, height:30, resizeMode:'contain'}} />
                                                        </Box> 
                                                    } 
                                                    {
                                                        adbFat[1] == 6 &&
                                                        <Box style={[{position:'absolute', bottom:20, left:'85%'}]}>
                                                           <Image source={require('../images/markerNew.png')} alt='수치' style={{width:30, height:30, resizeMode:'contain'}} />
                                                        </Box> 
                                                    }   
                                                </>
                                            }
                                            
                                        </HStack>
                                    </Box>
                                </Box>
                            </Box>
                        </ScrollView>
                        :
                        <Box justifyContent='center' alignItems='center' flex={1}>
                            <Image source={require('../images/inbodyIconG.png')} alt={'체성분정보를 관리하세요'} />
                            <DefText text='체성분정보를 추가하여 간편하게 관리하세요.' style={{marginTop:20, color:'#696969', fontFamily:Font.NotoSansMediu, fontWeight:'500'}} />
                            {/* <ActivityIndicator size='large' color='#333' /> */}
                        </Box>
                    }
                    
                </>
                
                :
                <Box flex={1} alignItems='center' justifyContent='center'>
                    <ActivityIndicator size='large' color='#333' />
                </Box>
            }

            <Box position={'absolute'} right={'30px'} bottom={'30px'}>
                <AddButton onPress={()=>{navigation.navigate('InbodyAdd')}} />
            </Box>
        </Box>
    );
};

const styles = StyleSheet.create({
 
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
    reportLabel : {
        fontSize:15,
        color:'#666',
        fontWeight:'bold'
    },
    reportLabelSmall : {
        fontSize:13,
        color:'#666'
    },
    reportChartText: {
        fontSize:14,
        color:'#fff'
    },
    graphText:{
        color:'#000',
        fontFamily:Font.NotoSansMedium,
        fontWeight:'500'
    },
    tableThText: {
        fontSize:14,
        color:'#333',
        fontWeight:'bold',
        textAlign:'center'
    },
    tableTdText: {
        fontSize:14,
        color:'#333',

        textAlign:'left'
    },
    graphBox:{
        width: (width - 80) * 0.15,
        height: 30,
        backgroundColor:'#333',
        justifyContent:'center',
        alignItems:'center'
    },
    graphBoxFive:{
        width: (width - 80) * 0.185,
    },
    graphBoxText: {
        fontSize:13,
        color:'#000',
        fontWeight:'bold'
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
)(Inbody);
