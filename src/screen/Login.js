import React, { useState } from 'react';
import {Box, VStack, Image, Input, CheckIcon, HStack} from 'native-base';
import { ScrollView, Dimensions, Alert, TouchableOpacity} from 'react-native';
import {DefText, Button, Button2, DefInput} from '../common/BOOTSTRAP';
import {email_check} from '../common/dataFunction';
import ToastMessage from '../components/ToastMessage';

const Login = (props) => {

    const {navigation} = props;

    const {width} = Dimensions.get('window');

    //e-mail 아이디
    const [emailInput, setEmailInput] = useState('');
    const emailChange = (text) => {
        setEmailInput(text);
    }

    //비밀번호 입력
    const [passwordInput, setPasswordInput] = useState('');
    const passwordChange = (password) => {
        setPasswordInput(password);
    }

    //자동로그인 체크
    const [autoLoginCheck, setAutoLoginCheck] = useState(false);

    //로그인 버튼 동작
    const _loginButton = () => {
        if(!emailInput){ //이메일 입력 검사
            ToastMessage('이메일을 입력하세요.');
            return false;
        }

        if(!email_check(emailInput)){ // 이메일 유효성 검사
            ToastMessage('이메일 형식으로 입력하세요.');
            return false;
        }

        if(!passwordInput){ //비밀번호 입력 검사
            ToastMessage('비밀번호를 입력하세요.');
            return false;
        }

        ToastMessage('로그인...');
    }

    const _RegisterButton = () => {
        navigation.navigate('Register');
    }

    return (
        <Box flex={1} backgroundColor='#fff'>
            <ScrollView>
                <VStack justifyContent='center' alignItems='center' >
                    <Image source={require('../images/LoginLogo.png')} alt='logo' style={{marginTop:37, marginBottom:30}} />
                    <DefText text='안녕하세요.' style={{marginBottom:10, fontSize:20, lineHeight:24}}/>
                    <DefText text="건강을 지키는 종소리 '힐링'에" style={{marginBottom:10, fontSize:20, lineHeight:24}} />
                    <DefText text='오신 걸 환영합니다.' style={{fontSize:20,lineHeight:24}} />
                </VStack>
                <VStack py={10} px={12}>
                    <Box>
                        <DefText text='이메일' style={{fontSize:14}} />
                        <DefInput 
                            placeholderText='이메일을 입력해주세요.'
                            value = {emailInput}
                            onChangeText = {emailChange}
                            multiline = {false}
                            inputStyle={{marginTop:15}}
                        />
                    </Box>
                    <Box mt={5}>
                        <DefText text='비밀번호' style={{fontSize:14}} />
                        <Box mt='15px'>
                            <DefInput 
                                placeholderText='비밀번호를 입력해주세요.'
                                value = {passwordInput}
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
                        <HStack alignItems='center' justifyContent='space-between'>
                            <TouchableOpacity onPress={()=>{setAutoLoginCheck(!autoLoginCheck)}} activeOpacity={1}>
                                <HStack alignItems='center'>
                                    <Box style={{width:24, height:24, borderRadius:4, borderWidth:1, borderColor:'#D0D0D0', justifyContent:'center', alignItems:'center'}}>
                                        {
                                            autoLoginCheck && 
                                            <CheckIcon style={{width:15, height:15}} />
                                        }
                                    </Box>
                                    <DefText text='자동 로그인' style={{fontSize:12, color:'#ABB3BB', marginLeft:10}} />
                                </HStack>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={()=>{navigation.navigate('PasswordLost')}}
                            >
                                <DefText text='비밀번호를 잊어버리셨나요?' style={{fontSize:12, color:'#FC6D5B'}} />
                            </TouchableOpacity>
                        </HStack>
                        <Box mt={7}>
                            <Button onPress={_loginButton} text='로그인' buttonStyle={{borderRadius:8}} textStyle={{lineHeight:22, fontSize:14}} />
                        </Box>
                        <Box mt={5}>
                            <Button onPress={_RegisterButton} text='가입하기' buttonStyle={{borderRadius:8}} textStyle={{lineHeight:22, fontSize:14}} />
                        </Box>
                        <Box mt={3}>
                            <HStack alignItems='center' justifyContent='space-between'>
                                <Box style={{width:width*0.32, height:1, backgroundColor:'#E1E1E1'}}></Box>
                                <DefText text='Or' style={{fontSize:14, color:'#ABB3BB'}} />
                                <Box style={{width:width*0.32, height:1, backgroundColor:'#E1E1E1'}}></Box>
                            </HStack>
                        </Box>
                        <Box mt={3}>
                            <Button2 
                                imgSource={require('../images/googleIcon.png')} 
                                imgAlt='구글로그인'
                                imgStyle={{marginRight:10}}
                                text='Continue with Google' 
                                buttonStyle={{borderRadius:8, backgroundColor:'#fff', borderWidth:1, borderColor:'#D0D0D0'}} 
                                textStyle={{lineHeight:22, fontSize:14, color:'#333333'}} 
                            />
                        </Box>
                        <Box mt={5}>
                            <Button 
                                text='카카오톡으로 로그인하기'
                                buttonStyle={{borderRadius:8, backgroundColor:'#FFEB00'}} 
                                textStyle={{lineHeight:22, fontSize:14, color:'#333'}} 
                            />
                        </Box>
                    </Box>
                </VStack>
            </ScrollView>
        </Box>
    );
};

export default Login;