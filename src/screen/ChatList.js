import React from 'react';
import { View, TouchableOpacity, Text, Dimensions, FlatList, Platform } from 'react-native';
import { Box, VStack, HStack } from 'native-base';
import HeaderComponents from '../components/HeaderComponents';
import HeaderMain from '../components/HeaderMain';

const ChatList = ( props ) => {

    const {navigation} = props;

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderMain navigation={navigation} />
        </Box>
    );
};

export default ChatList;