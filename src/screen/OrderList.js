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

const OrderList = ( props ) => {

    const {navigation, userInfo} = props;

    const [orderListData, setOrderListData] = useState([]);

    const OrderListRequest = () => {
        Api.send('order_list', {'id':userInfo.id, 'token':userInfo.appToken}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;

            if(resultItem.result === 'Y' && arrItems) {
              // console.log('내 주문목록: ', arrItems[0].product);

               setOrderListData(arrItems)
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
                <Box p={5}>
                    {
                        orderListData.map((item, index)=> {
                            return(
                                <Box key={index} style={index != 0 && {marginTop:20}}>
                                    <DefText text={'주문번호 : ' + item.orderid} style={styles.orderNumberText} />
                                    <Box p={2.5} borderWidth={1} borderColor='#999' mt={2.5}>
                                        <Box borderBottomWidth={1} borderBottomColor='#999'>
                                            {
                                                item.product.length > 0 &&
                                                item.product.map((items, index1) => {
                                                    return(
                                                        <HStack key={index1} justifyContent='space-between' style={index1 != 0 && {marginTop:10}} pb={2.5} >
                                                            <Box>
                                                                <DefText text={items.name} style={styles.orderItemTitle} />
                                                                <HStack mt={1}>
                                                                    <DefText text={items.option} style={[styles.orderOptionTitle, {marginRight:5}]} />
                                                                    <DefText text={"(+"+numberFormat(items.amount)+")"} style={styles.orderOptionTitle} />
                                                                </HStack>
                                                            </Box>
                                                            <Box  justifyContent='flex-end'>
                                                                <DefText text={numberFormat(items.price)+'원'} style={styles.orderOptionTitle}  />
                                                            </Box>
                                                        </HStack>
                                                    )
                                                })
                                            }
                                        </Box>
                                        <HStack alignItems='center' justifyContent='space-between' mt={2.5}>
                                            <DefText text='총 결제금액' style={styles.orderOptionTitle} />
                                            <DefText text={numberFormat(item.total_price)+'원'} style={styles.orderTitle} />
                                        </HStack>
                                    </Box>
                                </Box>
                            )
                        })
                    }
                </Box>
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