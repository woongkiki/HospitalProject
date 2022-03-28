import React, {useState, useEffect} from 'react';
import { ScrollView, Dimensions, TouchableOpacity, Platform, FlatList, StyleSheet } from 'react-native';
import { Box, VStack, HStack, Image, Select, Input } from 'native-base';
import HeaderComponents from '../components/HeaderComponents';
import { DefText, DefInput, SaveButton } from '../common/BOOTSTRAP';
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

const BloodSugarAdd = (props) => {

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

    const [select, setSelect] = useState('');

    const [bloodSugar, setBloodSugar] = useState('');
    const bloodSugarChange = (text) => {
        setBloodSugar(text);
    }


    console.log(userInfo);

    const SavesBtn = () => {
       // navigation.navigate('BloodSugar');
        //ToastMessage('혈당기록이 입력되었습니다.');
        if(!dateTimeText){
            ToastMessage('측정일자를 입력하세요.');
            return false;
        }

        if(!select){
            ToastMessage('측정시간을 입력하세요.');
            return false;
        }

        if(!bloodSugar){
            ToastMessage('혈당수치를 입력하세요.');
            return false;
        }

        
        Api.send('bloodSugar_insert', {'id':userInfo.id,  'token':userInfo.appToken, 'bdate':dateTimeText, 'btime':select, 'level':bloodSugar}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                console.log('결과 정보: ', arrItems);

                ToastMessage('혈당정보가 등록되었습니다.');
                navigation.navigate('BloodSugar');

            }else{
                console.log('결과 출력 실패!', resultItem);
               
            }
        });
    }

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderComponents headerTitle='혈당기록' navigation={navigation} />
            <ScrollView>
                <Box p={5}>
                    <HStack height='140px' justifyContent='space-between' px={4} backgroundColor='#F1F1F1' borderRadius='10px' alignItems='center'>
                        <Box width={(width * 0.60) + 'px'}>
                            <DefText text='혈당을 기록해주세요.' style={{fontSize:16, fontWeight:'bold'}} />
                            <DefText text='혈당측정 가이드를 꼭 참조해주세요.' style={{fontSize:14, fontFamily:Font.NotoSansDemiLight}} />
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
                        <Image source={require('../images/bloodSTopIcon.png')} alt='체크이미지' style={{resizeMode:'contain', width:65, height:70}} />
                    </HStack>
                    <Box mt={5}>
                        <HStack justifyContent={'space-between'}> 
                            <Box width={(width-40)*0.47}>
                                <HStack>
                                    <DefText text='일자' style={[styles.selectLabel, {marginBottom:15}]}  />
                                    <DefText text='*' style={{fontSize:18, color:'#FFC400', marginLeft:5}} />
                                </HStack>

                                <HStack justifyContent='space-between' alignItems='center' width='100%'  height='45px' py='5px'  backgroundColor='#f1f1f1' borderRadius={10} px={5} >
                                    <DefText text={dateTimeText} style={{fontSize:16, fontFamily:Font.NotoSansMedium}} />
                                    <TouchableOpacity onPress={showDatePicker}>
                                        <Image source={require('../images/carlendarNew.png')} alt='달력' style={{width:20, resizeMode:'contain', marginLeft:10}}  />
                                    </TouchableOpacity>
                                </HStack>
                            </Box>
                            <Box width={(width-40)*0.47}>
                                <HStack>
                                    <DefText text='시간' style={[styles.selectLabel, {marginBottom:15}]}  />
                                    <DefText text='*' style={{fontSize:18, color:'#FFC400', marginLeft:5}} />
                                </HStack>
                                <Select
                                    selectedValue={select} 
                                    width={(width-40)*0.47}
                                    height={45}
                                    backgroundColor='#fff'
                                    placeholder='측정시간'
                                    placeholderTextColor='#a3a3a3'
                                    onValueChange={(itemValue) => setSelect(itemValue)}
                                    style={[{borderRadius:10, borderColor:'#f1f1f1', fontSize:16, color:'#000', fontFamily:Font.NotoSansMedium}]}
                                >
                                    <Select.Item label="아침식전" value='1' /> 
                                    <Select.Item label="아침식후" value='2' /> 
                                    <Select.Item label="점심식전" value='3' /> 
                                    <Select.Item label="점심식후" value='4' /> 
                                    <Select.Item label="저녁식전" value='5' /> 
                                    <Select.Item label="저녁식후" value='6' /> 
                                </Select>
                            </Box>
                        </HStack>
                    </Box>
                    <Box mt={5}>
                        <HStack>
                            <DefText text='혈당' style={[styles.selectLabel, {marginBottom:15}]}  />
                            <DefText text='*' style={{fontSize:18, color:'#FFC400', marginLeft:5}} />
                        </HStack>
                        <Input 
                            placeholder='혈당을 입력하세요. mg/dL'
                            height='45px'
                            width={width-40}
                            backgroundColor='transparent'
                            _focus='transparent'
                            borderColor='#f1f1f1'
                            borderRadius={10}
                            //onSubmitEditing={schButtons}
                            value={bloodSugar}
                            onChangeText={bloodSugarChange}
                            style={[{fontSize:16, fontFamily:Font.NotoSansMedium}, bloodSugar.length > 0 && {backgroundColor:'#f1f1f1', color:'#000'}]}
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
        fontFamily:Font.NotoSansMedium, 
        color:'#696969'
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
)(BloodSugarAdd);