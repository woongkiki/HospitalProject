import React, {useState, useEffect} from 'react';
import { Box, VStack, HStack, Image, Modal } from 'native-base';
import { TouchableOpacity, Dimensions, ScrollView, StyleSheet, Linking, ActivityIndicator } from 'react-native';
import {AddButton, DefInput, DefText} from '../common/BOOTSTRAP';
import HeaderFood from '../components/HeaderFood';
import { textLengthOverCut } from '../common/dataFunction';
import { connect } from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import Api from '../Api';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import ToastMessage from '../components/ToastMessage';
import Font from '../common/Font';

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

    const [inbodyModal, setInbodyModal] = useState(false);
    const gogoInbody = () => {
        navigation.replace('Inbody');
        setInbodyModal(false);
    }

    const FoodDiaryListState = async () => {

        await setFoodLoading(false);
        await Api.send('food_schedule', {'id':userInfo.id, 'date':dateTimeText, 'token':userInfo.appToken}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y') {
                console.log('식단 정보: ', arrItems);
                setFoodDaiaryAll(arrItems);
                setFoodDaiaryData(arrItems.food_diary);
                setFoodDiaryAlertData(arrItems.alert);
            }else{
                //console.log('결과 출력 실패!', resultItem);
                //console.log(resultItem);
                
                // ToastMessage(resultItem.message);
                setTimeout(()=>{
                    setInbodyModal(true);
                },2000)
                
            }
        });

        await setFoodLoading(true);
    }

    const FoodDiaryDataSend = foodDaiaryData.map((food, index)=> {


        return(
            <HStack key={index} justifyContent='space-between' mt={index!=0 ? 5 : 0} alignItems='center'>
                <Box width='20%' p={2.5} marginRight='15px' alignItems='center'>
                    <DefText text={food.ftime} style={{fontSize:14, color:'#696969', fontFamily:Font.NotoSansMedium}} />
                </Box>
                <Box width='75%'>
                    <Box p={2.5} backgroundColor='#fff' borderRadius={10} shadow={8} >
                        <HStack alignItems='center'>
                            {/* <Image source={require('../images/foodThumb01.png')} alt='약 복용' /> */}
                            <Image source={{uri:food.upfile}} alt='약 복용' style={{width:48, height:48, borderRadius:10,resizeMode:'stretch'}} />
                            <Box style={{marginLeft:15}} width={'70%'} >
                                <HStack alignItems='center' justifyContent='space-between'>
                                    <DefText text={food.fname} style={{fontFamily:Font.NotoSansMedium}} />
                                    <DefText text={food.kcal + 'kcal'} style={{fontSize:14, color:'#696969',fontFamily:Font.NotoSansMedium}} />
                                </HStack>
                                <DefText text={textLengthOverCut(food.meal, 18)} style={{fontSize:14, color:'#77838F', marginTop:5, fontFamily:Font.NotoSansMedium}} />
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
                <HStack alignItems='center' flexWrap={'wrap'} justifyContent='space-between'>
                    <DefText text={notice.notice} style={{color:'#000', fontSize:14}} />
                    {
                        notice.screen != "" && notice.screen_idx &&
                        <Box width='100%' alignItems={'flex-end'} mt='10px'>
                            <TouchableOpacity onPress={()=>navigation.navigate(notice.screen, {'idx':notice.screen_idx})}>
                                <Box borderBottomWidth={1} borderBottomColor='#999' ml={1}>
                                    <DefText text='더보기' style={{fontSize:14,color:'#696969', fontFamily:Font.NotoSansMedium}} />
                                </Box>
                            </TouchableOpacity>
                        </Box>
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
            
                            <Box p={5} mb='80px'>
                                
                                <HStack height='140px' justifyContent='space-between' px={4} backgroundColor='#F1F1F1' borderRadius='10px' alignItems='center'>
                                    <Box width={(width * 0.65) + 'px'}>
                                        <DefText text='식단이야기' style={{fontSize:16, fontFamily:Font.NotoSansBold}} />
                                        <DefText text='건강해질 수 있는 식습관을 알아보세요.' style={{fontSize:14, fontFamily:Font.NotoSansDemiLight}} />
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
                                    <Image source={require('../images/foodTopImage.png')} alt='체크이미지' style={{width:70, height:69, resizeMode:'contain'}} />
                                </HStack>
                                <HStack mt='20px' height='50px' justifyContent={'flex-end'} alignItems='center'  width='100%' backgroundColor={'#F1F1F1'} borderRadius={7}>

                                    {/* <Box /> */}
                                    <Box width='100%' position='absolute' height='50px' top='0' left='0' alignItems={'center'} justifyContent='center' >
                                        <DefText text={dateTimeText} style={{fontSize:16,  color:'#696968', fontFamily:Font.NotoSansMedium, color:'#000000'}} />
                                    </Box>
                                    <TouchableOpacity onPress={showDatePicker}>
                                        <Image source={require('../images/carlendarNew.png')} alt='달력' style={{width:20, resizeMode:'contain', marginRight:15}}  />
                                    </TouchableOpacity>

                                </HStack>
                                {
                                    foodDaiaryAll != '' && 
                                    <Box px={2.5} py={2.5} backgroundColor='#f1f1f1' borderRadius={10} mt={5}>
                                        <HStack justifyContent='space-around'>
                                            <VStack width='25%'>
                                                <DefText text='전날' style={[styles.kcalAvgText]} />
                                                <DefText text={foodDaiaryAll.yesterday_kcal + 'kcal'} style={[styles.kcalAvgNumber]} />
                                            </VStack>
                                            <VStack width='55%'>
                                                <DefText text='오늘' style={[styles.kcalAvgText]}  />
                                                <DefText text={ foodDaiaryAll.recom_kcal_range+ 'kcal'} style={[styles.kcalAvgNumber, {fontSize:18, fontFamily:Font.NotoSansBold}]}  />
                                            </VStack>
                                            <VStack width='25%'>
                                                <DefText text='권장' style={[styles.kcalAvgText]}  />
                                                <DefText text={foodDaiaryAll.recom_kcal + 'kcal'} style={[styles.kcalAvgNumber]} />
                                            </VStack>
                                        </HStack>
                                    </Box>
                                }

                                <Box mt={5} backgroundColor='#F1F1F1' borderRadius={10} p={5}>
                                    <DefText text='영양소 섭취가이드(일)' style={[styles.reportLabel, {marginBottom:10}]} />
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
                                                            <HStack justifyContent={'center'}>
                                                                <Box style={{borderBottomWidth:1, borderBottomColor: foodDaiaryAll.now_carbo >= foodDaiaryAll.recom_carbo ? "#FF8569" : 'transparent' }}>
                                                                    <DefText text={ foodDaiaryAll.now_carbo.toFixed(2) } style={[styles.tableText, foodDaiaryAll.now_carbo >= foodDaiaryAll.recom_carbo && {color: '#FF8569', fontFamily:Font.NotoSansBold}]}  />
                                                                </Box>
                                                            </HStack>
                                                        </Box>
                                                        <Box >
                                                            <DefText text={ foodDaiaryAll.recom_carbo.toFixed(2) } style={[styles.tableText]}  />
                                                        </Box>
                                                    </VStack>
                                                    <VStack width='33.3%' height={60} justifyContent='space-between' py={1.5}>
                                                        <Box>
                                                            <HStack justifyContent={'center'}>
                                                                <Box style={{borderBottomWidth:1, borderBottomColor: foodDaiaryAll.now_protein >= foodDaiaryAll.recom_protein ? "#FF8569" : 'transparent' }}>
                                                                    <DefText text={foodDaiaryAll.now_protein.toFixed(2)} style={[styles.tableText, foodDaiaryAll.now_protein >= foodDaiaryAll.recom_protein && {color: '#FF8569', fontFamily:Font.NotoSansBold}]}  />
                                                                </Box>
                                                            </HStack>
                                                        </Box>
                                                        <Box >
                                                            <DefText text={foodDaiaryAll.recom_protein.toFixed(2)} style={[styles.tableText]}  />
                                                        </Box>
                                                    </VStack>
                                                    <VStack width='33.3%' height={60} justifyContent='space-between' alignItems='center' py={1.5}>
                                                        <Box >
                                                            <HStack justifyContent={'center'}>
                                                                <Box style={{borderBottomWidth:1, borderBottomColor: foodDaiaryAll.now_fat >= foodDaiaryAll.recom_fat ? "#FF8569" : 'transparent' }}>
                                                                    <DefText text={foodDaiaryAll.now_fat.toFixed(2)} style={[styles.tableText, foodDaiaryAll.now_fat >= foodDaiaryAll.recom_fat && {color: '#FF8569', fontFamily:Font.NotoSansBold}]}  />
                                                                </Box>
                                                            </HStack>
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
                                                            <HStack justifyContent={'center'}>
                                                                <Box style={{borderBottomWidth:1, borderBottomColor: foodDaiaryAll.now_fat2 >= foodDaiaryAll.recom_fat2 ? "#FF8569" : 'transparent' }}>
                                                                    <DefText text={ foodDaiaryAll.now_fat2.toFixed(2) } style={[styles.tableText, foodDaiaryAll.now_fat2 >= foodDaiaryAll.recom_fat2 &&  {color:'#FF8569', fontFamily:Font.NotoSansBold}]}  />
                                                                </Box>
                                                            </HStack>
                                                        </Box>
                                                        <Box >
                                                            <DefText text={foodDaiaryAll.recom_fat2.toFixed(2)} style={[styles.tableText]}  />
                                                        </Box>
                                                    </VStack>
                                                    <VStack width='40%' height={60} justifyContent='space-between' alignItems='center' py={1.5}>
                                                        <Box >
                                                            <HStack justifyContent={'center'}>
                                                                <Box style={{borderBottomWidth:1, borderBottomColor: foodDaiaryAll.now_fat3 >= foodDaiaryAll.recom_fat3 ? "#FF8569" : 'transparent' }}>
                                                                    <DefText text={ foodDaiaryAll.now_fat3.toFixed(2) } style={[styles.tableText, foodDaiaryAll.now_fat3 >= foodDaiaryAll.recom_fat3 && {color:'#FF8569', fontFamily:Font.NotoSansBold}]}  />
                                                                </Box>
                                                            </HStack>
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
                                    <DefText text='만성질환 위험감소 섭취안내(일)' style={[styles.reportLabel, {marginBottom:10}]} />
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
                                                            <HStack justifyContent={'center'}>
                                                                <Box style={{borderBottomWidth:1, borderBottomColor: foodDaiaryAll.now_sugar >= foodDaiaryAll.recom_sugar ? "#FF8569" : 'transparent' }}>
                                                                    <DefText text={foodDaiaryAll.now_sugar.toFixed(2)} style={[styles.tableText, foodDaiaryAll.now_sugar >= foodDaiaryAll.recom_sugar &&  {color:'#FF8569', fontFamily:Font.NotoSansBold}]}  />
                                                                </Box>
                                                            </HStack>
                                                        </Box>
                                                        <Box >
                                                            <DefText text={foodDaiaryAll.recom_sugar.toFixed(2)} style={[styles.tableText]}  />
                                                        </Box>
                                                    </VStack>
                                                    <VStack width='33.3%' height={60} justifyContent='space-between' py={1.5}
                                                    >
                                                         <Box >
                                                            <HStack justifyContent={'center'}>
                                                                <Box style={{borderBottomWidth:1, borderBottomColor: foodDaiaryAll.now_cholesterol >= foodDaiaryAll.recom_cholesterol ? "#FF8569" : 'transparent' }}>
                                                                    <DefText text={ foodDaiaryAll.now_cholesterol.toFixed(2) } style={[styles.tableText, foodDaiaryAll.now_cholesterol >= foodDaiaryAll.recom_cholesterol && {color:'#FF8569',  fontFamily:Font.NotoSansBold}]}  />
                                                                </Box>
                                                            </HStack>
                                                        </Box>
                                                        <Box >
                                                            <DefText text={foodDaiaryAll.recom_cholesterol.toFixed(2)} style={[styles.tableText]}  />
                                                        </Box>
                                                    </VStack>
                                                    <VStack width='33.3%' height={60} justifyContent='space-between' alignItems='center' py={1.5}>
                                                        <Box >
                                                            <HStack justifyContent={'center'}>
                                                                <Box style={{borderBottomWidth:1, borderBottomColor: foodDaiaryAll.now_salt >= foodDaiaryAll.recom_salt ? "#FF8569" : 'transparent' }}>
                                                                    <DefText text={foodDaiaryAll.now_salt.toFixed(2)} style={[styles.tableText, foodDaiaryAll.now_salt >= foodDaiaryAll.recom_salt && {color:'#FF8569',  fontFamily:Font.NotoSansBold}]}  />
                                                                </Box>
                                                            </HStack>
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
                                                <Image source={require('../images/foodTopImage.png')} alt={'식단을 관리하세요'} style={{width:50, height:50, resizeMode:'contain'}} />
                                                <DefText text='섭취하신 식단정보를 추가하여 건강을 관리하세요.' style={{marginTop:20, color:'#696969', fontFamily:Font.NotoSansMediu, fontWeight:'500'}} />
                                            </Box>
                                        }
                                    </Box>
                                </VStack>
                            </Box>
                        </ScrollView>
                        :
                        <Box justifyContent='center' alignItems='center' flex={1}>
                            <Image source={require('../images/foodTopImage.png')} alt={'식단을 관리하세요'} style={{width:50, height:50, resizeMode:'contain'}} />
                            <DefText text='섭취하신 식단정보를 입력하여 건강을 관리하세요.' style={{marginTop:20, color:'#696969', fontFamily:Font.NotoSansMediu, fontWeight:'500'}} />
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
            {/* <Box p={2.5} px={5}>
                <TouchableOpacity onPress={()=>{navigation.navigate('FoodDiaryAdd', {'foods':'', 'foodName':'', 'tagList':''})}} style={[styles.buttonDef]}>
                   <DefText text='식단정보 추가' style={styles.buttonDefText} />
                </TouchableOpacity>
            </Box> */}
            <Modal isOpen={inbodyModal} onClose={()=>setInbodyModal(false)}>
                <Modal.Content>
                    <Modal.Body>
                        <Box justifyContent={'center'} alignItems='center'>
                            <DefText text='권장칼로리 계산을 위해  체중, 키 수치가 필요합니다.' style={{fontSize:14}} />
                            <DefText text='체중, 키를 입력해주세요.' style={{fontSize:14}} />
                            <TouchableOpacity 
                                onPress={gogoInbody}
                                style={{width:(width - 80) * 0.45, height:45, backgroundColor:'#090A73', justifyContent:'center', alignItems:'center', borderRadius:10, marginTop:20}}>
                                <DefText text='확인' style={{color:'#fff'}}/>
                            </TouchableOpacity>
                        </Box>
                       
                    </Modal.Body>
                </Modal.Content>
            </Modal>

            <Box position={'absolute'} right={'30px'} bottom={'30px'}>
                <AddButton onPress={()=>{navigation.navigate('FoodDiaryAdd', {'foods':'', 'foodName':'', 'tagList':''})}} />
            </Box>
        </Box>
    );
};

const styles = StyleSheet.create({
    kcalAvgText: {
        fontSize:14,
        color:'#000',
        marginBottom:10,
        fontWeight:'bold',
        fontFamily:Font.NotoSansBold,
        textAlign:'center'
    },
    kcalAvgNumber : {
        fontSize:14,
        color:'#000',
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