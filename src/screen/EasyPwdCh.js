import React, { useEffect, useState } from 'react';
import {Box, VStack, HStack, Image, Modal} from 'native-base';
import { ScrollView, Dimensions, Alert, TouchableOpacity} from 'react-native';
import {DefText, DefInput, Button} from '../common/BOOTSTRAP';
import ToastMessage from '../components/ToastMessage';
import HeaderComponents from '../components/HeaderComponents';
import {email_check, phoneFormat} from '../common/dataFunction';
import Api from '../Api';
import messaging from '@react-native-firebase/messaging';
import { connect } from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import Font from '../common/Font';

//시간초 카운터용
let t1;
let tcounter;
let temp;

const EasyPwdCh = (props) => {

    const { navigation, userInfo } = props;

    //console.log(userInfo);

    const {width} = Dimensions.get('window');
    const phoneInputWidth = (width - 40) * 0.55;
    const phoneCertiButtonWidth = (width - 40) * 0.4;

    //e-mail 아이디
    const [emailInput, setEmailInput] = useState('');
    const emailChange = (text) => {
        setEmailInput(text);
    }

    //이름
    const [nameInput, setNameInput] = useState('');
    const nameChange = (text) => {
        setNameInput(text);
    }

    //휴대폰번호 입력
    const [phoneNumber, setPhoneNumber] = useState('');
    const phoneNumberChange = (number) => {
        setPhoneNumber(phoneFormat(number));
    }

    //인증번호
    const [certiNumber, setCertiNumber] = useState('');
    const certiNumberChange = (certinumbers) => {
        setCertiNumber(certinumbers);
    }

    //인증번호 발송버튼 활성화
    const [certiNumberButton, setCertiNumberButton] = useState(true);
    
    //인증받기 발송버튼 활성화
    const [certiComplete, setCertiComplete] = useState(true);
    const [certiStatus, setCertiStatus] = useState(false);

    //인증완료 버튼
    const [certiButtonText, setCertiButtonText] = useState('인증받기');

    //계정정보확인 완료 모달띄우기
    const [certiFormComplete, setCertiFormComplete] = useState(false);

    //버튼 활성화 변경
    useEffect(()=>{
        if(phoneNumber.length>0){
            setCertiNumberButton(false);
        }

        if(certiNumber.length>0){
            setCertiComplete(false);
        }

    },[phoneNumber, certiNumber])



    //버튼 동작



    //시간초 스테이트
    const [timeStamp, setTimeStamp] = useState('');
    //시간초 반복여부
    const [phoneIntervel, setPhoneInterval] = useState(false);
    //랜덤숫자
    const [ransoo, setRansoo] = useState('');

    //시간초 시작
    const timer_start = () => {
        tcounter = 60;
        t1 = setInterval(Timer, 1000);
        //console.log(t1);
    };

    //타이머
    const Timer = () => {
        //setPhoneInterval(false);
        tcounter = tcounter - 1;
        // temp = Math.floor(tcounter / 60);
        // temp = temp + (tcounter % 60);

        temp = Math.floor(tcounter/60);
        if(Math.floor(tcounter/60) < 10)  temp = '0'+temp;								
        temp = temp + ":";   								
        if((tcounter % 60) < 10)temp = temp + '0';
        temp = temp + (tcounter % 60);

        //console.log(temp);
        setTimeStamp(temp);
        //setIntervals(true); //실행중

        
        if (tcounter <= 0) {
            //timer_stop();
            setPhoneInterval(false);
        }
    };


    //test4321@test.com
    //test1234
  

    //번호로 문자보내기
    const smsSendButton = async () => {

        const token = await messaging().getToken();

     


        Api.send('member_sms', {'id':userInfo.email, 'nameInput':userInfo.name, 'phoneNumber':phoneNumber, 'token':token}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;

            if(resultItem.result === 'Y' && arrItems) {

               console.log('출력확인..',arrItems);
               setRansoo(arrItems);

               setPhoneInterval(true);

            }else{
                console.log('결과 출력 실패!', resultItem);
                ToastMessage(resultItem.message);
            }
        })

       
       // setCertiNumber('111111')
    }

    //인증번호 일치 확인
    const _smsCertiButton = async () => {

        const token = await messaging().getToken();


        if(!certiNumber){
            ToastMessage('인증번호를 입력하세요.');
            return false;
        }

        if(!phoneIntervel){
            ToastMessage('인증시간이 만료되었습니다. 다시 인증번호를 발송해주세요.');
            return false;
        }

        await Api.send('member_smsChk', {'id':userInfo.email, 'nameInput':userInfo.name, 'phoneNumber':phoneNumber, 'token':token, 'sms':certiNumber}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;

            if(resultItem.result === 'Y' && arrItems) {

               ToastMessage('인증이 완료되었습니다.');

            }else{
                console.log('결과 출력 실패!', resultItem);
                ToastMessage(resultItem.message);
            }
        })


        
        await setCertiComplete(true);
        await setCertiStatus(true);
        await setPhoneInterval(false);
        await setCertiButtonText('인증완료');
        
    }


    useEffect(()=>{
        if(!phoneIntervel) {timer_stop()}
        else                {timer_start()}
    },[phoneIntervel]);


    const timer_stop = () => {
        // setPhoneInterval(true);
        //console.log(phoneIntervel);
        //console.log(t1);
        clearInterval(t1);
        setTimeStamp('');
       
    };


    //계정정보 확인하기
    const _PasswordChange = () => {

      

        if(!phoneNumber){
            ToastMessage('휴대폰번호를 입력하세요.');
            return false;
        }

        if(!certiStatus){
            ToastMessage('휴대폰번호로 인증을 완료하세요.');
            return false;
        }

        setCertiFormComplete(true);
        //Alert.alert('비밀번호 변경페이지로 이동합니다.');
    }


    //비밀번호 변경페이지로 이동
    const _PasswordChangeSubmit = async () => {
        await setCertiFormComplete(false);
        await navigation.navigate('PasswordChange3', {'id':userInfo.email});
    }

    return (
        <Box flex={1} backgroundColor='#fff'>
             <HeaderComponents navigation={navigation} headerTitle='간편비밀번호 변경' />
            <ScrollView>
               
                <Box p={5}>
                    <VStack mb='35px'>
                        <DefText text='간편비밀번호 변경을 위해' style={{textAlign:'center'}} />
                        <DefText text='문자인증으로 본인확인해주세요.' style={{textAlign:'center'}} />
                    </VStack>
                    <VStack>
                        {/* <Box>
                            <HStack>
                                <DefText text='이메일' style={{fontSize:14}} />
                                <DefText text='*' style={{fontSize:14, color:'#f00', marginLeft:5}} />
                            </HStack>
                            <DefInput 
                                placeholderText='이메일을 입력해주세요.'
                                inputValue = {emailInput}
                                onChangeText = {emailChange}
                                multiline = {false}
                                inputStyle={{marginTop:15}}
                            />
                        </Box>
                        <Box mt={5}>
                            <HStack>
                                <DefText text='이름' style={{fontSize:14}} />
                                <DefText text='*' style={{fontSize:14, color:'#f00', marginLeft:5}} />
                            </HStack>
                            <DefInput 
                                placeholderText='이름을 입력해주세요.'
                                inputValue = {nameInput}
                                onChangeText = {nameChange}
                                multiline = {false}
                                inputStyle={{marginTop:15}}
                            />
                        </Box> */}
                        <Box>
                            <HStack>
                                <DefText text='휴대폰번호 인증' style={{fontFamily:Font.NotoSansMedium, color:'#696969'}} />
                                <DefText text='*' style={{fontSize:18, color:'#FFC400', marginLeft:5}} />
                            </HStack>
                            <HStack alignItems='flex-end' justifyContent='space-between'>
                                <DefInput 
                                    placeholderText='휴대폰번호'
                                    inputValue = {phoneNumber}
                                    onChangeText = {phoneNumberChange}
                                    multiline = {false}
                                    inputStyle={{marginTop:15, width:phoneInputWidth}}
                                    keyboardType='phone-pad'
                                    maxLength={13}
                                />
                                <Button 
                                    disabled={certiNumberButton} 
                                    text='인증번호 발송' 
                                    buttonStyle={[
                                        {
                                            borderRadius:8, 
                                            width:phoneCertiButtonWidth, 
                                            borderWidth:1, 
                                            borderColor:'#707070', 
                                            height:48
                                        },  
                                        certiNumberButton ? 
                                        { backgroundColor:'#f1f1f1', borderWidth:0 } : { backgroundColor : '#fff', borderWidth:1 }
                                    ]} 
                                    textStyle={[
                                        {
                                            fontSize:14
                                        },
                                        certiNumberButton ? 
                                        {color:'#999'} : {color:'#707070'}
                                    ]}
                                    onPress={smsSendButton}
                                />
                            </HStack>
                            <Box style={{marginTop:15}}>
                                <DefInput 
                                    placeholderText='인증번호를 입력하세요.'
                                    inputValue = {certiNumber}
                                    onChangeText = {certiNumberChange}
                                    maxLength={6}
                                    multiline = {false}
                                    keyboardType='phone-pad'
                                />
                                <Box position='absolute' top={0} right={5} height={46} justifyContent='center'>
                                    <DefText text={timeStamp} style={{color:'#999'}} />
                                </Box>
                                <Button 
                                    disabled={certiComplete}
                                    text={certiButtonText} 
                                    buttonStyle={[
                                        {
                                            borderRadius:8,
                                            borderWidth:1, 
                                            borderColor:'#707070', 
                                            height:48, 
                                            marginTop:15
                                        },
                                        certiComplete ? 
                                        { backgroundColor:'#f1f1f1', borderWidth:0 } : { backgroundColor : '#fff', borderWidth:1 }
                                    ]} 
                                    textStyle={[
                                        {
                                            fontSize:14, 
                                        },
                                        certiComplete ? 
                                        {color:'#999'} : {color:'#707070'}
                                    ]}
                                    onPress={_smsCertiButton}
                                />
                            </Box>
                        </Box>
                        
                    </VStack>
                </Box>
            </ScrollView>
            <Box p={2.5}>
                <Button onPress={_PasswordChange} text='다음' buttonStyle={{borderRadius:8}} textStyle={{fontSize:14}}  />
            </Box>
            <Modal isOpen={certiFormComplete} onClose={() => setCertiFormComplete(false)} >
                <Modal.Content maxWidth={width-100}>
                    <Modal.Body>
                        <Box>
                            <DefText text='본인확인 완료되었습니다.' style={{color:'#333'}} />
                            <DefText text='간편비밀번호 변경페이지로 이동합니다.' style={{marginTop:10, color:'#333'}} />
                            <Box alignItems='center'>
                                <Button onPress={_PasswordChangeSubmit} text='확인' buttonStyle={{borderRadius:8, height:40, marginTop:20, width:width*0.3}} textStyle={{fontSize:14}}  />
                            </Box>
                        </Box>
                    </Modal.Body>
                </Modal.Content>
            </Modal>
        </Box>
    );
};


export default connect(
({ User }) => ({
    userInfo: User.userInfo, //회원정보
}),
(dispatch) => ({
    member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
    member_info: (user) => dispatch(UserAction.member_info(user)), //회원 정보 조회
    
})
)(EasyPwdCh);