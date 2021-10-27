import React, {useState, useEffect} from 'react';
import { ScrollView, Dimensions, TouchableOpacity, StyleSheet, Platform, Alert } from 'react-native';
import { Box, VStack, HStack, Image, Input, Modal } from 'native-base';
import HeaderComponents from '../components/HeaderComponents';
import { DefText } from '../common/BOOTSTRAP';
import { numberFormat } from '../common/dataFunction';

const {width} = Dimensions.get('window');

const OrderForm = (props) => {

    const {navigation, route} = props;

    const {params} = route;

    console.log('주문폼::::',params);

    const [orderName, setOrderName] = useState('');
    const orderNameChange = (text) => {
        setOrderName(text);
    }

    const [orderPhoneNumber, setOrderPhoneNumber] = useState('010-1234-5678');
    const phoneNumberChange = (phone) => {
        setOrderPhoneNumber(phone);
    }


    //배송지정보
    const [baesongInfo, setBaesongInfo] = useState('');
    const baesongChange = (baesong) => {
        setBaesongInfo(baesong);
    }

    //주소정보
    const [addrText, setAddrText] = useState('');
    const addrChange = (addr) => {
        setAddrText(addr);
    }

    //추가주소정보
    const [addrText2, setAddrText2] = useState('');
    const addrTextChange2 = (addr2) => {
        setAddrText2(addr2);
    }

    //포인트
    const [myPoint, setMyPoint] = useState('1000');

    //포인트 인풋
    const [pointInput, setPointInput] = useState('0');
    const pointChange = (point) => {
        setPointInput(point);
    }

    const [payStatus, setPayStatus] = useState('');

    const [modalStatue, setModalStatus] = useState(false);

    console.log(params.par.option)

    useEffect(()=>{
        if(params != undefined){
            setOrderName(params.par.itemTitle);
        }
    }, [])

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderComponents headerTitle='주문정보 입력' navigation={navigation} />
            <ScrollView>
                <Box p={5}>
                    <Box>
                        <DefText text='주문자 정보' style={styles.orderInfoLable} />
                        <Box>
                            <DefText text='주문자명' style={styles.orderInfoSubTitle} />
                            <Input
                                placeholder='주문자명'
                                height='45px'
                                value={orderName}
                                onChangeText={orderNameChange}
                                _focus='transparent'
                            />
                        </Box>
                        <Box mt={5}>
                            <DefText text='주문자 연락처' style={styles.orderInfoSubTitle} />
                            <Input
                                placeholder='주문자 연락처'
                                height='45px'
                                value={orderPhoneNumber}
                                onChangeText={phoneNumberChange}
                                _focus='transparent'
                            />
                        </Box>
                        <Box mt={5}>
                            <DefText text='배송지정보' style={styles.orderInfoSubTitle} />
                            <HStack justifyContent='space-between'>
                                <Input
                                    placeholder='지번'
                                    width={(width-40)*0.6}
                                    height='45px'
                                    value={baesongInfo}
                                    onChangeText={baesongChange}
                                    _focus='transparent'
                                />
                                <TouchableOpacity style={{width:(width-40)*0.37, height:45, alignItems:'center', justifyContent:'center', borderRadius:5, borderWidth:1,borderColor:'#999'}}>
                                    <DefText text='주소찾기' style={{fontSize:14}} />
                                </TouchableOpacity>
                            </HStack>
                            <Box mt={2.5}>
                                <Input 
                                    placeholder='상세주소를 입력하세요.'
                                    height='45px'
                                    value={addrText}
                                    onChangeText={addrChange}
                                    _focus='transparent'
                                />
                            </Box>
                            <Box mt={2.5}>
                                <Input 
                                    placeholder='추가주소를 입력하세요.'
                                    height='45px'
                                    value={addrText2}
                                    onChangeText={addrTextChange2}
                                    _focus='transparent'
                                />
                            </Box>
                        </Box>
                        <Box mt={5}>
                            <DefText text='포인트 사용' style={styles.orderInfoLable} />
                            <Box>
                                <Box>
                                    <DefText text={'사용가능한 포인트 : ' + numberFormat(myPoint) + 'P'} style={{fontSize:13, color:'#666'}} />
                                </Box>
                                <HStack justifyContent='space-between' mt={2.5}>
                                    <Input
                                        placeholder='포인트 입력'
                                        width={(width-40)*0.75}
                                        height='45px'
                                        value={pointInput}
                                        onChangeText={pointChange}
                                        _focus='transparent'
                                        keyboardType='number-pad'
                                    />
                                    <TouchableOpacity onPress={()=>setPointInput(myPoint)} style={{width:(width-40)*0.22, height:45, alignItems:'center', justifyContent:'center', borderRadius:5, borderWidth:1,borderColor:'#999'}}>
                                        <DefText text='전액사용' style={{fontSize:14}} />
                                    </TouchableOpacity>
                                </HStack>
                            </Box>
                        </Box>
                        <Box mt={5}>
                            <DefText text='주문상품' style={styles.orderInfoLable} />
                            <Box  borderBottomWidth={1} borderBottomColor='#dfdfdf' pb={2.5}>
                                <HStack>
                                    <DefText text={orderName} style={{fontSize:15}} />
                                    <DefText text={' ('+params.counts+'개)'} />
                                </HStack>
                                
                                {
                                    params.optionChk != '' && 
                                    <HStack mt={2.5}>
                                        <DefText text={params.optionChk} style={[styles.optionText, {marginRight:5}]} />
                                        <DefText text={ "(+" + params.optionPrice + ")"} style={[styles.optionText]} />
                                    </HStack>
                                }
                                <Box mt={5}>
                                    <HStack justifyContent='space-between'>
                                        <DefText text={'상품금액'} style={styles.priceText} />
                                        <DefText text={numberFormat(params.priceFix) + '원'} style={styles.priceText} />
                                    </HStack>
                                    <HStack justifyContent='space-between' mt={2.5}>
                                        <DefText text={'포인트사용'} style={styles.priceText} />
                                        <DefText text={ "- " + numberFormat(pointInput) + '원'} style={styles.priceText} />
                                    </HStack>
                                </Box>
                            </Box>
                            <Box mt={5}>
                                <HStack justifyContent='space-between'>
                                    <DefText text='최종결제금액' style={styles.totalPrice} />
                                    <DefText text={ numberFormat(params.priceFix - pointInput) + "원"} style={styles.totalPrice} />
                                </HStack>
                            </Box>
                        </Box>
                        <Box mt={10}>
                            <DefText text='결제수단 선택' style={styles.orderInfoLable} />
                            <VStack>
                                <TouchableOpacity style={[styles.payButton, payStatus === '신용카드' && {backgroundColor:'#aaa'}]} onPress={()=>{setPayStatus('신용카드')}}>
                                    <DefText text='신용카드' style={[styles.payButtonText, payStatus === '신용카드' && {color:'#fff'} ]} />
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.payButton, {marginTop:10}, payStatus === '실시간 계좌이체' && {backgroundColor:'#aaa'}]} onPress={()=>{setPayStatus('실시간 계좌이체')}}>
                                    <DefText text='실시간 계좌이체' style={[styles.payButtonText, payStatus === '실시간 계좌이체' && {color:'#fff'}]} />
                                </TouchableOpacity>
                            </VStack>
                        </Box>
                        <Box mt={10}>
                            <TouchableOpacity style={styles.paySubmitButton} onPress={()=>setModalStatus(true)}>
                                <DefText text='결제하기' style={styles.paySubmitText} />
                            </TouchableOpacity>
                        </Box>
                    </Box>
                </Box>
            </ScrollView>
            <Modal isOpen={modalStatue} onClose={() => setModalStatus(false)}>
            
                <Modal.Content maxWidth={width-40}>
                    <Modal.Body>
                        
                        <DefText text={orderName+' 상품을 구매합니다.'}  />
                        <TouchableOpacity style={[styles.paySubmitButton, {marginTop:10}]} onPress={()=>{navigation.navigate('OrderComplete', { itemTitle:orderName, itemPrice: params.priceFix - pointInput, 'optionName':params.optionChk, 'optionPrice':params.optionPrice})}}>
                            <DefText text='결제하기' style={styles.paySubmitText} />
                        </TouchableOpacity>
                    </Modal.Body>
                </Modal.Content>
            </Modal>
        </Box>
    );
};

const styles = StyleSheet.create({
    orderInfoLable: {
        fontSize:17,
        color:'#000',
        fontWeight:'bold',
        marginBottom:10
    },
    orderInfoSubTitle: {
        fontSize:15,
        color:'#333',
        marginBottom:10,
    },
    optionText: {
        fontSize:13,
        color:'#666'
    },
    priceText: {
        fontSize:13,
        color:'#333'
    },
    totalPrice : {
        fontSize:16,
        color:'#000',
        fontWeight:'bold'
    },
    payButton: {
        height:40,
        borderRadius:5,
        borderWidth:1,
        borderColor:'#aaa',
        justifyContent:'center',
        alignItems:'center'
    },
    payButtonText: {
        fontSize:14,
        color:'#333'
    },
    paySubmitButton : {
        height:40,
        backgroundColor:'#666',
        borderRadius:5,
        alignItems:'center',
        justifyContent:'center'
    },
    paySubmitText: {
        fontSize:14,
        color:'#fff'
    }
})

export default OrderForm;