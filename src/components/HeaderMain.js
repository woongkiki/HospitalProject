import React, {useState, useEffect} from 'react';
import { Box, VStack, HStack, Image } from 'native-base';
import { TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { DefText } from '../common/BOOTSTRAP';
import Api from '../Api';
import messaging from '@react-native-firebase/messaging';
import { connect } from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import { textLengthOverCut } from '../common/dataFunction';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { Platform } from 'react-native';

const {width, height} = Dimensions.get('window');

const  heightHome = height - 55;
//console.log(height, heightHome);

const HeaderMain = ( props ) => {

    const { navigation, userInfo, member_info, hospitalChangeBtn, hospitalCode, hospitalLogo, hospitalName, chg_hcode } = props;

    //console.log('헤더,,,', userInfo.membership[0]);

    //console.log(userInfo.m_hcode);
    //console.log(userInfo.membership);

    if (Platform.OS === 'ios') { PushNotificationIOS.setApplicationIconBadgeNumber(0); }

    useEffect(() => {
   
          messaging().onMessage((remoteMessage) => {
            Toast.show({
              type: 'info', //success | error | info
              position: 'top',
              text1: remoteMessage.notification.title,
              text2: remoteMessage.notification.body,
              visibilityTime: 3000,
             // autoHide: remoteMessage.data.intent === 'SellerReg' ? false : true,    // true | false
              topOffset: Platform.OS === 'ios' ? 66 + getStatusBarHeight() : 10,
              style: { backgroundColor: 'red' },
              bottomOffset: 100,
              onShow: () => {},
              onHide: () => {},
              onPress: () => {

                //console.log('12312312313::::', remoteMessage.data)
                if (remoteMessage.data?.intent != null && remoteMessage.data?.intent != '') {
                    if(remoteMessage.data?.hcode != null && remoteMessage.data?.hcode != '') chg_hcode(remoteMessage.data?.hcode); 
                  navigation.navigate(remoteMessage.data.intent, {
                     idx: remoteMessage.data?.idx,
                     hcode: remoteMessage.data?.hcode
                  });
                  Toast.hide();
                }
              },
            });
            console.log('실행중 메시지:::',remoteMessage)

          });
          // 포그라운드
          messaging().onNotificationOpenedApp((remoteMessage) => {
            // console.log('onNotificationOpenedApp', remoteMessage);
            if (remoteMessage.data?.intent != null && remoteMessage.data?.intent != '') {
                if(remoteMessage.data?.hcode != null && remoteMessage.data?.hcode != '') chg_hcode(remoteMessage.data?.hcode); 
                navigation.navigate(remoteMessage.data.intent, {
                    idx: remoteMessage.data?.idx,
                    hcode: remoteMessage.data?.hcode
                });
                Toast.hide();
            }
          });
          // 백그라운드
          messaging()
            .getInitialNotification()
            .then((remoteMessage) => {
                if (remoteMessage.data?.intent != null && remoteMessage.data?.intent != '') {
                    if(remoteMessage.data?.hcode != null && remoteMessage.data?.hcode != '') chg_hcode(remoteMessage.data?.hcode); 
                    navigation.navigate(remoteMessage.data.intent, {
                        idx: remoteMessage.data?.idx,
                        hcode: remoteMessage.data?.hcode
                    });
                    Toast.hide();
                }
            });
            //const unsubscribe = await dynamicLinks().onLink(handleDynamicLink);
            //return () => unsubscribe();
      
      }, []);

    const [hospitalCodeSet, setHospitalCodeSet] = useState('');

    // const [hospitalName, setHospitalName] = useState('');
    // const [hospitalLogo, setHospitalLogo] = useState('');

    const [pushStatus, setPushStatus] = useState(false);

    const PushChecks = async () => {

       

        await Api.send('push_check', {'id':userInfo.id, 'token':userInfo.appToken}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                //console.log('병원 정보: ', arrItems.name);
                console.log(arrItems, resultItem);
                
                setPushStatus(arrItems.push_check);
            }else{
                console.log('결과 출력 실패 Hcode!', resultItem,arrItems);
               //ToastMessage(resultItem.message);
            }
        });
    }

    useEffect(()=>{
        PushChecks();
    }, []);

    useEffect(()=>{
        const unsubscribe = () => {
            navigation.addListener('focus', async () => {
                //member_info_handle()
                PushChecks();
            });
        };
        unsubscribe();
    },[]);


    // const member_info_handle = async () => {
        

    //     const formData = new FormData();
    //     formData.append('method', 'member_info');
    //     formData.append('id', userInfo.email);
    //     formData.append('token', userInfo.appToken);
    //     const member_info_list = await member_info(formData);

    //    // console.log('회원정보를 조회1', member_info_list.result.m_hcode);
    //     if(member_info_list.state){
    //         setHospitalCodeSet(member_info_list.result.m_hcode);
    //     }

    // };


    // useEffect(()=>{
    //     console.log('변했어', hospitalCodeSet);
    //     HeadName();
    // }, [hospitalCodeSet])

  // console.log(hospitalChangeBtn);

    //console.log('user::', users);
    //test4321@test.com

    return (
        <Box height='50px' px={5} shadow={5} backgroundColor='#fff'>
            <HStack justifyContent='space-between' alignItems='center' height='50px'>
                <TouchableOpacity 
                    activeOpacity={0.7}
                    onPress={hospitalChangeBtn}
                >
                    <HStack alignItems='center'>
                        {
                            userInfo != undefined &&
                            hospitalLogo != '' ?
                            <Image 
                                //source={require('../images/hospitalLogo.png')} 
                                source={{uri:hospitalLogo}} 
                                alt='hospital logo'
                                style={{marginRight:10, width:34, height:34, resizeMode:'cover', borderRadius:20, overflow:'hidden'}}
                            />
                            :
                            <Image 
                                source={require('../images/hospitalLogo.png')} 
                                //source={{uri:memberInfosHeader.photo}} 
                                alt='hospital logo'
                                style={{marginRight:10, width:34, height:34, resizeMode:'cover', borderRadius:20, overflow:'hidden'}}
                            />
                        }
                        
                        {
                            userInfo != undefined &&
                            hospitalName != '' ?
                        
                            <DefText text={hospitalName} style={{marginRight:10}} />
                            :
                            <DefText text='정보없음' style={{marginRight:10}} />
                         
                        }
                      
                           {
                               userInfo != undefined &&
                               userInfo.membership.length > 1 && 
                             
                                <Image 
                                    source={require('../images/headDownImg.png')}
                                    alt='아래로 내리기'         
                                    style={{width:14, height:10, resizeMode:'contain', marginTop:-3}}
                                />
                             
                           }
                      
                        {/* <Image 
                            source={require('../images/mainHeadArr.png')}
                            alt='아래로 내리기'
                            
                        /> */}
                        
                    </HStack>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{navigation.navigate('AlarmList')}}>
 
                     <Image
                        source={require('../images/noticeIconNew.png')}
                        alt='알림'
                        style={{width:27, height:30, resizeMode:'contain'}}
                    />
                    {
                        pushStatus &&
                        <Box style={{width:12, height:12,backgroundColor:'#FFC400', borderRadius:12, position:'absolute', bottom:3, right:-3}} >
                        </Box>
                    }
                </TouchableOpacity>
            </HStack>
           
            
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
        chg_hcode   : (hcode) => dispatch({"type":"change_hcode", payload:hcode})
    })
  )(HeaderMain);