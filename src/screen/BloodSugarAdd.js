import React, {useState, useEffect} from 'react';
import { ScrollView, Dimensions, TouchableOpacity, Platform, FlatList, StyleSheet } from 'react-native';
import { Box, VStack, HStack, Image, Select } from 'native-base';
import HeaderComponents from '../components/HeaderComponents';
import { DefText, DefInput } from '../common/BOOTSTRAP';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import ToastMessage from '../components/ToastMessage';

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

const BloodSugarAdd = (props) => {

    const {navigation} = props;

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

    

    let todayText = time.month + '월 ' + time.date +'일';

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
        setDateTimeText(date.format("MM월 dd일"))
    };

    const [select, setSelect] = useState('');

    const [bloodSugar, setBloodSugar] = useState('');
    const bloodSugarChange = (text) => {
        setBloodSugar(text);
    }

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderComponents headerTitle='혈당기록' navigation={navigation} />
            <ScrollView>
                <Box p={5}>
                    <HStack height='140px' justifyContent='space-between' px={4} backgroundColor='#F1F1F1' borderRadius='30px' alignItems='center'>
                        <Box>
                            <DefText text='혈당을 기록해주세요.' style={{fontSize:16, fontWeight:'bold'}} />
                            <DefText text='혈당측정 가이드를 꼭 참조해주세요.' style={{fontSize:14, }} />
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
                            >
                                <DefText text='가이드' style={{color:'#fff', fontSize:15}} />
                            </TouchableOpacity>
                        </Box>
                        <Image source={require('../images/checkIcons.png')} alt='체크이미지' />
                    </HStack>
                    <Box py={2.5} px={5} backgroundColor='#f1f1f1' borderRadius={10} mt={3}>
                        <DefText text='! 전문의료진께 한번 상담받기를 권해드립니다.' style={{fontSize:14,color:'#999'}} />
                    </Box>
                    <HStack mt={5} p={2.5} px={5} backgroundColor='#f1f1f1' borderRadius={10} justifyContent='space-between' alignItems='center'>
                        <DefText text='측정일자' />
                        <HStack alignItems='center' >
                            <DefText text={dateTimeText} />
                            <TouchableOpacity onPress={showDatePicker}>
                                <Image source={require('../images/datepickerIcon.png')} alt='달력' style={{width:20, resizeMode:'contain', marginLeft:10}}  />
                            </TouchableOpacity>
                        </HStack>
                    </HStack>
                    <Box mt={5}>
                        <HStack alignItems='center' >
                           
                            <Select
                                selectedValue={select} 
                                width={125}
                                height={46}
                                backgroundColor='#fff'
                                placeholder='측정시간'
                                onValueChange={(itemValue) => setSelect(itemValue)}
                            >
                                <Select.Item label="아침식전" value='아침식전' /> 
                                <Select.Item label="아침식후" value='아침식후' /> 
                                <Select.Item label="점심식전" value='점심식전' /> 
                                <Select.Item label="점심식후" value='점심식후' /> 
                                <Select.Item label="저녁식전" value='저녁식전' /> 
                                <Select.Item label="저녁식후" value='저녁식후' /> 

    
                            </Select>
                            <HStack alignItems='flex-end' ml={10}> 
                                <DefInput 
                                    placeholderText='혈당'
                                    inputValue = {bloodSugar}
                                    onChangeText = {bloodSugarChange}
                                    multiline = {false}
                                    inputStyle={{backgroundColor:'transparent', borderWidth:0, width:'90%'}}
                                    keyboardType='number-pad'
                                    height={46}
                                    inputStyle={{fontSize:20, height:46, borderWidth:0}}
                                />
                                <DefText text='mg/dL' style={{marginBottom:10, fontSize:14, color:'#666', marginLeft:10}} />
                            </HStack>
                            
                        </HStack>
                    </Box>
                </Box>
            </ScrollView>
            <Box p={2.5} px={5}>
                <TouchableOpacity style={[styles.buttonDef]}>
                   <DefText text='혈당 등록' style={styles.buttonDefText} />
                </TouchableOpacity>
            </Box>
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
            />
        </Box>
    );
};

const styles = StyleSheet.create({
    selectLabel : {
        fontSize:14,
        color:'#666'
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

export default BloodSugarAdd;