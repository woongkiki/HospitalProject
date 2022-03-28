import React, {useState, useEffect} from 'react';
import { Box, HStack, VStack, Image } from 'native-base';
import { TouchableOpacity, ScrollView, Dimensions, Animated, StyleSheet, Text, Platform, ActivityIndicator, Linking } from 'react-native';
import { DefText } from '../common/BOOTSTRAP';
import HeaderDefault from '../components/HeaderDefault';
import { connect } from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import ReportWeeks from '../components/ReportWeeks';
import ReportMonths from '../components/ReportMonths';
import Font from '../common/Font';
import Api from '../Api';
import { BASE_URL } from '../Utils/APIConstant';
import { WebView } from 'react-native-webview';

const {width} = Dimensions.get('window');

const ReportWeekN = (props) => {

    const {navigation, userInfo} = props;

    //주간,월간 나누기
    const [reportCategory, setReportCategory] = useState('1');
    const categoryChange = (number) => {
        setReportCategory(number);
        
    }

    const [weekData, setWeekData] = useState('');
    const [sugarArr, setSugarArr] = useState('');
    const [sugarArrTerm1, setSugarTerm1] = useState('');
    const [sugarArrTerm2, setSugarTerm2] = useState('');
    const [sugarArrTerm3, setSugarTerm3] = useState('');
    const [sugarArrTerm4, setSugarTerm4] = useState('');
    const [sugarArrTerm5, setSugarTerm5] = useState('');
    const [sugarArrTerm6, setSugarTerm6] = useState('');

    const [monthData, setMonthData] = useState('');

    const ReportDataReceive = async () => {
        await Api.send('report_week', {'id':userInfo.id, 'token':userInfo.appToken}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                console.log('주간 리포트 결과:::::::::', arrItems);

                //주간평균 혈당식전
                setWeekData(arrItems);

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

            }else{
                console.log('리포트 결과 실패 여부:::::::::', arrItems);
            }
        });

        await Api.send('report_month', {'id':userInfo.id, 'token':userInfo.appToken}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                //console.log('월간 리포트 결과:::::::::', arrItems);

                //주간평균 혈당식전
                setMonthData(arrItems);

            }else{
                console.log('리포트 결과 실패 여부:::::::::', arrItems);
            }
        });
    }

    useEffect(()=>{
        ReportDataReceive();
    }, [])

    return (
        <Box backgroundColor='#fff' flex={1}>
            <HeaderDefault headerTitle='리포트' navigation={navigation} />

            <ScrollView>
                <Box p={5}>
                    <HStack flexWrap='wrap' justifyContent='space-between' mb={5}>
                        <TouchableOpacity onPress={()=>categoryChange('1')} style={[{width:(width-40)*0.48, height:30, alignItems:'center', justifyContent:'center', borderRadius:10}, reportCategory == '1' ? {backgroundColor:'#696968'} : {backgroundColor:'#f1f1f1'}]}>
                            <DefText text='주간' style={[{fontWeight:'500', fontFamily:Font.NotoSansMedium}, reportCategory == '1' ? {color:'#fff'} : {color:'#696968'}]} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>categoryChange('2')} style={[{width:(width-40)*0.48, height:30, alignItems:'center', justifyContent:'center', borderRadius:10}, reportCategory == '2' ? {backgroundColor:'#696968'} : {backgroundColor:'#f1f1f1'}]}>
                            <DefText text='월간' style={[{fontWeight:'500', fontFamily:Font.NotoSansMedium}, reportCategory == '2' ? {color:'#fff'} : {color:'#696968'}]} />
                        </TouchableOpacity>
                    </HStack>

                    {
                        reportCategory == '1' &&
                        <Box>
                            <DefText text='주간평균 혈당' style={styles.reportLabel} />
                            <Box mt='10px'>
                                <HStack py={2.5} px={5} backgroundColor='#f1f1f1' borderRadius={10} justifyContent='space-between'>
                                    <DefText text={'식전 혈당(mg/dL)'} style={{ color:'#000000', fontFamily:Font.NotoSansMedium, lineHeight:30}} />
                                    <HStack>
                                        <Box borderBottomWidth={weekData.avg_sugar1 < 100 ? 0 : 1} borderColor={ weekData.avg_sugar1  < 100 ? 'transparent' : '#f00'}>
                                            <DefText text={weekData.avg_sugar1 != '' ? weekData.avg_sugar1  : '-'} style={{ color: weekData.avg_sugar1 < 100 ? '#000' : '#f00', fontFamily:Font.NotoSansMedium, lineHeight:30}} />
                                        </Box>
                                    </HStack>
                                </HStack>
                            </Box>
                            <Box mt='10px'>
                                <HStack py={2.5} px={5} backgroundColor='#f1f1f1' borderRadius={10} justifyContent='space-between'>
                                    <DefText text={'식후 혈당(mg/dL)'} style={{ color:'#000000', fontFamily:Font.NotoSansMedium, lineHeight:30}} />
                                    <HStack>
                                        <Box borderBottomWidth={weekData.avg_sugar2 < 140 ? 0 : 1} borderColor={ weekData.avg_sugar2 < 140 ? 'transparent' : '#f00'}>
                                            <DefText text={ weekData.avg_sugar2 != '' ? weekData.avg_sugar2 : '-'} style={{ color: weekData.avg_sugar2 < 140 ? '#000' : '#f00', fontFamily:Font.NotoSansMedium, lineHeight:30}} />
                                        </Box>
                                    </HStack>
                                </HStack>
                            </Box>
                            <Box mt='20px'>
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
                            </Box>
                            <Box height={'300px'} width={width - 40} >
                                <WebView
                                    source={{
                                        uri: BASE_URL + '/adm/rn-webview/bloodsugarReport.php?mode=week&id=' + userInfo.id
                                    }}
                                />
                            </Box>
                            {
                                weekData.sugar_all_total != '0' &&
                                <Box mt={'20px'} backgroundColor='#F1F1F1' borderRadius={10} p={5}>
                                    <DefText text='정상혈당 달성도' style={[styles.reportLabel, {marginBottom:10}]} />
                                    <VStack>
                                        {
                                            weekData.sugar_all_total != '' &&
                                            <DefText text={'전체 : '+weekData.sugar_all_per+'% (총 '+weekData.sugar_all_total+'회, 달성 '+weekData.sugar_all_cnt+'회)'} style={{fontSize:14, color:'#333'}}/>
                                        }
                                        {
                                            weekData.sugar_1_total != '' && 
                                            <DefText text={'공복 : '+weekData.sugar_1_per+'% (총 '+weekData.sugar_1_total+'회, 달성 '+weekData.sugar_1_cnt+'회)'} style={{fontSize:14, color:'#333', marginTop:10}}/>
                                        }
                                        {
                                            weekData.sugar_2_total != '' && 
                                            <DefText text={'식후 : '+weekData.sugar_2_per+'% (총 '+weekData.sugar_2_total+'회, 달성 '+weekData.sugar_2_cnt+'회)'} style={{fontSize:14, color:'#333', marginTop:10}}/>
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
                                <Box mt={'20px'} backgroundColor='#F1F1F1' borderRadius={10} p={5}>
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
                            <Box mt='20px'>
                                <DefText text='주간 혈압통계' style={[styles.reportLabel, {marginBottom:10}]} />
                                <DefText text='최고혈압' style={[{marginBottom:10, color:'#696968',  fontFamily:Font.NotoSansMedium}]} />
                                <Box p={5} backgroundColor='#f1f1f1' borderRadius={10} mb='20px'>
                                    <Box>
                                        {
                                            weekData.avg_pressure1 > -1 &&
                                            <DefText text={weekData.avg_pressure1 + ' mmHg'} style={{color:'#000', fontFamily:Font.NotoSansMedium, fontWeight:'500'}}/>
                                        }
                                    </Box>
                                    <Box mt='20px'>
                                        <HStack justifyContent='space-between' mt={'10px'} >
                                            <Box style={[styles.graphBoxFive, {backgroundColor:'#E5E587'}]}>
                                                <DefText text='주의' style={styles.graphBoxText} />
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
                                            weekData.avg_pressure1 > 0 && weekData.avg_pressure1 <= 120 &&
                                            <Box style={[{position:'absolute', bottom:20, left:'6%'}]}>
                                                <Image source={require('../images/fatPositionNew.png')} alt='수치' />
                                            </Box> 
                                        }
                                        {
                                            weekData.avg_pressure1 > 120 && weekData.avg_pressure1 <= 130 &&
                                            <Box style={[{position:'absolute', bottom:20, left:'25%'}]}>
                                                <Image source={require('../images/fatPositionNew.png')} alt='수치' />
                                            </Box> 
                                        }
                                        {
                                            weekData.avg_pressure1 > 130 && weekData.avg_pressure1 <= 140 &&
                                            <Box style={[{position:'absolute', bottom:20, left:'45%'}]}>
                                                <Image source={require('../images/fatPositionNew.png')} alt='수치' />
                                            </Box> 
                                        }
                                        {
                                            weekData.avg_pressure1 > 140 && weekData.avg_pressure1 <= 150 &&
                                            <Box style={[{position:'absolute', bottom:20, left:'65%'}]}>
                                                <Image source={require('../images/fatPositionNew.png')} alt='수치' />
                                            </Box> 
                                        }
                                        {
                                            weekData.avg_pressure1 > 150 &&
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
                                <DefText text='최저혈압' style={[{marginBottom:10, color:'#696968',  fontFamily:Font.NotoSansMedium}]} />
                                <Box p={5} backgroundColor='#f1f1f1' borderRadius={10} mb='20px'>
                                    <Box>
                                        {
                                            weekData.avg_pressure2 > -1 &&
                                            <DefText text={weekData.avg_pressure2 + ' mmHg'} style={{color:'#000', fontFamily:Font.NotoSansMedium, fontWeight:'500'}}/>
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
                                            weekData.avg_pressure2 > 0 && weekData.avg_pressure2 <= 60 &&
                                            <Box style={[{position:'absolute', bottom:20, left:'6%'}]}>
                                                <Image source={require('../images/fatPositionNew.png')} alt='수치' />
                                            </Box> 
                                        }
                                        {
                                            weekData.avg_pressure2 > 60 && weekData.avg_pressure2 <= 80 &&
                                            <Box style={[{position:'absolute', bottom:20, left:'25%'}]}>
                                                <Image source={require('../images/fatPositionNew.png')} alt='수치' />
                                            </Box> 
                                        }
                                        {
                                            weekData.avg_pressure2 > 80 && weekData.avg_pressure2 <= 90 &&
                                            <Box style={[{position:'absolute', bottom:20, left:'45%'}]}>
                                                <Image source={require('../images/fatPositionNew.png')} alt='수치' />
                                            </Box> 
                                        }
                                        {
                                            weekData.avg_pressure2 > 90 && weekData.avg_pressure2 <= 100 &&
                                            <Box style={[{position:'absolute', bottom:20, left:'65%'}]}>
                                                <Image source={require('../images/fatPositionNew.png')} alt='수치' />
                                            </Box> 
                                        }
                                        {
                                            weekData.avg_pressure2 > 100 &&
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
                            </Box>
                            <Box mt='20px'>
                                <HStack justifyContent={'center'}>
                                <HStack alignItems={'center'} mr='20px'>
                                    <Box style={{width:7, height:7, borderRadius:10, backgroundColor:'#00f', marginRight:5}} />
                                    <DefText text='최저혈압' style={{fontSize:12}} />
                                </HStack>
                                <HStack alignItems={'center'} mr='20px'>
                                    <Box style={{width:7, height:7, borderRadius:10, backgroundColor:'#f00', marginRight:5}} />
                                    <DefText text='최고혈압' style={{fontSize:12}} />
                                </HStack>
                                <HStack alignItems={'center'}>
                                    <Box style={{width:7, height:7, borderRadius:10, backgroundColor:'#FFF732', marginRight:5, borderWidth:1, borderColor:'#ddd'}} />
                                    <DefText text='심박수' style={{fontSize:12}} />
                                </HStack>
                                </HStack>
                            </Box>
                            <Box height={'300px'} width={width - 40} >
                                <WebView
                                    source={{
                                        uri: BASE_URL + '/adm/rn-webview/bloodpressureReport.php?mode=week&id=' + userInfo.id
                                    }}
                                />
                            </Box>
                        </Box>
                    }

                    {
                        reportCategory == '2' &&
                        <Box>
                            <DefText text='월간평균 혈당' style={styles.reportLabel} />
                            <Box mt='10px'>
                                <HStack py={2.5} px={5} backgroundColor='#f1f1f1' borderRadius={10} justifyContent='space-between'>
                                    <DefText text={'식전 혈당(mg/dL)'} style={{ color:'#000000', fontFamily:Font.NotoSansMedium, lineHeight:30}} />
                                    <HStack>
                                        <Box borderBottomWidth={monthData.avg_sugar1 < 100 ? 0 : 1} borderColor={ monthData.avg_sugar1  < 100 ? 'transparent' : '#f00'}>
                                            <DefText text={monthData.avg_sugar1 != '' ? monthData.avg_sugar1  : '-'} style={{ color: monthData.avg_sugar1 < 100 ? '#000' : '#f00', fontFamily:Font.NotoSansMedium, lineHeight:30}} />
                                        </Box>
                                    </HStack>
                                </HStack>
                            </Box>
                            <Box mt='10px'>
                                <HStack py={2.5} px={5} backgroundColor='#f1f1f1' borderRadius={10} justifyContent='space-between'>
                                    <DefText text={'식후 혈당(mg/dL)'} style={{ color:'#000000', fontFamily:Font.NotoSansMedium, lineHeight:30}} />
                                    <HStack>
                                        <Box borderBottomWidth={monthData.avg_sugar2 < 140 ? 0 : 1} borderColor={ monthData.avg_sugar2 < 140 ? 'transparent' : '#f00'}>
                                            <DefText text={ monthData.avg_sugar2 != '' ? monthData.avg_sugar2 : '-'} style={{ color: monthData.avg_sugar2 < 140 ? '#000' : '#f00', fontFamily:Font.NotoSansMedium, lineHeight:30}} />
                                        </Box>
                                    </HStack>
                                </HStack>
                            </Box>
                            <Box mt='20px'>
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
                            </Box>
                            <Box height={'300px'} width={width - 40} >
                                <WebView
                                    source={{
                                        uri: BASE_URL + '/adm/rn-webview/bloodsugarReport.php?mode=month&id=' + userInfo.id
                                    }}
                                />
                            </Box>
                            {
                                monthData.sugar_all_total != '0' &&
                                <Box mt={2.5} backgroundColor='#F1F1F1' borderRadius={10} p={5}>
                                    <DefText text='정상혈당 달성도' style={[styles.reportLabel, {marginBottom:10}]} />
                                    <VStack>
                                        {
                                            monthData.sugar_all_total != '' &&
                                            <DefText text={'전체 : '+monthData.sugar_all_per+'% (총 '+monthData.sugar_all_total+'회, 달성 '+monthData.sugar_all_cnt+'회)'} style={{fontSize:14, color:'#333'}}/>
                                        }
                                        {
                                            monthData.sugar_1_total != '' && 
                                            <DefText text={'공복 : '+monthData.sugar_1_per+'% (총 '+monthData.sugar_1_total+'회, 달성 '+monthData.sugar_1_cnt+'회)'} style={{fontSize:14, color:'#333', marginTop:10}}/>
                                        }
                                        {
                                            monthData.sugar_2_total != '' && 
                                            <DefText text={'식후 : '+monthData.sugar_2_per+'% (총 '+monthData.sugar_2_total+'회, 달성 '+monthData.sugar_2_cnt+'회)'} style={{fontSize:14, color:'#333', marginTop:10}}/>
                                        }
                                    
                                    </VStack>
                                    <HStack justifyContent='flex-end' alignItems='flex-end' mt={2.5}>
                                        <TouchableOpacity onPress={()=>{navigation.navigate('FoodReportMonth')}} style={{padding:5, paddingHorizontal: 10, backgroundColor:'#B7B7B7', borderRadius:12}}>
                                            <DefText text='음식과 대조' style={{color:'#fff'}} />
                                        </TouchableOpacity>
                                    </HStack>
                                </Box>
                            }
                        </Box>
                    }
                    
                    
                   
                    
                </Box>
            </ScrollView>

            
        </Box>
    );
};

const styles = StyleSheet.create({
    reportLabel : {
        fontSize:16,
        color:'#696969',
        fontWeight:'bold',
        fontFamily:Font.NotoSansBold
    },
    tableText: {
        fontSize:14,
        color:'#000',
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
)(ReportWeekN);