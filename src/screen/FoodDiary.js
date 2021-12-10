import React, {useState, useEffect} from 'react';
import { Box, VStack, HStack, Image } from 'native-base';
import { TouchableOpacity, Dimensions, ScrollView, StyleSheet, Linking, ActivityIndicator } from 'react-native';
import {DefInput, DefText} from '../common/BOOTSTRAP';
import HeaderFood from '../components/HeaderFood';
import { textLengthOverCut } from '../common/dataFunction';
import { connect } from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import Api from '../Api';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useFocusEffect, useIsFocused } from '@react-navigation/native';

const {width} = Dimensions.get('window');

Date.prototype.format = function(f) {
    if (!this.valueOf()) return " ";
 
    var weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    var d = this;
     
    return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function($1) {
        switch ($1) {
            case "yyyy": return d.getFullYear();
            case "yy": return (d.getFullYear() % 1000).zf(2);
            case "MM": return (d.getMonth() + 1).zf(2);
            case "dd": return d.getDate().zf(2);
            case "E": return weekName[d.getDay()];
            case "HH": return d.getHours().zf(2);
            case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2);
            case "mm": return d.getMinutes().zf(2);
            case "ss": return d.getSeconds().zf(2);
            case "a/p": return d.getHours() < 12 ? "오전" : "오후";
            default: return $1;
        }
    });
};
 
String.prototype.string = function(len){var s = '', i = 0; while (i++ < len) { s += this; } return s;};
String.prototype.zf = function(len){return "0".string(len - this.length) + this;};
Number.prototype.zf = function(len){return this.toString().zf(len);};

const FoodDiary = (props) => {

    const {navigation, userInfo} = props;

    const [foodLoading, setFoodLoading] = useState(false);


     //날짜 선택..
     const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

     let today = new Date(); // today 객체에 Date()의 결과를 넣어줬다
     let time = {
       year: today.getFullYear(),  //현재 년도
       month: today.getMonth() + 1, // 현재 월
       date: today.getDate(), // 현제 날짜
       hours: today.getHours(), //현재 시간
       minutes: today.getMinutes(), //현재 분
     };
 
     
 
     let todayText = today.format("yyyy-MM-dd");
 
     const [dateTimeText, setDateTimeText] = useState(todayText);
 
     const showDatePicker = () => {
         setDatePickerVisibility(true);
     };
 
     const hideDatePicker = () => {
         setDatePickerVisibility(false);
     };
 
     const handleConfirm = (date) => {
         //console.log("A date has been picked: ", date);
         hideDatePicker();
         setDateTimeText(date.format("yyyy-MM-dd"))
     };
 

    const FoodDiaryListBtn = () => {
        navigation.navigate('FoodDiaryList');
    }

   
    const [foodDaiaryAll, setFoodDaiaryAll] = useState([]);
    const [foodDaiaryData, setFoodDaiaryData] = useState([]);
    const [foodDiaryAlertData, setFoodDiaryAlertData] = useState([]);

    const FoodDiaryListState = async () => {

        await setFoodLoading(false);
        await Api.send('food_schedule', {'id':userInfo.id, 'date':dateTimeText, 'token':userInfo.appToken}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                console.log('식단 정보: ', arrItems);
                setFoodDaiaryAll(arrItems);
                setFoodDaiaryData(arrItems.food_diary);
                setFoodDiaryAlertData(arrItems.alert);
            }else{
                console.log('결과 출력 실패!', resultItem);
               
            }
        });

        await setFoodLoading(true);
    }

    const FoodDiaryDataSend = foodDaiaryData.map((food, index)=> {


        return(
            <HStack key={index} justifyContent='space-between' mt={index!=0 ? 5 : 0} alignItems='center'>
                <Box width='20%' p={2.5} marginRight='15px' alignItems='center'>
                    <DefText text={food.ftime} style={{fontSize:12, color:'#77838F'}} />
                </Box>
                <Box width='75%'>
                    <Box p={2.5} backgroundColor='#fff' borderRadius={20} shadow={8} >
                        <HStack alignItems='center'>
                            {/* <Image source={require('../images/foodThumb01.png')} alt='약 복용' /> */}
                            <Image source={{uri:food.upfile}} alt='약 복용' style={{width:48, height:48, borderRadius:48,resizeMode:'stretch'}} />
                            <Box style={{marginLeft:15}} width={'70%'} >
                                <HStack alignItems='center' justifyContent='space-between'>
                                    <DefText text={food.fname} style={{fontSize:14}} />
                                    <DefText text={food.kcal + 'kcal'} style={{fontSize:12, color:'#1E2022',  }} />
                                </HStack>
                                <DefText text={textLengthOverCut(food.meal, 18)} style={{fontSize:14, color:'#77838F', marginTop:5}} />
                            </Box>
                        </HStack>
                        {
                            food.red_alert &&
                            <Box position='absolute' top='40%' left='-12px'  zIndex='10'>
                                <Image source={require('../images/foodAlertIcons.png')} alt='경고' />
                            </Box>
                        }
                        
                    </Box>
                   
                </Box>
            </HStack>
        )
    })


    const FoodDiaryAlertSend = foodDiaryAlertData.map((notice, index)=> {
        return(
            <Box key={index} py={2.5} px={5} backgroundColor='#f1f1f1' borderRadius={10} mt={3}>
                <HStack alignItems='center'>
                    <DefText text={notice.notice} style={{fontSize:14,color:'#999'}} />
                    {
                        notice.url != "" &&
                        <TouchableOpacity onPress={()=>{Linking.openURL(notice.url)}}>
                            <Box borderBottomWidth={1} borderBottomColor='#999' ml={1} >
                                <DefText text='더보기' style={{fontSize:14,color:'#999'}} />
                            </Box>
                        </TouchableOpacity>
                    }
                    
                </HStack>
            </Box>
        )
    })

    useEffect(()=>{
        FoodDiaryListState();
    },[])
    

    const navigationMove = () => {
        navigation.navigate('Tab_Navigation', {
            screen: 'Community',
            params: 'food'
        });
    }

    const isFocused = useIsFocused();
 
    useEffect(() => {
      
      if (isFocused){
        //console.log('포커스온ㅇㅇㅇㅇㅇ::::::::',props.route.params);
        FoodDiaryListState()
      } 
        
    }, [isFocused]);


    useEffect(()=>{
        FoodDiaryListState()
    },[dateTimeText])

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderFood headerTitle='식단일기' navigation={navigation} diaryButton={FoodDiaryListBtn} />
            {
                foodLoading ?
                <>
                    {
                        foodDaiaryAll != '' ?
                        <ScrollView>
            
                            <Box p={5}>
                                <HStack mb='20px' px={5} justifyContent='space-between' alignItems='center'>

                                    <Box />
                                    <DefText text={dateTimeText} style={{fontSize:25, lineHeight:27, color:'#696968', marginBottom:-5}} />
                                    <TouchableOpacity onPress={showDatePicker}>
                                        <Image source={require('../images/datepickerIcon.png')} alt='달력' style={{width:20, resizeMode:'contain', marginLeft:10}}  />
                                    </TouchableOpacity>

                                </HStack>
                                <HStack height='140px' justifyContent='space-between' px={4} backgroundColor='#F1F1F1' borderRadius='30px' alignItems='center'>
                                    <Box width={(width * 0.65) + 'px'}>
                                        <DefText text='비만이야기' style={{fontSize:16, fontWeight:'bold'}} />
                                        <DefText text='약을 잘먹으면 큰병을 예방할 수 있어요.' style={{fontSize:14, }} />
                                        <TouchableOpacity
                                            style={{
                                                width:100,
                                                height:30,
                                                backgroundColor:'#696968',
                                                borderRadius:10,
                                                alignItems:'center',
                                                justifyContent:'center',
                                                marginTop:10 
                                            }}
                                            onPress={navigationMove}
                                        >
                                            <DefText text='알아보기' style={{color:'#fff', fontSize:15}} />
                                        </TouchableOpacity>
                                    </Box>
                                    <Image source={require('../images/checkIcons.png')} alt='체크이미지' />
                                </HStack>
                            
                                {
                                    foodDaiaryAll != '' && 
                                    <Box px={5} py={2.5} backgroundColor='#f1f1f1' borderRadius={10} mt={5}>
                                        <HStack justifyContent='space-around'>
                                            <VStack>
                                                <DefText text='전날' style={[styles.kcalAvgText]} />
                                                <DefText text={foodDaiaryAll.yesterday_kcal + 'kcal'} style={[styles.kcalAvgNumber]} />
                                            </VStack>
                                            <VStack>
                                                <DefText text='오늘' style={[styles.kcalAvgText]}  />
                                                <DefText text={ foodDaiaryAll.today_kcal.toFixed(2) + 'kcal'} style={[styles.kcalAvgNumber, {fontSize:18}]}  />
                                            </VStack>
                                            <VStack>
                                                <DefText text='권장' style={[styles.kcalAvgText]}  />
                                                <DefText text={foodDaiaryAll.recom_kcal + 'kcal'} style={[styles.kcalAvgNumber]} />
                                            </VStack>
                                        </HStack>
                                    </Box>
                                }
                            
                                

                                <Box mt={5} backgroundColor='#F1F1F1' borderRadius={10} p={5}>
                                    <DefText text='영양소 섭취가이드(일)' style={[styles.reportLabel], {marginBottom:10}} />
                                    <Box>
                                        <HStack justifyContent='space-between' borderBottomWidth={1} borderBottomColor='#999'>
                                            <Box width={(width - 40) *0.2 + 'px'} />
                                            <Box width={(width - 40 )*0.7 + 'px' } borderLeftWidth={1} borderLeftColor="#999">
                                                <HStack justifyContent='space-between' py={2.5}>
                                                    <Box width='33.3%' >
                                                        <DefText text='탄수화물(g)' style={[styles.tableText]} />
                                                    </Box>
                                                    <Box width='33.3%' >
                                                        <DefText text='단백질(g)' style={[styles.tableText]} />
                                                    </Box>
                                                    <Box width='33.3%' >
                                                        <DefText text='지방(g)' style={[styles.tableText]} />
                                                    </Box>
                                                </HStack>
                                            </Box>
                                        </HStack>
                                        
                                        <HStack borderBottomWidth={1} borderBottomColor='#999' >
                                            <Box width={(width - 40) *0.2  + 'px'} >
                                                <HStack alignItems='center'>
                                                    <Box width='50%' height={60} justifyContent='center' py={1.5}>
                                                        <DefText text='섭취량' style={[styles.tableText, {fontSize:13}]}  />
                                                    </Box>
                                                    <VStack width='50%' height={60} justifyContent='space-between' py={1.5}>
                                                        <Box >
                                                            <DefText text='현재' style={[styles.tableText]}  />
                                                        </Box>
                                                        <Box >
                                                            <DefText text='추천' style={[styles.tableText]}  />
                                                        </Box>
                                                    </VStack>
                                                </HStack>
                                            </Box>
                                            <Box width={(width - 40 )*0.7 + 'px'} borderLeftWidth={1} borderLeftColor="#999">
                                                <HStack justifyContent='space-between' alignItems='center' >
                                                    <VStack width='33.3%' height={60} justifyContent='space-between' py={1.5}>
                                                        <Box >
                                                            <DefText text={ foodDaiaryAll.now_carbo.toFixed(2) } style={[styles.tableText]}  />
                                                        </Box>
                                                        <Box >
                                                            <DefText text={ foodDaiaryAll.recom_carbo.toFixed(2) } style={[styles.tableText]}  />
                                                        </Box>
                                                    </VStack>
                                                    <VStack width='33.3%' height={60} justifyContent='space-between' py={1.5}>
                                                        <Box >
                                                            <DefText text={foodDaiaryAll.now_protein.toFixed(2)} style={[styles.tableText]}  />
                                                        </Box>
                                                        <Box >
                                                            <DefText text={foodDaiaryAll.recom_protein.toFixed(2)} style={[styles.tableText]}  />
                                                        </Box>
                                                    </VStack>
                                                    <VStack width='33.3%' height={60} justifyContent='space-between' alignItems='center' py={1.5}>
                                                        <Box >
                                                            <DefText text={foodDaiaryAll.now_fat.toFixed(2)} style={[styles.tableText]}  />
                                                        </Box>
                                                        <Box >
                                                            <DefText text={foodDaiaryAll.recom_fat.toFixed(2)} style={[styles.tableText]}  />
                                                        </Box>
                                                    </VStack>
                                                </HStack>
                                                
                                            </Box>
                                        </HStack>

                                    </Box>
                                    <Box mt={5}>
                                        <HStack justifyContent='space-between' borderBottomWidth={1} borderBottomColor='#999'>
                                            <Box width={(width - 40) *0.2 + 'px'} />
                                            <Box width={(width - 40 )*0.7 + 'px'} borderLeftWidth={1} borderLeftColor="#999">
                                                <HStack justifyContent='space-between' py={2.5}>
                                                    <Box width='20%' >
                                                        
                                                    </Box>
                                                    <Box width='40%' >
                                                        <DefText text='포화지방산(g)' style={[styles.tableText]} />
                                                    </Box>
                                                    <Box width='40%' >
                                                        <DefText text='트랜스지방산(g)' style={[styles.tableText]} />
                                                    </Box>
                                                </HStack>
                                            </Box>
                                        </HStack>
                                        
                                        <HStack borderBottomWidth={1} borderBottomColor='#999' >
                                            <Box width={(width - 40) *0.2 + 'px'} >
                                                <HStack alignItems='center'>
                                                    <Box width='50%' height={60} justifyContent='center' py={1.5}>
                                                        <DefText text='섭취량' style={[styles.tableText, {fontSize:13}]}  />
                                                    </Box>
                                                    <VStack width='50%' height={60} justifyContent='space-between' py={1.5}>
                                                        <Box >
                                                            <DefText text='현재' style={[styles.tableText]}  />
                                                        </Box>
                                                        <Box >
                                                            <DefText text='추천' style={[styles.tableText]}  />
                                                        </Box>
                                                    </VStack>
                                                </HStack>
                                            </Box>
                                            <Box width={(width - 40 )*0.7 + 'px'} borderLeftWidth={1} borderLeftColor="#999">
                                                <HStack justifyContent='space-between' alignItems='center' >
                                                    <VStack width='20%' height={60} justifyContent='space-between' py={1.5}>
                                                        <Box >
                                                        </Box>
                                                        <Box >
                                                        </Box>
                                                    </VStack>
                                                    <VStack width='40%' height={60} justifyContent='space-between' py={1.5}>
                                                        <Box >
                                                            <DefText text={foodDaiaryAll.now_fat2.toFixed(2)} style={[styles.tableText]}  />
                                                        </Box>
                                                        <Box >
                                                            <DefText text={foodDaiaryAll.recom_fat2.toFixed(2)} style={[styles.tableText]}  />
                                                        </Box>
                                                    </VStack>
                                                    <VStack width='40%' height={60} justifyContent='space-between' alignItems='center' py={1.5}>
                                                        <Box >
                                                            <DefText text={foodDaiaryAll.now_fat3.toFixed(2)} style={[styles.tableText]}  />
                                                        </Box>
                                                        <Box >
                                                            <DefText text={foodDaiaryAll.recom_fat3.toFixed(2)} style={[styles.tableText]}  />
                                                        </Box>
                                                    </VStack>
                                                </HStack>
                                                
                                            </Box>
                                        </HStack>

                                    </Box>
                                </Box>
                                
                                <Box mt={5} backgroundColor='#F1F1F1' borderRadius={10} p={5}>
                                    <DefText text='만성질환 위험감소 섭취안내(일)' style={[styles.reportLabel], {marginBottom:10}} />
                                    <Box>
                                        <HStack justifyContent='space-between' borderBottomWidth={1} borderBottomColor='#999'>
                                            <Box width={(width - 40) *0.2 + 'px'} />
                                            <Box width={(width - 40 )*0.7 + 'px'} borderLeftWidth={1} borderLeftColor="#999">
                                                <HStack justifyContent='space-between' py={2.5}>
                                                    <Box width='33.3%' >
                                                        <DefText text='당류(g)' style={[styles.tableText]} />
                                                    </Box>
                                                    <Box width='33.3%' >
                                                        <DefText text='콜레스테롤(g)' style={[styles.tableText]} />
                                                    </Box>
                                                    <Box width='33.3%' >
                                                        <DefText text='나트륨(g)' style={[styles.tableText]} />
                                                    </Box>
                                                </HStack>
                                            </Box>
                                        </HStack>
                                        
                                        <HStack borderBottomWidth={1} borderBottomColor='#999' >
                                            <Box width={(width - 40) *0.2 + 'px'} >
                                                <HStack alignItems='center'>
                                                    <Box width='50%' height={60} justifyContent='center' py={1.5}>
                                                        <DefText text='비율' style={[styles.tableText, {fontSize:13}]}  />
                                                    </Box>
                                                    <VStack width='50%' height={60} justifyContent='space-between' py={1.5}>
                                                        <Box >
                                                            <DefText text='현재' style={[styles.tableText]}  />
                                                        </Box>
                                                        <Box >
                                                            <DefText text='추천' style={[styles.tableText]}  />
                                                        </Box>
                                                    </VStack>
                                                </HStack>
                                            </Box>
                                            <Box width={(width - 40 )*0.7 + 'px'} borderLeftWidth={1} borderLeftColor="#999">
                                                <HStack justifyContent='space-between' alignItems='center' >
                                                    <VStack width='33.3%' height={60} justifyContent='space-between' py={1.5}>
                                                        <Box >
                                                            <DefText text={foodDaiaryAll.now_sugar.toFixed(2)} style={[styles.tableText]}  />
                                                        </Box>
                                                        <Box >
                                                            <DefText text={foodDaiaryAll.recom_sugar.toFixed(2)} style={[styles.tableText]}  />
                                                        </Box>
                                                    </VStack>
                                                    <VStack width='33.3%' height={60} justifyContent='space-between' py={1.5}>
                                                        <Box >
                                                            <DefText text={foodDaiaryAll.now_cholesterol.toFixed(2)} style={[styles.tableText]}  />
                                                        </Box>
                                                        <Box >
                                                            <DefText text={foodDaiaryAll.recom_cholesterol.toFixed(2)} style={[styles.tableText]}  />
                                                        </Box>
                                                    </VStack>
                                                    <VStack width='33.3%' height={60} justifyContent='space-between' alignItems='center' py={1.5}>
                                                        <Box >
                                                            <DefText text={foodDaiaryAll.now_salt.toFixed(2)} style={[styles.tableText]}  />
                                                        </Box>
                                                        <Box >
                                                            <DefText text={foodDaiaryAll.recom_salt.toFixed(2)} style={[styles.tableText]}  />
                                                        </Box>
                                                    </VStack>
                                                </HStack>
                                                
                                            </Box>
                                        </HStack>

                                    </Box>
                                    
                                </Box>
                                    {
                                        foodDiaryAlertData.length > 0 &&
                                        FoodDiaryAlertSend
                                    }
                                <VStack mt={8}>
                                    <Box> 
                                        {
                                            foodDaiaryData.length > 0 ?
                                            FoodDiaryDataSend
                                            :
                                            <Box justifyContent='center' alignItems='center' py={10}>
                                                <Image source={require('../images/foodIconsG.png')} alt={'식단을 관리하세요'} />
                                                <DefText text='섭취하신 식단정보를 추가하여 건강을 관리하세요.' style={{marginTop:20, color:'#666'}} />
                                            </Box>
                                        }
                                    </Box>
                                </VStack>
                            </Box>
                        </ScrollView>
                        :
                        <Box justifyContent='center' alignItems='center' flex={1}>
                            <Image source={require('../images/foodIconG.png')} alt={'식단을 관리하세요'} />
                            <DefText text='섭취하신 식단정보를 입력하여 건강을 관리하세요.' style={{marginTop:20, color:'#666'}} />
                            {/* <ActivityIndicator size='large' color='#333' /> */}
                        </Box>
                    }
                    
                </>
                :
                <Box alignItems='center' justifyContent='center' flex={1}>
                    <ActivityIndicator size='large' color='#333' />
                </Box>
            }
            
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
            />
            <Box p={2.5} px={5}>
                <TouchableOpacity onPress={()=>{navigation.navigate('FoodDiaryAdd', {'foods':'', 'foodName':'', 'tagList':''})}} style={[styles.buttonDef]}>
                   <DefText text='식단정보 추가' style={styles.buttonDefText} />
                </TouchableOpacity>
            </Box>
        </Box>
    );
};

const styles = StyleSheet.create({
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
    tableText: {
        fontSize:13,
        color:'#333',
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
    )(FoodDiary);