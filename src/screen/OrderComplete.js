import React, {useState, useEffect} from 'react';
import { ScrollView, Dimensions, TouchableOpacity, StyleSheet, Platform, Alert, Text } from 'react-native';
import { Box, VStack, HStack, Image, Input, Modal } from 'native-base';
import HeaderOrders from '../components/HeaderOrders';
import { DefText } from '../common/BOOTSTRAP';
import { numberFormat } from '../common/dataFunction';
import Font from '../common/Font';

const OrderComplete = (props) => {

    const {navigation, route} = props;

    const {params} = route;

    console.log('파라미터:::',params);

    const navigationMove = () => {
        navigation.navigate('Tab_Navigation', {
            screen: 'Home',
            
        });

        // navigation.reset({
        //     routes: [{ screen:'Tab_Navigation', name:'Home', msg:'' }],
        // });
    }

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderOrders headerTitle='주문완료' />
            <ScrollView>
                <Box p={5}>
                   
                    <Box p={5} backgroundColor='#fff' shadow={8} borderRadius={10}>
                       
                            <Box>
                                <HStack justifyContent={'space-between'}>
                                    <DefText text={'상품명 : ' + params.itemTitle} />
                                    <DefText text={params.amount + '개'} />
                                </HStack>
                                {
                                    params.itemOptionName != '' &&
                                    <DefText text={params.itemOptionTitle + ' : ' + params.itemOptionName + ' (+' + params.itemOptionPrice + '원)'} style={{fontSize:14, color:'#696969', marginTop:5}}/>
                                }
                            </Box>
                            
                            <Box alignItems={'flex-end'} mt={5}>
                                <DefText text={ '총금액 : ' + numberFormat(params.itemPrice) + '원'} style={{fontFamily:Font.NotoSansBold}} />
                            </Box>
                
                    </Box>

                    <Box mt={'40px'}>
                        <DefText text={'주문 감사드립니다.'+`\n`+'배송이 시작되면 알림을 보내드립니다.'} style={{textAlign:'center', color:'#696969', fontFamily:Font.NotoSansMedium}} />
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
        height:45,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#090A73',
        borderRadius:10,
        marginTop:10,
    },
    buttonDefWhite:{
        height:45,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#fff',
        borderRadius:10,
        
        borderWidth:1,
        borderColor:'#696969'
    },
    buttonDefText:{
        color:'#fff',
        fontFamily:Font.NotoSansMedium
    }
})

export default OrderComplete;