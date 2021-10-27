import React, { useEffect, useState } from 'react';
import {Box, VStack, Image, Input, CheckIcon, HStack, Select} from 'native-base';
import { ScrollView, Dimensions, Alert, TouchableOpacity} from 'react-native';
import {DefText, Button, Button2, DefInput} from '../common/BOOTSTRAP';
import {email_check, phoneFormat} from '../common/dataFunction';
import ToastMessage from '../components/ToastMessage';

import HeaderRegister from '../components/HeaderRegister';

const Register = (props) => {

    const {navigation} = props;

    const {width} = Dimensions.get('window');
    const halfWidth = width * 0.48 - 48;

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

    //비밀번호 입력
    const [passwordInput, setPasswordInput] = useState('');
    const passwordChange = (password) => {
        setPasswordInput(password);
    }

    //비밀번호 재입력
    const [rePasswordInput, setRePasswordInput] = useState('');
    const rePasswordChange = (password) => {
        setRePasswordInput(password);
    }

    //휴대폰번호 입력
    const [phoneNumber, setPhoneNumber] = useState('');
    const phoneNumberChange = (number) => {
        setPhoneNumber(phoneFormat(number));
    }

    //생년월일 입력
    const [birthDay, setBirthDay] = useState('');
    const birthDayChange = (year) => {
        setBirthDay(year);
    }

    //성별
    const [gender, setGender] = useState('남자');

    //가입코드
    const [joinCode, setJoinCode] = useState('');
    const joinCodeChange = (code) => {
        setJoinCode(code);
    }

    const [agree, setAgree] = useState(false);

    const _RegisterCompleteButton = () => {

        if(!emailInput){
            ToastMessage('이메일을 입력하세요');
            return false;
        }

        if(!email_check(emailInput)){ // 이메일 유효성 검사
            ToastMessage('이메일 형식으로 입력하세요.');
            return false;
        }

        if(!nameInput){ //비밀번호 입력 검사
            ToastMessage('이름을 입력하세요.');
            return false;
        }

        if(!passwordInput){ //비밀번호 입력 검사
            ToastMessage('비밀번호를 입력하세요.');
            return false;
        }

        if(!rePasswordInput){ //비밀번호 입력 검사
            ToastMessage('비밀번호를 다시한번 입력하세요.');
            return false;
        }

        if(passwordInput!=rePasswordInput){
            ToastMessage('비밀번호가 일치하지 않습니다.');
            return false;
        }

        ToastMessage('회원가입 완료..');
    }

    return (
        <Box flex={1} backgroundColor='#fff'>
            
            <ScrollView>
                <HeaderRegister navigation={navigation} headerText='회원가입' />
                <Box py={5}>
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
                                <DefText text='비밀번호' style={{fontSize:14}} />
                                <DefText text='*' style={{fontSize:14, color:'#f00', marginLeft:5}} />
                            </HStack>
                            <Box mt='15px'>
                                <DefInput 
                                    placeholderText='비밀번호를 입력해주세요.'
                                    inputValue = {passwordInput}
                                    onChangeText = {passwordChange}
                                    multiline = {false}
                                    secureTextEntry={true}
                                />
                                <Box style={{height:48, position:'absolute', top:0, right:15, justifyContent:'center'}}>
                                    <Image 
                                        source={require('../images/eyes.png')} 
                                        alt='암호화'
                                    />
                                </Box>
                            </Box>
                        </Box>
                        <Box mt={5}>
                            <HStack>
                                <DefText text='비밀번호 확인' style={{fontSize:14}} />
                                <DefText text='*' style={{fontSize:14, color:'#f00', marginLeft:5}} />
                            </HStack>
                            <Box mt='15px'>
                                <DefInput 
                                    placeholderText='비밀번호를 다시 입력해주세요.'
                                    inputValue = {rePasswordInput}
                                    onChangeText = {rePasswordChange}
                                    multiline = {false}
                                    secureTextEntry={true}
                                />
                                <Box style={{height:48, position:'absolute', top:0, right:15, justifyContent:'center'}}>
                                    <Image 
                                        source={require('../images/eyes.png')} 
                                        alt='암호화'
                                    />
                                </Box>
                            </Box>
                        </Box>
                        <Box mt={5}>
                            <HStack>
                                <DefText text='휴대폰번호' style={{fontSize:14}} />
                                <DefText text='*' style={{fontSize:14, color:'#f00', marginLeft:5}} />
                            </HStack>
                            <DefInput 
                                placeholderText='휴대폰번호를 입력해주세요. (-를 빼고 입력하세요.)'
                                inputValue = {phoneNumber}
                                onChangeText = {phoneNumberChange}
                                multiline = {false}
                                inputStyle={{marginTop:15}}
                                maxLength={13}
                                keyboardType='phone-pad'
                            />
                        </Box>
                        <HStack mt={5} justifyContent='space-between'>
                            <Box width={halfWidth}>
                                <HStack>
                                    <DefText text='생년월일' style={{fontSize:14}} />
                                    <DefText text='*' style={{fontSize:14, color:'#f00', marginLeft:5}} />
                                </HStack>
                                <DefInput 
                                    placeholderText='Ex) 19790324'
                                    inputValue = {birthDay}
                                    onChangeText = {birthDayChange}
                                    multiline = {false}
                                    inputStyle={{marginTop:15}}
                                    maxLength={8}
                                    keyboardType='phone-pad'
                                />
                            </Box>
                            <Box width={halfWidth}>
                                <HStack>
                                    <DefText text='성별' style={{fontSize:14}} />
                                    <DefText text='*' style={{fontSize:14, color:'#f00', marginLeft:5}} />
                                </HStack>
                                <Select
                                    selectedValue={gender}
                                    height='48px'
                                    mt='15px'
                                    fontSize={14}
                                    onValueChange={(itemValue) => setGender(itemValue)}
                                >
                                    <Select.Item label='남자' value='남자' />
                                    <Select.Item label='여자' value='여자' />
                                </Select>
                            </Box>
                        </HStack>
                        <Box mt={5}>
                            <HStack>
                                <DefText text='가입코드' style={{fontSize:14}} />
                                <DefText text='*' style={{fontSize:14, color:'#f00', marginLeft:5}} />
                            </HStack>
                            <DefInput 
                                placeholderText='보유하신 가입코드를 입력해주세요'
                                inputValue = {joinCode}
                                onChangeText = {joinCodeChange}
                                multiline = {false}
                                inputStyle={{marginTop:15}}
                            />
                        </Box>
                        <HStack mt={3}>
                            <TouchableOpacity onPress={()=>{setAgree(!agree)}} activeOpacity={1}>
                                <HStack alignItems='center'>
                                    <Box style={{width:24, height:24, borderRadius:4, borderWidth:1, borderColor:'#D0D0D0', justifyContent:'center', alignItems:'center'}}>
                                        {
                                            agree &&
                                            <CheckIcon style={{width:15, height:15}} />
                                        }
                                    </Box>
                                    <HStack style={{marginLeft:10}}>
                                        <TouchableOpacity>
                                            <DefText text='이용약관' style={{fontSize:12, color:'#3AD4E0', borderBottomWidth:1, borderBottomColor:'#3ad4e0' }} />
                                        </TouchableOpacity>
                                        <DefText text='에 동의합니다.' style={{fontSize:12, color:'#3AD4E0'}} />
                                    </HStack>
                                </HStack>
                            </TouchableOpacity>
                        </HStack>
                        <Box mt={12}>
                            <Button onPress={_RegisterCompleteButton} text='가입완료' buttonStyle={{borderRadius:8}} textStyle={{fontSize:14}} />
                        </Box>
                    </VStack>
                </Box>
            </ScrollView>
        </Box>
    );
};

export default Register;