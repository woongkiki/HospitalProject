import React, {useState, useEffect} from 'react';
import { Box, VStack, HStack, Image, Input } from 'native-base';
import { TouchableOpacity, Dimensions, ScrollView, StyleSheet } from 'react-native';
import {DefInput, DefText} from '../common/BOOTSTRAP';
import HeaderComponents from '../components/HeaderComponents';
import ToastMessage from '../components/ToastMessage';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { StackActions } from '@react-navigation/native';
import { connect } from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import Api from '../Api';
import AsyncStorage from '@react-native-community/async-storage';

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

const InbodyAdd = (props) => {

    const {navigation, userInfo} = props;

    
    const [tabOn, setTabOn] = useState('1');
    const tabChangeBtn = (text) => {
        setTabOn(text);
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

    //직접입력
    //체중
    const [weight, setWeight] = useState('');
    const weightChange = (weight) => {
        setWeight(weight);
    }

    //키
    const [feet, setFeet] = useState('');
    const feetChange = (feet) => {
        setFeet(feet);
    }

    //목둘레
    const [neck, setNeck] = useState('');
    const neckChange = (neck) => {
        setNeck(neck);
    }

    //허리둘레
    const [waist, setWaist] = useState('');
    const waistChange = (waist) => {
        setWaist(waist);
    }

    //엉덩이둘레
    const [heep, setHeep] = useState('');
    const heepChange = (heep) => {
        setHeep(heep);
    }

    //허벅지둘레
    const [thigh, setThigh] = useState('');
    const thighChange = (thigh) => {
        setThigh(thigh);
    }


    //직접입력 저장
    const InputSubmit = () => {

        if(!weight){
            ToastMessage('체중 값을 입력하세요.');
            return false;
        }

        if(!feet){
            ToastMessage('키 값을 입력하세요.');
            return false;
        }

        if(!neck){
            ToastMessage('목둘레 값을 입력하세요.')
            return false;
        }

        if(!waist){
            ToastMessage('허리둘레 값을 입력하세요.');
            return false;
        }

        if(!heep){
            ToastMessage('엉덩이 둘레 값을 입력하세요.');
            return false;
        }

        if(!thigh){
            ToastMessage('허벅지 둘레 값을 입력하세요.');
            return false;
        }


        Api.send('bodyProfile_insert', {'id':userInfo.id,  'token':userInfo.appToken, 'bdate':dateTimeText, 'inbody':'N', 'weight':weight, 'height':feet, 'neck':neck, 'waist':waist, 'hip':heep, 'leg':thigh}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {

                console.log('바디 프로필 직접입력하기::::::: ', resultItem);

                //setAdbfat(resultItem.message);
                navigation.navigate('Inbody');
               ToastMessage(resultItem.message);
               
            }else{
                console.log(resultItem.message);
                ToastMessage(resultItem.message);
            }
        });

       
    }



    ///////인바디용

    //체중
    const [weightInBody, setWeightInBody] = useState('');
    const weightInBodyChange = (weight) => {
        setWeightInBody(weight);
    }

    //키
    const [feetInBody, setFeetInBody] = useState('');
    const feetInBodyChange = (feet) => {
        setFeetInBody(feet);
    }

    //체지방률
    const [fatPercents, setFatPercents] = useState('');
    const fatPercentChange = (fat) => {
        setFatPercents(fat);
    }

    //골격근량
    const [skeleton, setSkeleton] = useState('');
    const skeletonChange = (skeleton) => {
        setSkeleton(skeleton);
    }

    //복부지방수치
    const [fatLevel, setFatLevel] = useState('');
    const fatLevelChange = (levels) => {
        setFatLevel(levels);
    }


    //인바디용 저장..
    const InputSubmitInBody = () => {
        if(!weightInBody){
            ToastMessage('체중 값을 입력하세요.');
            return false;
        }

        if(!feetInBody){
            ToastMessage('키 값을 입력하세요.');
            return false;
        }

        if(!fatPercents){
            ToastMessage('체지방율을 입력하세요.');
            return false;
        }

        if(!skeleton){
            ToastMessage('골격근량을 입력하세요.');
            return false;
        }

        if(!fatLevel){
            ToastMessage('복부지방수치를 입력하세요.');
            return false;
        }

        Api.send('bodyProfile_insert', {'id':userInfo.id,  'token':userInfo.appToken, 'bdate':dateTimeText, 'inbody':'Y', 'weight':weightInBody, 'height':feetInBody, 'fat':fatPercents, 'muscle':skeleton, 'abdFat':fatLevel}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {

                console.log('바디 프로필 인바디 수치로 입력하기::::::: ', resultItem);

                //setAdbfat(resultItem.message);
                navigation.navigate('Inbody');
               ToastMessage(resultItem.message);
               
            }else{
                console.log(resultItem.message);
                ToastMessage(resultItem.message);
            }
        });
    }

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderComponents headerTitle='체성분 입력' navigation={navigation} />
            <ScrollView>
                <Box p={5}>
                    <HStack height='140px' justifyContent='space-between' px={4} backgroundColor='#F1F1F1' borderRadius='30px' alignItems='center'>
                        <Box>
                            <DefText text='체성분결과 또는 체중을 기록하세요' style={{fontSize:16, fontWeight:'bold'}} />
                            <DefText text='체성분 측정 가이드를 참조해주세요.' style={{fontSize:14, marginTop:10}} />
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
                                onPress={()=>{navigation.navigate('Tab_Navigation', {'screenNumber':2})}}
                            >
                                <DefText text='가이드' style={{color:'#fff', fontSize:15}} />
                            </TouchableOpacity>
                        </Box>
                        <Image source={require('../images/checkIcons.png')} alt='체크이미지' />
                    </HStack>
                    <HStack justifyContent='space-between' mt={5}>
                        <TouchableOpacity onPress={()=>tabChangeBtn('1')} style={[styles.tabButtons, tabOn == '1' && {backgroundColor:'#666'}]}>
                            <DefText text='직접입력' style={[styles.tabButtonsText, tabOn == '1' && {color:'#fff'}]} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>tabChangeBtn('2')} style={[styles.tabButtons, tabOn == '2' && {backgroundColor:'#666'}]}>
                            <DefText text='인바디기기 입력' style={[styles.tabButtonsText ,tabOn == '2' && {color:'#fff'}]} />
                        </TouchableOpacity>
                    </HStack>
                    <HStack mt={5} p={2.5} px={5} backgroundColor='#f1f1f1' borderRadius={10} justifyContent='space-between' alignItems='center'>
                        <DefText text='측정일자' />
                        <HStack alignItems='center' >
                            <DefText text={dateTimeText} />
                            <TouchableOpacity onPress={showDatePicker}>
                                <Image source={require('../images/datepickerIcon.png')} alt='달력' style={{width:20, resizeMode:'contain', marginLeft:10}}  />
                            </TouchableOpacity>
                        </HStack>
                    </HStack>
                    {
                        tabOn == '1' && 
                        <Box>
                            <HStack mt={5} justifyContent='space-between'>
                                <Box width={(width-40)*0.47} >
                                    <DefText text='체중(kg)' style={[styles.reportLabel, {marginBottom:10}]} />
                                    
                                    <Input
                                        placeholder='66.6'
                                        height='45px'
                                        width='100%'
                                        backgroundColor='transparent'
                                        borderWidth={1}
                                        //onSubmitEditing={schButtons}
                                        value={weight}
                                        onChangeText={weightChange}
                                        style={{fontSize:15}}
                                        keyboardType='phone-pad'
                                        _focus='transparent'
                                    />
                    
                                </Box>
                                <Box width={(width-40)*0.47} >
                                    <DefText text='신장(cm)' style={[styles.reportLabel, {marginBottom:10}]} />
                                    
                                    <Input
                                        placeholder='174.0'
                                        height='45px'
                                        width='100%'
                                        backgroundColor='transparent'
                                        borderWidth={1}
                                        //onSubmitEditing={schButtons}
                                        value={feet}
                                        onChangeText={feetChange}
                                        style={{fontSize:15}}
                                        keyboardType='phone-pad'
                                        _focus='transparent'
                                    />
                    
                                </Box>
                            </HStack>
                            <HStack mt={5} justifyContent='space-between'>
                                <Box width={(width-40)*0.47} >
                                    <DefText text='목둘레(cm)' style={[styles.reportLabel, {marginBottom:10}]} />
                                    
                                    <Input
                                        placeholder='37.0'
                                        height='45px'
                                        width='100%'
                                        backgroundColor='transparent'
                                        borderWidth={1}
                                        //onSubmitEditing={schButtons}
                                        value={neck}
                                        onChangeText={neckChange}
                                        style={{fontSize:15}}
                                        keyboardType='phone-pad'
                                        _focus='transparent'
                                    />
                    
                                </Box>
                                <Box width={(width-40)*0.47} >
                                    <DefText text='허리둘레(cm)' style={[styles.reportLabel, {marginBottom:10}]} />
                                    
                                    <Input
                                        placeholder='87.0'
                                        height='45px'
                                        width='100%'
                                        backgroundColor='transparent'
                                        borderWidth={1}
                                        //onSubmitEditing={schButtons}
                                        value={waist}
                                        onChangeText={waistChange}
                                        style={{fontSize:15}}
                                        keyboardType='phone-pad'
                                        _focus='transparent'
                                    />
                    
                                </Box>
                            </HStack>
                            <HStack mt={5} justifyContent='space-between'>
                                <Box width={(width-40)*0.47} >
                                    <DefText text='엉덩이 둘레(cm)' style={[styles.reportLabel, {marginBottom:10}]} />
                                    
                                    <Input
                                        placeholder='80.0'
                                        height='45px'
                                        width='100%'
                                        backgroundColor='transparent'
                                        borderWidth={1}
                                        //onSubmitEditing={schButtons}
                                        value={heep}
                                        onChangeText={heepChange}
                                        style={{fontSize:15}}
                                        keyboardType='phone-pad'
                                        _focus='transparent'
                                    />
                    
                                </Box>
                                <Box width={(width-40)*0.47} >
                                    <DefText text='허벅지 둘레(cm)' style={[styles.reportLabel, {marginBottom:10}]} />
                                    
                                    <Input
                                        placeholder='57.0'
                                        height='45px'
                                        width='100%'
                                        backgroundColor='transparent'
                                        borderWidth={1}
                                        //onSubmitEditing={schButtons}
                                        value={thigh}
                                        onChangeText={thighChange}
                                        style={{fontSize:15}}
                                        keyboardType='phone-pad'
                                        _focus='transparent'
                                    />
                    
                                </Box>
                            </HStack>
                            <TouchableOpacity onPress={InputSubmit} style={[styles.buttonDef, {marginTop:20}]}>
                                <DefText text='저장' style={styles.buttonDefText} />
                            </TouchableOpacity>
                        </Box>
                    }

                    {
                        tabOn == '2' && 
                        <Box>
                            <HStack mt={5} justifyContent='space-between'>
                                <Box width={(width-40)*0.47} >
                                    <DefText text='체중(kg)' style={[styles.reportLabel, {marginBottom:10}]} />
                                    
                                    <Input
                                        placeholder='66.6'
                                        height='45px'
                                        width='100%'
                                        backgroundColor='transparent'
                                        borderWidth={1}
                                        //onSubmitEditing={schButtons}
                                        value={weightInBody}
                                        onChangeText={weightInBodyChange}
                                        style={{fontSize:15}}
                                        keyboardType='phone-pad'
                                        _focus='transparent'
                                    />
                    
                                </Box>
                                <Box width={(width-40)*0.47} >
                                    <DefText text='신장(cm)' style={[styles.reportLabel, {marginBottom:10}]} />
                                    
                                    <Input
                                        placeholder='174.0'
                                        height='45px'
                                        width='100%'
                                        backgroundColor='transparent'
                                        borderWidth={1}
                                        //onSubmitEditing={schButtons}
                                        value={feetInBody}
                                        onChangeText={feetInBodyChange}
                                        style={{fontSize:15}}
                                        keyboardType='phone-pad'
                                        _focus='transparent'
                                    />
                    
                                </Box>
                            </HStack>
                            <HStack mt={5} justifyContent='space-between'>
                                <Box width={(width-40)*0.47} >
                                    <DefText text='체지방률(%)' style={[styles.reportLabel, {marginBottom:10}]} />
                                    
                                    <Input
                                        placeholder='37.0'
                                        height='45px'
                                        width='100%'
                                        backgroundColor='transparent'
                                        borderWidth={1}
                                        //onSubmitEditing={schButtons}
                                        value={fatPercents}
                                        onChangeText={fatPercentChange}
                                        style={{fontSize:15}}
                                        keyboardType='phone-pad'
                                        _focus='transparent'
                                    />
                    
                                </Box>
                                <Box width={(width-40)*0.47} >
                                    <DefText text='골격근량(kg)' style={[styles.reportLabel, {marginBottom:10}]} />
                                    
                                    <Input
                                        placeholder='87.0'
                                        height='45px'
                                        width='100%'
                                        backgroundColor='transparent'
                                        borderWidth={1}
                                        //onSubmitEditing={schButtons}
                                        value={skeleton}
                                        onChangeText={skeletonChange}
                                        style={{fontSize:15}}
                                        keyboardType='phone-pad'
                                        _focus='transparent'
                                    />
                    
                                </Box>
                            </HStack>
                            <HStack mt={5} justifyContent='space-between'>
                                <Box width={(width-40)*0.47} >
                                    <DefText text='복부지방수치(%)' style={[styles.reportLabel, {marginBottom:10}]} />
                                    
                                    <Input
                                        placeholder='15.0'
                                        height='45px'
                                        width='100%'
                                        backgroundColor='transparent'
                                        borderWidth={1}
                                        //onSubmitEditing={schButtons}
                                        value={fatLevel}
                                        onChangeText={fatLevelChange}
                                        style={{fontSize:15}}
                                        keyboardType='phone-pad'
                                        _focus='transparent'
                                    />
                    
                                </Box>
                                
                            </HStack>
                            <TouchableOpacity onPress={InputSubmitInBody} style={[styles.buttonDef, {marginTop:20}]}>
                                <DefText text='저장' style={styles.buttonDefText} />
                            </TouchableOpacity>
                        </Box>
                    }
                    
                </Box>
            </ScrollView>
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
    tabButtons: {
        height:34,
        width:(width-40) * 0.48,
        backgroundColor:'#f1f1f1',
        borderRadius:5,
        justifyContent:'center',
        alignItems:'center'
    },
    tabButtonsText: {
        fontSize:13,
        color:'#333',
    },
    reportLabel : {
        fontSize:15,
        color:'#666',
        fontWeight:'bold'
    },
    datetimeText: {
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
)(InbodyAdd);