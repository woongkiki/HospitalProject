import React, {useState, useEffect} from 'react';
import { ScrollView, Dimensions, View, Text, Platform, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Box, HStack, VStack, Image } from 'native-base';
import { DefText } from '../common/BOOTSTRAP';
import HeaderDefault from '../components/HeaderDefault';
import {myChatList, myChatListComplete, myChatListIng} from '../Utils/DummyData';
import ToastMessage from '../components/ToastMessage';
import { StackActions } from '@react-navigation/native';
import { connect } from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import Api from '../Api';
import AsyncStorage from '@react-native-community/async-storage';
import {textLengthOverCut} from '../common/dataFunction';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import Font from '../common/Font';

const { width, height } = Dimensions.get('window');
const RightContWidth = (width - 40) - 90;

const ChatingList = (props) => {

    const { navigation, userInfo, member_info } = props;

    const [chatListLoading, setChatListLoading] = useState(true); // 로딩화면

    const [chatCategorys, setChatCategorys] = useState(''); //카테고리

    const [chatDatas, setChatDatas] = useState('');// 채팅내역 데이터

    const isFocused = useIsFocused();
 
    useEffect(() => {
      
      if (isFocused){
        chatlistReceive();
        
      } 
        
    }, [isFocused]);


    //console.log(userInfo);
   

    //처음 렌더링시 로딩화면 추가
    useEffect(()=>{
       
        setChatListLoading(false);
        //console.log(chatListLoading);
    },[])



    const ChatingButtons = (status) => {

        console.log(status);

        if(status.hmidx == null){
            ToastMessage('현재 담당자를 배정 중인 채팅입니다.');
            return false;
        }else{
            navigation.navigate('ChatView', status);
        }

    }


    //채팅리스트 가져오기
    const chatlistReceive = async () => {

        await setChatListLoading(true);



             
        await Api.send('checklist_list', {'id':userInfo.id,  'token':userInfo.appToken, 'hcode':userInfo.m_hcode, 'status':chatCategorys}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                console.log('채팅리스트: ', resultItem);
                //ToastMessage(resultItem.message);

                //console.log('채팅리스트1:::', arrItems);
                setChatDatas(arrItems);
                setChatListLoading(false);
                //setReserveList(arrItems)
            }else{
                //console.log('결과 출력 실패!', resultItem);
                ToastMessage(resultItem.message);
            }
        });
                
   
        await setChatListLoading(false);

  
        
    }

    useEffect(()=>{
        chatlistReceive();
    }, [])
    

     //카테고리 클릭시 카테고리 변경
     const ChatCategoryChanges = (category) => {

        
        setChatCategorys(category);
        
    }


    useEffect(()=>{
        console.log(chatCategorys);
        chatlistReceive();
    }, [chatCategorys])

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderDefault headerTitle='채팅내역' navigation={navigation} />
            {
                chatListLoading ? 
                <Box justifyContent='center' alignItems='center' flex={1}>
                    <ActivityIndicator size={'large'} color="#333" />
                </Box>
                :
                <ScrollView>
                    <Box p={5}>
                        <DefText text='원하시는 태그를 선택하시면 보다 쉽게 검색이 가능합니다.' style={{color:'#000', fontFamily:Font.NotoSansMedium}} />
                        <HStack pt={2.5}>
                            <TouchableOpacity onPress={()=>ChatCategoryChanges('')} style={[styles.chatCategory, chatCategorys === '' && {backgroundColor:'#666'} ]}>
                                <DefText text='전체' style={[styles.chatCategoryText, chatCategorys === '' && {color:'#fff'}]} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>ChatCategoryChanges('Y')} style={[styles.chatCategory, chatCategorys === 'Y' && {backgroundColor:'#666'}]}>
                                <DefText text='진행중' style={[styles.chatCategoryText, chatCategorys === 'Y' && {color:'#fff'}]} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>ChatCategoryChanges('N')}  style={[styles.chatCategory, chatCategorys === 'N' && {backgroundColor:'#666'}]}>
                                <DefText text='완료' style={[styles.chatCategoryText, chatCategorys === 'N' && {color:'#fff'}]} />
                            </TouchableOpacity>
                        </HStack>
                        {
                            chatDatas.length != '0' ?
                            chatDatas.map((item, index)=>{
                                return (
                                    <TouchableOpacity key={index} style={[styles.chatListButton, index == 0 && {borderTopColor:'#f1f1f1', borderTopWidth:1, marginTop:20}]} onPress={()=>ChatingButtons(item)}>
                                        <HStack>
                                            <Image source={{uri:item.upfile}} alt='123' style={{width:width * 0.2, height:width * 0.2, resizeMode:'cover', borderRadius:10}} />
                                            <VStack width={RightContWidth} px={3} justifyContent='space-around'>
                                                <HStack justifyContent='space-between' width={(width-40)*0.7 + 'px'}>
                                                    <HStack alignItems='center'>
                                                        <DefText text={item.name} style={styles.buttonDoctorName} />
                                                        <DefText text='Cure Mentor.' style={styles.buttonMentorText} />
                                                    </HStack>
                                                    <Box>
                                                        <DefText text={item.cdate} style={styles.buttonLastTime} />
                                                    </Box>
                                                </HStack>
                                                <HStack justifyContent='space-between' alignItems='center' width={(width-40)*0.7 + 'px'}>
                                                    <VStack>
                                                        <Text style={styles.buttonContentText}>
                                                            자문내용 : {textLengthOverCut(item.pain, 18)}
                                                        </Text>
                                                        <Text style={styles.buttonContentText}>
                                                            상담결과 : {item.statusStr}
                                                        </Text>
                                                    </VStack>
                                                    {/* <Box 
                                                        style={[
                                                            styles.buttonCategoryBox,
                                                            item.chatCategory === '완료' &&
                                                            {backgroundColor:'#D2D2D2'}
                                                        ]}>
                                                        <DefText text={item.chatCategory} style={styles.buttonCategoryText} />
                                                    </Box> */}
                                                </HStack>
                                            </VStack>
                                        </HStack>
                                    </TouchableOpacity>
                                )
                            })
                            
                            :
                            <Box justifyContent='center' alignItems='center' height={height- 250}>
                                <DefText text='채팅내역 목록이 없습니다.' style={{color:'#696969'}} />
                            </Box>
                        }
                    </Box>
                </ScrollView>
            }
            
        </Box>
    );
};

const styles = StyleSheet.create({
    chatCategory : {
        height:30,
        paddingHorizontal:10,
        backgroundColor:'#f1f1f1',
        alignItems:'center',
        justifyContent:'center',
        borderRadius:10,
        marginRight:10
    },
    chatCategoryText : {
        fontSize: 14,
        color:'#000',
        fontWeight:'500',
        fontFamily:Font.NotoSansMedium,
    },
    chatListButton: {
        borderBottomWidth:1,
        borderBottomColor:'#f1f1f1',
        paddingVertical:15
    },
    buttonDoctorName : {
        fontSize:14,
        color:'#000',
        fontWeight:'bold',
        marginRight:10,
    },
    buttonMentorText: {
        fontSize:12,
        color:'#333',
        fontWeight:'300'
    },
    buttonLastTime : {
        fontSize:14,
        color:'#000',
        fontWeight:'bold'
    },
    buttonContentText: {
        fontSize:14,
        color:'#333',
        fontWeight:'400'
    },
    buttonCategoryBox: {
        height:30,
        borderRadius:15,
        backgroundColor:'#5EB5E0',
        alignItems:'center',
        justifyContent:'center',
        paddingHorizontal:10
    },
    buttonCategoryText: {
        fontSize:14,
        color:'#fff',
        fontWeight:'300'
    }
})

export default connect(
    ({ User }) => ({
        userInfo: User.userInfo, //회원정보
    }),
    (dispatch) => ({
        member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
        member_info: (user) => dispatch(UserAction.member_info(user)), //회원 정보 조회
        
    })
)(ChatingList);