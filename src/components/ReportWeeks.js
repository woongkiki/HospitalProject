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
import Font from '../common/Font';
import { WebView } from 'react-native-webview';
import { BASE_URL } from '../Utils/APIConstant';

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
    const [bloodSugarGraphWidth, setBloodSugarGraphWidth] = useState(0);
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
    const [bloodPressureWidth, setBloodPressureWidth] = useState([]);
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

               
                setBloodSugarGraph(arrItems.sugar_graph);
                

                //공복혈당 평균
                let bblevel = arrItems.avg_sugar1;

               // console.log('bblevel::::::',bblevel);
            
                if(bblevel < 80)    bblevel = 80;
                if(bblevel > 140)   bblevel = 140;
                
                // bblevel = (bblevel * 1 - 91.7) * 2.405 * 0.92;

                let bbvalue = 0;
                if(bblevel <= 100) bbvalue = 7*0.92;
                else if(bblevel > 100 && bblevel <= 125) bbvalue = 50*0.92;
                else bbvalue = 92 * 0.92;

                setBloodSugarAvgBefore(arrItems.avg_sugar1)


                //식후혈당 평균

                let balevel = arrItems.avg_sugar2;

                //console.log('식후혈당:::',balevel);

                if(balevel < 120)   balevel = 120;
                if(balevel > 220)   balevel = 220;
                balevel = (balevel * 1 - 120) * 0.92;



                if(balevel <= 140) bbvalue = 7*0.92;
                else if(balevel > 140 && balevel <= 200) bbvalue = 50*0.92;
                else bbvalue = 92 * 0.92;                

                //console.log('213213123',balevel)
                setBloodSugarAvgAfter(arrItems.avg_sugar2);



                


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

                setBloodPHigh(arrItems.avg_pressure1);

               

                //최저혈압
                let bloodLows = arrItems.avg_pressure2;
        
                if(bloodLows < 60)   bloodLows = 60;
                if(bloodLows > 110)   bloodLows = 110;
                bloodLows = (bloodLows * 1 - 60) * 2 * 0.92;

                setBloodPLow(arrItems.avg_pressure2);
                

                //setBloodPLow(arrItems.avg_pressure1);



               // let bpgraph_keys = Object.values(arrItems.pressure_graph);

                // let bloodPHightData = [];
                // bpgraph_keys.map((e, i)=> {
                //     if(bpgraph_keys[i].high != undefined){
                //         bloodPHightData[i] = bpgraph_keys[i].high;
                //     }else{
                //         bloodPHightData[i] = 0;
                //     }
                    
                // })

                //console.log(bloodPHightData);
               // setBloodPHighData(bloodPHightData);


                

                let drug_percent1 = arrItems.drug_per1;

                drug_percent1 = drug_percent1 / 100;

                let drug_percent2 = arrItems.drug_per2;

                console.log('drug:::', arrItems)

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
                if(!isNaN(kcalEats)){
                    if(kcalEats>100){
                        setKcalEat(100);
                    }else{
                        setKcalEat( Math.round(kcalEats));
                    }
                } else {
                    setKcalEat(0);
                }


                //식단 그래프용
             

               

                //식사 실천율
                setRuleMeal(arrItems.rule_meal);
                setRuleMealAlert(arrItems.rule_meal_alert);
                console.log(arrItems.rule_meal_alert);

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
        legend: ["수축기","확장기"], // optional
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
                    <HStack alignItems={'center'} justifyContent='space-between'>
                        <DefText text='주간평균 혈당' style={styles.reportLabel} />
                        <TouchableOpacity onPress={()=>navigation.navigate('GraphView', {'id':userInfo.id, 'mode':'week', 'screen':'bloodsugarReport'})} style={{padding:5, paddingHorizontal: 10, backgroundColor:'#B7B7B7', borderRadius:12}} >
                            <DefText text='그래프 확인' style={{color:'#fff', }} />
                        </TouchableOpacity>
                    </HStack>
                    <VStack mt={2.5}> 
                        
                       
                        <HStack py={2.5} px={5} backgroundColor='#f1f1f1' borderRadius={10} justifyContent='space-between'>
                            <DefText text={'식전 혈당(mg/dL)'} style={{ color:'#000000', fontFamily:Font.NotoSansMedium, lineHeight:30}} />
                            <HStack>
                                <Box borderBottomWidth={bloodSugarAvgBefore < 100 ? 0 : 1} borderColor={ bloodSugarAvgBefore < 100 ? 'transparent' : '#f00'}>
                                    <DefText text={bloodSugarAvgBefore != '' ? bloodSugarAvgBefore : '-'} style={{ color: bloodSugarAvgBefore < 100 ? '#000' : '#f00', fontFamily:Font.NotoSansMedium, lineHeight:30}} />
                                </Box>
                            </HStack>
                        </HStack>
                
                    </VStack>
                    <VStack mt={2.5}>
                        
                        <HStack py={2.5} px={5} backgroundColor='#f1f1f1' borderRadius={10} justifyContent='space-between'>
                            <DefText text={'식후 혈당(mg/dL)'} style={{ color:'#000000', fontFamily:Font.NotoSansMedium, lineHeight:30}} />
                            <HStack>
                                <Box borderBottomWidth={bloodSugarAvgAfter < 140 ? 0 : 1} borderColor={ bloodSugarAvgAfter < 140 ? 'transparent' : '#f00'}>
                                    <DefText text={ bloodSugarAvgAfter != '' ? bloodSugarAvgAfter : '-'} style={{ color: bloodSugarAvgAfter < 140 ? '#000' : '#f00', fontFamily:Font.NotoSansMedium, lineHeight:30}} />
                                </Box>
                            
                            </HStack>
                        </HStack>
         
                    </VStack>
         
                    {/* <Box mt={5}>
                        <HStack justifyContent={'center'}>
                            <HStack alignItems={'center'} mr='20px'>
                                <Box style={{width:7, height:7, borderRadius:10, backgroundColor:'#00f', marginRight:5}} />
                                <DefText text='정상' style={{fontSize:12}} />
                            </HStack>
                            <HStack alignItems={'center'}>
                                <Box style={{width:7, height:7, borderRadius:10, backgroundColor:'#f00', marginRight:5}} />
                                <DefText text='비정상' style={{fontSize:12}} />
                            </HStack>
                        </HStack>
                        <Box height='300px' >
                            
                            <WebView
                                source={{
                                    uri:BASE_URL +`/adm/rn-webview/bloodsugarReport.php?mode=week&id=`+userInfo?.id
                                }}
                                startInLoadingState={true}
                                renderLoading={() => (
                                        <ActivityIndicator
                                            size="large"
                                            color="#000"
                                            style={{ width: '100%', marginTop: 50, marginBottom: 50 }}
                                            />
                                )}
                                style={{
                                    opacity:0.99,
                                    minHeight:1,
                                }}
                            />
                        </Box>
                    </Box> */}

                    
                    {
                        bloodSugarGoalTotal != '0' &&
                        <Box mt={5} backgroundColor='#F1F1F1' borderRadius={10} p={5}>
                            <DefText text='정상혈당 달성도' style={[styles.reportLabel, {marginBottom:10}]} />
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
                                                        <DefText text={sugarArrTerm1 > 0 ? '+'+sugarArrTerm1 : sugarArrTerm1} style={[styles.tableText, {color:'#fff', fontSize:12}]}  />
                                                    </Box>
                                                }
                                                {
                                                    sugarArrTerm2 == 0 ?
                                                    <Box style={{height:20, backgroundColor:'#B7B7B7', width:50, alignItems:'center', justifyContent:'center', borderRadius:20}}>
                                                        <DefText text={'='} style={[styles.tableText, {color:'#fff', fontSize:12}]}  />
                                                    </Box>
                                                    :
                                                    <Box style={{height:20, backgroundColor:'#FF6262', width:50, alignItems:'center', justifyContent:'center', borderRadius:20}}>
                                                        <DefText text={sugarArrTerm2 > 0 ? '+'+sugarArrTerm2 : sugarArrTerm2} style={[styles.tableText, {color:'#fff', fontSize:12}]}  />
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
                                                        <DefText text={sugarArrTerm3 > 0 ? '+'+sugarArrTerm3 : sugarArrTerm3} style={[styles.tableText, {color:'#fff', fontSize:12}]}  />
                                                    </Box>
                                                }
                                                {
                                                    sugarArrTerm4 == 0 ?
                                                    <Box style={{height:20, backgroundColor:'#B7B7B7', width:50, alignItems:'center', justifyContent:'center', borderRadius:20}}>
                                                        <DefText text={'='} style={[styles.tableText, {color:'#fff', fontSize:12}]}  />
                                                    </Box>
                                                    :
                                                    <Box style={{height:20, backgroundColor:'#FF6262', width:50, alignItems:'center', justifyContent:'center', borderRadius:20}}>
                                                        <DefText text={sugarArrTerm4 > 0 ? '+'+sugarArrTerm4 : sugarArrTerm4} style={[styles.tableText, {color:'#fff', fontSize:12}]}  />
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
                                                        <DefText text={sugarArrTerm5 > 0 ? '+'+sugarArrTerm5 : sugarArrTerm5} style={[styles.tableText, {color:'#fff', fontSize:12}]}  />
                                                    </Box>
                                                }
                                                {
                                                    sugarArrTerm6 == 0 ?
                                                    <Box style={{height:20, backgroundColor:'#B7B7B7', width:50, alignItems:'center', justifyContent:'center', borderRadius:20}}>
                                                        <DefText text={'='} style={[styles.tableText, {color:'#fff', fontSize:12}]}  />
                                                    </Box>
                                                    :
                                                    <Box style={{height:20, backgroundColor:'#FF6262', width:50, alignItems:'center', justifyContent:'center', borderRadius:20}}>
                                                        <DefText text={sugarArrTerm6 > 0 ? '+'+sugarArrTerm6 : sugarArrTerm6} style={[styles.tableText, {color:'#fff', fontSize:12}]}  />
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
                        <HStack justifyContent={'space-between'} alignItems='center' mb={'10px'}>
                            <DefText text='주간 혈압통계' style={[styles.reportLabel]} />
                            <TouchableOpacity onPress={()=>navigation.navigate('GraphView', {'id':userInfo.id, 'mode':'week', 'screen':'bloodpressureReport'})} style={{padding:5, paddingHorizontal: 10, backgroundColor:'#B7B7B7', borderRadius:12}} >
                                <DefText text='그래프 확인' style={{color:'#fff', }} />
                            </TouchableOpacity>
                        </HStack>
                      
                        <DefText text='최고혈압' style={[{marginBottom:10, color:'#696968',  fontFamily:Font.NotoSansMedium}]} />
                        <Box p={5} backgroundColor='#f1f1f1' borderRadius={10} mb='20px'>
                            <Box>
                                {
                                    bloodPHigh > -1 &&
                                    <DefText text={bloodPHigh + ' mmHg'} style={{color:'#000', fontFamily:Font.NotoSansMedium, fontWeight:'500'}}/>
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
                                    bloodPHigh > 0 && bloodPHigh <= 120 &&
                                    <Box style={[{position:'absolute', bottom:20, left:'6%'}]}>
                                        <Image source={require('../images/fatPositionNew.png')} alt='수치' />
                                    </Box> 
                                }
                                {
                                    bloodPHigh > 120 && bloodPHigh <= 130 &&
                                    <Box style={[{position:'absolute', bottom:20, left:'25%'}]}>
                                        <Image source={require('../images/fatPositionNew.png')} alt='수치' />
                                    </Box> 
                                }
                                {
                                    bloodPHigh > 130 && bloodPHigh <= 140 &&
                                    <Box style={[{position:'absolute', bottom:20, left:'45%'}]}>
                                        <Image source={require('../images/fatPositionNew.png')} alt='수치' />
                                    </Box> 
                                }
                                {
                                    bloodPHigh > 140 && bloodPHigh <= 150 &&
                                    <Box style={[{position:'absolute', bottom:20, left:'65%'}]}>
                                        <Image source={require('../images/fatPositionNew.png')} alt='수치' />
                                    </Box> 
                                }
                                {
                                    bloodPHigh > 150 &&
                                    <Box style={[{position:'absolute', bottom:20, left:'85%'}]}>
                                        <Image source={require('../images/fatPositionNew.png')} alt='수치' />
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
                    </VStack>
                    <VStack>
                        <DefText text='최저혈압' style={[{marginBottom:10, color:'#696968',  fontFamily:Font.NotoSansMedium}]} />
                        <Box p={5} backgroundColor='#f1f1f1' borderRadius={10} mb='20px'>
                            <Box>
                                {
                                    bloodPLow > -1 &&
                                    <DefText text={bloodPLow + ' mmHg'} style={{color:'#000', fontFamily:Font.NotoSansMedium, fontWeight:'500'}}/>
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
                                    bloodPLow > 0 && bloodPLow <= 60 &&
                                    <Box style={[{position:'absolute', bottom:20, left:'6%'}]}>
                                        <Image source={require('../images/fatPositionNew.png')} alt='수치' />
                                    </Box> 
                                }
                                {
                                    bloodPLow > 60 && bloodPLow <= 80 &&
                                    <Box style={[{position:'absolute', bottom:20, left:'25%'}]}>
                                        <Image source={require('../images/fatPositionNew.png')} alt='수치' />
                                    </Box> 
                                }
                                {
                                    bloodPLow > 80 && bloodPLow <= 90 &&
                                    <Box style={[{position:'absolute', bottom:20, left:'45%'}]}>
                                        <Image source={require('../images/fatPositionNew.png')} alt='수치' />
                                    </Box> 
                                }
                                {
                                    bloodPLow > 90 && bloodPLow <= 100 &&
                                    <Box style={[{position:'absolute', bottom:20, left:'65%'}]}>
                                        <Image source={require('../images/fatPositionNew.png')} alt='수치' />
                                    </Box> 
                                }
                                {
                                    bloodPLow > 100 &&
                                    <Box style={[{position:'absolute', bottom:20, left:'85%'}]}>
                                        <Image source={require('../images/fatPositionNew.png')} alt='수치' />
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
                    </VStack>
                   
                   
                    
                    <VStack mt={2.5}>
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
                    
                    {/* 식단관리 */}
                    <VStack mt={5}>
                        <HStack justifyContent={'space-between'} alignItems='center' mb={'10px'}>
                            <DefText text='식습관 통계' style={[styles.reportLabel]} />
                            <TouchableOpacity onPress={()=>navigation.navigate('GraphView', {'id':userInfo.id, 'mode':'week', 'screen':'kcalReport'})} style={{padding:5, paddingHorizontal: 10, backgroundColor:'#B7B7B7', borderRadius:12}} >
                                <DefText text='그래프 확인' style={{color:'#fff', }} />
                            </TouchableOpacity>
                        </HStack>
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
                                    <Box justifyContent={'center'} alignItems='center'>
                                        <DefText text='0%'  />
                                    </Box>
                                }
                            </Box>
                        </Box>
                        
                        <Box p={5} backgroundColor='#F1F1F1' borderRadius={10} mt={2.5}>
                            <DefText text='올바른 식사습관 달성도' style={[styles.reportLabel, {marginBottom:20}]} />
                            <VStack flexWrap={'wrap'}>
                                {
                                    ruleMeal != '' &&
                                    <DefText text={'규칙적인 식사 실천율 : '+ruleMeal.per+'%(총 '+ruleMeal.all+'회, 달성 '+ruleMeal.cnt+'회)'} style={{fontSize:14,color:'#666'}} />
                                }
                                {
                                    ruleMealAlert?.notice != '' &&
                                    
                                    <HStack alignItems='center' mt={2.5}>
                                        <HStack flexWrap={'wrap'}>
                                            <Box width='10%'>
                                                <Image source={require('../images/dangerIcon.png')} alt='주의' style={{marginRight:5}} />
                                            </Box>
                                            <Box width='90%'>
                                                <DefText text={ruleMealAlert.notice} style={{fontSize:12, color:'#333', fontWeight:'bold'}} />
                                            </Box>
                                        </HStack>

                                    </HStack>
                                }
                                
                            </VStack>
                            <VStack  mt={2.5}>
                                {
                                    ruleTime != '' &&
                                    <DefText text={'식사시간 준수실천율 : '+ruleTime.per+'%(총 '+ruleTime.all+'회, 달성 '+ruleTime.cnt+'회)'} style={{fontSize:14,color:'#666'}} />
                                }
                                {
                                    ruleTimeAlert?.notice != '' &&
                                    
                                    <HStack alignItems='center' mt={2.5} flexWrap='wrap'>
                                        <HStack flexWrap={'wrap'}>
                                            <Box width='10%'>
                                                <Image source={require('../images/dangerIcon.png')} alt='주의' style={{marginRight:5}} />
                                            </Box>
                                            <Box width='90%'>
                                                <DefText text={ ruleTimeAlert.notice} style={{fontSize:12, color:'#333', fontWeight:'bold'}} />
                                            </Box>
                                        </HStack>
                                    
                                            
                                    </HStack>
                                }
                            </VStack>
                            <VStack mt={2.5}>
                                {
                                    ruleNutrient != '' &&
                                    <DefText text={'균형잡힌 영양소 비율 달성 : '+ruleNutrient.per+'%(총 '+ruleNutrient.all+'일, 달성 '+ruleNutrient.cnt+'일)'} style={{fontSize:14,color:'#666'}} />
                                }
                            </VStack>
                            {
                                ruleNutrientAlert.notice != '' &&
                                
                                <HStack alignItems='center' mt={2.5} flexWrap='wrap'>
                                    <HStack flexWrap={'wrap'}>
                                        <Box width='10%'>
                                            <Image source={require('../images/dangerIcon.png')} alt='주의' style={{marginRight:5}} />
                                        </Box>
                                        <Box width='90%'>
                                            <DefText text={ ruleNutrientAlert.notice } style={{fontSize:12, color:'#333', fontWeight:'bold'}} />
                                        </Box>
                                    </HStack>
                            
                                        
                                </HStack>
                            }
                            <VStack mt={2.5}>
                                {
                                    ruleSugar != '' &&
                                    <DefText text={'당류 관리 달성도 : '+ruleSugar.per+'%(총 '+ruleSugar.all+'일, 달성 '+ruleSugar.cnt+'일)'} style={{fontSize:14,color:'#666'}} />
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
                                    <DefText text={'콜레스테롤 관리 달성도 : '+ruleCholesterol.per+'%(총 '+ruleCholesterol.all+'일, 달성 '+ruleCholesterol.cnt+'일)'} style={{fontSize:14,color:'#666'}} />
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
                                    <DefText text={'나트륨 관리 달성도 : '+ruleSalt.per+'%(총 '+ruleSalt.all+'일, 달성 '+ruleSalt.cnt+'일)'} style={{fontSize:14,color:'#666'}} />
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
        borderColor:'#f1f1f1',
        backgroundColor:'#f1f1f1',
        //alignItems:'center',
        alignItems:'center',
        justifyContent:'center',
        borderRadius:10
    },
    reportLabel : {
        fontSize:16,
        color:'#696969',
        fontWeight:'bold',
        fontFamily:Font.NotoSansBold
    },
    reportLabelSmall : {
        fontSize:14,
        color:'#696969'
    },
    reportChartText: {
        fontSize:14,
        color:'#fff'
    },
    tableText: {
        fontSize:14,
        color:'#000',
        textAlign:'center'
    },
    progerssChartText: {
        fontSize:14,
        color:'#000'
    },
    progerssChartNumber : {
        fontSize:18,
        color:'#000',
        fontWeight:'bold',
        fontFamily:Font.NotoSansBold,
        marginVertical:2.5
    },
    kcalAvgText: {
        fontSize:14,
        color:'#666',
        marginBottom:10,
        fontWeight:'bold',
        textAlign:'center'
    },
    kcalAvgNumber : {
        fontSize:14,
        color:'#666',
        textAlign:'center'

    },
    BloodPreText: {
        fontSize: width > 360 ? 13 : 12,
        color:'#fff',
        textAlign:'center'
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
)(ReportWeeks);