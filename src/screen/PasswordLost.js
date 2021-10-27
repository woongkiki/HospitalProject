import React, { useEffect, useState } from 'react';
import {Box, VStack, HStack, Image, Modal} from 'native-base';
import { ScrollView, Dimensions, Alert, TouchableOpacity} from 'react-native';
import {DefText, DefInput, Button} from '../common/BOOTSTRAP';
import ToastMessage from '../components/ToastMessage';
import HeaderRegister from '../components/HeaderRegister';
import {email_check, phoneFormat} from '../common/dataFunction';

const PasswordLost = (props) => {

    const { navigation } = props;

    const {width} = Dimensions.get('window');
    const phoneInputWidth = width * 0.55 - 48;
    const phoneCertiButtonWidth = width * 0.4 - 48;

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

    const smsSendButton = () => {
        setCertiNumber('111111')
    }

    const _smsCertiButton = () => {
        if(!certiNumber){
            ToastMessage('인증번호를 입력하세요.');
            return false;
        }

        ToastMessage('휴대폰인증이 완료되었습니다.');
        setCertiComplete(true);
        setCertiStatus(true);
        setCertiButtonText('인증완료');
        
    }

    const _PasswordChange = () => {

        if(!emailInput){
            ToastMessage('이메일을 입력하세요.');
            return false;
        }

        if(!email_check(emailInput)){ // 이메일 유효성 검사
            ToastMessage('이메일 형식으로 입력하세요.');
            return false;
        }

        if(!nameInput){
            ToastMessage('이름을 입력하세요.');
            return false;
        }

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
        await navigation.navigate('PasswordChange');
    }

    return (
        <Box flex={1} backgroundColor='#fff'>
            <ScrollView>
                <HeaderRegister navigation={navigation} headerText='비밀번호찾기' />
                <Box py={5}>
                    <VStack mb='35px'>
                        <DefText text='계정정보를 입력하신 후' style={{textAlign:'center'}} />
                        <DefText text='문자인증으로 본인확인해주세요.' style={{textAlign:'center'}} />
                    </VStack>
                    <VStack px={12}>
                        <Box>
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
                        </Box>
                        <Box mt={5}>
                            <HStack>
                                <DefText text='휴대폰번호 인증' style={{fontSize:14}} />
                                <DefText text='*' style={{fontSize:14, color:'#f00', marginLeft:5}} />
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
                                />
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
                        <Box mt='60px'>
                            <Button onPress={_PasswordChange} text='계정정보 확인' buttonStyle={{borderRadius:8}} textStyle={{fontSize:14}}  />
                        </Box>
                    </VStack>
                </Box>
            </ScrollView>
            <Modal isOpen={certiFormComplete} onClose={() => setCertiFormComplete(false)} >
                <Modal.Content maxWidth={width-100}>
                    <Modal.Body>
                        <Box>
                            <DefText text='계정정보가 확인되었습니다.' style={{color:'#333'}} />
                            <DefText text='비밀번호 변경페이지로 이동합니다.' style={{marginTop:10, color:'#333'}} />
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

export default PasswordLost;