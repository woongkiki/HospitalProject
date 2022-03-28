import React, {useState, useEffect} from 'react';
import { Box, VStack, HStack, Image } from 'native-base';
import { TouchableOpacity, Dimensions, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import {DefInput, DefText} from '../common/BOOTSTRAP';
import HeaderComponents from '../components/HeaderComponents';
import LinearGradient from 'react-native-linear-gradient';
import { StackActions } from '@react-navigation/native';
import { connect } from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import Api from '../Api';
import AsyncStorage from '@react-native-community/async-storage';
import ToastMessage from '../components/ToastMessage';
import { useFocusEffect } from '@react-navigation/native';

const {width} = Dimensions.get('window');

const InbodyInfo = (props) => {

    const {navigation, userInfo, route} = props;

    const {params} = route;


    const fatDis = 25.5;

    const [inBodydata, setinBodydata] = useState('');

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

    const BloodPresReceive = () => {
        Api.send('bodyProfile_detail', {'id':userInfo.id,  'token':userInfo.appToken, 'idx':params.idx}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                console.log('결과 정보: ', arrItems);
                setinBodydata(arrItems);

                setAllInbody(arrItems);

                setWeight(arrItems.weight);
                setMuscle(arrItems.muscle);
                setFatKg(arrItems.fat_kg);
                
                setBmiAlert(arrItems.fat_alert);
                setBodyStatus(arrItems.body_category);
                setFatPercent(arrItems.fat_per)
                setBmiData(arrItems.bmi);
                setAdbfat(arrItems.adb_fat)
            }else{
                console.log('결과 출력 실패!', resultItem);
              // ToastMessage(resultItem.message);
            }
        });
    }

    useEffect(()=>{
        BloodPresReceive();
    }, []);



    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderComponents headerTitle='체성분 정보' navigation={navigation} listButton={false} />
            <ScrollView>
            <Box p={5}>
                <Box>
                    {/* <DefText text='식습관 통계' style={[styles.reportLabel, {marginBottom:10}]} /> */}
                    <DefText text='비만 동반질환 위험도' style={[styles.graphText, {marginBottom:10, color:'#707070'}]} />
                    <Box p={5}  backgroundColor='#f1f1f1' borderRadius={10}>
                        {
                            bmiAlert != '' &&
                            <DefText text={bmiAlert[1]} style={[styles.graphText, {marginBottom:10}]} />
                        }
                        <LinearGradient height={23} start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['rgba(234,68,22, 0.03)', 'rgba(234,68,22, 0.51)', '#EA4416']} style={[{borderRadius:5, marginTop:10}]}>
                            <Box style={[{position:'absolute', bottom:15, left:fatDis+'%'}, bmiAlert != '' && {left:(bmiAlert[0]*10)+'%'}]}>
                                <Image source={require('../images/markerNew.png')} alt='수치' style={{width:30, height:30, resizeMode:'contain'}} />
                            </Box> 
                        </LinearGradient>
                    </Box>
                </Box>
                <DefText text='유형분석' style={[styles.graphText, {marginBottom:10, marginTop:20, color:'#707070'}]} />
                <Box p={5} backgroundColor='#f1f1f1' borderRadius={10}>
                    {
                        bodyStatus != '' &&
                        <DefText text={bodyStatus.category} style={[styles.graphText]}  />
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
                <Box  mt={5} p={5} backgroundColor='#f1f1f1' borderRadius={10} >
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
        fontSize:15,
        color:'#333',
        fontWeight:'bold'
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
)(InbodyInfo);