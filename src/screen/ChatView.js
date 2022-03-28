import React, { useState, useCallback, useEffect } from 'react';
import { Box, VStack, HStack, Image, CheckIcon, Input, Modal } from 'native-base';
import { TouchableOpacity, Dimensions, ScrollView, StyleSheet, Alert, View, ActivityIndicator } from 'react-native';
import {DefInput, DefText} from '../common/BOOTSTRAP';
import HeaderFood from '../components/HeaderFood';
import HeaderComponents from '../components/HeaderComponents';
import { GiftedChat } from 'react-native-gifted-chat';
import { StackActions } from '@react-navigation/native';
import { connect } from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import Api from '../Api';
import AsyncStorage from '@react-native-community/async-storage';
import ToastMessage from '../components/ToastMessage';
import { renderBubble,renderMessageText,renderMessage,ChatTime,renderDay,renderAvatar } from '../components/Chat';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';

import Toast from 'react-native-toast-message';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import Font from '../common/Font';

// ios 노티 개수 초기화
if (Platform.OS === 'ios') { PushNotificationIOS.setApplicationIconBadgeNumber(0); }

const ChatView = (props) => {

    const {navigation, route, userInfo, member_info} = props;

    const {params} = route;

    //console.log(userInfo);

    const [messages, setMessages] = useState([]);


    const [chatCategorys, setChatCategorys] = useState(''); //카테고리
    // useEffect(() => {
    //     setMessages([
    //         {
    //             _id: 1,
    //             text: '안녕하세요 반갑습니다.',
    //             createdAt: new Date(),
    //             user: {
    //             _id: 2,
    //             name: params.chatDoctor,
    //             avatar: params.imgUrl,
    //             },
    //         },
    //     ])
    // }, [])

    const onSend = useCallback((messages = []) => {

        console.log('내 메세지 전송:::::::',messages[0].text);

        

        //await setHospitalCode(member_info_list.result.membership[0]['hcode']);
        Api.send('checklist_chatInsert', {'id':userInfo.id,  'token':userInfo.appToken, 'hcode':userInfo.m_hcode, 'cidx':params.idx, 'content':messages[0].text}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                //console.log('임시저장하기: ', resultItem);
                //ToastMessage(resultItem.message);

                console.log('채팅리스트1:::', arrItems);
                setMessages(arrItems);
                
                //setReserveList(arrItems)
            }else{
                //console.log('결과 출력 실패!', resultItem);
                ToastMessage(resultItem.message);
            }
        });


        //setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
    }, [])

    const [checkListImage, setCheckListImage] = useState('');

    const ChatingLists = () => {
      
         Api.send('checklist_chatList', {'id':userInfo.id,  'token':userInfo.appToken, 'hcode':userInfo.m_hcode, 'cidx':params.idx}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                //console.log('임시저장하기: ', resultItem);
                //ToastMessage(resultItem.message);

                // console.log('채팅리스트1:::', arrItems[0]);
                 setCheckListImage(arrItems[0].user.avatar);
                setMessages(arrItems);
                
                //setReserveList(arrItems)
            }else{
                //console.log('결과 출력 실패!', resultItem);
                ToastMessage(resultItem.message);
            }
        });
                
     
    }


    const [chatInfoData, setChatInfoData] = useState('');

    const ChatInfos = () => {
        Api.send('checklist_list', {'id':userInfo.id,  'token':userInfo.appToken, 'hcode':userInfo.m_hcode, 'status':chatCategorys}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                console.log('채팅리스트 헤더: ', arrItems);
                //ToastMessage(resultItem.message);

                let coco = arrItems;
                //console.log('cocococo', coco);
                let coco2 = coco.filter((item)=>{
                    return item.idx == params.idx;
                })

                setChatInfoData(coco2[0]);
                //console.log('ghoiiiio', coco);
                //console.log('채팅리스트1:::', arrItems);
               // setChatDatas(arrItems);
                // /setChatListLoading(false);
                //setReserveList(arrItems)
            }else{
                //console.log('결과 출력 실패!', resultItem);
                ToastMessage(resultItem.message);
            }
        });
    }

    

    useEffect(()=>{
        ChatInfos();
        ChatingLists();
    }, [])



    //채팅방 내용불러오기 처리
    useFocusEffect(
        React.useCallback(() => {
            messaging().onMessage((remoteMessage) => { 
                ChatingLists(); 
            });
            ChatingLists();
        }, [])
    );

    const renderLoading = () => {
        return (
          <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
            <ActivityIndicator size="large" color="#000" />
          </View>
        );
      };






    //푸시 메세지 제어
    useEffect(async() => {
        if (userInfo !== null) {
        // 켜져있는경우
        messaging().onMessage((remoteMessage) => {
            Toast.show({
            type: 'info', // success | error | info
            position: 'top',
            text1: remoteMessage.notification.title,
            text2: remoteMessage.notification.body,
            visibilityTime: 3000,
            autoHide: true, // true | false,
            topOffset: Platform.OS === 'ios' ? 66 + getStatusBarHeight() : 10,
            style: { backgroundColor: 'red' },
            bottomOffset: 100,
            onShow: () => {},
            onHide: () => {},
            onPress: () => {
                if (remoteMessage.data.intent === 'ChatView') {

                    console.log(remoteMessage);

                    navigation.navigate('ChatView', {
                        idx: remoteMessage.data.aidx,
                        cidx: remoteMessage.data.cidx,                
                        fid: remoteMessage.data.to_id,
                        nick: remoteMessage.data.nick,
                        photo: remoteMessage.data.photo,
                    });
                    Toast.hide();
                } 
            },
            });
        });
        // 포그라운드
        messaging().onNotificationOpenedApp((remoteMessage) => {
            // console.log('onNotificationOpenedApp', remoteMessage);
            if (remoteMessage.data !== null) {
                if (remoteMessage.data.intent === 'ChatView') {
                    navigation.navigate('ChatView', {
                    idx: remoteMessage.data.aidx,
                    cidx:remoteMessage.data.cidx,              
                    fid: remoteMessage.data.to_id,
                    nick: remoteMessage.data.nick,
                    photo: remoteMessage.data.photo,
                    });
                } 
            }
        });
        // 백그라운드
        messaging()
            .getInitialNotification()
            .then((remoteMessage) => {
            // console.log('getInitialNotification', remoteMessage);
            if (remoteMessage?.data !== null) {
                if (remoteMessage.data.intent === 'ChatView') {
                    navigation.navigate('ChatView', {
                        idx: remoteMessage.data.aidx,
                        cidx:remoteMessage.data.cidx,
                        fid: remoteMessage.data.to_id,
                        nick: remoteMessage.data.nick,
                        photo: remoteMessage.data.photo,
                    });
                } 
            }
            });
            //const unsubscribe = await dynamicLinks().onLink(handleDynamicLink);
            //return () => unsubscribe();
        }
    }, []);

    return (
        <Box flex={1} backgroundColor='#fff'>
            {/* <HeaderComponents navigation={navigation} headerTitle='채팅' /> */}
            <Box >
                <HStack alignItems='center' px={5} height='55px'  backgroundColor='#F7F8FB'>
                    <TouchableOpacity
                        onPress={()=>{ navigation.goBack() }}
                        
                    >
                        <Image source={require('../images/headerArr.png')} alt='뒤로가기' />
                    </TouchableOpacity>
                    {
                        chatInfoData != '' &&
                        <Box ml={5}>
                            <Box >
                                <Image source={{uri:chatInfoData.upfile}} style={{width:40, height:40, resizeMode:'cover', borderRadius:10}} alt={params.name} />
                            </Box>
                        </Box>
                    }
                    {
                        chatInfoData != '' &&
                        <Box ml={2.5}>
                            <DefText text={chatInfoData.name} style={{fontSize:14, fontFamily:Font.NotoSansMedium}} />
                            <DefText text='Medical Assistant' style={{fontSize:14, color:'#696969'}} />
                        </Box>
                    }
                    
                </HStack>
            </Box>
            <GiftedChat
                messages={messages}
                onSend={messages => onSend(messages)}
                label='전송'
                
                user={{
                    _id: userInfo.id,
                }}
                color={'#f00'}
                renderDay={renderDay}
                placeholder="메세지를 입력하세요"
                alignTop
                alwaysShowSend
                scrollToBottom
                autoCapitalize="none"
                locale={'ko'}
                timeFormat={'LT'}
                color={'#333333'}
                renderAvatarOnTop
                renderTime={ChatTime}
                renderMessage={renderMessage}
                renderBubble={renderBubble}
                renderLoading={renderLoading}
                messagesContainerStyle={{ backgroundColor: '#ffffff', paddingBottom:20 }}
                textInputProps={{ autoCapitalize: 'none' }}
                showUserAvatar={false}
                
                />
        </Box>
    )
};

export default connect(
    ({ User }) => ({
        userInfo: User.userInfo, //회원정보
    }),
    (dispatch) => ({
        member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
        member_info: (user) => dispatch(UserAction.member_info(user)), //회원 정보 조회
        
    })
)(ChatView);