import React, { useEffect, useState } from 'react';
import { ScrollView, Dimensions, TouchableOpacity, Platform, FlatList, StyleSheet, Linking, ActivityIndicator } from 'react-native';
import { Box, VStack, HStack, Image, Center } from 'native-base';
import HeaderComponents from '../components/HeaderComponents';
import { AddButton, DefText } from '../common/BOOTSTRAP';
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import Api from '../Api';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { textAlign } from 'styled-system';
import Font from '../common/Font';

const {width} = Dimensions.get('window');

const BloodPressure = (props) => {

    const {navigation, userInfo} = props;

    //최고혈압
    const bloodNumber = 22;
    const totalNumber = 100;
    const bloodPercent = bloodNumber / totalNumber * 100; //퍼센트값 계산

    //최저혈압
    const bloodNumber2 = 0;
    const totalNumber2 = 100;
    const bloodPercent2 = bloodNumber2 / totalNumber2 * 100; //퍼센트값 계산


    const bloodNumberSelect1 = 122;
    const bloodNumberSelect2 = 82;

    const HeartLate = 77;


    const [bloodPLoading, BloodPLoading] = useState(false);


    const [bloodPressureData, setBloodPressureData] = useState('');
    const [bloodPressureAlert, setBloodPressureAlert] = useState([]);

    const [bloodPressureHigh, setBloodPressureHigh] = useState(-1);
    const [bloodPressureLow, setBloodPressureLow] = useState(-1);

    const [bloodPressureHighOr, setBloodPressureHighOr] = useState(-1);
    const [bloodPressureLowOr, setBloodPressureLowOr] = useState(-1);
    
    const [bloodHeartLate, setBloodHeartLate] = useState(0);

    //혈압정보 가져오기
    const bloodPressureApi = async () => {

        await BloodPLoading(false);

        await Api.send('bloodPressure_info', {'id':userInfo.id,  'token':userInfo.appToken}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                
                console.log(arrItems);
            
                setBloodPressureData(arrItems);
                setBloodPressureAlert(arrItems.alert);

                //console.log(arrItems.alert);

                let bloodHighs = arrItems.high;
                let boxWidths  = 0;
             
                if(bloodHighs < 100)   bloodHighs = 100;
                if(bloodHighs > 180)   bloodHighs = 180;
                if(bloodHighs >= 100 && bloodHighs < 120) boxWidths = 0;
                if(bloodHighs >= 120 && bloodHighs < 130) boxWidths = 25;
                if(bloodHighs >= 130 && bloodHighs < 140) boxWidths = 50;
                if(bloodHighs >= 140 && bloodHighs < 160) boxWidths = 75;
                if(bloodHighs >= 160)   boxWidths = 95;
                boxWidths = boxWidths * 0.92;

                
                setBloodPressureHigh(boxWidths)



                let bloodLows = arrItems.low ;
                console.log('최저', bloodLows);
                if(bloodLows < 60)   bloodLows = 60;
                if(bloodLows > 110)   bloodLows = 110;

                bloodLows = (bloodLows * 1 - 60) * 2 * 0.92;
                console.log('최저', bloodLows);
                setBloodPressureLow(bloodLows);
                

                setBloodPressureHighOr(arrItems.high);
                setBloodPressureLowOr(arrItems.low);

                setBloodHeartLate(arrItems.heartRate);


            }else{
                console.log('결과 출력 실패!', resultItem);
               
            }
        });

        await BloodPLoading(true);
    }


    useEffect(()=>{
        bloodPressureApi();
    }, [])


    const navigationMove = () => {
        navigation.navigate('Tab_Navigation', {
            screen: 'Community',
            params: 'bloodp'
        });
    }

    useFocusEffect(
        React.useCallback(()=>{
            // screen is focused
            bloodPressureApi();

            return () => {
                // screen is unfocused
                console.log('포커스 nono');
            };
        },[])
    );

    const BloodPresButton = () => {
        navigation.navigate('BloodPressureList');
    }

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderComponents headerTitle='혈압' navigation={navigation} listButton={true} bloodSugar={BloodPresButton} />
            {
                bloodPLoading ?
                <>
                {
                    bloodPressureData != '' ?
                    <ScrollView>
                        <Box p={5} mb='80px'>
                            <HStack height='140px' justifyContent='space-between' px={4} backgroundColor='#F1F1F1' borderRadius='10px' alignItems='center'>
                                <Box width={(width * 0.60) + 'px'}>
                                    <DefText text='혈압이야기' style={[{fontSize:16, fontFamily:Font.NotoSansBold}, Platform.OS == 'ios' && {fontWeight:'bold'}]} />
                                    <DefText text='중요한 건강지표 "혈압"에 관해' style={{fontSize:14, fontFamily:Font.NotoSansDemiLight}} />
                                    <DefText text='알아보세요.' style={{fontSize:14, fontFamily:Font.NotoSansDemiLight}}/>
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
                                <Image source={require('../images/bloodPTopImage.png')} style={{width:74, height:59, resizeMode:'contain'}} alt='체크이미지' />
                            </HStack>
                            {
                                bloodPressureAlert != "" &&
                                
                                <Box>
                                
                                    <Box py={2.5} justifyContent='center' px={5}  backgroundColor='#f1f1f1' borderRadius={10} mt={3}>
                                        <HStack alignItems='center' flexWrap='wrap' justifyContent='space-between'>
                                            
                                            <Box >
                                                <DefText text={bloodPressureAlert.notice} style={{color:'#000', fontSize:14}} />
                                            </Box>
                                            {
                                                bloodPressureAlert.screen && bloodPressureAlert.screen_idx != '' &&
                                                <Box width='100%' alignItems='flex-end' > 
                                                    <TouchableOpacity  onPress={()=>navigation.navigate(bloodPressureAlert.screen, {'idx':bloodPressureAlert.screen_idx})}>
                                                        <Box borderBottomWidth={1} borderBottomColor='#999' ml={1}>
                                                            <DefText text='더보기' style={{fontSize:14,color:'#696969', fontFamily:Font.NotoSansMedium}} />
                                                        </Box>
                                                    </TouchableOpacity>
                                                </Box>
                                            }
                                        </HStack>
                                    </Box>
                                </Box>
                      
                                
                            }
                            {/* <VStack mt={2.5}>
                                <DefText text='최고혈압' style={styles.BloodPreSmallText} />
                                
                                <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#FFCACA', '#FF9696', '#FF6262']} style={[{borderRadius:5, marginTop:10}]}>
                                    {
                                        bloodPressureHigh > -1 && 
                                        <Box style={[{position:'absolute', bottom:1, left:bloodPressureHigh+'%'}]}>
                                            <Image source={require('../images/smileIcons.png')} alt='수치' />
                                        </Box> 
                                    }
                                    
                                    <HStack justifyContent='space-around' height='35px' alignItems='flex-end' pb='5px'>
                                        <DefText text='정상' style={[styles.BloodPreText, {color:'#333', fontWeight:'bold', flex:1}]} />
                                        <DefText text='주의' style={[styles.BloodPreText, {color:'#333', fontWeight:'bold', flex:1, marginLeft:-10}]} />
                                        <DefText text='고혈압전단계' style={[styles.BloodPreText, {color:'#333', fontWeight:'bold', flex:1}]} />
                                        <DefText text='고혈압1기' style={[styles.BloodPreText, {color:'#333', fontWeight:'bold', flex:1, marginRight:-5}]} />
                                        <DefText text='고혈압2기' style={[styles.BloodPreText, {color:'#333', fontWeight:'bold', flex:1}]} />
                                    </HStack>
                                </LinearGradient>
                                <HStack justifyContent='space-between' height='35px' mt={1} pl={'25px'} pr={'30px'}>

                                    <DefText text='120' style={[styles.BloodPreText, {color:'#333', flex:1.25}]} />
                                    <DefText text='130' style={[styles.BloodPreText, {color:'#333', flex:1.25}]} />
                                    <DefText text='140' style={[styles.BloodPreText, {color:'#333', flex:1.25}]} />
                                    <DefText text='160' style={[styles.BloodPreText, {color:'#333', flex:1.25}]} />

                                </HStack>
                            </VStack> */}
                            {/* <VStack>
                                <DefText text='최저혈압' style={styles.BloodPreSmallText} />
                                
                                <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#FFCACA', '#FF9696', '#FF6262']} style={[{borderRadius:5, marginTop:10}]}>
                                    {
                                        bloodPressureLow > -1 && 
                                        <Box style={[{position:'absolute', bottom:1, left: bloodPressureLow + '%'}]}>
                                            <Image source={require('../images/smileIcons.png')} alt='수치' />
                                        </Box> 
                                    }
                                        
                                    
                                    
                                    <HStack justifyContent='space-around' height='35px' alignItems='flex-end' pb='5px'>
                                        <DefText text='정상' style={[styles.BloodPreText, {color:'#333', fontWeight:'bold', flex:2, textAlign:'center'}]} />
                                        <DefText text='고혈압전단계' style={[styles.BloodPreText, {color:'#333', fontWeight:'bold',flex:1}]} />
                                        <DefText text='고혈압1기' style={[styles.BloodPreText, {color:'#333', fontWeight:'bold',flex:1}]} />
                                        <DefText text='고혈압2기' style={[styles.BloodPreText, {color:'#333', fontWeight:'bold',flex:1}]} />
                                    </HStack>
                                </LinearGradient>
                                <HStack justifyContent='space-around' height='35px' mt={1}>
                                    <DefText text=' ' style={[styles.BloodPreText, {color:'#333', flex:2.25}]} />
                                    <DefText text='80' style={[styles.BloodPreText, {color:'#333', flex:1.25}]} />
                                    <DefText text='90' style={[styles.BloodPreText, {color:'#333', flex:1.25}]} />
                                    <DefText text='100' style={[styles.BloodPreText, {color:'#333', flex:1.25}]} />
                                    <DefText text=' ' style={[styles.BloodPreText, {color:'#333', flex:1}]} />
                                </HStack>
                            </VStack> */}
                            <DefText text='최고혈압' style={[{marginBottom:10, color:'#696968',  fontFamily:Font.NotoSansMedium, marginTop:20}]} />
                            <Box p={5} backgroundColor='#f1f1f1' borderRadius={10} mb='20px'>
                                <Box>
                                    {
                                        bloodPressureHighOr > -1 &&
                                        <DefText text={bloodPressureHighOr + ' mmHg'} style={{color:'#000', fontFamily:Font.NotoSansMedium, fontWeight:'500'}}/>
                                    }
                                </Box>
                                <Box mt='20px'>
                                    <HStack justifyContent='space-between' mt={'10px'} >
                                        <Box style={[styles.graphBoxFive, {backgroundColor:'#E5E587'}]}>
                                            <DefText text='정상' style={styles.graphBoxText} />
                                        </Box>
                                        <Box style={[styles.graphBoxFive, {backgroundColor:'#11FF00'}]}>
                                            <DefText text='주의' style={styles.graphBoxText} />
                                        </Box>
                                        <Box style={[styles.graphBoxFive, {backgroundColor:'#FFA7A7'}]}>
                                            <DefText text='전단계' style={styles.graphBoxText} />
                                        </Box>
                                        <Box style={[styles.graphBoxFive, {backgroundColor:'#FF8686'}]}>
                                            <DefText text='고혈압1기' style={styles.graphBoxText} />
                                        </Box>
                                        <Box style={[styles.graphBoxFive, {backgroundColor:'#FF5656'}]}>
                                            <DefText text='고혈압2기' style={styles.graphBoxText} />
                                        </Box>
                                    </HStack>
                                    {
                                        bloodPressureHighOr <= 120 &&
                                        <Box style={[{position:'absolute', bottom:20, left:'6%'}]}>
                                            <Image source={require('../images/markerNew.png')} alt='수치' style={{width:30, height:30, resizeMode:'contain'}} />
                                        </Box> 
                                    }
                                    {
                                        bloodPressureHighOr > 120 && bloodPressureHighOr <= 130 &&
                                        <Box style={[{position:'absolute', bottom:20, left:'25%'}]}>
                                            <Image source={require('../images/markerNew.png')} alt='수치' style={{width:30, height:30, resizeMode:'contain'}} />
                                        </Box> 
                                    }
                                    {
                                        bloodPressureHighOr > 130 && bloodPressureHighOr <= 140 &&
                                        <Box style={[{position:'absolute', bottom:20, left:'45%'}]}>
                                            <Image source={require('../images/markerNew.png')} alt='수치' style={{width:30, height:30, resizeMode:'contain'}} />
                                        </Box> 
                                    }
                                    {
                                        bloodPressureHighOr > 140 && bloodPressureHighOr <= 150 &&
                                        <Box style={[{position:'absolute', bottom:20, left:'65%'}]}>
                                            <Image source={require('../images/markerNew.png')} alt='수치' style={{width:30, height:30, resizeMode:'contain'}} />
                                        </Box> 
                                    }
                                    {
                                        bloodPressureHighOr > 150 &&
                                        <Box style={[{position:'absolute', bottom:20, left:'85%'}]}>
                                            <Image source={require('../images/markerNew.png')} alt='수치' style={{width:30, height:30, resizeMode:'contain'}} />
                                        </Box> 
                                    }
                                </Box>
                                <HStack justifyContent={'space-around'} px={10} mt={'10px'}>
                                    <DefText text='120' style={{fontSize:10, fontFamily:Font.NotoSansMedium}} />
                                    <DefText text='130' style={{fontSize:10, fontFamily:Font.NotoSansMedium}} />
                                    <DefText text='140' style={{fontSize:10, fontFamily:Font.NotoSansMedium}} />
                                    <DefText text='150' style={{fontSize:10, fontFamily:Font.NotoSansMedium}} />
                                </HStack>
                            </Box>
                            <DefText text='최저혈압' style={[{marginBottom:10, color:'#696968',  fontFamily:Font.NotoSansMedium}]} />
                            <Box p={5} backgroundColor='#f1f1f1' borderRadius={10} mb='20px'>
                                <Box>
                                    {
                                        bloodPressureLowOr > -1 &&
                                        <DefText text={bloodPressureLowOr + ' mmHg'} style={{color:'#000', fontFamily:Font.NotoSansMedium, fontWeight:'500'}}/>
                                    }
                                </Box>
                                <Box mt='20px'>
                                    <HStack justifyContent='space-between' mt={'10px'} >
                                        <Box style={[styles.graphBoxFive, {backgroundColor:'#E5E587'}]}>
                                            <DefText text='저혈압' style={styles.graphBoxText} />
                                        </Box>
                                        <Box style={[styles.graphBoxFive, {backgroundColor:'#11FF00'}]}>
                                            <DefText text='정상' style={styles.graphBoxText} />
                                        </Box>
                                        <Box style={[styles.graphBoxFive, {backgroundColor:'#FFA7A7'}]}>
                                            <DefText text='전단계' style={styles.graphBoxText} />
                                        </Box>
                                        <Box style={[styles.graphBoxFive, {backgroundColor:'#FF8686'}]}>
                                            <DefText text='고혈압1기' style={styles.graphBoxText} />
                                        </Box>
                                        <Box style={[styles.graphBoxFive, {backgroundColor:'#FF5656'}]}>
                                            <DefText text='고혈압2기' style={styles.graphBoxText} />
                                        </Box>
                                    </HStack>
                                    {
                                        bloodPressureLowOr <= 60 &&
                                        <Box style={[{position:'absolute', bottom:20, left:'6%'}]}>
                                            <Image source={require('../images/markerNew.png')} alt='수치' style={{width:30, height:30, resizeMode:'contain'}} />
                                        </Box> 
                                    }
                                    {
                                        bloodPressureLowOr > 60 && bloodPressureLowOr <= 80 &&
                                        <Box style={[{position:'absolute', bottom:20, left:'25%'}]}>
                                            <Image source={require('../images/markerNew.png')} alt='수치' style={{width:30, height:30, resizeMode:'contain'}} />
                                        </Box> 
                                    }
                                    {
                                        bloodPressureLowOr > 80 && bloodPressureLowOr <= 90 &&
                                        <Box style={[{position:'absolute', bottom:20, left:'45%'}]}>
                                            <Image source={require('../images/markerNew.png')} alt='수치' style={{width:30, height:30, resizeMode:'contain'}} />
                                        </Box> 
                                    }
                                    {
                                        bloodPressureLowOr > 90 && bloodPressureLowOr <= 100 &&
                                        <Box style={[{position:'absolute', bottom:20, left:'65%'}]}>
                                            <Image source={require('../images/markerNew.png')} alt='수치' style={{width:30, height:30, resizeMode:'contain'}} />
                                        </Box> 
                                    }
                                    {
                                        bloodPressureLowOr > 100 &&
                                        <Box style={[{position:'absolute', bottom:20, left:'85%'}]}>
                                            <Image source={require('../images/markerNew.png')} alt='수치' style={{width:30, height:30, resizeMode:'contain'}} />
                                        </Box> 
                                    }
                                </Box>
                                <HStack justifyContent={'space-around'} px={10} mt={'10px'}>
                                    <DefText text='60' style={{fontSize:10, fontFamily:Font.NotoSansMedium}} />
                                    <DefText text='80' style={{fontSize:10, fontFamily:Font.NotoSansMedium}} />
                                    <DefText text='90' style={{fontSize:10, fontFamily:Font.NotoSansMedium}} />
                                    <DefText text='100' style={{fontSize:10, fontFamily:Font.NotoSansMedium}} />
                                </HStack>
                            </Box>
                            {/* <HStack py={2.5} px={5} backgroundColor='#f1f1f1' borderRadius={10} justifyContent='space-between'>
                                <DefText text='혈압(mmHg)' />
                                <HStack>
                                    {
                                        bloodPressureHighOr > -1 &&
                                        <DefText text={'수축기 : ' + bloodPressureHighOr} />
                                    }
                                    {
                                        bloodPressureLowOr > -1 &&
                                        <DefText text={'이완기 : ' + bloodPressureLowOr} style={{marginLeft:10}} />
                                    }
                                    
                                    
                                </HStack>
                            </HStack> */}
                            {
                                bloodHeartLate > 0 && 
                                <>
                                <DefText text='심박수' style={[{marginBottom:10, color:'#696968',  fontFamily:Font.NotoSansMedium}]} />
                                <HStack  py={2.5} px={5} backgroundColor='#f1f1f1' borderRadius={10} justifyContent='space-between'>
                                    <DefText text='심박수(bpm)' style={{color:'#000', fontFamily:Font.NotoSansMedium}} />
                                    <HStack>
                                        <DefText text={bloodHeartLate} style={{color:'#000', fontFamily:Font.NotoSansMedium}} />
                                    </HStack>
                                </HStack>
                                </>
                            }
                            
                        </Box>
                    </ScrollView>
                    :
                    <Box justifyContent='center' alignItems='center'  flex={1}>
                        <Image source={require('../images/heartRateIcon.png')} alt='체크이미지' />
                        <DefText text='혈압을 기록하여 건강을 관리하세요.' style={{marginTop:20, color:'#696969', fontFamily:Font.NotoSansMediu, fontWeight:'500'}} />
                        {/* <ActivityIndicator size='large' color='#333' /> */}
                    </Box>
                }
                </>
                :
                <Box flex={1} alignItems='center' justifyContent='center'>
                    <ActivityIndicator size='large' color='#333' />
                </Box>
            }
            {/* <Box p={2.5} px={5}>
                <TouchableOpacity onPress={()=>{navigation.navigate('BloodPressureAdd')}} style={[styles.buttonDef]}>
                   <DefText text='혈압기록 추가' style={styles.buttonDefText} />
                </TouchableOpacity>
            </Box> */}

            <Box position={'absolute'} right={'30px'} bottom={'30px'}>
                <AddButton onPress={()=>{navigation.navigate('BloodPressureAdd')}} />
            </Box>
        </Box>
    );
};

const styles = StyleSheet.create({
    BloodPreSmallText : {
        fontSize:13,
        color:'#666'
    },
    BloodPreText: {
        fontSize: width > 360 ? 13 : 12,
        color:'#fff',
        textAlign:'center'
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
    graphBox:{
        width: (width - 80) * 0.15,
        height: 30,
        backgroundColor:'#333',
        justifyContent:'center',
        alignItems:'center'
    },
    graphBoxFive:{
        width: (width - 80) * 0.185,
        height: 30,
        backgroundColor:'#333',
        justifyContent:'center',
        alignItems:'center'
    },
    graphBoxText: {
        fontSize:12,
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
)(BloodPressure);