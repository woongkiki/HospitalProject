import React, {useState, useEffect} from 'react';
import { TouchableOpacity, Dimensions, View, Text, ScrollView, StyleSheet, FlatList, ImageBackground, Alert } from 'react-native';
import { Box, Image, HStack, Input, Modal, VStack } from 'native-base';
import { DefText } from '../common/BOOTSTRAP';
import HeaderComponents from '../components/HeaderComponents';
import { orderDataList } from '../Utils/DummyData';
import { numberFormat } from '../common/dataFunction';

const OrderList = ( props ) => {

    const {navigation} = props;

    const orderDataR = orderDataList.map((item,index)=>{

        console.log(item.orderItems);

        const orderDataItems = item.orderItems.map((order, indexOrder)=>{

            const sumPrice = order.orderPrice + order.orderOptionsPrice;


            return(
                <>
                    <HStack key={indexOrder} justifyContent='space-between' style={indexOrder != 0 && {marginTop:10}} pb={2.5} >
                        <Box>
                            <DefText text={order.orderTitle} style={styles.orderItemTitle} />
                            <HStack mt={1}>
                                <DefText text={order.orderOptions} style={[styles.orderOptionTitle, {marginRight:5}]} />
                                <DefText text={"(+"+numberFormat(order.orderOptionsPrice)+")"} style={styles.orderOptionTitle} />
                            </HStack>
                        </Box>
                        <Box  justifyContent='flex-end'>
                            <DefText text={numberFormat(sumPrice)+'원'} style={styles.orderOptionTitle}  />
                        </Box>
                    </HStack>
                    
                </>
            )
        });

        return(
            <Box key={index} style={index != 0 && {marginTop:20}}>
                <DefText text={'주문번호 : ' + item.orderIdx} style={styles.orderNumberText} />
                <Box p={2.5} borderWidth={1} borderColor='#999' mt={2.5}>
                    <Box borderBottomWidth={1} borderBottomColor='#999'>
                    {orderDataItems}
                    </Box>
                    <HStack alignItems='center' justifyContent='space-between' mt={2.5}>
                        <DefText text='총 결제금액' style={styles.orderOptionTitle} />
                        <DefText text={numberFormat(item.orderTotalSum)+'원'} style={styles.orderTitle} />
                    </HStack>
                </Box>
            </Box>
        )
    })

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderComponents headerTitle='주문내역' navigation={navigation} />
            <ScrollView>
                <Box p={5}>
                    {orderDataR}
                </Box>
            </ScrollView>
        </Box>
    );
};

const styles = StyleSheet.create({
    orderNumberText : {
        fontSize:14,

    },
    orderItemTitle : {
        fontSize:16,
        color:'#000',
        fontWeight:'bold'
    },
    orderTitle : {
        fontSize:15,
    },
    orderOptionTitle : {
        fontSize:13,
    }
})

export default OrderList;