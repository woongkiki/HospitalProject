import React, {useState, useEffect} from 'react';
import { Box, HStack, VStack, Image } from 'native-base';
import { TouchableOpacity, ScrollView, Dimensions, Animated, StyleSheet, Text, Platform } from 'react-native';
import { DefText } from '../common/BOOTSTRAP';
import HeaderDefault from '../components/HeaderDefault';
import { TabView, SceneMap } from 'react-native-tab-view';
import LinearGradient from 'react-native-linear-gradient';
import {LineChart, ProgressChart} from 'react-native-chart-kit'
import { connect } from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import Api from '../Api';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import ToastMessage from '../components/ToastMessage';

const {width} = Dimensions.get('window');

const initialLayout = { width: Dimensions.get('window').width };

const firstChartWidth = (width - 80) * 0.5;

const secondChartWidth = (width - 80) * 0.45;

//console.log(width);
//console.log(firstChartWidth);
//console.log(secondChartWidth);

const Report = (props) => {

    const {navigation, userInfo} = props;

    //console.log(userInfo);

    //공복혈당
    const bloodNumber = 45;
    const totalNumber = 200;
    const bloodPercent = bloodNumber / totalNumber * 100; //퍼센트값 계산

    //식후혈당
    const foodBloodNumber = 70;
    const foodBloodPer = foodBloodNumber / totalNumber * 100;


    const bloodPressureHigh = 25;
    const bloodPressureLow = 70;
    const bloodPressureCommand = 100;

    const bloodPressurePercent = bloodPressureHigh / bloodPressureCommand * 100;
    const bloodPressureLowPercent = 100 - (bloodPressureLow / bloodPressureCommand * 100);
    //console.log(bloodValue);


    const [bloodSugarGraph, setBloodSugarGraph] = useState('');
    const [bloodSugarAvgBefore, setBloodSugarAvgBefore] = useState(-1);
    const [bloodSugarAvgAfter, setBloodSugarAvgAfter] = useState(-1);
    const [bloodSugarGraphData, setBloodSugarGraphData] = useState('');

    const [bloodSugarKeyData, setBloodSugarKeyData] = useState([]);
    const [bloodSugarData, setBloodSugarData] = useState([130, 0, 190, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])

    const ReportDataReceive = () => {
        Api.send('report_week', {'id':userInfo.id,  'token':userInfo.appToken}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                //console.log('결과 정보: ', Object.values(arrItems.sugar_graph));

               
                setBloodSugarGraph(arrItems);
                

                //공복혈당 평균
                let beforeBsData = arrItems.avg_sugar1;
                if(beforeBsData <= 95){ // 95이하는 정상
                    setBloodSugarAvgBefore(0);
                }else if(beforeBsData > 130){ //130이상은 당뇨
                    setBloodSugarAvgBefore(92);
                }else if(beforeBsData == 0){ // 0은 수치없음
                    setBloodSugarAvgBefore(-1);
                }else{
                    beforeBsData = (beforeBsData - 95) * 1.3;
                    //console.log('공복혈당 평균:::', beforeBsData);
                    setBloodSugarAvgBefore(beforeBsData);
                }


                //식후혈당 평균
                let afterBsData = arrItems.avg_sugar2;
                if(afterBsData == 0){ // 95이하는 정상
                    setBloodSugarAvgAfter(-1);
                }else if(afterBsData > 130){ //130이상은 당뇨
                    setBloodSugarAvgAfter(92);
                }else if(afterBsData <= 95 ){ // 0은 수치없음
                    setBloodSugarAvgAfter(0);
                }else{
                    afterBsData = (afterBsData - 95) * 1.3;
                    //console.log('공복혈당 평균:::', beforeBsData);
                    setBloodSugarAvgAfter(afterBsData);
                }

                let graph_keys = Object.keys(arrItems.sugar_graph);

                let graphKeysDatas = [];
                graph_keys.map((e, i)=> {
                    graphKeysDatas[i] = graph_keys[i].split('_')[0].substring(5,9) + '일 ' + graph_keys[i].split('_')[1]+'시';
                })
                //console.log('123123', graph_keys[0].split('_')[1]);


                console.log('3444', graphKeysDatas);

                //키값저장
                setBloodSugarKeyData(graphKeysDatas);
                //setBloodSugarKeyData(graphKeysDatas)

                setBloodSugarData(Object.values(arrItems.sugar_graph));
              

            }else{
                console.log('결과 출력 실패!', resultItem);
               //ToastMessage(resultItem.message);
            }
        });
    }

    useEffect(()=>{
        ReportDataReceive();
    }, [])

    // useEffect(()=>{
    //     console.log('bloodSugarAvgAfter:::', bloodSugarAvgAfter);
    // }, [bloodSugarAvgAfter])


    

    const data = {
        labels: bloodSugarKeyData,
        datasets: [
          
          {
            data: bloodSugarData,
            color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`, // optional
            strokeWidth: 2 // optional
          }
        ],
        //legend: ["당뇨인"], // optional
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


      const dataBlood = {
        labels: ["10일", "11일", "12일", "13일", "14일", "15일", "16일", "17일", "18일", "19일"],
        datasets: [
          {
            data: [100, 80,90, 80, 90, 80, 90, 80, 70, 120],
            color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`, // optional
            strokeWidth: 2, // optional
           
          },
          {
            data: [60, 50, 60, 70, 60, 70, 60, 70, 50, 55],
            color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`, // optional
            strokeWidth: 2 // optional
          }
        ],
        legend: ["확장기","수축기"], // optional
        fromZero : false
      };

      
      const dataKcal = {
        labels: ["1일", "2일", "3일", "4일", "5일", "6일", "7일", "8일", "9일", "10일"],
        datasets: [
          {
            data: [1200, 1400, 1500, 1430, 1700, 1000, 700, 800, 830, 1000],
            color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`, // optional
            strokeWidth: 2, // optional
           
          },
          
        ],
        //legend: ["칼로리 섭취",], // optional
        fromZero : false
      };


      const medicineData = {
        labels: ["조제약 복용률"], // optional
        data: [0.75],
        medicineText:'양호'
      };

      const medicineData2 = {
        labels: ["영양제 복용률"], // optional
        data: [0.4],
        medicineText:'주의'
      };
    
      const chartConfigMedicine = {
        backgroundGradientFrom: "#fff",
        backgroundGradientFromOpacity: 0,
        backgroundGradientTo: "#fff",
        backgroundGradientToOpacity: 0,
        color: (opacity = 1) => `rgba(255, 98, 98, ${opacity})`,
        strokeWidth: 2, // optional, default 3
        barPercentage: 0.5,
        useShadowColorFromDataset: false // optional
      };

      const chartConfigMedicine2 = {
        backgroundGradientFrom: "#fff",
        backgroundGradientFromOpacity: 0,
        backgroundGradientTo: "#fff",
        backgroundGradientToOpacity: 0,
        color: (opacity = 1) => `rgba(94, 181, 224, ${opacity})`,
        strokeWidth: 2, // optional, default 3
        barPercentage: 0.5,
        useShadowColorFromDataset: false // optional
      };


      const beforeWeekKcal = 1720;
      const nowWeekKcal = 2450;
      const recommendKcal = 1998;

      const avgKcal = nowWeekKcal / recommendKcal * 100;
      const avgKcalFl = Math.floor(avgKcal);

      let avgKcalTotals;

      if(avgKcalFl > 100){
        avgKcalTotals = 100;
      }else{
        avgKcalTotals = avgKcalFl;
      }


      const dataWeight = {
        labels: ["1일", "2일", "3일", "4일", "5일", "6일", "7일", "8일", "9일", "10일"],
        datasets: [
          {
            data: [75, 74, 72, 72, 72.5, 76, 76, 75, 72, 78],
            color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`, // optional
            strokeWidth: 2, // optional
           
          },
          
        ],
        legend: ["10월",], // optional
        fromZero : false
      };

      const dataMuscle = {
        labels: ["1일", "2일", "3일", "4일", "5일", "6일", "7일", "8일", "9일", "10일"],
        datasets: [
          {
            data: [28.7, 28.8, 28.5, 28.1, 27.9, 27.6, 28, 28.2, 28.4, 28.8],
            color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`, // optional
            strokeWidth: 2, // optional
           
          },
          
        ],
        legend: ["10월",], // optional
        fromZero : false
      };

      const dataFat = {
        labels: ["1일", "2일", "3일", "4일", "5일", "6일", "7일", "8일", "9일", "10일"],
        datasets: [
          {
            data: [12.7, 12.8, 12.5, 12.1, 12.9, 12.6, 12, 12.2, 12.4, 13.8],
            color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`, // optional
            strokeWidth: 2, // optional
           
          },
          
        ],
        legend: ["10월",], // optional
        fromZero : false
      };


    const FirstRoute = () => {

        return(
            <Box backgroundColor='#fff'>
                <ScrollView>
                    <Box px={5} pb={5} pt={2.5}>
                    
                        <Box>
                            <DefText text='주간평균 혈당' style={styles.reportLabel} />
                            <VStack mt={2.5}>
                                <DefText text='공복혈당' style={styles.reportLabelSmall} />
                               
                                <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#FFCACA', '#FF9696', '#FF6262']} style={[{borderRadius:5, marginTop:10}]}>
                                    {
                                        bloodSugarAvgBefore > -1 &&
                                        <Box style={[{position:'absolute', bottom:1, left:bloodSugarAvgBefore+'%'}]}>
                                            <Image source={require('../images/smileIcons.png')} alt='수치' />
                                        </Box> 
                                    }
                                    <HStack justifyContent='space-around' height='35px' alignItems='flex-end' pb='5px'>
                                        <DefText text='정상' style={[styles.reportChartText, {color:'#333', fontWeight:'bold'}]} />
                                        <DefText text='당뇨전단계' style={[styles.reportChartText, {color:'#333', fontWeight:'bold'}]} />
                                        <DefText text='당뇨' style={[styles.reportChartText, {color:'#333', fontWeight:'bold'}]} />
                                    </HStack>
                                </LinearGradient>
                                <HStack justifyContent='space-around' height='35px' mt={1}>
                                    <DefText text='100' style={[styles.reportChartText, {color:'#333'}]} />
                                    <DefText text='125' style={[styles.reportChartText, {color:'#333'}]} />
                                </HStack>
                            </VStack>
                            <VStack mt={2.5}>
                                <DefText text='식후혈당' style={styles.reportLabelSmall} />
                               
                                <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#FFCACA', '#FF9696', '#FF6262']} style={[{borderRadius:5, marginTop:10}]}>
                                    {
                                        bloodSugarAvgAfter > -1 &&
                                        <Box style={[{position:'absolute', bottom:1, left:bloodSugarAvgAfter+'%'}]}>
                                            <Image source={require('../images/smileIcons.png')} alt='수치' />
                                        </Box>
                                    }
                                    <HStack justifyContent='space-around' height='35px' alignItems='flex-end' pb='5px'>
                                        <DefText text='정상' style={[styles.reportChartText, {color:'#333', fontWeight:'bold'}]} />
                                        <DefText text='당뇨전단계' style={[styles.reportChartText, {color:'#333', fontWeight:'bold'}]} />
                                        <DefText text='당뇨' style={[styles.reportChartText, {color:'#333', fontWeight:'bold'}]} />
                                    </HStack>
                                </LinearGradient>
                                <HStack justifyContent='space-around' height='35px' mt={1}>
                                    <DefText text='100' style={[styles.reportChartText, {color:'#333'}]} />
                                    <DefText text='125' style={[styles.reportChartText, {color:'#333'}]} />
                                </HStack>
                            </VStack>
                            <Box mt={5}>
                                <Box>
                                    <ScrollView
                                        horizontal={true}
                                        showsHorizontalScrollIndicator={false}
                                    >
                                        <LineChart
                                            data={data}
                                            width={width + 3000}
                                            height={235}
                                            chartConfig={chartConfig}
                                            bezier
                                            fromZero={true} //0 부터시작 기본 false
                                            withShadow={false} // 선그림자 여부 기본 true
                                            yLabelsOffset={20} //y축 그래프 사이 여백
                                            segments={5} //y축 수치 세그먼트 기본 4
                                            style={{marginLeft:-20}}
                                        />
                                    </ScrollView>
                                </Box>
                            </Box>
                            <Box mt={2.5} backgroundColor='#F1F1F1' borderRadius={10} p={5}>
                                <DefText text='정상혈당 달성도' style={[styles.reportLabel, {marginBottom:10}]} />
                                <VStack>
                                    <DefText text={'전체 : 90% (총 12회, 달성 11회)'} style={{fontSize:14, color:'#333'}}/>
                                    <DefText text={'공복 : 100% (총 7회, 달성 7회)'} style={{fontSize:14, color:'#333', marginTop:10}}/>
                                    <DefText text={'식후 : 80% (총 5회, 달성 4회)'} style={{fontSize:14, color:'#333', marginTop:10}}/>
                                </VStack>
                            </Box>
                            <Box mt={5} backgroundColor='#F1F1F1' borderRadius={10} p={5}>
                                <DefText text='혈당 값 추세' style={[styles.reportLabel, {marginBottom:10}]} />
                                <Box width={ (width-80) + 'px'} >
                                    <HStack justifyContent='space-between' borderBottomWidth={1} borderBottomColor='#999'>
                                        <Box width={(width - 40) *0.2 + 'px'} />
                                        <Box width={(width - 40 )*0.7 + 'px'} borderLeftWidth={1} borderLeftColor="#999">
                                            <HStack justifyContent='space-between' py={2.5}>
                                                <Box width='33.3%' >
                                                    <DefText text='지난주' style={[styles.tableText]} />
                                                </Box>
                                                <Box width='33.3%' >
                                                    <DefText text='이번주' style={[styles.tableText]} />
                                                </Box>
                                                <Box width='33.3%'  />
                                            </HStack>
                                        </Box>
                                    </HStack>
                                   
                                    <HStack borderBottomWidth={1} borderBottomColor='#999' >
                                        <Box width={(width - 40) *0.2 + 'px'} >
                                            <HStack alignItems='center'>
                                                <Box width='50%' height={60} justifyContent='center' py={1.5}>
                                                    <DefText text='아침' style={[styles.tableText, {fontSize:15}]}  />
                                                </Box>
                                                <VStack width='50%' height={60} justifyContent='space-between' py={1.5}>
                                                    <Box >
                                                        <DefText text='식전' style={[styles.tableText]}  />
                                                    </Box>
                                                    <Box >
                                                        <DefText text='식후' style={[styles.tableText]}  />
                                                    </Box>
                                                </VStack>
                                            </HStack>
                                        </Box>
                                        <Box width={(width - 40 )*0.7 + 'px'} borderLeftWidth={1} borderLeftColor="#999">
                                            <HStack justifyContent='space-between' alignItems='center' >
                                                <VStack width='33.3%' height={60} justifyContent='space-between' py={1.5}>
                                                    <Box >
                                                        <DefText text={80} style={[styles.tableText]}  />
                                                    </Box>
                                                    <Box >
                                                        <DefText text={120} style={[styles.tableText]}  />
                                                    </Box>
                                                </VStack>
                                                <VStack width='33.3%' height={60} justifyContent='space-between' py={1.5}>
                                                    <Box >
                                                        <DefText text={90} style={[styles.tableText]}  />
                                                    </Box>
                                                    <Box >
                                                        <DefText text={122} style={[styles.tableText]}  />
                                                    </Box>
                                                </VStack>
                                                <VStack width='33.3%' height={60} justifyContent='space-between' alignItems='center' py={1.5}>
                                                    <Box style={{height:20, backgroundColor:'#FF6262', width:50, alignItems:'center', justifyContent:'center', borderRadius:20}}>
                                                        <DefText text={'+'+10} style={[styles.tableText, {color:'#fff', fontSize:12}]}  />
                                                    </Box>
                                                    <Box style={{height:20, backgroundColor:'#FF6262', width:50, alignItems:'center', justifyContent:'center', borderRadius:20}}>
                                                        <DefText text={'+'+2} style={[styles.tableText, {color:'#fff', fontSize:12}]}  />
                                                    </Box>
                                                </VStack>
                                            </HStack>
                                           
                                        </Box>
                                    </HStack>
                               
                                    <HStack borderBottomWidth={1} borderBottomColor='#999' >
                                        <Box width={(width - 40) *0.2 + 'px'} >
                                            <HStack alignItems='center'>
                                                <Box width='50%' height={60} justifyContent='center' py={1.5}>
                                                    <DefText text='점심' style={[styles.tableText, {fontSize:15}]}  />
                                                </Box>
                                                <VStack width='50%' height={60} justifyContent='space-between' py={1.5}>
                                                    <Box >
                                                        <DefText text='식전' style={[styles.tableText]}  />
                                                    </Box>
                                                    <Box >
                                                        <DefText text='식후' style={[styles.tableText]}  />
                                                    </Box>
                                                </VStack>
                                            </HStack>
                                        </Box>
                                        <Box width={(width - 40 )*0.7 + 'px'} borderLeftWidth={1} borderLeftColor="#999">
                                            <HStack justifyContent='space-between' alignItems='center' >
                                                <VStack width='33.3%' height={60} justifyContent='space-between' py={1.5}>
                                                    <Box >
                                                        <DefText text={80} style={[styles.tableText]}  />
                                                    </Box>
                                                    <Box >
                                                        <DefText text={120} style={[styles.tableText]}  />
                                                    </Box>
                                                </VStack>
                                                <VStack width='33.3%' height={60} justifyContent='space-between' py={1.5}>
                                                    <Box >
                                                        <DefText text={80} style={[styles.tableText]}  />
                                                    </Box>
                                                    <Box >
                                                        <DefText text={130} style={[styles.tableText]}  />
                                                    </Box>
                                                </VStack>
                                                <VStack width='33.3%' height={60} justifyContent='space-between' alignItems='center' py={1.5}>
                                                    <Box style={{height:20, backgroundColor:'#B7B7B7', width:50, alignItems:'center', justifyContent:'center', borderRadius:20}}>
                                                        <DefText text={'='} style={[styles.tableText, {color:'#fff', fontSize:12}]}  />
                                                    </Box>
                                                    <Box style={{height:20, backgroundColor:'#FF6262', width:50, alignItems:'center', justifyContent:'center', borderRadius:20}}>
                                                        <DefText text={'+'+10} style={[styles.tableText, {color:'#fff', fontSize:12}]}  />
                                                    </Box>
                                                </VStack>
                                            </HStack>
                                           
                                        </Box>
                                    </HStack>
                                   
                                    <HStack  >
                                        <Box width={(width - 40) *0.2 + 'px'} >
                                            <HStack alignItems='center'>
                                                <Box width='50%' height={60} justifyContent='center' py={1.5}>
                                                    <DefText text='저녁' style={[styles.tableText, {fontSize:15}]}  />
                                                </Box>
                                                <VStack width='50%' height={60} justifyContent='space-between' py={1.5}>
                                                    <Box >
                                                        <DefText text='식전' style={[styles.tableText]}  />
                                                    </Box>
                                                    <Box >
                                                        <DefText text='식후' style={[styles.tableText]}  />
                                                    </Box>
                                                </VStack>
                                            </HStack>
                                        </Box>
                                        <Box width={(width - 40 )*0.7 + 'px'} borderLeftWidth={1} borderLeftColor="#999">
                                            <HStack justifyContent='space-between' alignItems='center' >
                                                <VStack width='33.3%' height={60} justifyContent='space-between' py={1.5}>
                                                    <Box >
                                                        <DefText text={80} style={[styles.tableText]}  />
                                                    </Box>
                                                    <Box >
                                                        <DefText text={120} style={[styles.tableText]}  />
                                                    </Box>
                                                </VStack>
                                                <VStack width='33.3%' height={60} justifyContent='space-between' py={1.5}>
                                                    <Box >
                                                        <DefText text={80} style={[styles.tableText]}  />
                                                    </Box>
                                                    <Box >
                                                        <DefText text={140} style={[styles.tableText]}  />
                                                    </Box>
                                                </VStack>
                                                <VStack width='33.3%' height={60} justifyContent='space-between' alignItems='center' py={1.5}>
                                                    <Box style={{height:20, backgroundColor:'#B7B7B7', width:50, alignItems:'center', justifyContent:'center', borderRadius:20}}>
                                                        <DefText text={'='} style={[styles.tableText, {color:'#fff', fontSize:12}]}  />
                                                    </Box>
                                                    <Box style={{height:20, backgroundColor:'#FF6262', width:50, alignItems:'center', justifyContent:'center', borderRadius:20}}>
                                                        <DefText text={'+'+20} style={[styles.tableText, {color:'#fff', fontSize:12}]}  />
                                                    </Box>
                                                </VStack>
                                            </HStack>
                                           
                                        </Box>
                                    </HStack>
                                </Box>
                            </Box>

                            <VStack mt={5}>
                                <DefText text='주간 혈압통계' style={[styles.reportLabel, {marginBottom:10}]} />
                                <DefText text='최고혈압' style={styles.reportLabelSmall} />
                               
                                <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#FFCACA', '#FF9696', '#FF6262']} style={[{borderRadius:5, marginTop:10}]}>
                                    <Box style={[{position:'absolute', bottom:1, left:bloodPressurePercent+'%'}]}>
                                        <Image source={require('../images/smileIcons.png')} alt='수치' />
                                    </Box>
                                    <HStack justifyContent='space-around' height='35px' alignItems='flex-end' pb='5px'>
                                        <DefText text='정상' style={[styles.reportChartText, {color:'#333', fontWeight:'bold'}]} />
                                        <DefText text='주의' style={[styles.reportChartText, {color:'#333', fontWeight:'bold'}]} />
                                        <DefText text='고혈압전단계' style={[styles.reportChartText, {color:'#333', fontWeight:'bold'}]} />
                                        <DefText text='고혈압1기' style={[styles.reportChartText, {color:'#333', fontWeight:'bold'}]} />
                                        <DefText text='고혈압2기' style={[styles.reportChartText, {color:'#333', fontWeight:'bold'}]} />

                                    </HStack>
                                    
                                </LinearGradient>
                                <HStack justifyContent='space-around' height='35px' mt={1}>
                                    <DefText text='120' style={[styles.reportChartText, {color:'#333'}]} />
                                    <DefText text='130' style={[styles.reportChartText, {color:'#333'}]} />
                                    <DefText text='140' style={[styles.reportChartText, {color:'#333'}]} />
                                    <DefText text='160' style={[styles.reportChartText, {color:'#333'}]} />
                                </HStack>
                            </VStack>

                            <VStack mt={2.5}>
                                <DefText text='최저혈압' style={styles.reportLabelSmall} />
                               
                                <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#FFCACA', '#FF9696', '#FF6262']} style={[{borderRadius:5, marginTop:10}]}>
                                    <Box style={[{position:'absolute', bottom:1, left:bloodPressureLowPercent+'%'}]}>
                                        <Image source={require('../images/smileIcons.png')} alt='수치' />
                                    </Box>
                                    <HStack justifyContent='space-around' height='35px' alignItems='flex-end' pb='5px'>
                                        <DefText text='정상' style={[styles.reportChartText, {color:'#333', fontWeight:'bold'}]} />
                                        <DefText text='주의' style={[styles.reportChartText, {color:'#333', fontWeight:'bold'}]} />
                                        <DefText text='저혈압전단계' style={[styles.reportChartText, {color:'#333', fontWeight:'bold'}]} />
                                        <DefText text='저혈압1기' style={[styles.reportChartText, {color:'#333', fontWeight:'bold'}]} />
                                        <DefText text='저혈압2기' style={[styles.reportChartText, {color:'#333', fontWeight:'bold'}]} />

                                    </HStack>
                                    
                                </LinearGradient>
                                <HStack justifyContent='space-around' height='35px' mt={1}>
                                    <DefText text='70' style={[styles.reportChartText, {color:'#333'}]} />
                                    <DefText text='80' style={[styles.reportChartText, {color:'#333'}]} />
                                    <DefText text='90' style={[styles.reportChartText, {color:'#333'}]} />
                                    <DefText text='100' style={[styles.reportChartText, {color:'#333'}]} />
                                </HStack>
                            </VStack>

                            <Box alignItems='center'>
                                <LineChart
                                    data={dataBlood}
                                    width={width - 40}
                                    height={220}
                                    chartConfig={chartConfig}
                                    bezier
                                    fromZero={true} //0 부터시작 기본 false
                                    withShadow={false} // 선그림자 여부 기본 true
                                    yLabelsOffset={20} //y축 그래프 사이 여백
                                    segments={5} //y축 수치 세그먼트 기본 4
                                    style={{marginLeft:-10}}
                                    />
                            </Box>

                            
                            <VStack mt={5}>
                                <DefText text='복약통계' style={[styles.reportLabel, {marginBottom:10}]} />
                                <HStack alignItems='flex-end' justifyContent='space-between' backgroundColor='#F1F1F1' p={5} borderRadius={10} >
                                    <Box >
                                        <ProgressChart
                                            data={medicineData}
                                            width={firstChartWidth}
                                            height={firstChartWidth}
                                            strokeWidth={15}
                                            radius={ Platform.OS==='ios' ? firstChartWidth * 0.45 : firstChartWidth * 0.45 }
                                            chartConfig={chartConfigMedicine}
                                            hideLegend={true}
                                        />
                                         <Box style={{width:firstChartWidth, height:firstChartWidth, backgroundColor:'rgba(0,0,0,0,3)', position:'absolute', bottom:0, left:0, alignItems:'center', justifyContent:'center'}}>
                                            <DefText text={medicineData.labels} style={[styles.progerssChartText]} />
                                            <DefText text={medicineData.data * 100 + '%'} style={[styles.progerssChartNumber]}  />
                                            <DefText text={medicineData.medicineText} style={[styles.progerssChartText, medicineData.medicineText == '양호' ? {color:'#666'} : {color:'#f00'} ]}  />
                                        </Box>
                                    </Box>
                                    <Box>
                                        <ProgressChart
                                            data={medicineData2}
                                            width={secondChartWidth}
                                            height={secondChartWidth}
                                            strokeWidth={15}
                                            radius={Platform.OS==='ios' ? secondChartWidth * 0.44 : secondChartWidth * 0.44 }
                                            chartConfig={chartConfigMedicine2}
                                            hideLegend={true}
                                        />
                                         <Box style={{width:secondChartWidth, height:secondChartWidth, backgroundColor:'rgba(0,0,0,0,3)', position:'absolute', bottom:0, left:0, alignItems:'center', justifyContent:'center'}}>
                                            <DefText text={medicineData2.labels} style={[styles.progerssChartText]}  />
                                            <DefText text={medicineData2.data * 100 + '%'} style={[styles.progerssChartNumber]} />
                                            <DefText text={medicineData2.medicineText} style={[styles.progerssChartText, medicineData2.medicineText == '양호' ? {color:'#666'} : {color:'#f00'}]}  />
                                        </Box>
                                    </Box>
                                </HStack>
                                
                            </VStack>






                            <VStack mt={5}>
                                <DefText text='식습관 통계' style={[styles.reportLabel, {marginBottom:10}]} />
                                <Box p={5} backgroundColor='#F1F1F1' borderRadius={10}>
                                    <HStack justifyContent='space-around'>
                                        <VStack>
                                            <DefText text='전주평균' style={[styles.kcalAvgText]} />
                                            <DefText text={beforeWeekKcal + 'kcal'} style={[styles.kcalAvgNumber]} />
                                        </VStack>
                                        <VStack>
                                            <DefText text='주간평균' style={[styles.kcalAvgText]} />
                                            <DefText text={nowWeekKcal + 'kcal'} style={[styles.kcalAvgNumber, {fontSize:18}]} />
                                        </VStack>
                                        <VStack>
                                            <DefText text='권장' style={[styles.kcalAvgText]} />
                                            <DefText text={recommendKcal + 'kcal'} style={[styles.kcalAvgNumber]} />
                                        </VStack>
                                    </HStack>
                                    <Box width={width-80} backgroundColor='#fff' borderRadius={10} height={30} mt={5} alignItems='center' justifyContent='center'>
                                        {
                                            avgKcalFl > 0 ?
                                            <Box width={avgKcalTotals+'%'} backgroundColor='#F39595' borderRadius={10} height={30} alignItems='center' justifyContent='center'>
                                                <DefText text={avgKcalFl + '%'} />
                                            </Box>
                                            :
                                            <DefText text='0%'  />
                                        }
                                    </Box>
                                </Box>
                                <Box mt={5}>
                                    <LineChart
                                        data={dataKcal}
                                        width={width - 40}
                                        height={220}
                                        chartConfig={chartConfig}
                                        bezier
                                        fromZero={true} //0 부터시작 기본 false
                                        withShadow={false} // 선그림자 여부 기본 true
                                        yLabelsOffset={20} //y축 그래프 사이 여백
                                        segments={5} //y축 수치 세그먼트 기본 4
                                        hideLegend={true}
                                        style={{marginLeft:-10}}
                                    />
                                </Box>
                            </VStack>
                            <Box p={5} backgroundColor='#F1F1F1' borderRadius={10} mt={2.5}>
                                <DefText text='올바른 식사습관 달성도' style={[styles.reportLabel, {marginBottom:20}]} />
                                <VStack>
                                    <DefText text='규칙적인 식사 실천율 : 66%(총 21회, 달성 14회)' style={{fontSize:14,color:'#666'}} />
                                    <HStack alignItems='center' mt={2.5}>
                                        <Image source={require('../images/dangerIcon.png')} alt='주의' style={{marginRight:10}} />
                                        <DefText text='식사를 거를경우 당뇨발생 위험률이 높아집니다.' style={{fontSize:12, color:'#333', fontWeight:'bold'}} />
                                    </HStack>
                                </VStack>
                                <VStack mt={2.5}>
                                    <DefText text='규칙적인 식사 실천율 : 66%(총 21회, 달성 14회)' style={{fontSize:14,color:'#666'}} />
                                    <HStack alignItems='center' mt={2.5}>
                                        <Image source={require('../images/dangerIcon.png')} alt='주의' style={{marginRight:10}} />
                                        <DefText text='! 식사가 불규칙하게 이뤄집니다.(4-5시간 단위로 섭취 권장)' style={{fontSize:12, color:'#333', fontWeight:'bold'}} />
                                    </HStack>
                                </VStack>
                                <DefText text='균형잡힌 영양소 비율 달성 : 71%(총 7회, 달성 5회)' style={{fontSize:14,color:'#666', marginTop:10}} />
                                <DefText text='당류 섭취관리 : 71%(총 7회, 달성 5회)' style={{fontSize:14,color:'#666', marginTop:10}} />
                                <DefText text='콜레스테롤 섭취관리 :  71%(총 7회, 달성 5회)' style={{fontSize:14,color:'#666', marginTop:10}} />
                                <DefText text='나트륨 섭취관리 :  71%(총 7회, 달성 5회)' style={{fontSize:14,color:'#666', marginTop:10}} />
                            </Box>
                        </Box>
                        
                    </Box>
                </ScrollView>
                
            </Box>
        )
    }

    const SecondRoute = () => {

        return(
            <Box backgroundColor='#fff'>
                <ScrollView>
                    <Box px={5} pb={5} pt={2.5}>
                        <Box>
                            <DefText text='월간평균 혈당' style={styles.reportLabel} />
                            <VStack mt={2.5}>
                                <DefText text='공복혈당' style={styles.reportLabelSmall} />
                               
                                <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#FFCACA', '#FF9696', '#FF6262']} style={[{borderRadius:5, marginTop:10}]}>
                                    <Box style={[{position:'absolute', bottom:1, left:bloodPercent+'%'}]}>
                                        <Image source={require('../images/smileIcons.png')} alt='수치' />
                                    </Box> 
                                    <HStack justifyContent='space-around' height='35px' alignItems='flex-end' pb='5px'>
                                        <DefText text='정상' style={[styles.reportChartText, {color:'#333', fontWeight:'bold'}]} />
                                        <DefText text='당뇨전단계' style={[styles.reportChartText, {color:'#333', fontWeight:'bold'}]} />
                                        <DefText text='당뇨' style={[styles.reportChartText, {color:'#333', fontWeight:'bold'}]} />
                                    </HStack>
                                </LinearGradient>
                                <HStack justifyContent='space-around' height='35px' mt={1}>
                                    <DefText text='120' style={[styles.reportChartText, {color:'#333'}]} />
                                    <DefText text='130' style={[styles.reportChartText, {color:'#333'}]} />
                                    <DefText text='140' style={[styles.reportChartText, {color:'#333'}]} />
                                    <DefText text='160' style={[styles.reportChartText, {color:'#333'}]} />
                                </HStack>
                            </VStack>
                            <VStack mt={2.5}>
                                <DefText text='식후혈당' style={styles.reportLabelSmall} />
                               
                                <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#FFCACA', '#FF9696', '#FF6262']} style={[{borderRadius:5, marginTop:10}]}>
                                    <Box style={[{position:'absolute', bottom:1, left:foodBloodPer+'%'}]}>
                                        <Image source={require('../images/smileIcons.png')} alt='수치' />
                                    </Box>
                                    <HStack justifyContent='space-around' height='35px' alignItems='flex-end' pb='5px'>
                                        <DefText text='정상' style={[styles.reportChartText, {color:'#333', fontWeight:'bold'}]} />
                                        <DefText text='당뇨전단계' style={[styles.reportChartText, {color:'#333', fontWeight:'bold'}]} />
                                        <DefText text='당뇨' style={[styles.reportChartText, {color:'#333', fontWeight:'bold'}]} />
                                    </HStack>
                                </LinearGradient>
                                <HStack justifyContent='space-around' height='35px' mt={1}>
                                    <DefText text='120' style={[styles.reportChartText, {color:'#333'}]} />
                                    <DefText text='130' style={[styles.reportChartText, {color:'#333'}]} />
                                    <DefText text='140' style={[styles.reportChartText, {color:'#333'}]} />
                                    <DefText text='160' style={[styles.reportChartText, {color:'#333'}]} />
                                </HStack>
                            </VStack>
                            <Box mt={5} >
                                <LineChart
                                    data={data}
                                    width={width-40}
                                    height={300}
                                    chartConfig={chartConfig}
                                    bezier
                                    fromZero={true} //0 부터시작 기본 false
                                    withShadow={false} // 선그림자 여부 기본 true
                                    yLabelsOffset={20} //y축 그래프 사이 여백
                                    segments={5} //y축 수치 세그먼트 기본 4
                                    style={{marginLeft:-10}}
                                    />
                            </Box>

                            <Box mt={2.5} backgroundColor='#F1F1F1' borderRadius={10} p={5}>
                                <DefText text='정상혈당 달성도' style={[styles.reportLabel, {marginBottom:10}]} />
                                <VStack>
                                    <DefText text={'전체 : 90% (총 12회, 달성 11회)'} style={{fontSize:14, color:'#333'}}/>
                                    <DefText text={'공복 : 100% (총 7회, 달성 7회)'} style={{fontSize:14, color:'#333', marginTop:10}}/>
                                    <DefText text={'식후 : 80% (총 5회, 달성 4회)'} style={{fontSize:14, color:'#333', marginTop:10}}/>
                                </VStack>
                            </Box>
                            <Box mt={5} backgroundColor='#F1F1F1' borderRadius={10} p={5}>
                                <DefText text='혈당 값 추세' style={[styles.reportLabel, {marginBottom:10}]} />
                                <Box>
                                    <HStack justifyContent='space-between' borderBottomWidth={1} borderBottomColor='#999'>
                                        <Box width={(width - 40) *0.2 + 'px'} />
                                        <Box width={(width - 40 )*0.7 + 'px'} borderLeftWidth={1} borderLeftColor="#999">
                                            <HStack justifyContent='space-between' py={2.5}>
                                                <Box width='33.3%' >
                                                    <DefText text='지난주' style={[styles.tableText]} />
                                                </Box>
                                                <Box width='33.3%' >
                                                    <DefText text='이번주' style={[styles.tableText]} />
                                                </Box>
                                                <Box width='33.3%'  />
                                            </HStack>
                                        </Box>
                                    </HStack>
                                   
                                    <HStack borderBottomWidth={1} borderBottomColor='#999' >
                                        <Box width={(width - 40) *0.2 + 'px'} >
                                            <HStack alignItems='center'>
                                                <Box width='50%' height={60} justifyContent='center' py={1.5}>
                                                    <DefText text='아침' style={[styles.tableText, {fontSize:15}]}  />
                                                </Box>
                                                <VStack width='50%' height={60} justifyContent='space-between' py={1.5}>
                                                    <Box >
                                                        <DefText text='식전' style={[styles.tableText]}  />
                                                    </Box>
                                                    <Box >
                                                        <DefText text='식후' style={[styles.tableText]}  />
                                                    </Box>
                                                </VStack>
                                            </HStack>
                                        </Box>
                                        <Box width={(width - 40 )*0.7 + 'px'} borderLeftWidth={1} borderLeftColor="#999">
                                            <HStack justifyContent='space-between' alignItems='center' >
                                                <VStack width='33.3%' height={60} justifyContent='space-between' py={1.5}>
                                                    <Box >
                                                        <DefText text={80} style={[styles.tableText]}  />
                                                    </Box>
                                                    <Box >
                                                        <DefText text={120} style={[styles.tableText]}  />
                                                    </Box>
                                                </VStack>
                                                <VStack width='33.3%' height={60} justifyContent='space-between' py={1.5}>
                                                    <Box >
                                                        <DefText text={90} style={[styles.tableText]}  />
                                                    </Box>
                                                    <Box >
                                                        <DefText text={122} style={[styles.tableText]}  />
                                                    </Box>
                                                </VStack>
                                                <VStack width='33.3%' height={60} justifyContent='space-between' alignItems='center' py={1.5}>
                                                    <Box style={{height:20, backgroundColor:'#FF6262', width:50, alignItems:'center', justifyContent:'center', borderRadius:20}}>
                                                        <DefText text={'+'+10} style={[styles.tableText, {color:'#fff', fontSize:12}]}  />
                                                    </Box>
                                                    <Box style={{height:20, backgroundColor:'#FF6262', width:50, alignItems:'center', justifyContent:'center', borderRadius:20}}>
                                                        <DefText text={'+'+2} style={[styles.tableText, {color:'#fff', fontSize:12}]}  />
                                                    </Box>
                                                </VStack>
                                            </HStack>
                                           
                                        </Box>
                                    </HStack>
                               
                                    <HStack borderBottomWidth={1} borderBottomColor='#999' >
                                        <Box width={(width - 40) *0.2 + 'px'} >
                                            <HStack alignItems='center'>
                                                <Box width='50%' height={60} justifyContent='center' py={1.5}>
                                                    <DefText text='점심' style={[styles.tableText, {fontSize:15}]}  />
                                                </Box>
                                                <VStack width='50%' height={60} justifyContent='space-between' py={1.5}>
                                                    <Box >
                                                        <DefText text='식전' style={[styles.tableText]}  />
                                                    </Box>
                                                    <Box >
                                                        <DefText text='식후' style={[styles.tableText]}  />
                                                    </Box>
                                                </VStack>
                                            </HStack>
                                        </Box>
                                        <Box width={(width - 40 )*0.7 + 'px'} borderLeftWidth={1} borderLeftColor="#999">
                                            <HStack justifyContent='space-between' alignItems='center' >
                                                <VStack width='33.3%' height={60} justifyContent='space-between' py={1.5}>
                                                    <Box >
                                                        <DefText text={80} style={[styles.tableText]}  />
                                                    </Box>
                                                    <Box >
                                                        <DefText text={120} style={[styles.tableText]}  />
                                                    </Box>
                                                </VStack>
                                                <VStack width='33.3%' height={60} justifyContent='space-between' py={1.5}>
                                                    <Box >
                                                        <DefText text={80} style={[styles.tableText]}  />
                                                    </Box>
                                                    <Box >
                                                        <DefText text={130} style={[styles.tableText]}  />
                                                    </Box>
                                                </VStack>
                                                <VStack width='33.3%' height={60} justifyContent='space-between' alignItems='center' py={1.5}>
                                                    <Box style={{height:20, backgroundColor:'#B7B7B7', width:50, alignItems:'center', justifyContent:'center', borderRadius:20}}>
                                                        <DefText text={'='} style={[styles.tableText, {color:'#fff', fontSize:12}]}  />
                                                    </Box>
                                                    <Box style={{height:20, backgroundColor:'#FF6262', width:50, alignItems:'center', justifyContent:'center', borderRadius:20}}>
                                                        <DefText text={'+'+10} style={[styles.tableText, {color:'#fff', fontSize:12}]}  />
                                                    </Box>
                                                </VStack>
                                            </HStack>
                                           
                                        </Box>
                                    </HStack>
                                   
                                    <HStack  >
                                        <Box width={(width - 40) *0.2 + 'px'} >
                                            <HStack alignItems='center'>
                                                <Box width='50%' height={60} justifyContent='center' py={1.5}>
                                                    <DefText text='저녁' style={[styles.tableText, {fontSize:15}]}  />
                                                </Box>
                                                <VStack width='50%' height={60} justifyContent='space-between' py={1.5}>
                                                    <Box >
                                                        <DefText text='식전' style={[styles.tableText]}  />
                                                    </Box>
                                                    <Box >
                                                        <DefText text='식후' style={[styles.tableText]}  />
                                                    </Box>
                                                </VStack>
                                            </HStack>
                                        </Box>
                                        <Box width={(width - 40 )*0.7 + 'px'} borderLeftWidth={1} borderLeftColor="#999">
                                            <HStack justifyContent='space-between' alignItems='center' >
                                                <VStack width='33.3%' height={60} justifyContent='space-between' py={1.5}>
                                                    <Box >
                                                        <DefText text={80} style={[styles.tableText]}  />
                                                    </Box>
                                                    <Box >
                                                        <DefText text={120} style={[styles.tableText]}  />
                                                    </Box>
                                                </VStack>
                                                <VStack width='33.3%' height={60} justifyContent='space-between' py={1.5}>
                                                    <Box >
                                                        <DefText text={80} style={[styles.tableText]}  />
                                                    </Box>
                                                    <Box >
                                                        <DefText text={140} style={[styles.tableText]}  />
                                                    </Box>
                                                </VStack>
                                                <VStack width='33.3%' height={60} justifyContent='space-between' alignItems='center' py={1.5}>
                                                    <Box style={{height:20, backgroundColor:'#B7B7B7', width:50, alignItems:'center', justifyContent:'center', borderRadius:20}}>
                                                        <DefText text={'='} style={[styles.tableText, {color:'#fff', fontSize:12}]}  />
                                                    </Box>
                                                    <Box style={{height:20, backgroundColor:'#FF6262', width:50, alignItems:'center', justifyContent:'center', borderRadius:20}}>
                                                        <DefText text={'+'+20} style={[styles.tableText, {color:'#fff', fontSize:12}]}  />
                                                    </Box>
                                                </VStack>
                                            </HStack>
                                           
                                        </Box>
                                    </HStack>
                                </Box>
                            </Box>

                            <VStack mt={5}>
                                <DefText text='월간 혈압통계' style={[styles.reportLabel, {marginBottom:10}]} />
                                <DefText text='최고혈압' style={styles.reportLabelSmall} />
                               
                                <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#FFCACA', '#FF9696', '#FF6262']} style={[{borderRadius:5, marginTop:10}]}>
                                    <Box style={[{position:'absolute', bottom:1, left:bloodPressurePercent+'%'}]}>
                                        <Image source={require('../images/smileIcons.png')} alt='수치' />
                                    </Box>
                                    <HStack justifyContent='space-around' height='35px' alignItems='flex-end' pb='5px'>
                                        <DefText text='정상' style={[styles.reportChartText, {color:'#333', fontWeight:'bold'}]} />
                                        <DefText text='주의' style={[styles.reportChartText, {color:'#333', fontWeight:'bold'}]} />
                                        <DefText text='고혈압전단계' style={[styles.reportChartText, {color:'#333', fontWeight:'bold'}]} />
                                        <DefText text='고혈압1기' style={[styles.reportChartText, {color:'#333', fontWeight:'bold'}]} />
                                        <DefText text='고혈압2기' style={[styles.reportChartText, {color:'#333', fontWeight:'bold'}]} />

                                    </HStack>
                                    
                                </LinearGradient>
                                <HStack justifyContent='space-around' height='35px' mt={1}>
                                    <DefText text='120' style={[styles.reportChartText, {color:'#333'}]} />
                                    <DefText text='130' style={[styles.reportChartText, {color:'#333'}]} />
                                    <DefText text='140' style={[styles.reportChartText, {color:'#333'}]} />
                                    <DefText text='160' style={[styles.reportChartText, {color:'#333'}]} />
                                </HStack>
                            </VStack>

                            <VStack mt={2.5}>
                                <DefText text='최저혈압' style={styles.reportLabelSmall} />
                               
                                <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#FFCACA', '#FF9696', '#FF6262']} style={[{borderRadius:5, marginTop:10}]}>
                                    <Box style={[{position:'absolute', bottom:1, left:bloodPressureLowPercent+'%'}]}>
                                        <Image source={require('../images/smileIcons.png')} alt='수치' />
                                    </Box>
                                    <HStack justifyContent='space-around' height='35px' alignItems='flex-end' pb='5px'>
                                        <DefText text='정상' style={[styles.reportChartText, {color:'#333', fontWeight:'bold'}]} />
                                        <DefText text='주의' style={[styles.reportChartText, {color:'#333', fontWeight:'bold'}]} />
                                        <DefText text='저혈압전단계' style={[styles.reportChartText, {color:'#333', fontWeight:'bold'}]} />
                                        <DefText text='저혈압1기' style={[styles.reportChartText, {color:'#333', fontWeight:'bold'}]} />
                                        <DefText text='저혈압2기' style={[styles.reportChartText, {color:'#333', fontWeight:'bold'}]} />

                                    </HStack>
                                    
                                </LinearGradient>
                                <HStack justifyContent='space-around' height='35px' mt={1}>
                                    <DefText text='70' style={[styles.reportChartText, {color:'#333'}]} />
                                    <DefText text='80' style={[styles.reportChartText, {color:'#333'}]} />
                                    <DefText text='90' style={[styles.reportChartText, {color:'#333'}]} />
                                    <DefText text='100' style={[styles.reportChartText, {color:'#333'}]} />
                                </HStack>
                            </VStack>

                            <Box>
                                <LineChart
                                    data={dataBlood}
                                    width={width - 40}
                                    height={220}
                                    chartConfig={chartConfig}
                                    bezier
                                    fromZero={true} //0 부터시작 기본 false
                                    withShadow={false} // 선그림자 여부 기본 true
                                    yLabelsOffset={20} //y축 그래프 사이 여백
                                    segments={5} //y축 수치 세그먼트 기본 4
                                    style={{marginLeft:-10}}
                                    />
                            </Box>

                            <VStack mt={5}>
                                <DefText text='복약통계' style={[styles.reportLabel, {marginBottom:10}]} />
                                <HStack alignItems='flex-end' justifyContent='space-between' backgroundColor='#F1F1F1' p={5} borderRadius={10} >
                                    <Box width={firstChartWidth} height={firstChartWidth}>
                                        <ProgressChart
                                            data={medicineData}
                                            width={firstChartWidth}
                                            height={firstChartWidth}
                                            strokeWidth={15}
                                            radius={Platform.OS==='ios' ? firstChartWidth * 0.44 : firstChartWidth * 0.44}
                                            chartConfig={chartConfigMedicine}
                                            hideLegend={true}
                                        />
                                         <Box style={{width:firstChartWidth, height:firstChartWidth, backgroundColor:'rgba(0,0,0,0,3)', position:'absolute', bottom:0, left:0, alignItems:'center', justifyContent:'center'}}>
                                            <DefText text={medicineData.labels} style={[styles.progerssChartText]} />
                                            <DefText text={medicineData.data * 100 + '%'} style={[styles.progerssChartNumber]}  />
                                            <DefText text={medicineData.medicineText} style={[styles.progerssChartText, medicineData.medicineText == '양호' ? {color:'#666'} : {color:'#f00'} ]}  />
                                        </Box>
                                    </Box>
                                    <Box>
                                        <ProgressChart
                                            data={medicineData2}
                                            width={secondChartWidth}
                                            height={secondChartWidth}
                                            strokeWidth={15}
                                            radius={Platform.OS==='ios' ? secondChartWidth * 0.44 : secondChartWidth * 0.44}
                                            chartConfig={chartConfigMedicine2}
                                            hideLegend={true}
                                        />
                                         <Box style={{width:secondChartWidth, height:secondChartWidth, backgroundColor:'rgba(0,0,0,0,3)', position:'absolute', bottom:0, left:0, alignItems:'center', justifyContent:'center'}}>
                                            <DefText text={medicineData2.labels} style={[styles.progerssChartText]}  />
                                            <DefText text={medicineData2.data * 100 + '%'} style={[styles.progerssChartNumber]} />
                                            <DefText text={medicineData2.medicineText} style={[styles.progerssChartText, medicineData2.medicineText == '양호' ? {color:'#666'} : {color:'#f00'}]}  />
                                        </Box>
                                    </Box>
                                </HStack>
                                
                            </VStack>
                            <VStack mt={5}>
                                <DefText text='식습관 통계' style={[styles.reportLabel, {marginBottom:10}]} />
                                <Box p={5} backgroundColor='#F1F1F1' borderRadius={10}>
                                    <HStack justifyContent='space-around'>
                                        <VStack>
                                            <DefText text='전주평균' style={[styles.kcalAvgText]} />
                                            <DefText text={beforeWeekKcal + 'kcal'} style={[styles.kcalAvgNumber]} />
                                        </VStack>
                                        <VStack>
                                            <DefText text='주간평균' style={[styles.kcalAvgText]} />
                                            <DefText text={nowWeekKcal + 'kcal'} style={[styles.kcalAvgNumber, {fontSize:18}]} />
                                        </VStack>
                                        <VStack>
                                            <DefText text='권장' style={[styles.kcalAvgText]} />
                                            <DefText text={recommendKcal + 'kcal'} style={[styles.kcalAvgNumber]} />
                                        </VStack>
                                    </HStack>
                                    <Box width={width-80} backgroundColor='#fff' borderRadius={10} height={30} mt={5} alignItems='center' justifyContent='center'>
                                        {
                                            avgKcalFl > 0 ?
                                            <Box width={avgKcalTotals+'%'} backgroundColor='#F39595' borderRadius={10} height={30} alignItems='center' justifyContent='center'>
                                                <DefText text={avgKcalFl + '%'} />
                                            </Box>
                                            :
                                            <DefText text='0%'  />
                                        }
                                    </Box>
                                </Box>
                                <Box mt={5}>
                                    <LineChart
                                        data={dataKcal}
                                        width={width - 40}
                                        height={220}
                                        chartConfig={chartConfig}
                                        bezier
                                        fromZero={true} //0 부터시작 기본 false
                                        withShadow={false} // 선그림자 여부 기본 true
                                        yLabelsOffset={20} //y축 그래프 사이 여백
                                        segments={5} //y축 수치 세그먼트 기본 4
                                        hideLegend={true}
                                        style={{marginLeft:-10}}
                                    />
                                </Box>
                                <Box mt={2.5}>
                                    <DefText text='체중변화' style={[styles.reportLabel]} />
                                    <LineChart
                                        data={dataWeight}
                                        width={width - 40}
                                        height={220}
                                        chartConfig={chartConfig}
                                        bezier
                                        fromZero={true} //0 부터시작 기본 false
                                        withShadow={false} // 선그림자 여부 기본 true
                                        yLabelsOffset={20} //y축 그래프 사이 여백
                                        segments={5} //y축 수치 세그먼트 기본 4
                                        hideLegend={true}
                                        style={{marginLeft:-10}}
                                    />
                                </Box>
                                <Box mt={2.5}>
                                    <DefText text='근육량 변화' style={[styles.reportLabel]} />
                                    <LineChart
                                        data={dataMuscle}
                                        width={width - 40}
                                        height={220}
                                        chartConfig={chartConfig}
                                        bezier
                                        fromZero={true} //0 부터시작 기본 false
                                        withShadow={false} // 선그림자 여부 기본 true
                                        yLabelsOffset={20} //y축 그래프 사이 여백
                                        segments={5} //y축 수치 세그먼트 기본 4
                                        hideLegend={true}
                                        style={{marginLeft:-10}}
                                    />
                                </Box>
                                <Box mt={2.5}>
                                    <DefText text='체지방량 변화' style={[styles.reportLabel]} />
                                    <LineChart
                                        data={dataFat}
                                        width={width - 40}
                                        height={220}
                                        chartConfig={chartConfig}
                                        bezier
                                        fromZero={true} //0 부터시작 기본 false
                                        withShadow={false} // 선그림자 여부 기본 true
                                        yLabelsOffset={20} //y축 그래프 사이 여백
                                        segments={5} //y축 수치 세그먼트 기본 4
                                        hideLegend={true}
                                        style={{marginLeft:-10}}
                                    />
                                </Box>
                            </VStack>
                            
                        </Box>
                        
                    </Box>
                </ScrollView>
                
            </Box>
        )
    }

    const [index, setIndex] = useState(0);
    const [routes] = useState([
        {
            key : 'first',
            title : '주간',
       
        },
        {
            key : 'second',
            title : '월간',
   
        }
    ])

    const _renderTabBar = (props) => {
        const inputRange = props.navigationState.routes.map((x,i)=>i);

        return(
            <Box p={5} pb={2.5}>
                <HStack justifyContent='space-between'>
                {props.navigationState.routes.map((route, i)=>{
                    const opacity = props.position.interpolate({
                        inputRange,
                        outputRange:inputRange.map((inputIndex)=>
                            inputIndex === i ? 1 : 0.5
                        )
                    });
         

                    return (
                        <TouchableOpacity
                          key={i}
                          onPress={() => setIndex(i)}
                          style={[styles.tabButton, index === i ? { backgroundColor:'#666', borderWidth:0} : { backgroundColor:'#dfdfdf', borderWidth:1}]}
                        >
                          <Animated.Text style={[ {fontSize:13}, index === i ? { color:'#fff'} : { color:'#191919'} ]}>{route.title}</Animated.Text>
                        </TouchableOpacity>
                      );
                })}
                </HStack>
            </Box>
        )
    }

    const renderScene = SceneMap({
        first: FirstRoute,
        second: SecondRoute,
    });

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderDefault headerTitle='리포트' navigation={navigation} />

            <TabView
                navigation={navigation}
                navigationState={{index, routes}}
                renderScene={renderScene}
                renderTabBar={_renderTabBar}
                onIndexChange={setIndex}
                initialLayout={initialLayout}
            />
        </Box>
    );
};

const styles = StyleSheet.create({
    tabButton:{
        
        width:width*0.43,
        height: 30,
        borderWidth:1,
        borderColor:'#f2f2f2',
        backgroundColor:'#dfdfdf',
        //alignItems:'center',
        alignItems:'center',
        justifyContent:'center',
        borderRadius:5
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
    tableText: {
        fontSize:14,
        color:'#333',
        textAlign:'center'
    },
    progerssChartText: {
        fontSize:14,
        color:'#333'
    },
    progerssChartNumber : {
        fontSize:18,
        color:'#333',
        fontWeight:'bold',
        marginVertical:2.5
    },
    kcalAvgText: {
        fontSize:15,
        color:'#666',
        marginBottom:10,
        fontWeight:'bold',
        textAlign:'center'
    },
    kcalAvgNumber : {
        fontSize:15,
        color:'#666',
        textAlign:'center'

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
)(Report);