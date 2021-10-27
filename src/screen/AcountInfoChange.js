import React, {useState, useEffect} from 'react';
import { TouchableOpacity, Dimensions, Text, ScrollView, StyleSheet, FlatList, ImageBackground, Alert } from 'react-native';
import { Box, Image, HStack, Input, Modal, VStack, Select } from 'native-base';
import { DefText, DefInput, Button } from '../common/BOOTSTRAP';
import {email_check, phoneFormat} from '../common/dataFunction';
import HeaderComponents from '../components/HeaderComponents';
import ToastMessage from '../components/ToastMessage';

const {width} = Dimensions.get('window');
    const halfWidth = width * 0.48 - 48;

const AcountInfoChange = (props) => {

    const {navigation} = props;

    //이메일
    const [emailInput, setEmailInput] = useState('test@email.com');
    const emailChange = (email) =>{
        setEmailInput(email);
    }

    //이름
    const [nameInput, setNameInput] = useState('test');
    const nameChange = (name) => {
        setNameInput(name);
    }

    //비밀번호
    const [passwordInput, setPasswordInput] = useState('');
    const passwordChange = (password) => {
        setPasswordInput(password);
    }

    const [rePasswordInput, setRePasswordInput] = useState('');
    const rePasswordChange = (password) => {
        setRePasswordInput(password);
    }

    //휴대폰번호
    const [phoneNumber, setPhoneNumber] = useState('010-1234-5678');
    const phoneNumberChange = (number) => {
        setPhoneNumber(phoneFormat(number));
    }

    //생년월일 입력
    const [birthDay, setBirthDay] = useState('19910101');
    const birthDayChange = (year) => {
        setBirthDay(year);
    }

    //성별
    const [gender, setGender] = useState('남자');

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


        navigation.replace('AcountInfo');
        ToastMessage('회원정보 수정 완료');
    }

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderComponents navigation={navigation} headerTitle='회원정보 변경' />
            <ScrollView>
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
                        
                    </VStack>
                </Box>
            </ScrollView>
            <Box mt={5} px={12} py={2.5}>
                <Button onPress={_RegisterCompleteButton} text='회원정보 수정하기' buttonStyle={{borderRadius:8}} textStyle={{fontSize:14}} />
            </Box>
        </Box>
    );
};

export default AcountInfoChange;