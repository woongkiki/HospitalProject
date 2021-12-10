import React, {useState, useEffect} from 'react';
import { ScrollView, Dimensions, TouchableOpacity, StyleSheet, Platform, Alert, Text } from 'react-native';
import { Box, VStack, HStack, Image, Input, Modal } from 'native-base';
import HeaderOrders from '../components/HeaderOrders';
import { DefText } from '../common/BOOTSTRAP';
import { numberFormat } from '../common/dataFunction';

const OrderComplete = (props) => {

    const {navigation, route} = props;

    const {params} = route;

    console.log('파라미터:::',params);

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
                    <Box alignItems='center'>
                        <DefText text='주문완료' style={{fontSize:17, lineHeight:20}} />
                    </Box>
                    <Box p={5} borderWidth={1} borderColor='#666' mt={5}>
                        <HStack justifyContent='space-between' alignItems='center'>
                            <Box>
                                <DefText text={params.itemTitle + '(2개)'} />
                                {
                                    params.itemOptionName != '' &&
                                    <DefText text={params.itemOptionName + ':' + params.itemOptionTitle + ' (+' + params.itemOptionPrice + '원)'} style={{fontSize:13, color:'#666', marginTop:5}}/>
                                }
                            </Box>
                            
                            <DefText text={ numberFormat(params.itemPrice) + '원'} />
                        </HStack>
                    </Box>

                    <Box mt={10}>
                        <DefText text={'주문 감사드립니다.'+`\n`+'배송이 시작되면 알림을 보내드립니다.'} style={{textAlign:'center'}} />
                    </Box>
                   
                    

                </Box>
            </ScrollView>
            <Box px={5} py={2.5}>
                <TouchableOpacity onPress={()=>navigation.navigate('OrderList')} style={[styles.buttonDefWhite]}>
                    <DefText text='주문내역' style={[styles.buttonDefText, {color:'#666'}]} />
                </TouchableOpacity>
                <TouchableOpacity onPress={navigationMove} style={[styles.buttonDef]}>
                    <DefText text='메인으로' style={styles.buttonDefText} />
                </TouchableOpacity>
                
            </Box>
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
        marginTop:10,
    },
    buttonDefWhite:{
        height:40,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#fff',
        borderRadius:5,
        
        borderWidth:1,
        borderColor:'#666'
    },
    buttonDefText:{
        fontSize:14,
        color:'#fff'
    }
})

export default OrderComplete;