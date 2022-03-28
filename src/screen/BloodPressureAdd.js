import React, {useState, useEffect} from 'react';
import { ScrollView, Dimensions, TouchableOpacity, Platform, FlatList, StyleSheet } from 'react-native';
import { Box, VStack, HStack, Image, Select, Input } from 'native-base';
import HeaderComponents from '../components/HeaderComponents';
import { DefText, SaveButton } from '../common/BOOTSTRAP';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import ToastMessage from '../components/ToastMessage';
import { connect } from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import Api from '../Api';
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

const BloodPressureAdd = (props) => {

    const {navigation, userInfo} = props;


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

    const [select1, setSelect1] = useState('');
    const select1Change = (text) => {
        setSelect1(text);
    }
    const [select2, setSelect2] = useState('');
    const select2Change = (text) => {
        setSelect2(text);
    }
    
    const [select3, setSelect3] = useState('');
    const select3Change = (text) => {
        setSelect3(text);
    }


    const SavesBtn = () => {
       // navigation.navigate('BloodPressure');
        //ToastMessage('혈압기록이 입력되었습니다.');
        if(!dateTimeText){
            ToastMessage('측정일자를 입력하세요.');
            return false;
        }

        if(!select1){
            ToastMessage('수축기 측정 값을 입력하세요.');
            return false;
        }

        if(!select2){
            ToastMessage('이완기 측정 값을 입력하세요.');
            return false;
        }

        if(!select3){
            ToastMessage('심박수 측정 값을 입력하세요.');
            return false;
        }

        Api.send('bloodPressure_insert', {'id':userInfo.id,  'token':userInfo.appToken, 'bdate':dateTimeText, 'high':select1, 'low':select2, 'heartRate':select3}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                console.log('결과 정보: ', arrItems);

                ToastMessage(resultItem.message);
                navigation.navigate('BloodPressure');

            }else{
                console.log('결과 출력 실패!', resultItem);
               
            }
        });
    }


    return (
        <Box flex={1} backgroundColor='#fff     '>
            <HeaderComponents headerTitle='혈압기록' navigation={navigation} />
            <ScrollView>
                <Box p={5}>
                    <HStack height='140px' justifyContent='space-between' px={4} backgroundColor='#F1F1F1' borderRadius='10px' alignItems='center'>
                        <Box width={(width * 0.60) + 'px'}>
                            <DefText text='혈압을 기록해주세요.' style={{fontSize:16, fontFamily:Font.NotoSansMedium}} />
                            <DefText text='혈압측정 가이드를 꼭 참조해주세요.' style={{fontSize:14, fontFamily:Font.NotoSansDemiLight}} />
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
                            >
                                <DefText text='가이드' style={{color:'#fff', fontSize:18, lineHeight:30, fontFamily:Font.NotoSansDemiLight}} />
                            </TouchableOpacity>
                        </Box>
                        <Image source={require('../images/bloodPTopImage.png')} style={{width:74, height:59, resizeMode:'contain'}} alt='체크이미지' />
                    </HStack>
                    <HStack mt={5} p={2.5} px={5} backgroundColor='#f1f1f1' borderRadius={10} justifyContent='space-between' alignItems='center'>
                        <DefText text='측정일자' />
                        <HStack alignItems='center' >
                            <DefText text={dateTimeText} />
                            <TouchableOpacity onPress={showDatePicker}>
                                <Image source={require('../images/carlendarNew.png')} alt='달력' style={{width:20, resizeMode:'contain', marginLeft:10}}  />
                            </TouchableOpacity>
                        </HStack>
                    </HStack>
                    <Box mt={5}>
                        <HStack>
                            <DefText text='수축기(mmHg)' style={[styles.selectLabel, {marginBottom:15}]} />
                            <DefText text='*' style={{fontSize:18, color:'#FFC400', marginLeft:5}} />
                        </HStack>
                        <Input
                            placeholder='수축기 혈압을 입력하세요.'
                            placeholderTextColor={'#a3a3a3'}
                            height='45px'
                            width={width-40}
                            backgroundColor='transparent'
                            borderWidth={1}
                            borderColor='#f1f1f1'
                            borderRadius={10}
                            //onSubmitEditing={schButtons}
                            value={select1}
                            onChangeText={select1Change}
                            style={[{fontSize:16, fontFamily:Font.NotoSansMedium}, select1.length > 0 && {backgroundColor:'#f1f1f1', color:'#000'}]}
                            keyboardType='phone-pad'
                            _focus='transparent'
                        />
                        
                    </Box>
                    <Box mt={5}>
                        <HStack>
                            <DefText text='이완기(mmHg)' style={[styles.selectLabel, {marginBottom:15}]} />
                            <DefText text='*' style={{fontSize:18, color:'#FFC400', marginLeft:5}} />
                        </HStack>
                        <Input 
                                placeholder='이완기 혈압을 입력하세요.'
                                height='45px'
                                width={width-40}
                                backgroundColor='transparent'
                                _focus='transparent'
                                //onSubmitEditing={schButtons}
                                value={select2}
                                borderColor='#f1f1f1'
                                borderRadius={10}
                                onChangeText={select2Change}
                                style={[{fontSize:16, fontFamily:Font.NotoSansMedium}, select2.length > 0 && {backgroundColor:'#f1f1f1', color:'#000'}]}
                                keyboardType='number-pad'
                        />
                        {/* <HStack alignItems='center' justifyContent='space-between'>
                            <DefText text='이완기(mmHg)' style={styles.selectLabel} />
                            <Input 
                                 placeholder='이완기 혈압을 입력하세요.'
                                 height='45px'
                                 width={width * 0.5}
                                 backgroundColor='transparent'
                                 _focus='transparent'
                                 //onSubmitEditing={schButtons}
                                 value={select2}
                                 borderColor='#f1f1f1'
                                 borderRadius={10}
                                 onChangeText={select2Change}
                                 style={[{fontSize:14}, select2.length > 0 && {backgroundColor:'#f1f1f1', color:'#000', fontSize:16, fontFamily:Font.NotoSansMedium}]}
                                 keyboardType='number-pad'
                            />
                        </HStack> */}
                    </Box>
                    <Box mt={5}>
                        <HStack>
                            <DefText text='심박수(bpm)' style={[styles.selectLabel, {marginBottom:15}]}  />
                            <DefText text='*' style={{fontSize:18, color:'#FFC400', marginLeft:5}} />
                        </HStack>
                        <Input 
                            placeholder='심박수를 입력하세요.'
                            height='45px'
                            width={width-40}
                            backgroundColor='transparent'
                            _focus='transparent'
                            borderColor='#f1f1f1'
                            borderRadius={10}
                            //onSubmitEditing={schButtons}
                            value={select3}
                            onChangeText={select3Change}
                            style={[{fontSize:16, fontFamily:Font.NotoSansMedium}, select3.length > 0 && {backgroundColor:'#f1f1f1', color:'#000'}]}
                            keyboardType='number-pad'
                        />
                        
                    </Box>
                </Box>
            </ScrollView>
            <Box position={'absolute'} bottom={"30px"} right={"30px"}>
                <SaveButton onPress={SavesBtn} />
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
        color:'#696968',
        fontFamily:Font.NotoSansMedium
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
)(BloodPressureAdd);