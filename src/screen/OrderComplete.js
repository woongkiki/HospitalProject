import React, {useState, useEffect} from 'react';
import { ScrollView, Dimensions, TouchableOpacity, StyleSheet, Platform, Alert, Text } from 'react-native';
import { Box, VStack, HStack, Image, Input, Modal } from 'native-base';
import HeaderComponents from '../components/HeaderComponents';
import { DefText } from '../common/BOOTSTRAP';
import { numberFormat } from '../common/dataFunction';

const OrderComplete = (props) => {

    const {navigation, route} = props;

    const {params} = route;

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderComponents headerTitle='주문완료' navigation={navigation} />
            <ScrollView>
                <Box p={5}>
                    <Text>
                        주문 감사드립니다. {'\n'}
                        배송이 시작되면 알림을 보내드립니다.
                    </Text>
                </Box>
            </ScrollView>
        </Box>
    );
};

export default OrderComplete;