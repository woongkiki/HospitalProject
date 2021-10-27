import React, {useState, useEffect} from 'react';
import { ScrollView, Dimensions, View, Text, Platform, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Box, HStack, VStack, Image } from 'native-base';
import { DefText } from '../common/BOOTSTRAP';
import HeaderMain from '../components/HeaderMain';
import {myChatList, myChatListComplete, myChatListIng} from '../Utils/DummyData';

const { width } = Dimensions.get('window');
const RightContWidth = (width - 40) - 90;

const ChatingList = (props) => {

    const { navigation } = props;

    const [chatListLoading, setChatListLoading] = useState(true); // 로딩화면

    const [chatCategorys, setChatCategorys] = useState('전체'); //카테고리

    const [chatDatas, setChatDatas] = useState(myChatList);// 채팅내역 데이터

    //카테고리 클릭시 카테고리 변경
    const ChatCategoryChanges = (category) => {
        setChatCategorys(category);
    }

    //처음 렌더링시 로딩화면 추가
    useEffect(()=>{
       
        setChatListLoading(false);
        //console.log(chatListLoading);
    },[])

    //카테고리에 따른 데이터 변화
    useEffect(()=>{
        setChatListLoading(true);
        if(chatCategorys == '전체'){
            setChatDatas(myChatList)
        }
        if(chatCategorys == '진행중'){
            setChatDatas(myChatListComplete)
        }
        if(chatCategorys == '완료'){
            setChatDatas(myChatListIng)
        }
        setChatListLoading(false);
    },[chatCategorys])

    //채팅내역 컴포넌트
    const _renderItem = ({item, index}) => {
        return(
            <TouchableOpacity style={[ styles.chatListButton]} onPress={()=>navigation.navigate('ChatView')}>
                <HStack>
                    <Image source={{uri:item.imgUrl}} alt={item.chatDoctor} style={{width:70, height:70, resizeMode:'contain'}} />
                    <VStack width={RightContWidth} px={3} justifyContent='space-around'>
                        <HStack justifyContent='space-between'>
                            <HStack alignItems='center'>
                                <DefText text={item.chatDoctor} style={styles.buttonDoctorName} />
                                <DefText text='Cure Mentor.' style={styles.buttonMentorText} />
                            </HStack>
                            <Box>
                                <DefText text='09:21' style={styles.buttonLastTime} />
                            </Box>
                        </HStack>
          
                        <HStack justifyContent='space-between' alignItems='center'>
                            <VStack>
                                <Text style={styles.buttonContentText}>
                                    자문내용 : {item.chatSubject}
                                </Text>
                                <Text style={styles.buttonContentText}>
                                    상담결과 : {item.chatCategory}
                                </Text>
                            </VStack>
                            <Box 
                                style={[
                                    styles.buttonCategoryBox,
                                    item.chatCategory === '완료' &&
                                    {backgroundColor:'#D2D2D2'}
                                ]}>
                                <DefText text={item.chatCategory} style={styles.buttonCategoryText} />
                            </Box>
                        </HStack>
                    </VStack>
                </HStack>
            </TouchableOpacity>
        )
    }
    

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderMain navigation={navigation} />
           
            <Box p={5}>
                <DefText text='원하시는 태그를 선택하시면 보다 쉽게 검색이 가능합니다.' style={{fontSize:15, color:'#666'}} />
                <HStack pt={2.5}>
                    <TouchableOpacity onPress={()=>ChatCategoryChanges('전체')} style={[styles.chatCategory, chatCategorys === '전체' && {backgroundColor:'#666'} ]}>
                        <DefText text='전체' style={[styles.chatCategoryText, chatCategorys === '전체' && {color:'#fff'}]} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>ChatCategoryChanges('진행중')} style={[styles.chatCategory, chatCategorys === '진행중' && {backgroundColor:'#666'}]}>
                        <DefText text='진행중' style={[styles.chatCategoryText, chatCategorys === '진행중' && {color:'#fff'}]} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>ChatCategoryChanges('완료')}  style={[styles.chatCategory, chatCategorys === '완료' && {backgroundColor:'#666'}]}>
                        <DefText text='완료' style={[styles.chatCategoryText, chatCategorys === '완료' && {color:'#fff'}]} />
                    </TouchableOpacity>
                </HStack>
                {
                    chatListLoading ?
                    <Box justifyContent='center' alignItems='center' height={300}>
                        <ActivityIndicator size={'large'} color="#333" />
                    </Box>
                    :
                    <FlatList
                    data={chatDatas}
                    renderItem={_renderItem}
                    keyExtractor={(item, index)=>index.toString()}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <Box py={10} alignItems='center'>
                            <DefText text='채팅내역이 없습니다.' style={{color:'#666'}} />
                        </Box>                
                    }
                />
                }
            </Box>

        </Box>
    );
};

const styles = StyleSheet.create({
    chatCategory : {
        height:30,
        paddingHorizontal:10,
        backgroundColor:'#ddd',
        alignItems:'center',
        justifyContent:'center',
        borderRadius:35,
        marginRight:10
    },
    chatCategoryText : {
        fontSize: 14,
        color:'#333',
    },
    chatListButton: {
        borderBottomWidth:1,
        borderBottomColor:'#666',
        marginTop:20,
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

export default ChatingList;