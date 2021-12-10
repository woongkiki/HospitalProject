import React, {useState, useEffect} from 'react';
import { Box, HStack, VStack, Image } from 'native-base';
import { TouchableOpacity, ScrollView, Dimensions, Animated, StyleSheet, Text, Platform, ActivityIndicator, Linking } from 'react-native';
import { DefText } from '../common/BOOTSTRAP';
import LinearGradient from 'react-native-linear-gradient';
import {LineChart, ProgressChart} from 'react-native-chart-kit'
import Api from '../Api';
import { connect } from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';

const {width} = Dimensions.get('window');

const initialLayout = { width: Dimensions.get('window').width };

const firstChartWidth = (width - 80) * 0.5;

const secondChartWidth = (width - 80) * 0.45;

const ReportWeeks = (props) => {

    const {navigation, userInfo} = props;

    const isFocused = useIsFocused();
 
    useEffect(() => {
      
      if (isFocused){
        ReportDataReceive();
        
      } 
        
    }, [isFocused]);


    const [bloodSugarGraph, setBloodSugarGraph] = useState('');
    const [bloodSugarAvgBefore, setBloodSugarAvgBefore] = useState(-1);
    const [bloodSugarAvgAfter, setBloodSugarAvgAfter] = useState(-1);
    const [bloodSugarGraphData, setBloodSugarGraphData] = useState('');

    const [bloodSugarKeyData, setBloodSugarKeyData] = useState([]);
    const [bloodSugarData, setBloodSugarData] = useState([130, 0, 190, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);


    const [bloodSugarGoalTotal, setBloodSugarGoalTotal] = useState('');
    const [bloodSugarGoalPercent, setBloodSugarGoalPercent] = useState('');
    const [bloodSugarGoalCount, setBloodSugarGoalCount] = useState('');

    const [bloodSugarGoalBeforeTotal, setBloodSugarGoaBeforelTotal] = useState('');
    const [bloodSugarGoalBeforePercent, setBloodSugarGoalBeforePercent] = useState('');
    const [bloodSugarGoalBeforeCount, setBloodSugarGoalBeforeCount] = useState('');

    const [bloodSugarGoalAfterTotal, setBloodSugarGoalAfterlTotal] = useState('');
    const [bloodSugarGoalAfterPercent, setBloodSugarGoalAfterPercent] = useState('');
    const [bloodSugarGoalAfterCount, setBloodSugarGoalAfterCount] = useState('');

    const [sugarArr, setSugarArr] = useState('');
    const [sugarArrTerm1, setSugarTerm1] = useState('');
    const [sugarArrTerm2, setSugarTerm2] = useState('');
    const [sugarArrTerm3, setSugarTerm3] = useState('');
    const [sugarArrTerm4, setSugarTerm4] = useState('');
    const [sugarArrTerm5, setSugarTerm5] = useState('');
    const [sugarArrTerm6, setSugarTerm6] = useState('');


    const [bloodPHigh, setBloodPHigh] = useState('-1');
    const [bloodPLow, setBloodPLow] = useState('-1');

    const [bloodPressureType, setBloodPressureType] = useState([]);
    const [bloodPHighData, setBloodPHighData] = useState([]);
    const [bloodPLowData, setBloodPLowData] = useState([]);

    const [drugData1, setDrugData1] = useState('');
    const [drugData2, setDrugData2] = useState('');

    const [beforeKcalData, setBeforeKcalData] = useState('');
    const [nowKcalData, setNowKcalData] = useState('');
    const [recomKcalData, setRecomKcalData] = useState('');
    const [kcalEat, setKcalEat] = useState('');
    const [foodGraphKey, setFoodGraphKey] = useState([]);
    const [foodGraphValue, setFoodGraphValue] = useState([]);


    const [ruleMeal, setRuleMeal] = useState('');
    const [ruleMealAlert, setRuleMealAlert] = useState('');

    const [ruleTime, setRuleTime] = useState('');
    const [ruleTimeAlert, setRuleTimeAlert] = useState('');

    const [ruleNutrient, setRuleNurient] = useState('');
    const [ruleNutrientAlert, setRuleNutrientAlert] = useState('');

    const [ruleSugar, setRuleSugar] = useState('');
    const [ruleSugarAlert, setRuleSugarAlert] = useState('');

    const [ruleCholesterol, setRuleCholesterol] = useState('');
    const [ruleCholesterolAlert, setRuleCholesterolAlert] = useState('');

    const [ruleSalt, setRuleSalt] = useState('');
    const [ruleSaltAlert, setRuleSaltAlert] = useState('');

    const [reportLoading, setReportLoading] = useState(false);

    const ReportDataReceive = async () => {

        await setReportLoading(true);

        await Api.send('report_week', {'id':userInfo.id, 'token':userInfo.appToken}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                //console.log('123:::::::::', arrItems);

               
                setBloodSugarGraph(arrItems.avg_sugar1);
                

                //공복혈당 평균
                let bblevel = arrItems.avg_sugar1;
            
                if(bblevel < 80)   bblevel = 80;
                if(bblevel > 140)   bblevel = 140;
                bblevel = (bblevel * 1 - 91.7) * 2.405 * 0.92;

               // console.log('213213123123123123',bblevel)
                setBloodSugarAvgBefore(bblevel)


                //식후혈당 평균

                let balevel = arrItems.avg_sugar2;

                //console.log('식후혈당:::',balevel);

                if(balevel < 120)   balevel = 120;
                if(balevel > 220)   balevel = 220;
                balevel = (balevel * 1 - 120) * 0.92;

                //console.log('213213123',balevel)
                setBloodSugarAvgAfter(balevel);

                

                let graph_keys = Object.keys(arrItems.sugar_graph);

                let graphKeysDatas = [];
                graph_keys.map((e, i)=> {
                    graphKeysDatas[i] = graph_keys[i].split('_')[0].substring(5,10) + ' ' + graph_keys[i].split('_')[1]+'시';
                })
                //console.log('123123', graph_keys[0].split('_')[1]);


                //키값저장
                setBloodSugarKeyData(graphKeysDatas);
                //setBloodSugarKeyData(graphKeysDatas)

                setBloodSugarData(Object.values(arrItems.sugar_graph));


                //정상혈당 달성도
                setBloodSugarGoalPercent(arrItems.sugar_all_per);
                setBloodSugarGoalTotal(arrItems.sugar_all_total);
                setBloodSugarGoalCount(arrItems.sugar_all_cnt);

                //공복혈당 달성도
                setBloodSugarGoaBeforelTotal(arrItems.sugar_1_total);
                setBloodSugarGoalBeforePercent(arrItems.sugar_1_per);
                setBloodSugarGoalBeforeCount(arrItems.sugar_1_cnt);

                //식후혈당 달성도
                //console.log('11', arrItems.sugar_2_total);
                setBloodSugarGoalAfterlTotal(arrItems.sugar_2_total);
                setBloodSugarGoalAfterPercent(arrItems.sugar_2_per);
                setBloodSugarGoalAfterCount(arrItems.sugar_2_cnt);


                //혈당값추세
                setSugarArr(Object.values(arrItems.sugar_arr));

                let sugarArrs1;
                let sugarArrs2;
                let sugarArrs3;
                let sugarArrs4;
                let sugarArrs5;
                let sugarArrs6;

                sugarArrs1 = Object.values(arrItems.sugar_arr)[0]['now_level'] - Object.values(arrItems.sugar_arr)[0]['before_level']; //아침식전
                sugarArrs2 = Object.values(arrItems.sugar_arr)[1]['now_level'] - Object.values(arrItems.sugar_arr)[1]['before_level']; //아침식후

                sugarArrs3 = Object.values(arrItems.sugar_arr)[2]['now_level'] - Object.values(arrItems.sugar_arr)[2]['before_level']; //점심식전
                sugarArrs4 = Object.values(arrItems.sugar_arr)[3]['now_level'] - Object.values(arrItems.sugar_arr)[3]['before_level']; //점심식전

                sugarArrs5 = Object.values(arrItems.sugar_arr)[4]['now_level'] - Object.values(arrItems.sugar_arr)[4]['before_level']; //점심식전
                sugarArrs6 = Object.values(arrItems.sugar_arr)[5]['now_level'] - Object.values(arrItems.sugar_arr)[5]['before_level']; //점심식전
                

                setSugarTerm1(sugarArrs1);
                setSugarTerm2(sugarArrs2);
                setSugarTerm3(sugarArrs3);
                setSugarTerm4(sugarArrs4);
                setSugarTerm5(sugarArrs5);
                setSugarTerm6(sugarArrs6);

                //최고혈압

                let bloodHighs = arrItems.avg_pressure1;

                
                let boxWidths  = 0;
             
                if(bloodHighs < 100)   bloodHighs = 100;
                if(bloodHighs > 180)   bloodHighs = 180;
                if(bloodHighs >= 100 && bloodHighs < 120) boxWidths = 0;
                if(bloodHighs >= 120 && bloodHighs < 130) boxWidths = 25;
                if(bloodHighs >= 130 && bloodHighs < 140) boxWidths = 50;
                if(bloodHighs >= 140 && bloodHighs < 160) boxWidths = 75;
                if(bloodHighs >= 160)   boxWidths = 95;
                boxWidths = boxWidths * 0.92;

                setBloodPHigh(boxWidths);

               

                //최저혈압
                let bloodLows = arrItems.avg_pressure2;
        
                if(bloodLows < 60)   bloodLows = 60;
                if(bloodLows > 110)   bloodLows = 110;
                bloodLows = (bloodLows * 1 - 60) * 2 * 0.92;

                setBloodPLow(bloodLows);
                

                //setBloodPLow(arrItems.avg_pressure1);


                //날짜별 혈압정보
                //console.log('34343', Object.values(arrItems.pressure_graph)[0].high);

                let bloodpgraphValue = Object.keys(arrItems.pressure_graph);
                let bloodpKeyArr = [];
                bloodpgraphValue.map((e, i)=> {
                    bloodpKeyArr[i] = bloodpgraphValue[i].substring(5,10);
                })

                setBloodPressureType(bloodpKeyArr)
                //let pressureKey


                let bpgraph_keys = Object.values(arrItems.pressure_graph);

                let bloodPHightData = [];
                bpgraph_keys.map((e, i)=> {
                    if(bpgraph_keys[i].high != undefined){
                        bloodPHightData[i] = bpgraph_keys[i].high;
                    }else{
                        bloodPHightData[i] = 0;
                    }
                    //console.log(bpgraph_keys[i].high);
                })

                //console.log(bloodPHightData);
                setBloodPHighData(bloodPHightData);


                let bloodPLowData = [];
                bpgraph_keys.map((e, i)=> {
                    if(bpgraph_keys[i].low != undefined){
                        bloodPLowData[i] = bpgraph_keys[i].low;
                    }else{
                        bloodPLowData[i] = 0;
                    }
                    //console.log(bpgraph_keys[i].high);
                })
                setBloodPLowData(bloodPLowData);


                let drug_percent1 = arrItems.drug_per1;

                drug_percent1 = drug_percent1 / 100;

                let drug_percent2 = arrItems.drug_per2;

                drug_percent2 = drug_percent2 / 100;
                
                //약정보
                setDrugData1(drug_percent1)
                setDrugData2(drug_percent2)

                console.log(arrItems.avg_kcal1);
                //식단 칼로리
                setBeforeKcalData(arrItems.before_kcal);
                setNowKcalData(arrItems.avg_kcal1);
                setRecomKcalData(arrItems.recom_kcal);

                let kcalEats = (arrItems.avg_kcal1 / arrItems.recom_kcal) * 100;

                console.log('kaclE', kcalEats);

                if(kcalEats>100){
                    setKcalEat(100);
                }else{
                    setKcalEat( Math.round(kcalEats));
                }


                //식단 그래프용
                let foodGraphKey = Object.keys(arrItems.kcal_graph);
                let foodGraphKeyArr = [];
                foodGraphKey.map((e, i)=> {
                    foodGraphKeyArr[i] = foodGraphKey[i].substring(5,10);
                })
                
                setFoodGraphKey(foodGraphKeyArr);

                let foodGraphValue = Object.values(arrItems.kcal_graph);
                let foodGraphValueArr = [];
                foodGraphValue.map((e, i)=> {
                    foodGraphValueArr[i] = foodGraphValue[i];
                })

                setFoodGraphValue(foodGraphValueArr);

                //식사 실천율
                setRuleMeal(arrItems.rule_meal);
                setRuleMealAlert(arrItems.rule_meal_alert);

                //식사습관
                setRuleTime(arrItems.rule_time);
                setRuleTimeAlert(arrItems.rule_time_alert)

                //균형잡힌 영양소
                setRuleNurient(arrItems.rule_nutrient);
                setRuleNutrientAlert(arrItems.rule_nutrient_alert);

                //당류 섭취
                setRuleSugar(arrItems.rule_sugar);
                setRuleSugarAlert(arrItems.rule_sugar_alert);

                //콜레스테롤 섭취
                setRuleCholesterol(arrItems.rule_cholesterol);
                setRuleCholesterolAlert(arrItems.rule_cholesterol_alert);

                //나트륨 섭취
                setRuleSalt(arrItems.rule_salt);
                setRuleSaltAlert(arrItems.rule_salt_alert);

            }else{
                console.log('결과 출력 실패!', resultItem);
               //ToastMessage(resultItem.message);
            }
        });

        await setReportLoading(false);
    }

    useEffect(()=>{
        ReportDataReceive();
    }, [])


    useEffect(()=>{
        console.log('값이 들어왔어',bloodPHigh);
    }, [bloodPHigh])
    ////////

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


    //혈압 그래프용
    const dataBlood = {
        labels: bloodPressureType,
        datasets: [
          {
            data: bloodPHighData,
            color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`, // optional
            strokeWidth: 2, // optional
           
          },
          {
            data: bloodPLowData,
            color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`, // optional
            strokeWidth: 2 // optional
          }
        ],
        legend: ["확장기","수축기"], // optional
        fromZero : false
    };


    //복약 그래프

    const medicineData = {
        labels: ["조제약 복용률"], // optional
        data: [drugData1],
        medicineText: drugData1 > 0.5 ? '양호' : '주의'
      };

      const medicineData2 = {
        labels: ["영양제 복용률"], // optional
        data: [drugData2],
        medicineText: drugData2 > 0.5 ? '양호' : '주의'
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


      /*식단용*/
      const dataKcal = {
        labels: foodGraphKey,
        datasets: [
          {
            data: foodGraphValue,
            color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`, // optional
            strokeWidth: 2, // optional
           
          },
          
        ],
        //legend: ["칼로리 섭취",], // optional
        fromZero : false
      };


    return (
        <Box flex={1} backgroundColor='#fff'>
            {
                reportLoading ? 
                <Box flex={1} backgroundColor='#fff' alignItems='center' justifyContent='center' height='300px'>
                    <ActivityIndicator size='large' color='#333' />
                </Box>
                :
                <>
                    <DefText text='주간평균 혈당' style={styles.reportLabel} />
                    <VStack mt={2.5}>
                        <DefText text='공복혈당' style={styles.reportLabelSmall} />
                        
                        <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#FFCACA', '#FF9696', '#FF6262']} style={[{borderRadius:5, marginTop:10}]}>
                            {
                                bloodSugarAvgBefore != '-1' &&
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
                            <DefText text=' ' style={[styles.reportChartText, {color:'#333'}]} />
                            <DefText text='100' style={[styles.reportChartText, {color:'#333'}]} />
                            <DefText text=' ' style={[styles.reportChartText, {color:'#333'}]} />
                            <DefText text=' ' style={[styles.reportChartText, {color:'#333'}]} />
                            <DefText text='125' style={[styles.reportChartText, {color:'#333'}]} />
                            <DefText text=' ' style={[styles.reportChartText, {color:'#333'}]} />
                        </HStack>
                    </VStack>
                    <VStack mt={2.5}>
                        <DefText text='식후혈당' style={styles.reportLabelSmall} />
                        
                        <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#FFCACA', '#FF9696', '#FF6262']} style={[{borderRadius:5, marginTop:10}]}>
                            {
                                bloodSugarAvgAfter != '-1' &&
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
                            <DefText text=' ' style={[styles.reportChartText, {color:'#333'}]} />
                            <DefText text='140' style={[styles.reportChartText, {color:'#333'}]} />
                            <DefText text=' ' style={[styles.reportChartText, {color:'#333'}]} />
                            <DefText text=' ' style={[styles.reportChartText, {color:'#333'}]} />
                            <DefText text='200' style={[styles.reportChartText, {color:'#333'}]} />
                            <DefText text=' ' style={[styles.reportChartText, {color:'#333'}]} />
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
                    {
                        bloodSugarGoalTotal != '0' &&
                        <Box mt={2.5} backgroundColor='#F1F1F1' borderRadius={10} p={5}>
                            <DefText text='정상혈당 달성도' style={[styles.reportLabel], {marginBottom:10}} />
                            <VStack>
                                {
                                    bloodSugarGoalTotal != '' &&
                                    <DefText text={'전체 : '+bloodSugarGoalPercent+'% (총 '+bloodSugarGoalTotal+'회, 달성 '+bloodSugarGoalCount+'회)'} style={{fontSize:14, color:'#333'}}/>
                                }
                                {
                                    bloodSugarGoalBeforeTotal != '' && 
                                    <DefText text={'공복 : '+bloodSugarGoalBeforePercent+'% (총 '+bloodSugarGoalBeforeTotal+'회, 달성 '+bloodSugarGoalBeforeCount+'회)'} style={{fontSize:14, color:'#333', marginTop:10}}/>
                                }
                                {
                                    bloodSugarGoalAfterTotal != '' && 
                                    <DefText text={'식후 : '+bloodSugarGoalAfterPercent+'% (총 '+bloodSugarGoalAfterTotal+'회, 달성 '+bloodSugarGoalAfterCount+'회)'} style={{fontSize:14, color:'#333', marginTop:10}}/>
                                }
                            
                            </VStack>
                            <HStack justifyContent='flex-end' alignItems='flex-end' mt={2.5}>
                                <TouchableOpacity onPress={()=>{navigation.navigate('FoodReportWeek')}} style={{padding:5, paddingHorizontal: 10, backgroundColor:'#B7B7B7', borderRadius:12}}>
                                    <DefText text='음식과 대조' style={{color:'#fff'}} />
                                </TouchableOpacity>
                            </HStack>
                        </Box>
                    }
                    
                    {
                        sugarArr != '' && 
                        <Box mt={5} backgroundColor='#F1F1F1' borderRadius={10} p={5}>
                            <DefText text='혈당 값 추세' style={[styles.reportLabel], {marginBottom:10}} />
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
                                                <Box>
                                                    <DefText text={sugarArr[0].before_level} style={[styles.tableText]}  />
                                                </Box>
                                                <Box>
                                                    <DefText text={sugarArr[1].before_level} style={[styles.tableText]}  />
                                                </Box>
                                            </VStack>
                                            <VStack width='33.3%' height={60} justifyContent='space-between' py={1.5}>
                                                <Box>
                                                    <DefText text={sugarArr[0].now_level} style={[styles.tableText]}  />
                                                </Box>
                                                <Box >
                                                    <DefText text={sugarArr[1].now_level} style={[styles.tableText]}  />
                                                </Box>
                                            </VStack>
                                            <VStack width='33.3%' height={60} justifyContent='space-between' alignItems='center' py={1.5}>
                                                {
                                                    sugarArrTerm1 == 0 ?
                                                    <Box style={{height:20, backgroundColor:'#B7B7B7', width:50, alignItems:'center', justifyContent:'center', borderRadius:20}}>
                                                        <DefText text={'='} style={[styles.tableText, {color:'#fff', fontSize:12}]}  />
                                                    </Box>
                                                    :
                                                    <Box style={{height:20, backgroundColor:'#FF6262', width:50, alignItems:'center', justifyContent:'center', borderRadius:20}}>
                                                        <DefText text={sugarArrTerm1 > 0 ? '+'+sugarArrTerm1 : '-'+sugarArrTerm1} style={[styles.tableText, {color:'#fff', fontSize:12}]}  />
                                                    </Box>
                                                }
                                                {
                                                    sugarArrTerm2 == 0 ?
                                                    <Box style={{height:20, backgroundColor:'#B7B7B7', width:50, alignItems:'center', justifyContent:'center', borderRadius:20}}>
                                                        <DefText text={'='} style={[styles.tableText, {color:'#fff', fontSize:12}]}  />
                                                    </Box>
                                                    :
                                                    <Box style={{height:20, backgroundColor:'#FF6262', width:50, alignItems:'center', justifyContent:'center', borderRadius:20}}>
                                                        <DefText text={sugarArrTerm2 > 0 ? '+'+sugarArrTerm2 : '-'+sugarArrTerm2} style={[styles.tableText, {color:'#fff', fontSize:12}]}  />
                                                    </Box>
                                                }
                                                
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
                                                <Box>
                                                    <DefText text={sugarArr[2].before_level} style={[styles.tableText]}  />
                                                </Box>
                                                
                                                <Box >
                                                    <DefText text={sugarArr[3].before_level} style={[styles.tableText]}  />
                                                </Box>
                                            </VStack>
                                            <VStack width='33.3%' height={60} justifyContent='space-between' py={1.5}>
                                                <Box>
                                                    <DefText text={sugarArr[2].now_level} style={[styles.tableText]}  />
                                                </Box>
                                                
                                                <Box >
                                                    <DefText text={sugarArr[3].now_level} style={[styles.tableText]}  />
                                                </Box>
                                            </VStack>
                                            <VStack width='33.3%' height={60} justifyContent='space-between' alignItems='center' py={1.5}>
                                                {
                                                    sugarArrTerm3 == 0 ?
                                                    <Box style={{height:20, backgroundColor:'#B7B7B7', width:50, alignItems:'center', justifyContent:'center', borderRadius:20}}>
                                                        <DefText text={'='} style={[styles.tableText, {color:'#fff', fontSize:12}]}  />
                                                    </Box>
                                                    :
                                                    <Box style={{height:20, backgroundColor:'#FF6262', width:50, alignItems:'center', justifyContent:'center', borderRadius:20}}>
                                                        <DefText text={sugarArrTerm3 > 0 ? '+'+sugarArrTerm3 : '-'+sugarArrTerm3} style={[styles.tableText, {color:'#fff', fontSize:12}]}  />
                                                    </Box>
                                                }
                                                {
                                                    sugarArrTerm4 == 0 ?
                                                    <Box style={{height:20, backgroundColor:'#B7B7B7', width:50, alignItems:'center', justifyContent:'center', borderRadius:20}}>
                                                        <DefText text={'='} style={[styles.tableText, {color:'#fff', fontSize:12}]}  />
                                                    </Box>
                                                    :
                                                    <Box style={{height:20, backgroundColor:'#FF6262', width:50, alignItems:'center', justifyContent:'center', borderRadius:20}}>
                                                        <DefText text={sugarArrTerm4 > 0 ? '+'+sugarArrTerm4 : '-'+sugarArrTerm4} style={[styles.tableText, {color:'#fff', fontSize:12}]}  />
                                                    </Box>
                                                }
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
                                                <Box>
                                                    <DefText text={sugarArr[4].before_level} style={[styles.tableText]}  />
                                                </Box>
                                                
                                                <Box >
                                                    <DefText text={sugarArr[5].before_level} style={[styles.tableText]}  />
                                                </Box>
                                            </VStack>
                                            <VStack width='33.3%' height={60} justifyContent='space-between' py={1.5}>
                                                <Box>
                                                    <DefText text={sugarArr[4].now_level} style={[styles.tableText]}  />
                                                </Box>
                                                
                                                <Box >
                                                    <DefText text={sugarArr[5].now_level} style={[styles.tableText]}  />
                                                </Box>
                                            </VStack>
                                            <VStack width='33.3%' height={60} justifyContent='space-between' alignItems='center' py={1.5}>
                                                {
                                                    sugarArrTerm5 == 0 ?
                                                    <Box style={{height:20, backgroundColor:'#B7B7B7', width:50, alignItems:'center', justifyContent:'center', borderRadius:20}}>
                                                        <DefText text={'='} style={[styles.tableText, {color:'#fff', fontSize:12}]}  />
                                                    </Box>
                                                    :
                                                    <Box style={{height:20, backgroundColor:'#FF6262', width:50, alignItems:'center', justifyContent:'center', borderRadius:20}}>
                                                        <DefText text={sugarArrTerm5 > 0 ? '+'+sugarArrTerm5 : '-'+sugarArrTerm5} style={[styles.tableText, {color:'#fff', fontSize:12}]}  />
                                                    </Box>
                                                }
                                                {
                                                    sugarArrTerm6 == 0 ?
                                                    <Box style={{height:20, backgroundColor:'#B7B7B7', width:50, alignItems:'center', justifyContent:'center', borderRadius:20}}>
                                                        <DefText text={'='} style={[styles.tableText, {color:'#fff', fontSize:12}]}  />
                                                    </Box>
                                                    :
                                                    <Box style={{height:20, backgroundColor:'#FF6262', width:50, alignItems:'center', justifyContent:'center', borderRadius:20}}>
                                                        <DefText text={sugarArrTerm6 > 0 ? '+'+sugarArrTerm6 : '-'+sugarArrTerm6} style={[styles.tableText, {color:'#fff', fontSize:12}]}  />
                                                    </Box>
                                                }
                                            </VStack>
                                        </HStack>
                                        
                                    </Box>
                                </HStack>
                            </Box>
                        </Box>
                    }
                    {/* 혈압시작 */}
                    <VStack mt={5}>
                        <DefText text='주간 혈압통계' style={[styles.reportLabel, {marginBottom:10}]} />
                        <DefText text='최고혈압' style={styles.reportLabelSmall} />
                        
                        <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#FFCACA', '#FF9696', '#FF6262']} style={[{borderRadius:5, marginTop:10}]}>
                            {
                                bloodPHigh != '-1' &&
                                <Box style={[{position:'absolute', bottom:1, left: bloodPHigh + '%'}]}>
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
                    </VStack>
                    <VStack mt={2.5}>
                        <DefText text='최저혈압' style={styles.reportLabelSmall} />
                    
                        <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#FFCACA', '#FF9696', '#FF6262']} style={[{borderRadius:5, marginTop:10}]}>
                            {
                                bloodPLow != '-1' && 
                                <Box style={[{position:'absolute', bottom:1, left:bloodPLow + '%'}]}>
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
                    </VStack>
                    <Box alignItems='center' height='240px'>
                        <Box>
                            <ScrollView
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                            >   
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
                            </ScrollView>
                        </Box>
                        
                    </Box>
                    {
                        drugData1 != '' &&
                        <VStack mt={10}>
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
                                        <DefText text={(medicineData.data * 100) + '%'} style={[styles.progerssChartNumber]}  />
                                        <DefText text={medicineData.medicineText} style={[styles.progerssChartText, medicineData.data > 0.5 ? {color:'#666'} : {color:'#f00'} ]}  />
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
                                        <DefText text={(medicineData2.data * 100) + '%'} style={[styles.progerssChartNumber]} />
                                        <DefText text={medicineData2.medicineText} style={[styles.progerssChartText, medicineData2.data > 0.5 ? {color:'#666'} : {color:'#f00'}]}  />
                                    </Box>
                                </Box>
                            </HStack>
                            
                        </VStack>
                    }
                    {/* 식단관리 */}
                    <VStack mt={5}>
                        <DefText text='식습관 통계' style={[styles.reportLabel, {marginBottom:10}]} />
                        <Box p={5} backgroundColor='#F1F1F1' borderRadius={10}>
                            <HStack justifyContent='space-around'>
                                <VStack>
                                    <DefText text='전주평균' style={[styles.kcalAvgText]} />
                                    {
                                        beforeKcalData != '' ?
                                        <DefText text={beforeKcalData + 'kcal'} style={[styles.kcalAvgNumber]} />
                                        :
                                        <DefText text='-' style={[styles.kcalAvgNumber]} />
                                    }
                                </VStack>
                                <VStack>
                                    <DefText text='주간평균' style={[styles.kcalAvgText]} />
                                    {
                                        nowKcalData != '' ?
                                        <DefText text={nowKcalData + 'kcal'} style={[styles.kcalAvgNumber]} />
                                        :
                                        <DefText text='-' style={[styles.kcalAvgNumber]} />
                                    }
                                </VStack>
                                <VStack>
                                    <DefText text='권장' style={[styles.kcalAvgText]} />
                                    {
                                        recomKcalData != '' ?
                                        <DefText text={recomKcalData + 'kcal'} style={[styles.kcalAvgNumber]} />
                                        :
                                        <DefText text='-' style={[styles.kcalAvgNumber]} />
                                    }
                                </VStack>
                            </HStack>
                            <Box width={width-80} backgroundColor='#fff' borderRadius={10} height={30} mt={5} justifyContent='center'>
                                {
                                    kcalEat != '' ?
                                    <Box width={kcalEat+'%'} backgroundColor='#F39595' borderRadius={10} height={30} alignItems='center' justifyContent='center'>
                                        <DefText text={kcalEat + '%'} />
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
                        <Box p={5} backgroundColor='#F1F1F1' borderRadius={10} mt={2.5}>
                            <DefText text='올바른 식사습관 달성도' style={[styles.reportLabel, {marginBottom:20}]} />
                            <VStack flexWrap={'wrap'}>
                                {
                                    ruleMeal != '' &&
                                    <DefText text={'규칙적인 식사 실천율 : '+ruleMeal.per+'%(총 '+ruleMeal.all+'회, 달성 '+ruleMeal.cnt+'회)'} style={{fontSize:14,color:'#666'}} />
                                }
                                {
                                    ruleMealAlert.notice != '' &&
                                    
                                    <HStack alignItems='center' mt={2.5}>
                                        <HStack flexWrap={'wrap'}>
                                            <Image source={require('../images/dangerIcon.png')} alt='주의' style={{marginRight:5}} />
                                            <DefText text={ruleMealAlert.notice} style={{fontSize:12, color:'#333', fontWeight:'bold'}} />
                                        </HStack>

                                    </HStack>
                                }
                                
                            </VStack>
                            <VStack  mt={2.5}>
                                {
                                    ruleTime != '' &&
                                    <DefText text={'규칙적인 식사 실천율 : '+ruleTime.per+'%(총 '+ruleTime.all+'회, 달성 '+ruleTime.cnt+'회)'} style={{fontSize:14,color:'#666'}} />
                                }
                                {
                                    ruleTimeAlert.notice != '' &&
                                    
                                    <HStack alignItems='center' mt={2.5} flexWrap='wrap'>
                                        <HStack flexWrap={'wrap'}>
                                            <Image source={require('../images/dangerIcon.png')} alt='주의' style={{marginRight:5}} />
                                            <DefText text={ ruleTimeAlert.notice} style={{fontSize:12, color:'#333', fontWeight:'bold'}} />
                                        </HStack>
                                    
                                            
                                    </HStack>
                                }
                            </VStack>
                            <VStack mt={2.5}>
                                {
                                    ruleNutrient != '' &&
                                    <DefText text={'균형잡힌 영양소 비율 달성 : '+ruleNutrient.per+'%(총 '+ruleNutrient.all+'회, 달성 '+ruleNutrient.cnt+'회)'} style={{fontSize:14,color:'#666'}} />
                                }
                            </VStack>
                            {
                                ruleNutrientAlert.notice != '' &&
                                
                                <HStack alignItems='center' mt={2.5} flexWrap='wrap'>
                                    <HStack flexWrap={'wrap'}>
                                        <Image source={require('../images/dangerIcon.png')} alt='주의' style={{marginRight:5}} />
                                        <DefText text={ ruleNutrientAlert.notice } style={{fontSize:12, color:'#333', fontWeight:'bold'}} />
                                    </HStack>
                            
                                        
                                </HStack>
                            }
                            <VStack mt={2.5}>
                                {
                                    ruleSugar != '' &&
                                    <DefText text={'당류 섭취관리 : '+ruleSugar.per+'%(총 '+ruleSugar.all+'회, 달성 '+ruleSugar.cnt+'회)'} style={{fontSize:14,color:'#666'}} />
                                }
                            </VStack>
                            {
                                ruleSugarAlert.notice != '' &&
                                
                                <HStack alignItems='center' mt={2.5} flexWrap='wrap'>
                                    <HStack flexWrap={'wrap'}>
                                        <Image source={require('../images/dangerIcon.png')} alt='주의' style={{marginRight:5}} />
                                        <DefText text={ ruleSugarAlert.notice } style={{fontSize:12, color:'#333', fontWeight:'bold'}} />
                                    </HStack>
                                </HStack>
                            }
                            <VStack mt={2.5}>
                                {
                                    ruleCholesterol != '' &&
                                    <DefText text={'콜레스테롤 섭취관리 : '+ruleCholesterol.per+'%(총 '+ruleCholesterol.all+'회, 달성 '+ruleCholesterol.cnt+'회)'} style={{fontSize:14,color:'#666'}} />
                                }
                            </VStack>
                            {
                                ruleCholesterolAlert.notice != '' &&
                                
                                <HStack alignItems='center' mt={2.5} flexWrap='wrap'>
                                    <HStack flexWrap={'wrap'}>
                                        <Image source={require('../images/dangerIcon.png')} alt='주의' style={{marginRight:5}} />
                                        <DefText text={ ruleCholesterolAlert.notice } style={{fontSize:12, color:'#333', fontWeight:'bold'}} />
                                    </HStack>
                                </HStack>
                            }
                            <VStack mt={2.5}>
                                {
                                    ruleSalt != '' &&
                                    <DefText text={'나트륨 섭취관리 : '+ruleSalt.per+'%(총 '+ruleSalt.all+'회, 달성 '+ruleSalt.cnt+'회)'} style={{fontSize:14,color:'#666'}} />
                                }
                            </VStack>
                            {
                                ruleSaltAlert.notice != '' &&
                                
                                <HStack alignItems='center' mt={2.5} flexWrap='wrap'>
                                    <HStack flexWrap={'wrap'}>
                                        <Image source={require('../images/dangerIcon.png')} alt='주의' style={{marginRight:5}} />
                                        <DefText text={ ruleSaltAlert.notice } style={{fontSize:12, color:'#333', fontWeight:'bold'}} />
                                    </HStack>
                                </HStack>
                            }
                        </Box>
                    </VStack>
                </>
            }
            
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

    },
    BloodPreText: {
        fontSize: width > 360 ? 13 : 12,
        color:'#fff',
        textAlign:'center'
    },
})

export default connect(
    ({ User }) => ({
        userInfo: User.userInfo, //회원정보
    }),
    (dispatch) => ({
        member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
        member_info: (user) => dispatch(UserAction.member_info(user)), //회원 정보 조회
        
    })
)(ReportWeeks);