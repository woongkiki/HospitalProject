import React, {useState, useEffect} from 'react';
import { TouchableOpacity, Dimensions, View, Text, ScrollView, StyleSheet, FlatList, ImageBackground, Alert } from 'react-native';
import { Box, Image, HStack, Input, Modal, VStack } from 'native-base';
import { DefText } from '../common/BOOTSTRAP';
import HeaderComponents from '../components/HeaderComponents';
import { orderDataList } from '../Utils/DummyData';
import { numberFormat } from '../common/dataFunction';
import { connect } from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import ToastMessage from '../components/ToastMessage';
import Api from '../Api';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import Font from '../common/Font';

const OrderList = ( props ) => {

    const {navigation, userInfo} = props;

    const [orderListData, setOrderListData] = useState([]);

    const OrderListRequest = () => {
        Api.send('order_list', {'id':userInfo.id, 'token':userInfo.appToken}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;

            if(resultItem.result === 'Y' && arrItems) {
               console.log('내 주문목록: ', arrItems);

               setOrderListData(arrItems)
               console.log('옵션',arrItems[0].product)
              // setCommunityList(arrItems);

            }else{
                console.log('결과 출력 실패!', resultItem);
               // ToastMessage(resultItem.message);
            }
        });
    }

    useEffect(()=>{
        OrderListRequest();
    }, [])

    const isFocused = useIsFocused();
 
    useEffect(() => {
      
      if (isFocused){
        //console.log('포커스온ㅇㅇㅇㅇㅇ::::::::',props.route.params);
        OrderListRequest()
      } 
        
    }, [isFocused]);

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderComponents headerTitle='주문내역' navigation={navigation} />
           
            {
                orderListData != '' &&
                orderListData.length > 0 ?
                <ScrollView>
                <Box p={5}>
                    {
                        orderListData.map((item, index)=> {
                            return(
                                <Box key={index} style={[{paddingVertical:15, borderBottomWidth:1, borderBottomColor:'#f1f1f1'}, index == 0 && {borderTopColor:'#f1f1f1', borderTopWidth:1}]}>
                                    <DefText text={'주문번호 : ' + item.orderid} style={styles.orderNumberText} />
                                    <Box mt='10px'>
                                        <Box borderBottomWidth={1} borderBottomColor='#a3a3a3'>
                                            {
                                                item.product.length > 0 &&
                                                item.product.map((items, index1) => {
                                                    return(
                                                        <Box key={index1} mb={2.5}>
                                                            <HStack  alignItems='center' justifyContent='space-between' style={index1 != 0 && {marginTop:10}} >
                                                                <Box>
                                                                    <DefText text={items.name} style={[styles.orderItemTitle]} />
                                                                    {
                                                                        items.option != '' && 
                                                                        <DefText text={items.option} style={[styles.orderOptionTitle]} />
                                                                    }
                                                                  
                                                                </Box>
                                                                <Box>
                                                                    <DefText text={numberFormat(items.amount) + '개'} style={[styles.orderOptionTitle]} />
                                                                </Box>
                                                            </HStack>
                                                            <Box alignItems={'flex-end'} justifyContent='flex-end' mt='10px'>
                                                                <DefText text={numberFormat(items.price * items.amount)+'원'} style={styles.orderItemTitle}  />
                                                            </Box>
                                                        </Box>
                                                    )
                                                })
                                            }
                                        </Box>
                                        <HStack alignItems='center' justifyContent='space-between' mt={2.5}>
                                            <DefText text='총 결제금액' style={styles.orderItemTitle} />
                                            <DefText text={numberFormat(item.total_price)+'원'} style={styles.orderItemTitle} />
                                        </HStack>
                                    </Box>
                                </Box>
                            )
                        })
                    }
                </Box>
                </ScrollView>
                :
                <Box flex={1} alignItems='center' justifyContent='center'>
                    <DefText text='주문내역이 없습니다.' />
                </Box>
            }
            
        </Box>
    );
};

const styles = StyleSheet.create({
    orderNumberText : {
       marginBottom:5,
        fontFamily:Font.NotoSansMedium
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
        fontSize:14,
        fontFamily:Font.NotoSansMedium,
        color:'#696969',
    }
})

export default connect(
    ({ User }) => ({
        userInfo: User.userInfo, //회원정보
    }),
    (dispatch) => ({
        member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
        member_info: (user) => dispatch(UserAction.member_info(user)), //회원 정보 조회
        member_logout: (user) => dispatch(UserAction.member_logout(user)), //로그아웃
    })
)(OrderList);