import React, { useEffect, useState } from 'react';
import { ScrollView, Dimensions, TouchableOpacity, Platform, FlatList, StyleSheet, Linking, ActivityIndicator } from 'react-native';
import { Box, VStack, HStack, Image } from 'native-base';
import HeaderComponents from '../components/HeaderComponents';
import { AddButton, DefText } from '../common/BOOTSTRAP';
import LinearGradient from 'react-native-linear-gradient';
import {LineChart, ProgressChart} from 'react-native-chart-kit';
import { connect } from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import Api from '../Api';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import ToastMessage from '../components/ToastMessage';
import Font from '../common/Font';
import { WebView } from 'react-native-webview';

const {width} = Dimensions.get('window');

const BloodSugar = (props) => {

    const {navigation, userInfo} = props;

    const [datalabel, setDataLabel] = useState([]);
    const dataLabels = [7,8,9,10,11,12,13,14,15,16,17,18,19,20];
    const [bloodSugarData, setBloodSugarData] = useState([130, 0, 190, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])



    const data = {
        labels: datalabel,
        datasets: [
          {
            data: bloodSugarData,
            color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`, // optional
            strokeWidth: 2, // optional
           
          },
          
        ],
     
        fromZero : false
    };

    const chartConfig = {
        backgroundGradientFrom: "#fff",
        backgroundGradientFromOpacity: 0,
        backgroundGradientTo: "#fff",
        backgroundGradientToOpacity: 0,
        color: (opacity = 1) => `rgba(51, 51, 51, ${opacity})`,
        strokeWidth: 2, // optional, default 3
        barPercentage: 0.5,
        useShadowColorFromDataset: false, // optional
        decimalPlaces: 0 
    };


    const navigationMove = () => {
        navigation.navigate('Tab_Navigation', {
            screen: 'Community',
            params: 'bloods'
        });
    }

    const [bloodSugarLoading, setBloodSugarLoading] = useState(false);

    //혈당전체
    const [bloodSugarInfoAll, setBloodSugarInfoAll] = useState('');

    //공복혈당
    const [bloodSugarBeforeInfo, setBloodSugarBeforeInfo] = useState('');

    //식후혈당
    const [bloodSugarAfterInfo, setBloodSugarAfterInfo] = useState('');

    //혈당 경고 문구
    const [bloodSugarAlert, setBloodSugarAlert] = useState('');


    const [bloodSugarBeforelevel, setBloodSugarBeforelevel] = useState(-1);
    const [bloodSugarAfterlevel, setBloodSugarAfterlevel] = useState(-1);

    //혈당 정보 불러오기
    const bloodSugarDataReceive = async () => {

        await setBloodSugarLoading(false);

        await Api.send('bloodSugar_info', {'id':userInfo.id,  'token':userInfo.appToken}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                console.log('결과 정보: ', arrItems);
                
                setDataLabel(arrItems.graph_label)
                setBloodSugarInfoAll(arrItems);
                setBloodSugarBeforeInfo(arrItems.before);
                setBloodSugarAfterInfo(arrItems.after);
                setBloodSugarAlert(arrItems.alert);
                //console.log(arrItems);
                
              //  console.log('혈당 데이터', arrItems.sugar_graph);
              //  console.log(arrItems.sugar_graph[dataLabels[10]]);
                let graphDatas = [];
                dataLabels.map((e,i) => {
                    graphDatas[i] = arrItems.sugar_graph[e];
                });
              //  console.log(graphDatas);
                setBloodSugarData(arrItems.graph_data);

              
                

                // let balevel = arrItems.after.level;
                // if(balevel < 120)   balevel = 120;
                // if(balevel > 220)   balevel = 220;
                // balevel = (balevel * 1 - 120) * 0.92;

                // console.log('213213123',balevel)
                // setBloodSugarAfterlevel(balevel);

                let balevel = arrItems.after.level;

                //console.log('식후혈당:::',balevel);

                if(balevel < 120)   balevel = 120;
                if(balevel > 220)   balevel = 220;
                balevel = (balevel * 1 - 120) * 0.92;



                if(balevel <= 140) bbvalue = 7*0.92;
                else if(balevel > 140 && balevel <= 200) bbvalue = 50*0.92;
                else bbvalue = 92 * 0.92;                

                //console.log('213213123',balevel)
                setBloodSugarAfterlevel(bbvalue);

                

                // if(balevel > 100){
                //     setBloodSugarAfterlevel(91.5)
                // }else if(balevel < 120){
                //     setBloodSugarAfterlevel(0)
                // }else{
                //     setBloodSugarAfterlevel(balevel)
                // }

                // let bblevel = arrItems.before.level;
                // if(bblevel < 80)   bblevel = 80;
                // if(bblevel > 140)   bblevel = 140;
                // bblevel = (bblevel * 1 - 91.7) * 2.405 * 0.92;

                // console.log('213213123123123123',bblevel)
                // setBloodSugarBeforelevel(bblevel)


                 //공복혈당 평균
                let bblevel = arrItems.before.level;

               // console.log('bblevel::::::',bblevel);
            
                if(bblevel < 80)    bblevel = 80;
                if(bblevel > 140)   bblevel = 140;
                
                // bblevel = (bblevel * 1 - 91.7) * 2.405 * 0.92;

                let bbvalue = 0;
                if(bblevel <= 100) bbvalue = 7*0.92;
                else if(bblevel > 100 && bblevel <= 125) bbvalue = 50*0.92;
                else bbvalue = 92 * 0.92;

                setBloodSugarBeforelevel(bbvalue)



                // let bblevel = (arrItems.before.level - 95) * 2.8;

                // //console.log('213213123',balevel)
                // if(balevel < 0){
                //     setBloodSugarBeforelevel(0)
                // }else{
                //     setBloodSugarBeforelevel(bblevel)
                // }
                
              
                //setBloodSugarBeforeAfter()
        

            }else{
                console.log('결과 출력 실패!', resultItem);
              // ToastMessage(resultItem.message);
            }
        });

        await setBloodSugarLoading(true);
    }

    useEffect(()=>{
        bloodSugarDataReceive();
    }, [])



    useFocusEffect(
        React.useCallback(()=>{
            // screen is focused
            bloodSugarDataReceive();

            console.log('1231231',bloodSugarAfterInfo);

            return () => {
                // screen is unfocused
                console.log('포커스 nono');
            };
        },[])
    );


    // useEffect(()=>{
        
    //     console.log('식전', bloodSugarAfterInfo);
    // }, [bloodSugarInfoAll])

    const bloodSugarSubmit = () => {
        navigation.navigate('BloodSugarList')
    }

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderComponents headerTitle='혈당' navigation={navigation} listButton={true} bloodSugar={bloodSugarSubmit} />
            {
                bloodSugarLoading ? 
                <>
                {
                    bloodSugarInfoAll != '' ?
                    <ScrollView>
                        <Box p={5} mb='80px'>
                            <HStack height='140px' justifyContent='space-between' px={4} backgroundColor='#F1F1F1' borderRadius='10px' alignItems='center'>
                                <Box width={(width * 0.60) + 'px'}>
                                    <DefText text='혈당이야기' style={{fontSize:16, fontWeight:'bold'}} />
                                    <DefText text='중요한 건강지표 "혈당"에 관해' style={{fontSize:14, fontFamily:Font.NotoSansDemiLight}} />
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
                                <Image source={require('../images/bloodSTopIcon.png')} alt='체크이미지' style={{resizeMode:'contain', width:65, height:70}} />
                            </HStack>
                            {//콜레라
                                bloodSugarAlert &&
                                <Box py={2.5} justifyContent='center' px={5} backgroundColor='#f1f1f1' borderRadius={10} mt={3}>
                                    <HStack alignItems='center' flexWrap={'wrap'}>
                                        <Box  >
                                            <DefText text={ bloodSugarAlert.notice} style={{fontSize:14,color:'#000'}} />
                                        </Box>
                                        {
                                            bloodSugarAlert.screen != '' && bloodSugarAlert.screen_idx &&
                                            <HStack width='100%' justifyContent={'flex-end'} mt='10px' >
                                                <Box> 
                                                    <TouchableOpacity onPress={()=>navigation.navigate(bloodSugarAlert.screen, {'idx':bloodSugarAlert.screen_idx})}>
                                                        <Box borderBottomWidth={1} borderBottomColor='#999' ml={1}>
                                                            <DefText text='더보기' style={{fontSize:14,color:'#696969', fontFamily:Font.NotoSansMedium}} />
                                                        </Box>
                                                    </TouchableOpacity>
                                                </Box>
                                            </HStack>
                                        }
                                    </HStack>
                                </Box>
                            }
                            <Box mt={5} mb={5}>
                                <DefText text='오늘의 혈당' style={[styles.graphText, {marginBottom:10, color:'#696968',  fontFamily:Font.NotoSansMedium}, Platform.OS === 'ios' && {fontWeight:'500'}]} />
                                <Box height='300px'>
                                   
                                    {/* <LineChart
                                        data={data}
                                        width={width-30}
                                        height={235}
                                        chartConfig={chartConfig}
                                        bezier
                                        fromZero={true} //0 부터시작 기본 false
                                        withShadow={false} // 선그림자 여부 기본 true
                                        yLabelsOffset={20} //y축 그래프 사이 여백
                                        segments={5} //y축 수치 세그먼트 기본 4
                                        style={{marginLeft:-20}}
                                    /> */}
                                    <WebView
                                        source={{
                                            uri:'https://khict0107.cafe24.com/adm/rn-webview/bloodsugar.php?id='+userInfo.id
                                        }}
                                    />
                          
                                </Box>
                            </Box>
                            {/* <VStack mt={2.5}>
                                <DefText text='공복혈당' style={styles.reportLabelSmall} />
                                
                                <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#FFCACA', '#FF9696', '#FF6262']} style={[{borderRadius:5, marginTop:10}]}>
                                    {
                                        bloodSugarBeforelevel > -1 && 
                                        <Box style={[{position:'absolute', bottom:1, left:bloodSugarBeforelevel + '%'}]}>
                                            <Image source={require('../images/smileIcons.png')} alt='수치' />
                                        </Box> 
                                    }
                                    
                                    <HStack justifyContent='space-around' height='35px' alignItems='flex-end' pb='5px'>
                                        <DefText text='정상' style={[styles.reportChartText, {color:'#333', fontWeight:'bold'}]} />
                                        <DefText text='당뇨전단계' style={[styles.reportChartText,{color:'#333', fontWeight:'bold'}]} />
                                        <DefText text='당뇨' style={[styles.reportChartText, {color:'#333', fontWeight:'bold'}]} />
                                    </HStack>
                                </LinearGradient>
                                <HStack justifyContent='space-around' height='35px' mt={1}>
                                    <DefText text=' ' style={[styles.reportChartText, {color:'#333'}]} />
                                    <DefText text='100' style={[styles.reportChartText, {color:'#333'}]} />
                                    <DefText text=' ' style={[styles.reportChartText, {color:'#333'}]} />
                                    <DefText text=' ' style={[styles.reportChartText, {color:'#333'}]} />
                                    <DefText text='125' style={[styles.reportChartText, {color:'#333'}]} />
                                    <DefText text=' ' style={[styles.reportChartText, {color:'#333'}]} />
                                    
                                </HStack>
                            </VStack> */}
                            {/* <VStack>
                                <DefText text='식후혈당' style={styles.reportLabelSmall} />
                                
                                <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#FFCACA', '#FF9696', '#FF6262']} style={[{borderRadius:5, marginTop:10}]}>
                                    {
                                        bloodSugarAfterlevel > -1 &&
                                        <Box style={[{position:'absolute', bottom:1, left:bloodSugarAfterlevel + '%'}]}>
                                            <Image source={require('../images/smileIcons.png')} alt='수치' />
                                        </Box>
                                    }
                                    
                                    <HStack justifyContent='space-around' height='35px' alignItems='flex-end' pb='5px'>
                                        <DefText text='정상' style={[styles.reportChartText, {color:'#333', fontWeight:'bold'}]} />
                                        <DefText text='당뇨전단계' style={[styles.reportChartText, {color:'#333', fontWeight:'bold'}]} />
                                        <DefText text='당뇨' style={[styles.reportChartText, {color:'#333', fontWeight:'bold'}]} />
                                    </HStack>
                                </LinearGradient>
                                <HStack justifyContent='space-around' height='35px' mt={1} >
                                    <DefText text=' ' style={[styles.reportChartText, {color:'#333'}]} />
                                    <DefText text='140' style={[styles.reportChartText, {color:'#333'}]} />
                                    <DefText text=' ' style={[styles.reportChartText, {color:'#333'}]} />
                                    <DefText text=' ' style={[styles.reportChartText, {color:'#333'}]} />
                                    <DefText text='200' style={[styles.reportChartText, {color:'#333'}]} />
                                    <DefText text=' ' style={[styles.reportChartText, {color:'#333'}]} />
                                    
                                </HStack>
                            </VStack> */}
                            <DefText text='최근혈당' style={[styles.graphText, {marginBottom:10, color:'#696968',  fontFamily:Font.NotoSansMedium}, Platform.OS === 'ios' && {fontWeight:'500'}]} />
                            <VStack>
                                {
                                    bloodSugarBeforeInfo != '' &&
                                    <HStack py={2.5} px={5} backgroundColor='#f1f1f1' borderRadius={10} justifyContent='space-between'>
                                        <DefText text={'식전 혈당(mg/dL)'} style={{ color:'#000000', fontFamily:Font.NotoSansMedium, lineHeight:30}} />
                                        <HStack>
                                            <Box borderBottomWidth={1} borderBottomColor={ bloodSugarBeforeInfo.level < 100 ? 'transparent' : '#f00'}>
                                                <DefText text={bloodSugarBeforeInfo.level } style={{ color: bloodSugarBeforeInfo.level < 100 ? '#000' : '#f00', fontFamily:Font.NotoSansMedium, lineHeight:30}} />
                                            </Box>
                                        </HStack>
                                    </HStack>
                                }
                                
                                {
                                    bloodSugarAfterInfo != '' &&
                                    <HStack mt={2.5} py={2.5} px={5} backgroundColor='#f1f1f1' borderRadius={10} justifyContent='space-between'>
                                        {/* <DefText text={ bloodSugarAfterInfo.btimeStr +' 혈당(mg/dL)'} /> */}
                                        <DefText text={'식후 혈당(mg/dL)'} style={{ color:'#000000', fontFamily:Font.NotoSansMedium, lineHeight:30}} />
                                        <HStack>
                                            <Box borderBottomWidth={1} borderBottomColor={ bloodSugarAfterInfo.level < 140 ? 'transparent' : '#f00'}>
                                                <DefText text={bloodSugarAfterInfo.level} style={{ color: bloodSugarAfterInfo.level < 140 ? '#000' : '#f00', fontFamily:Font.NotoSansMedium, lineHeight:30}}/>
                                            </Box>
                                        </HStack>
                                    </HStack>
                                }
                                
                            </VStack>
                        </Box>
                    </ScrollView>
                    :
                    <Box justifyContent='center' alignItems='center'  flex={1}>
                        <Image source={require('../images/BloodSugarIcon.png')} alt='체크이미지' style={{resizeMode:'contain'}} />
                        <DefText text='혈당을 기록하여 건강을 관리하세요.' style={{marginTop:20, color:'#696969', fontFamily:Font.NotoSansMediu, fontWeight:'500'}} />
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
                <TouchableOpacity onPress={()=>{navigation.navigate('BloodSugarAdd')}} style={[styles.buttonDef]}>
                   <DefText text='혈당기록 추가' style={styles.buttonDefText} />
                </TouchableOpacity>
            </Box> */}

            <Box position={'absolute'} right={'30px'} bottom={'30px'}>
                <AddButton onPress={()=>{navigation.navigate('BloodSugarAdd')}} />
            </Box>
        </Box>
    );
};

const styles = StyleSheet.create({
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
)(BloodSugar);