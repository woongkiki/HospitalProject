import React, { useEffect, useState } from 'react';
import {Box, VStack, Image, Input, CheckIcon, HStack} from 'native-base';
import { ScrollView, Dimensions, Alert, TouchableOpacity, Platform, StyleSheet} from 'react-native';
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
import appleAuth, {
    AppleButton,
    AppleAuthRequestOperation,
    AppleAuthRequestScope,
    AppleAuthCredentialState,
  } from '@invertase/react-native-apple-authentication';
  

import { BASE_URL } from '../Utils/APIConstant';
import Font from '../common/Font';

const {width} = Dimensions.get('window');

const Login = (props) => {

    //console.log('BASE_URL', BASE_URL)

    const {navigation, member_login, member_info} = props;



    async function onAppleButtonPress() {
        const appleAuthRequestResponse = await appleAuth.performRequest({
          requestedOperation: appleAuth.Operation.LOGIN,
          requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
        });
      
        // Ensure Apple returned a user identityToken
        if (!appleAuthRequestResponse.identityToken) {
          throw 'Apple Sign-In failed - no identify token returned';
        }
      
        const {identityToken, user, email, fullName} = appleAuthRequestResponse;

        const { familyName, givenName } = fullName;
      
        // console.log('identityToken: ', identityToken);
        // console.log('nonce: ', nonce);
        console.log('appleAuthRequestResponse', appleAuthRequestResponse);


        const params = {
            snskey: user,
            email: email,
            name : familyName + givenName,
            sns : 'apple'
        };

        Api.send('member_snsCheck', params, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                
                console.log('sns ????????? ?????? ?????? ?????????:', resultItem);

                console.log('sns ????????? ?????? ?????? ??????:', arrItems);

                if(!arrItems.check){
                    console.log('??????????????????..');
                    navigation.navigate('RegisterSns', params);
                }else{
                    console.log('???????????????..');


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
                console.log('sns ????????? ?????? ??????...', resultItem);
            
            }
        });

      }


    const _signIn = async () => {
        try {
          await GoogleSignin.hasPlayServices();
          const userInfo = await GoogleSignin.signIn();

          //console.log('?????? ?????????:::', userInfo.user);
    
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
                    
                    console.log('sns ????????? ?????? ?????? ?????????:', resultItem);

                    console.log('sns ????????? ?????? ?????? ??????:', arrItems);

                    if(!arrItems.check){
                        console.log('??????????????????..');
                        navigation.navigate('RegisterSns', params);
                    }else{
                        console.log('???????????????..');


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
                    console.log('sns ????????? ?????? ??????...', resultItem);
                
                }
            });
        } catch (error) {
          console.log("error code :::: ", error.code);
          if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            // 12501
            ToastMessage("?????? ???????????? ?????????????????????.");
          } else if (error.code === statusCodes.IN_PROGRESS) {
            ToastMessage("?????? ???????????? ??????????????????.");
          } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            ToastMessage("??????????????? ????????? ???????????? ???????????????. ????????? ?????? ????????????.",);
          } else {
            ToastMessage("??????????????? ???????????????. ????????? ?????? ?????? ????????????.");
          }
        }
      };


      const _loginButtonSNS = async (argsData) => {
        console.log('?????????????',argsData);

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
                console.log('??????:',login);
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
                    
                    console.log('????????? ????????? ?????? ?????? ?????????:', resultItem);

                    console.log('????????? ????????? ?????? ?????? ??????:', arrItems);

                    if(!arrItems.check){
                        console.log('??????????????????..');
                        navigation.navigate('RegisterSns', params);
                    }else{
                        console.log('???????????????..');

                        _loginButtonSNS(params);
                    }



                }else{
                    console.log('sns ????????? ?????? ??????...', resultItem);
                
                }
            });
        }
    
        
      };

 

    //e-mail ?????????
    const [emailInput, setEmailInput] = useState('');
    const emailChange = (text) => {
        setEmailInput(text);
    }

    //???????????? ??????
    const [passwordInput, setPasswordInput] = useState('');
    const passwordChange = (password) => {
        setPasswordInput(password);
    }

    //??????????????? ??????
    const [autoLoginCheck, setAutoLoginCheck] = useState(true);

    //????????? ?????? ??????
    const _loginButton = async () => {


       

        if(!emailInput){ //????????? ?????? ??????
            ToastMessage('???????????? ???????????????.');
            return false;
        }

        if(!email_check(emailInput)){ // ????????? ????????? ??????
            ToastMessage('????????? ???????????? ???????????????.');
            return false;
        }

        if(!passwordInput){ //???????????? ?????? ??????
            ToastMessage('??????????????? ???????????????.');
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
            console.log('??????:',login);
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
    //             console.log('?????? ??????');
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

    //             // console.log('??????????????? ??????...');

    //             // console.log(member_info_list);

    //             navigation.replace('Tab_Navigation', {
    //                 screen: 'Home',
    //                 params: {
    //                     msg : member_info_list.msg
    //                 }
    //             });

    //         }else{
    //             ToastMessage('?????????????????? ?????????????????????.');
    //             return;
    //         }
    //     });
    // }, [])

    const [passwordStatus, setPasswordStatus] = useState(true);

    return (
        <Box flex={1} backgroundColor='#fff'>
            <ScrollView>
                {/* <VStack justifyContent='center' alignItems='center' >
                    <Image source={require('../images/LoginLogo.png')} alt='logo' style={{marginTop:37, marginBottom:30}} />
                    <DefText text='???????????????.' style={{marginBottom:10, fontSize:20, lineHeight:24}}/>
                    <DefText text="????????? ????????? ????????? '??????'???" style={{marginBottom:10, fontSize:20, lineHeight:24}} />
                    <DefText text='?????? ??? ???????????????.' style={{fontSize:20,lineHeight:24}} />
                </VStack> */}
                <Box mt={8}>
                    <Image source={require('../images/mainLoginLogo.png')} alt='?????????' width={width} height={200} resizeMode='contain' />
                </Box>
                <VStack py={10} px={12} pt={7}>
                    <Box>
                        <DefText text='?????????' style={{fontFamily:Font.NotoSansMedium, color:'#696969'}} />
                        <Input 
                            placeholder='???????????? ??????????????????.'
                            placeholderTextColor={'#a3a3a3'}
                            value = {emailInput}
                            onChangeText = {emailChange}
                            multiline = {false}
                            height='45px'
                            _focus='transparent'
                            borderWidth={1}
                            borderColor='#f1f1f1'
                            style={[{fontSize:16, marginTop:10, fontFamily:Font.NotoSansMedium}, emailInput.length > 0 && {backgroundColor:'#f1f1f1'}]}
                        />
                        
                    </Box>
                    <Box mt={5}>
                        <DefText text='????????????' style={{fontFamily:Font.NotoSansMedium, color:'#696969'}} />
                        <Box mt='10px'>
                            <Input 
                                placeholder='??????????????? ??????????????????.'
                                height='45px'
                                value = {passwordInput}
                                onChangeText = {passwordChange}
                                multiline = {false}
                                secureTextEntry={passwordStatus}
                                _focus='transparent'
                                borderWidth={1}
                                borderColor='#f1f1f1'
                                style={[{fontSize:16, fontFamily:Font.NotoSansMedium}, passwordInput.length > 0 && {backgroundColor:'#f1f1f1'}]}
                            />
                            <Box style={{height:45, position:'absolute', top:0, right:15, justifyContent:'center'}}>
                                <TouchableOpacity onPress={()=>setPasswordStatus(!passwordStatus)}>
                                    {
                                        passwordStatus ?
                                        <Image 
                                            source={require('../images/eyes.png')} 
                                            alt='?????????'
                                        />
                                        :
                                        <Image 
                                            source={require('../images/eyes_yes.png')} 
                                            alt='?????????'
                                        />
                                    }
                                    
                                </TouchableOpacity>
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
                                    <DefText text='?????? ?????????' style={{fontSize:14, color:'#696969', marginLeft:10}} />
                                </HStack>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={()=>{navigation.navigate('PasswordLost')}}
                            >
                                <DefText text='??????????????? ??????????????????????' style={{fontSize:14, color:'#FC6D5B'}} />
                            </TouchableOpacity>
                        </HStack>
                        <Box mt={7}>
                            <Button onPress={_loginButton} text='?????????' buttonStyle={{borderRadius:10, height:45, backgroundColor:'#696969'}} textStyle={{lineHeight:22, fontSize:16, fontFamily:Font.NotoSansMedium}} />
                        </Box>
                        <Box mt={5}>
                            <Button onPress={_RegisterButton} text='????????????' buttonStyle={{borderRadius:10, height:45, backgroundColor:'#696969'}} textStyle={{lineHeight:22, fontSize:16, fontFamily:Font.NotoSansMedium}} />
                        </Box>
                        <Box mt={3}>
                            <HStack alignItems='center' justifyContent='space-between'>
                                <Box style={{width:width*0.32, height:1, backgroundColor:'#f1f1f1'}}></Box>
                                <DefText text='Or' style={{fontSize:14, color:'#696969'}} />
                                <Box style={{width:width*0.32, height:1, backgroundColor:'#f1f1f1'}}></Box>
                            </HStack>
                        </Box>
                        <Box mt={3}>
                            {/* <Button2 
                                imgSource={require('../images/googleIcon.png')} 
                                imgAlt='???????????????'
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
                                text='?????????????????? ???????????????'
                                buttonStyle={{borderRadius:8, backgroundColor:'#FFEB00'}} 
                                textStyle={{lineHeight:22, fontSize:14, color:'#333'}} 
                                onPress={()=>signInWithKakao()}
                            />
                        </Box>
                        {
                            Platform.OS === 'ios' && 
                            <Box mt={5}>
                                <AppleButton
                                    buttonStyle={AppleButton.Style.BLACK}
                                    buttonType={AppleButton.Type.SIGN_IN}
                                    style={styles.appleButton}
                                    onPress={() =>
                                    onAppleButtonPress().then(() =>
                                        console.log('Apple sign-in complete!'),
                                    )
                                    }
                                />
                            </Box>
                        }
                        
                    </Box>
                </VStack>
            </ScrollView>
        </Box>
    );
};

const styles = StyleSheet.create({
    appleButton: {
        width: width - 95,
        height: 50,
    },
});

export default connect(
    ({ User }) => ({
        userInfo: User.userInfo, //????????????
    }),
    (dispatch) => ({
        member_login: (user) => dispatch(UserAction.member_login(user)), //?????????
        member_info: (user) => dispatch(UserAction.member_info(user)), //?????? ?????? ??????
        
    })
)(Login);