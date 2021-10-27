import React, { useEffect, useState } from 'react';
import { Box, VStack, HStack, Image, Modal, CheckIcon } from 'native-base';
import { TouchableOpacity, ScrollView, StyleSheet, Dimensions, ImageBackground, Text, View, TouchableWithoutFeedback } from 'react-native';
import { DefText, DefInput } from '../common/BOOTSTRAP';
import HeaderComponents from '../components/HeaderComponents';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import ToastMessage from '../components/ToastMessage';

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

const DiseaseSchedule = (props) => {

    const {navigation, route} = props;
    const {params} = route;
    const [par, setPar] = useState({});

    useEffect(async()=>{await setPar(params); await console.log("route.params222 ::: ", par);},[])
    //console.log('데이터정보...',route);

    const [scheduleCate, setScheduleCate] = useState('매일');

    const [scheduleText, setScheduleText] = useState('매일');

    const schduleCateSelect = ( category ) => {
        if(category=='매일'){
            setScheduleText(category);
            setScheduleCate(category);
        }else{
            setScheduleText('');
            setScheduleCate(category);
        }
    }

    const [buttonState, setButtonState] = useState(true);

    const scheduleTextChange = (text) => {
        setScheduleText(text);
    }

   

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

    let todayText = time.year + '년 ' + time.month + '월 ' + time.date +'일';

    const [dateTimeText, setDateTimeText] = useState(todayText);
    const dateTimeChange = (text) => {
        setDateTimeText(text);
    }

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        //console.log("A date has been picked: ", date);
        hideDatePicker();
        setDateTimeText(date.format("yyyy년 MM월 dd일"))
    };

    const [isMedicineDate, setIsMedicineDate] = useState('계속');
    const [dateCategory, setDateCategory] = useState('계속');
    const MedicineDateChangeText = (text) => {
        setIsMedicineDate(text);
    }

    const dateCategoryChange = (category) => {
        //console.log(category);
        if(category=='계속'){
            setIsMedicineDate('계속');
            setDateCategory(category);
        }else{
            setIsMedicineDate('');
            setDateCategory(category);
        }
    }

    useEffect(()=>{
        if(scheduleText.length>0 && isMedicineDate.length > 0){
            setButtonState(false);
        }else{
            setButtonState(true);
        }
    },[scheduleText, isMedicineDate])

    const _handlerDisease = () => {
        if(scheduleText.length == 0){
            ToastMessage('복약주기를 입력하세요.');
            return false;
        }
        if(dateTimeText.length == 0){
            ToastMessage('날짜를 입력하세요.');
            return false;
        }
        if(isMedicineDate.length == 0){
            ToastMessage('복약일수를 입력하세요.');
            return false;
        }

        //console.log(scheduleText, dateTimeText, isMedicineDate);
        navigation.replace('MedicineForm2', {diseaseDatas: route.params.diseaseDatas, scheduleText:scheduleText, dateTimeText:dateTimeText, isMedicineDate:isMedicineDate});
    }

   
    

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderComponents headerTitle='복약관리' navigation={navigation} />
            <ScrollView>
                <Box px={5} py={5}>
                    <HStack height='150px' justifyContent='space-between' px={4} backgroundColor='#F1F1F1' borderRadius='30px' alignItems='center'>
                        <Box>
                            <DefText text='복약주기 및 일수' style={{fontSize:16, fontWeight:'bold'}} />
                            <DefText text='어떤 주기로 얼만큼 약을 드시나요?' style={{fontSize:15, marginTop:10}} />
        
                        </Box>
                        <Image source={require('../images/medicineScheduleIcon.png')} alt='복약관리체크' />
                    </HStack>
                    <Box mt={5}>
                        <DefText text='시작일' style={styles.labelText} />
                        <TouchableOpacity onPress={showDatePicker}>
                            <HStack mt={2.5} alignItems='center' justifyContent='space-between' backgroundColor='#F1F1F1' borderRadius='20px' px={4}>
                            
                                <Box height='45px' justifyContent='center' alignItems='center'>
                                    <DefText text={dateTimeText} style={{fontSize:14}} />
                                </Box>
                                <Image source={require('../images/datepickerIcon.png')} alt='달력' style={{width:20}} resizeMode='contain' />
                            </HStack>
                        </TouchableOpacity>
                    </Box>
                    <Box mt={5}>
                        <DefText text='복약주기' style={styles.labelText} />
                        <HStack mt={2.5}>
                            <TouchableOpacity onPress={ () => schduleCateSelect('매일') } style={[styles.scheduleCate, scheduleCate == '매일' && {backgroundColor:'#666'}]}>
                                <DefText text='매일' style={[styles.scheduleCateText, scheduleCate == '매일' && {color:'#fff'}]} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={ () => schduleCateSelect('일수간격') } style={[styles.scheduleCate, scheduleCate == '일수간격' && {backgroundColor:'#666'}]}>
                                <DefText text='일수간격' style={[styles.scheduleCateText, scheduleCate == '일수간격' && {color:'#fff'}]} />
                            </TouchableOpacity>
                        </HStack>
                    </Box>
                    <Box mt={2.5}>
                        <HStack alignItems='center' backgroundColor='#F1F1F1' borderRadius='20px' px={4} >
                            <Image source={require('../images/schduleIcons.png')} alt='스케줄 입력' />
                            <DefInput 
                                placeholderText='일수 간격을 입력하세요.'
                                inputValue = {scheduleText}
                                onChangeText = {scheduleTextChange}
                                multiline = {false}
                                inputStyle={{backgroundColor:'transparent', borderWidth:0, width:'90%'}}
                                disabled={true}
                            />
                        </HStack>
                    </Box>
                    
                    <Box mt={5}>
                        <DefText text='복약일수' style={styles.labelText} />
                        <HStack my={2.5}>
                            <TouchableOpacity onPress={ () => dateCategoryChange('계속') } style={[styles.scheduleCate, dateCategory == '계속' && {backgroundColor:'#666'}]}>
                                <DefText text='계속' style={[styles.scheduleCateText, dateCategory == '계속' && {color:'#fff'}]} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={ () => dateCategoryChange('며칠간') } style={[styles.scheduleCate, dateCategory == '며칠간' && {backgroundColor:'#666'}]}>
                                <DefText text='며칠간' style={[styles.scheduleCateText, dateCategory == '며칠간' && {color:'#fff'}]} />
                            </TouchableOpacity>
                        </HStack>
                        <HStack alignItems='center' backgroundColor='#F1F1F1' borderRadius='20px' px={4} >
                            <Image source={require('../images/schduleIcons.png')} alt='스케줄 입력' />
                            
                            <DefInput 
                                placeholderText='일간 복약 예정입니다.'
                                inputValue = {isMedicineDate}
                                onChangeText = {MedicineDateChangeText}
                                multiline = {false}
                                inputStyle={{backgroundColor:'transparent', borderWidth:0, width:'90%'}}
                                disabled={true}
                            />
                        </HStack>
                    </Box>
                    <Box mt={5}>
                        <DefText text='복약시간' style={styles.labelText} />
                        <HStack>
                            <TouchableOpacity>
                                <DefText text='아침식사 전' />
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <DefText text='아침식사 후' />
                            </TouchableOpacity>
                        </HStack>
                    </Box>
                </Box>
            </ScrollView>
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
            />
            <Box p={2.5}>
                <TouchableOpacity onPress={_handlerDisease} disabled={buttonState} style={[styles.medicineButtons, !buttonState && {backgroundColor:'#333'}]}>
                    <DefText text='저장' style={styles.medicineButtonsText} />
                </TouchableOpacity>
            </Box>
        </Box>
    );
};

const styles = StyleSheet.create({
    scheduleCate : {
        
        paddingHorizontal:10,
        borderRadius:10,
        height:30,
        backgroundColor:'#f1f1f1',
        marginRight:10,
        alignItems:'center',
        justifyContent:'center'
    },
    scheduleCateText : {
        fontSize:14,
        color:'#333',
        fontWeight:'bold'
    },
    medicineButtons : {
        backgroundColor:'#999',
        borderRadius:5,
        alignItems:'center',
        justifyContent:'center',
        height: 40,
    },
    medicineButtonsText: {
        fontSize:15,
        color:'#fff',
        
    },
    labelText: {
        fontSize:14,
        color:'#696968'
    }
})

export default DiseaseSchedule;