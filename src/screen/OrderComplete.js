import React, {useState, useEffect} from 'react';
import { ScrollView, Dimensions, TouchableOpacity, StyleSheet, Platform, Alert, Text } from 'react-native';
import { Box, VStack, HStack, Image, Input, Modal } from 'native-base';
import HeaderOrders from '../components/HeaderOrders';
import { DefText } from '../common/BOOTSTRAP';
import { numberFormat } from '../common/dataFunction';

const OrderComplete = (props) => {

    const {navigation, route} = props;

    const {params} = route;

    const navigationMove = () => {
        navigation.navigate('Tab_Navigation', {
            screen: 'Home',
            
        });
    }

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderOrders headerTitle='주문완료' />
            <ScrollView>
                <Box p={5}>
                    <Text>
                        주문 감사드립니다. {'\n'}
                        배송이 시작되면 알림을 보내드립니다.
                    </Text>
                   
                    <TouchableOpacity onPress={navigationMove} style={[styles.buttonDef]}>
                        <DefText text='메인으로 이동...' style={styles.buttonDefText} />
                    </TouchableOpacity>

                </Box>
            </ScrollView>
        </Box>
    );
};

const styles = StyleSheet.create({
    buttonDef:{
        height:40,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#666',
        borderRadius:5,
        marginTop:20,
    },
    buttonDefText:{
        fontSize:14,
        color:'#fff'
    }
})

export default OrderComplete;