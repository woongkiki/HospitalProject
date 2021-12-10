import React, {useState, useEffect} from 'react';
import { TouchableOpacity, Dimensions, Text, ScrollView, StyleSheet, FlatList } from 'react-native';
import { Box, Image, HStack, VStack, CheckIcon,Modal, Input } from 'native-base';
import { DefText } from '../common/BOOTSTRAP';
import HeaderHospital from '../components/HeaderHospital';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import ToastMessage from '../components/ToastMessage';
import { connect } from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import Api from '../Api';
import AsyncStorage from '@react-native-community/async-storage';

import HTML from 'react-native-render-html';
import StyleHtml from '../common/StyleHtml';

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

const {width} = Dimensions.get('window');

const ReservationAdd = (props) => {

    const {navigation, userInfo, member_info} = props;

    
    //console.log(props.route.params);
    //수정인지 새로작성인지
    const [reserveStatus, setReserveStatus] = useState('');
    const [reserveParams, setReserveParams] = useState('');

    //console.log(userInfo);
    
    const [userInfoState, setUserInfoState] = useState('');

    useEffect(()=>{
        if(userInfo){
            setUserInfoState(userInfo);
        }

        if(props.route.params){
            //console.log(props.route.params.item, props.route.params.reserveStatus)

            setReserveStatus(props.route.params.reserveStatus);
            setReserveParams(props.route.params.item)

        }else{
           

            setReserveStatus('');
            setReserveParams('');
        }
     
    },[])

    //console.log(navigation);

    const [privacyModal, setPrivacyModal] = useState(false);

    const [privacyNumber, setPrivacyNumber] = useState('1');

    const modalButtons = (params) => {
        
        setPrivacyNumber(params);
        setPrivacyModal(true)
    }


    const [agreeInfo1, setAgreeInfo1] = useState(false);
    const [agreeInfo2, setAgreeInfo2] = useState(false);


    const [nameInput, setNameInput] = useState('');
    const nameChange = (names) => {
        setNameInput(names);
    }
    const [resNumber, setResNumber] = useState('');
    const resNumberChange = (names) => {
        setResNumber(names);
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

    const [isTimeickerVisible, setTimePickerVisibility] = useState(false);

    let todayTime = today.format("HH:mm:00");

    const [timeText, setTimeText] = useState(todayTime);

    const showTimePicker = () => {
        setTimePickerVisibility(true);
    };

    const hideTimePicker = () => {
        setTimePickerVisibility(false);
    };

    const handleConfirmTime = (date) => {
        //console.log("A date has been picked: ", date);
        hideTimePicker();
        setTimeText(date.format("HH:mm:00"))
    };


    const reservationType = ['진료의뢰', '건강상담', '정밀검사의뢰', '수액처방', '기타'];

    const [reserType, setReserType] = useState('');

    const rTypes = reservationType.map((item, index)=> {
        return(
            <TouchableOpacity onPress={()=>setReserType(item)} key={index} style={[{padding:10, paddingHorizontal:20, backgroundColor:'#f1f1f1', marginTop:10, borderRadius:15, marginRight:10, justifyContent:'center', alignItems:'center'}, reserType == item && {backgroundColor:'#666'} ]}>
                <DefText text={item} style={[{fontSize:14, fontWeight:'bold'}, reserType == item && {color:'#fff'} ]} />
            </TouchableOpacity>
        )
    });


    const [reservationContent, setReservationContent] = useState('');
    const contentChanges = (content) => {
        setReservationContent(content);
    }


    const [doctorName, setDoctorName] = useState('');


    useEffect(()=>{
      
    },[userInfoState])


    useEffect(()=>{
        
        //setNameInput(reserveStatus);
        console.log(reserveParams);

        if(reserveStatus == 'u'){

            setNameInput(reserveParams.name);
            setResNumber(reserveParams.birthday);
            setDateTimeText(reserveParams.rdate);
            setTimeText(reserveParams.rtime);
            setReserType(reserveParams.category);
            setReservationContent(reserveParams.memo)
            setDoctorName(reserveParams.doctor);
            setAgreeInfo1(true);
            setAgreeInfo2(true);
        }else{
            if(userInfoState){
                setNameInput(userInfoState.name);
                setResNumber(userInfoState.birthday.substring(2, 8));
            }
        }

        

    }, [reserveStatus, reserveParams, userInfoState]);


    //회원정보 조회
    const [memberInfoList, setMemberInfoList] = useState('');
    
    const member_info_handle = () => {
        AsyncStorage.getItem('flex_id').then(async (response) => {

            const formData = new FormData();
            formData.append('method', 'member_info');
            formData.append('id', response);
            formData.append('token', userInfo.appToken);
            const member_info_list = await member_info(formData);


            setMemberInfoList(member_info_list.result);
            //console.log('회원정보를 조회', member_info_list);
           // console.log(response)

        });
    };


    //김퇴근

    const reservationComple = async () => {

        await member_info_handle();

       // await console.log('321',memberInfoList['membership'][0]['hcode']);
        if(!agreeInfo1){
            ToastMessage('고유식별정보 처리에 동의하세요.');
            return false;
        }

        if(!agreeInfo2){
            ToastMessage('개인정보 수집이용에 동의하세요.');
            return false;
        }

        if(!nameInput){
            ToastMessage('예약하실 이름을 입력하세요.');
            return false;
        }

        if(!resNumber){
            ToastMessage('주민등록번호 앞자리를 입력하세요.');
            return false;
        }

        if(!dateTimeText){
            ToastMessage('예약을 희망하는 날짜를 입력하세요.');
            return false;
        }

        if(!reserType){
            ToastMessage('예약유형을 선택하세요.');
            return false;
        }


        await Api.send('hospital_reserve', {'id':userInfo.id,  'token':userInfo.appToken, 'hcode':userInfo.m_hcode, 'nameInput':nameInput, 'birthDay':resNumber, 'rdate':dateTimeText, 'rtime':timeText,'category':reserType,'category':reserType, 'memo':reservationContent}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                //console.log('복약 스케줄 정보: ', arrItems);
                
                //console.log(resultItem);
                ToastMessage(resultItem.message);

                navigation.replace('Reservation')
                //console.log(arrItems);
            }else{
                //console.log('결과 출력 실패!', resultItem);
                ToastMessage(resultItem.message);
            }
        });

       // ToastMessage('예약이 완료되었습니다.');
       // navigation.replace('Reservation');
    }

    //

    const reservationUpdates = async () => {
        
        console.log(reserveParams.idx)
        
        Api.send('hospital_reserveMod', {'idx':reserveParams.idx, 'id':reserveParams.id,  'token':userInfo.appToken, 'hcode':reserveParams.hcode, 'nameInput':nameInput, 'birthDay':resNumber, 'rdate':dateTimeText, 'rtime':timeText,'category':reserType, 'memo':reservationContent}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                //console.log('복약 스케줄 정보: ', arrItems);
                
                //console.log(resultItem);
                ToastMessage(resultItem.message);

                //navigation.replace('Reservation')

                navigation.goBack();
                
                //console.log(arrItems);
            }else{
                //console.log('결과 출력 실패!', resultItem);
                ToastMessage(resultItem.message);
            }
        });

    }


     //정책
     const [contentPrivacyData, setContentPrivacyData] = useState([]);

     const [privacy1, setPrivacy1] = useState('');
     const [privacy2, setPrivacy2] = useState('');

     const contentPrivacy = () => {
         Api.send('service_list', {}, (args)=>{
             let resultItem = args.resultItem;
             let arrItems = args.arrItems;
     
             if(resultItem.result === 'Y' && arrItems) {
                 //console.log('정책: ', arrItems[1]);
                 setContentPrivacyData(arrItems);

                 setPrivacy1(arrItems[3]);
                 setPrivacy2(arrItems[1]);
                
             }else{
                 console.log('결과 출력 실패!', resultItem);
                
             }
         });
     }
 
     useEffect(()=>{
         contentPrivacy();
     }, [])


    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderHospital navigation={navigation} headerTitle={ reserveStatus == 'u' ? '예약요청내역' : '예약상담요청'} />
            <ScrollView>
                <Box p={5}>
                    <Box backgroundColor='#f1f1f1' p={5} py='15px' borderRadius={10}>
                        <DefText text='진료받으실 분의 개인정보를 입력해주세요.' style={{fontSize:15,color:'#000',fontWeight:'bold'}} />
                    </Box>
                    <Box backgroundColor='#f1f1f1' p={5} py='15px' borderRadius={10} mt={2.5}>
                        <HStack>
                            <HStack alignItems='center'>
                                <TouchableOpacity onPress={()=>setAgreeInfo1(!agreeInfo1)}>
                                    <Box width='20px' height='20px' borderRadius='20px' borderWidth={1} borderColor={ agreeInfo1 ? '#f00' : '#666' } alignItems='center' justifyContent='center' mr={2.5}>
                                        <CheckIcon width='10px' color={agreeInfo1 ? '#f00' : '#666'} />
                                    </Box>
                                </TouchableOpacity>
                                <HStack alignItems='center'>
                                    <DefText text='고유식별정보 처리에 대한 안내' />
                                    <TouchableOpacity onPress={()=>modalButtons('1')}>
                                        <Box borderBottomWidth={1} borderBottomColor='#888' ml={2.5}>
                                            <DefText text='자세히' style={{fontSize:13,color:'#888'}} />
                                        </Box>
                                    </TouchableOpacity>
                                </HStack>
                            </HStack>
                        </HStack>
                    </Box>

                    <Box backgroundColor='#f1f1f1' p={5} py='15px' borderRadius={10} mt={2.5}>
                        <HStack>
                            <HStack alignItems='center'>
                                <TouchableOpacity onPress={()=>setAgreeInfo2(!agreeInfo2)}>
                                    <Box width='20px' height='20px' borderRadius='20px' borderWidth={1} borderColor={ agreeInfo2 ? '#f00' : '#666' } alignItems='center' justifyContent='center' mr={2.5}>
                                        <CheckIcon width='10px' color={agreeInfo2 ? '#f00' : '#666'} />
                                    </Box>
                                </TouchableOpacity>
                                <HStack alignItems='center'>
                                    <DefText text='개인정보 수집이용에 대한 안내' />
                                    <TouchableOpacity onPress={()=>modalButtons('2')}>
                                        <Box borderBottomWidth={1} borderBottomColor='#888' ml={2.5}>
                                            <DefText text='자세히' style={{fontSize:13,color:'#888'}} />
                                        </Box>
                                    </TouchableOpacity>
                                </HStack>
                            </HStack>
                        </HStack>
                    </Box>

                    {
                        reserveStatus == 'u' &&
                        <Box mt={5}>
                            <DefText text='담당의사' style={[styles.reportLabel]} />
                            <Input 
                                placeholder='김건강'
                                _focus='transparent'
                                value={doctorName}
                               isDisabled={true}
                                height='45px'
                                style={{marginTop:10, fontSize:14}}
                            />
                        </Box>
                    }
                  

                    <Box mt={5}>
                        <Box>
                            <DefText text='이름' style={[styles.reportLabel]} />
                            <Input 
                                placeholder='김건강'
                                _focus='transparent'
                                value={nameInput}
                                onChangeText={nameChange}
                                height='45px'
                                style={{marginTop:10, fontSize:14}}
                            />
                        </Box>
                        <Box mt={5}>
                            <DefText text='주민등록번호' style={[styles.reportLabel]} />
                            <Input 
                                placeholder='770101'
                                _focus='transparent'
                                value={resNumber}
                                onChangeText={resNumberChange}
                                height='45px'
                                style={{marginTop:10, fontSize:14}}
                                keyboardType='phone-pad'
                                maxLength={8}
                            />
                        </Box>
                        <Box mt={5}>
                            <DefText text='예약희망날짜' style={[styles.reportLabel, {marginBottom:10}]} />
                            <HStack justifyContent='space-between' px={5} alignItems='center' width='100%'  height='45px'  backgroundColor='#fff' borderWidth={1} borderColor='#dfdfdf' borderRadius={10} >
                                <DefText text={dateTimeText} style={{fontSize:14}} />
                                <TouchableOpacity onPress={showDatePicker}>
                                    <Image source={require('../images/datepickerIcon.png')} alt='달력' style={{width:20, resizeMode:'contain', marginLeft:10}}  />
                                </TouchableOpacity>
                            </HStack>
                        </Box>
                        <Box mt={5}>
                            <DefText text='예약희망시간' style={[styles.reportLabel, {marginBottom:10}]} />
                            <HStack justifyContent='space-between' px={5} alignItems='center' width='100%'  height='45px'  backgroundColor='#fff' borderWidth={1} borderColor='#dfdfdf' borderRadius={10} >
                                <DefText text={timeText} style={{fontSize:14}} />
                                <TouchableOpacity onPress={showTimePicker}>
                                    <Image source={require('../images/datepickerIcon.png')} alt='시계' style={{width:20, resizeMode:'contain', marginLeft:10}}  />
                                </TouchableOpacity>
                            </HStack>
                        </Box>
                        <Box mt={5}>
                            <DefText text='예약유형'/>
                            <HStack flexWrap='wrap'>
                                {rTypes}
                            </HStack>
                        </Box>
                        <Box mt={5}>
                            <DefText text='남기고 싶은 말' style={[styles.reportLabel]} />
                            <Box p={2.5} backgroundColor='#fff' borderWidth={1} borderColor='#dfdfdf' borderRadius={10} mt='10px'>
                                <Input
                                    placeholder='예약시 남기고 싶은 내용을 입력하세요'
                                    height='100px'
                                    width='100%'
                                    backgroundColor='transparent'
                                    borderWidth={0}
                                    //onSubmitEditing={schButtons}
                                    value={reservationContent}
                                    onChangeText={contentChanges}
                                    style={{fontSize:14}}
                                    multiline={true}
                                    textAlignVertical='top'
                                    _focus='transparent'
                                />
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </ScrollView>
            {
                reserveStatus == 'u' ?
                <Box p={2.5} px={5}>
                    <TouchableOpacity onPress={reservationUpdates} style={[styles.buttonDef]}>
                    <DefText text='예약내역수정' style={styles.buttonDefText} />
                    </TouchableOpacity>
                </Box>
                :
                <Box p={2.5} px={5}>
                    <TouchableOpacity onPress={reservationComple} style={[styles.buttonDef]}>
                    <DefText text='예약상담요청' style={styles.buttonDefText} />
                    </TouchableOpacity>
                </Box>
            }
            
            <Modal isOpen={privacyModal} onClose={()=>setPrivacyModal(false)}>
                <Modal.Content maxWidth={width-40}>
                    <Modal.Body>
                        {
                            privacyNumber == '1' ?
                            <Box>
                                <DefText text='고유식별정보 처리에 대한 안내' style={{fontSize:18, color:'#000'}} />
                                <Box mt={5}>
                                    <HTML 
                                        ignoredStyles={[ 'width', 'height', 'margin', 'padding', 'fontFamily', 'lineHeight', 'fontFamily', 'br']}
                                        ignoredTags={['head', 'script', 'src']}
                                        imagesMaxWidth={Dimensions.get('window').width - 40}
                                        source={{html: privacy1.content}} 
                                        tagsStyles={StyleHtml}
                                        containerStyle={{ flex: 1, }}
                                        contentWidth={Dimensions.get('window').width}  
                                    />
                                </Box>
                            </Box>
                            :
                            <Box>
                                <DefText text='개인정보 수집이용에 대한 안내' style={{fontSize:18, color:'#000'}} />
                                <Box mt={5}>
                                    <HTML 
                                        ignoredStyles={[ 'width', 'height', 'margin', 'padding', 'fontFamily', 'lineHeight', 'fontFamily', 'br']}
                                        ignoredTags={['head', 'script', 'src']}
                                        imagesMaxWidth={Dimensions.get('window').width - 40}
                                        source={{html: privacy2.content}} 
                                        tagsStyles={StyleHtml}
                                        containerStyle={{ flex: 1, }}
                                        contentWidth={Dimensions.get('window').width}  
                                    />
                                </Box>
                            </Box>
                        }
                        <HStack justifyContent='center' mt={2.5} >
                           
                           
                            <TouchableOpacity style={{width:(width-160), height:45, borderWidth:1, borderColor:'#999', borderRadius:3, alignItems:'center', justifyContent:'center', marginTop:20}} onPress={()=>setPrivacyModal(false)} >
                                <DefText text='확인' style={[styles.counselButtonText]} />
                            </TouchableOpacity>
                    
                        </HStack>
                        
                    </Modal.Body>
                </Modal.Content>
            </Modal>

            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
            />

            <DateTimePickerModal
                isVisible={isTimeickerVisible}
                mode="time"
                onConfirm={handleConfirmTime}
                onCancel={hideTimePicker}
            />
        </Box>
    );
};

const styles = StyleSheet.create({
    counselButton: {
        paddingHorizontal:10,
        borderRadius:5,
        borderWidth:1,
        borderColor:'#666',
        marginTop:10,
        width:'auto',
        height:45,
        justifyContent:'center',
        backgroundColor:'#fff',
        width:'auto'
    },
    counselButtonText: {
        fontSize:14,
        color:'#333'
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
    reportLabel : {
        fontSize:15,
        color:'#666',
        fontWeight:'bold'
    },
    reportDataText: {
        fontSize:15,
        color:'#333'
    },
})

//export default ReservationAdd;
export default connect(
    ({ User }) => ({
        userInfo: User.userInfo, //회원정보
    }),
    (dispatch) => ({
        member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
        member_info: (user) => dispatch(UserAction.member_info(user)), //회원 정보 조회
        
    })
)(ReservationAdd);