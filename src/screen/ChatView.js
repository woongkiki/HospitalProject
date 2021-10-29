import React, { useState, useCallback, useEffect } from 'react';
import { Box, VStack, HStack, Image, CheckIcon, Input, Modal } from 'native-base';
import { TouchableOpacity, Dimensions, ScrollView, StyleSheet, Alert } from 'react-native';
import {DefInput, DefText} from '../common/BOOTSTRAP';
import HeaderFood from '../components/HeaderFood';
import HeaderComponents from '../components/HeaderComponents';
import { GiftedChat } from 'react-native-gifted-chat';

const ChatView = (props) => {

    const {navigation, route} = props;

    const {params} = route;

    console.log(params);

    const [messages, setMessages] = useState([]);

    useEffect(() => {
        setMessages([
            {
                _id: 1,
                text: '안녕하세요 반갑습니다.',
                createdAt: new Date(),
                user: {
                _id: 2,
                name: params.chatDoctor,
                avatar: params.imgUrl,
                },
            },
        ])
    }, [])

    const onSend = useCallback((messages = []) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
    }, [])

    return (
        <Box flex={1} backgroundColor='#fff'>
            {/* <HeaderComponents navigation={navigation} headerTitle='채팅' /> */}
            <Box>
                <HStack alignItems='center' px={5} py={2.5} backgroundColor='#F7F8FB'>
                    <TouchableOpacity
                        onPress={()=>{ navigation.goBack() }}
                        
                    >
                        <Image source={require('../images/headerArr.png')} alt='뒤로가기' />
                    </TouchableOpacity>
                    <Box ml={5}>
                        <Box width='50px' height='50px' borderRadius='50px' overflow='hidden'>
                            <Image source={{uri:params.imgUrl}} style={{width:50, height:50, resizeMode:'contain'}} alt={params.chatDoctor} />
                        </Box>
                    </Box>
                    <Box ml={2.5}>
                        <DefText text={params.chatDoctor} style={{fontSize:14}} />
                        <DefText text='Medical Assistant' style={{fontSize:14, marginTop:10, color:'#666'}} />
                    </Box>
                </HStack>
            </Box>
            <GiftedChat
            messages={messages}
            onSend={messages => onSend(messages)}
            user={{
                _id: 1,
            }}
            />
        </Box>
    )
};

export default ChatView;