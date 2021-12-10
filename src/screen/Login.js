import React, { useEffect, useState } from 'react';
import {Box, VStack, Image, Input, CheckIcon, HStack} from 'native-base';
import { ScrollView, Dimensions, Alert, TouchableOpacity, Platform} from 'react-native';
import {DefText, Button, Button2, DefInput} from '../common/BOOTSTRAP';
import {email_check} from '../common/dataFunction';
import ToastMessage from '../components/ToastMessage';
import { StackActions } from '@react-navigation/native';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import AsyncStorage from '@react-native-community/async-storage';
import messaging from '@react-native-firebase/messaging';
import {
    GoogleSignin,
    GoogleSigninButton,
    statusCodes,
  } from "@react-native-google-signin/google-signin";
import Api from '../Api';
import {
    KakaoOAuthToken,
    KakaoProfile,
    getProfile as getKakaoProfile,
    login,
    logout,
    unlink,
  } from '@react-native-seoul/kakao-login';

import { BASE_URL } from '../Utils/APIConstant';

const Login = (props) => {

    console.log('BASE_URL', BASE_URL)

    const {navigation, member_login, member_info} = props;

    const {width} = Dimensions.get('window');

    const _signIn = async () => {
        try {
          await GoogleSignin.hasPlayServices();
          const userInfo = await GoogleSignin.signIn();

          //console.log('구글 로그인:::', userInfo.user);
    
          const authStatus = await messaging().requestPermission();
          const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;
          //   const json = JSON.parse(response);
       //  const token = await messaging().getToken();
    
            const params = {
                snskey: userInfo.user.id,
                email: userInfo.user.email,
                name : userInfo.user.name,
                sns : 'google'
            };

           console.log("params :::: ", params);

           await Api.send('member_snsCheck', params, (args)=>{
                let resultItem = args.resultItem;
                let arrItems = args.arrItems;
        
                if(resultItem.result === 'Y' && arrItems) {
                    
                    console.log('sns 로그인 진행 성공 메시지:', resultItem);

                    console.log('sns 로그인 진행 성공 타입:', arrItems);

                    if(!arrItems.check){
                        console.log('회원가입으로..');
                        navigation.navigate('RegisterSns', params);
                    }else{
                        console.log('로그인으로..');


                       _loginButtonSNS(params);
                        // const token =  messaging().getToken();
                        // const formData = new FormData();
                        // formData.append('id', userInfo.user.email);
                        // formData.append('autoLoginCheck', autoLoginCheck);
                        // formData.append('token', token);
                        // formData.append('method', 'member_login');
            
                        // const login =  member_login(formData);
            
                        // console.log('login::::', login);
         
                    }



                }else{
                    console.log('sns 로그인 진행 실패...', resultItem);
                
                }
            });
        } catch (error) {
          console.log("error code :::: ", error.code);
          if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            // 12501
            ToastMessage("구글 로그인을 취소하셨습니다.");
          } else if (error.code === statusCodes.IN_PROGRESS) {
            ToastMessage("구글 로그인을 진행중입니다.");
          } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            ToastMessage("구글플레이 서비스 이용불가 계정입니다. 구글에 문의 바랍니다.",);
          } else {
            ToastMessage("구글로그인 오류입니다. 잠시후 다시 시도 해주세요.");
          }
        }
      };


      const _loginButtonSNS = async (argsData) => {
        console.log('넘어왔니?',argsData);

            const token = await messaging().getToken();
            const formData = new FormData();
            formData.append('id', argsData.email);
            formData.append('autoLoginCheck', autoLoginCheck);
            formData.append('token', token);
            formData.append('sns', argsData.sns);
            formData.append('snskey', argsData.snskey)
            formData.append('method', 'member_login');
           

            const login = await member_login(formData);

            //console.log('login::::', login);

            if(login.state){
            
                //console.log('123',login);
                const member_info_list = await member_info(formData);
   
    
                if(member_info_list.state){
                    navigation.replace('Tab_Navigation', {
                        screen: 'Home',
                        params: {
                            msg : member_info_list.msg
                        }
                    });
                }
                
                //console.log(login);
            }else{
                console.log('에러:',login);
                ToastMessage(login.msg);
            }

      }
  

    
      useEffect(()=>{
        GoogleSignin.configure({
            webClientId:
              "942377152347-tll69c6es8n311sba9kp18etui7u9att.apps.googleusercontent.com",
            offlineAccess: true,
            hostedDomain: "",
            forceConsentPrompt: true,
          });
      }, [])

      const signInWithKakao = async () => {
        const token = await login();
        if(token.scopes != undefined) {
            const profile = await getKakaoProfile();

            const params = {
                snskey: profile.id,
                email: profile.email,
                name : '',
                sns : 'kakao'
            };

            console.log("::::::::", params);

            await Api.send('member_snsCheck', params, (args)=>{
                let resultItem = args.resultItem;
                let arrItems = args.arrItems;
        
                if(resultItem.result === 'Y' && arrItems) {
                    
                    console.log('카카오 로그인 진행 성공 메시지:', resultItem);

                    console.log('카카오 로그인 진행 성공 타입:', arrItems);

                    if(!arrItems.check){
                        console.log('회원가입으로..');
                        navigation.navigate('RegisterSns', params);
                    }else{
                        console.log('로그인으로..');

                        _loginButtonSNS(params);
                    }



                }else{
                    console.log('sns 로그인 진행 실패...', resultItem);
                
                }
            });
        }
    
        
      };

 

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
    const [autoLoginCheck, setAutoLoginCheck] = useState(true);

    //로그인 버튼 동작
    const _loginButton = async () => {


       

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

        const token = await messaging().getToken();


        console.log(token);

        const formData = new FormData();
        formData.append('id', emailInput);
        formData.append('password', passwordInput);
        formData.append('autoLoginCheck', autoLoginCheck);
        formData.append('token', token);
        formData.append('method', 'member_login');
        

        const login = await member_login(formData);

        if(login.state){
            
            //console.log('123',login);
            const member_info_list = await member_info(formData);


            //console.log('123213123',member_info_list);

            if(member_info_list.state){
                navigation.replace('Tab_Navigation', {
                    screen: 'Home',
                    params: {
                        msg : member_info_list.msg
                    }
                });
            }
            
            //console.log(login);
        }else{
            console.log('에러:',login);
            ToastMessage(login.msg);
        }

        // navigation.replace('Tab_Navigation', {
        //     screen: 'Home
        // });
    }

    

    const _RegisterButton = () => {
        navigation.navigate('Register');
    }

    const _LoginButton = () => {
        navigation.replace('Tab_Navigation', {
            screen: 'Home',
            
        });
    }

    


    // useEffect(()=>{
    //     AsyncStorage.getItem('save_id').then(async (response) => {
            
    //         if (response === null) {
    //             console.log('세션 없음');
    //             return;
    //         }

    //         const token = await messaging().getToken();
    //        // console.log(":::::::",response);
    //         //console.log('tokens', token);

    //         const formData = new FormData();
    //         formData.append('method', 'member_info');
    //         formData.append('id', response);
    //         formData.append('token', token);
            
    //         const member_info_list = await member_info(formData);

    //         if(member_info_list.state){

    //             // console.log('자동로그인 완료...');

    //             // console.log(member_info_list);

    //             navigation.replace('Tab_Navigation', {
    //                 screen: 'Home',
    //                 params: {
    //                     msg : member_info_list.msg
    //                 }
    //             });

    //         }else{
    //             ToastMessage('자동로그인이 실패되었습니다.');
    //             return;
    //         }
    //     });
    // }, [])



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
                        <Input 
                            placeholder='이메일을 입력해주세요.'
                            value = {emailInput}
                            onChangeText = {emailChange}
                            multiline = {false}
                            
                            _focus='transparent'
                            style={{fontSize:14, marginTop:10}}
                        />
                        
                    </Box>
                    <Box mt={5}>
                        <DefText text='비밀번호' style={{fontSize:14}} />
                        <Box mt='10px'>
                            <Input 
                                placeholder='비밀번호를 입력해주세요.'
                                
                                value = {passwordInput}
                                onChangeText = {passwordChange}
                                multiline = {false}
                                secureTextEntry={true}
                                _focus='transparent'
                                style={{fontSize:14}}
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
                            {/* <Button2 
                                imgSource={require('../images/googleIcon.png')} 
                                imgAlt='구글로그인'
                                imgStyle={{marginRight:10}}
                                text='Continue with Google' 
                                buttonStyle={{borderRadius:8, backgroundColor:'#fff', borderWidth:1, borderColor:'#D0D0D0'}} 
                                textStyle={{lineHeight:22, fontSize:14, color:'#333333'}} 
                            /> */}
                            <GoogleSigninButton 
                                onPress={()=>_signIn()} 
                                style={{ width: width - 95, height: Platform.OS === 'ios' ? 50 : 60 }}

                                size={GoogleSigninButton.Size.Wide}
                                color={GoogleSigninButton.Color.Dark}
                            />
                           
                        </Box>
                        <Box mt={5}>
                            <Button 
                                text='카카오톡으로 로그인하기'
                                buttonStyle={{borderRadius:8, backgroundColor:'#FFEB00'}} 
                                textStyle={{lineHeight:22, fontSize:14, color:'#333'}} 
                                onPress={()=>signInWithKakao()}
                            />
                        </Box>
                    </Box>
                </VStack>
            </ScrollView>
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
)(Login);