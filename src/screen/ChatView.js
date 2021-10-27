import React, { useState, useCallback, useEffect } from 'react';
import { Box, VStack, HStack, Image, CheckIcon, Input, Modal } from 'native-base';
import { TouchableOpacity, Dimensions, ScrollView, StyleSheet, Alert } from 'react-native';
import {DefInput, DefText} from '../common/BOOTSTRAP';
import HeaderFood from '../components/HeaderFood';
import HeaderComponents from '../components/HeaderComponents';
import { GiftedChat } from 'react-native-gifted-chat';

const ChatView = (props) => {

    const {navigation} = props;

    const [messages, setMessages] = useState([]);

    useEffect(() => {
        setMessages([
            {
                _id: 1,
                text: 'Hello developer',
                createdAt: new Date(),
                user: {
                _id: 2,
                name: 'React Native',
                avatar: 'https://placeimg.com/140/140/any',
                },
            },
        ])
    }, [])

    const onSend = useCallback((messages = []) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
    }, [])

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderComponents navigation={navigation} headerTitle='채팅' />
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