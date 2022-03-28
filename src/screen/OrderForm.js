import React, {useState, useEffect} from 'react';
import { ScrollView, Dimensions, TouchableOpacity, StyleSheet, Platform, Alert, ActivityIndicator } from 'react-native';
import { Box, VStack, HStack, Image, Input, Modal, CheckIcon } from 'native-base';
import HeaderComponents from '../components/HeaderComponents';
import { DefInput, DefText } from '../common/BOOTSTRAP';
import { numberFormat } from '../common/dataFunction';
import Api from '../Api';
import { connect } from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import ToastMessage from '../components/ToastMessage';
import Font from '../common/Font';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import HTML from 'react-native-render-html';
import StyleHtml from '../common/StyleHtml';

Date.prototype.format = function(f) {
    if (!this.valueOf()) return " ";
 
    var weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    var d = this;
     
    return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function($1) {
        switch ($1) {
            case "yyyy": return d.getFullYear();
            case "yy": return (d.getFullYear() % 1000).zf(2);
            case "MM": return (d.getMonth() + 1).zf(2);
            case "dd": return d.getDate().zf(2);
            case "E": return weekName[d.getDay()];
            case "HH": return d.getHours().zf(2);
            case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2);
            case "mm": return d.getMinutes().zf(2);
            case "ss": return d.getSeconds().zf(2);
            case "a/p": return d.getHours() < 12 ? "오전" : "오후";
            default: return $1;
        }
    });
};
 
String.prototype.string = function(len){var s = '', i = 0; while (i++ < len) { s += this; } return s;};
String.prototype.zf = function(len){return "0".string(len - this.length) + this;};
Number.prototype.zf = function(len){return this.toString().zf(len);};

const {width} = Dimensions.get('window');

const OrderForm = (props) => {

    const {navigation, route, userInfo} = props;

    const {params} = route;

    //console.log('주문폼::::',params);

    const [orderName, setOrderName] = useState('');
    const orderNameChange = (text) => {
        setOrderName(text);
    }

    const [orderPhoneNumber, setOrderPhoneNumber] = useState('');
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
    const [myPoint, setMyPoint] = useState(0);

    //포인트 인풋
    const [pointInput, setPointInput] = useState('0');
    const pointChange = (point) => {

        
        setPointInput(point);
    }

    const [payStatus, setPayStatus] = useState('');

    const [modalStatue, setModalStatus] = useState(false);

    //console.log(params.par.option)

    // useEffect(()=>{
    //     if(params != undefined){
    //         setOrderName(params.par.itemTitle);
    //     }
    // }, [])

    const [orderLoading, setOrderLoading] = useState(true);

    const [memberData, setMemberData] = useState('');

    const [orderItemName, setOrderItemName] = useState('');
    const [orderItemOption, setOrderItemOption] = useState('');
    const [orderItemCount, setOrderItemCount] = useState('');
    const [orderAmount, setOrderAmount] = useState('');
    const [prdCode, setPrdCode] = useState('');

    const OrderFormReceive = async () => {

        await setOrderLoading(false)

        await Api.send('product_cartInfo', {'id':userInfo.id, 'token':userInfo.appToken, 'hcode':userInfo.m_hcode, 'prdcode':params.prdcode}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               
              console.log('결과출력...', arrItems);
              setMemberData(arrItems.member);

              setOrderName(arrItems.member.name);
              setOrderPhoneNumber(arrItems.member.hphone);
              setBaesongInfo(arrItems.member.post);
              setAddrText(arrItems.member.address1);
              setAddrText2(arrItems.member.address2);
              setMyPoint(arrItems.point);

              setOrderAmount(arrItems.cart[0].amount);

              setOrderItemName(arrItems.cart[0].name);
              setOrderItemCount(arrItems.cart[0].amount);
              setOrderItemOption(arrItems.cart[0].option)

              setPrdCode(arrItems.cart[0].prdcode);
    
            }else{
                console.log('결과 출력 실패!', resultItem);
                //ToastMessage(resultItem.message);
            }
        });

        await setOrderLoading(true);
    }


    useEffect(()=>{
        OrderFormReceive();
    }, []);


    const OrderSubmit = () => {

        //resDate1, resTime1
        //resDate2, resTime2

        if(!agree1){
            ToastMessage('고유식별처리 대해 동의하세요.');
            return false;
        }

        Api.send('product_order', {'id':userInfo.id, 'token':userInfo.appToken, 'hcode':userInfo.m_hcode, 'name':orderName, 'hphone':orderPhoneNumber, 'post':baesongInfo, 'address1':addrText, 'address2':addrText2, 'point':pointInput, 'prdcode':prdCode, 'paymethod':payStatus, 'resDate1':dateTimeText, 'resTime1':timeInput, 'resDate2':dateTimeText2, 'resTime2':timeInput2}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               
              console.log('상품 구매...', resultItem);
              setModalStatus(false);
              navigation.navigate('OrderComplete', { itemTitle:orderItemName, itemPrice: params.allPrice - pointInput, itemOptionTitle:params.optionTitle, itemOptionName:params.optionselect, itemOptionPrice:params.optionPrice, points:pointInput, 'amount':orderAmount})

             
            }else{
                console.log('상품 구매 실패!', resultItem);
                //ToastMessage(resultItem.message);
            }
        });
    }


    //날짜 선택..
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

    let today = new Date();
    let todayText = today.format('yyyy-MM-dd');

    const [dateTimeText, setDateTimeText] = useState(todayText);
    const [dateTimeText2, setDateTimeText2] = useState(todayText);

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        //console.log("A date has been picked: ", date);
        hideDatePicker();
        setDateTimeText(date.format("yyyy-MM-dd"))
    };


    const [datePickerVisibility2, setDatePickerVisibility2] = useState(false);
    const showDatePicker2 = () => {
        setDatePickerVisibility2(true);
    };

    const hideDatePicker2 = () => {
        setDatePickerVisibility2(false);
    };

    const handleConfirm2 = (date) => {
        //console.log("A date has been picked: ", date);
        hideDatePicker2();
        setDateTimeText2(date.format("yyyy-MM-dd"))
    };
    
    

    let todayTimes = today.format('HH:mm');

    const [timeInput, setTimeInput] = useState('');
    const [timeInput2, setTimeInput2] = useState('');

    const showTimePicker = () => {
        setTimePickerVisibility(true);
    };

    const hideTimePicker = () => {
        setTimePickerVisibility(false);
    };

    const handleConfirmTime = (date) => {
        //console.log("A date has been picked: ", date);
        hideTimePicker();
        setTimeInput(date.format("HH:mm"))
    };

    const [timePickerVisibility2, setTimePickerVisibility2] = useState(false);
    const showTimePicker2 = () => {
        setTimePickerVisibility2(true);
    };

    const hideTimePicker2 = () => {
        setTimePickerVisibility2(false);
    };

    const handleConfirmTime2 = (date) => {
        //console.log("A date has been picked: ", date);
        hideTimePicker2();
        setTimeInput2(date.format("HH:mm"))
    };


    const [agree1, setAgree1] = useState(false);
    const [agree2, setAgree2] = useState(false);

    const [personalData, setPersonalData] = useState('');
    const [privacyAgreeModal, setPrivacyAgreeModal] = useState(false);

    const PersonalRecieve = (page) => {
        Api.send('service_personalPage', {'page':page}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                //console.log('개인정보보호방침::::: ', arrItems);

                setPersonalData(arrItems);
                if(arrItems != ''){
                    setPrivacyAgreeModal(true);
                }
            }else{
                console.log('개인정보보호방침 출력 실패!', resultItem);
               // ToastMessage(resultItem.message);
            }
        });
    }

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderComponents headerTitle='주문정보 입력' navigation={navigation} />
            {
                orderLoading ? 
                <ScrollView>
                    <Box p={5}>
                        <Box>
                            <DefText text='주문자 정보' style={styles.orderInfoLable} />
                            <Box>
                                <DefText text='주문자명' style={styles.orderInfoSubTitle} />
                                <DefInput 
                                     placeholderText='주문자명'
                                     height='45px'
                                     inputValue={orderName}
                                     onChangeText={orderNameChange}
                                     _focus='transparent'
                                />
                            </Box>
                            <Box mt={5}>
                                <DefText text='주문자 연락처' style={styles.orderInfoSubTitle} />
                                
                                <DefInput 
                                     placeholderText='주문자 연락처'
                                     height='45px'
                                     inputValue={orderPhoneNumber}
                                     onChangeText={phoneNumberChange}
                                     _focus='transparent'
                                />
                            </Box>
                            <Box mt={5}>
                                <DefText text='배송지정보' style={styles.orderInfoSubTitle} />
                                <HStack justifyContent='space-between'>
                                    
                                    <DefInput 
                                        placeholderText='지번'
                                        height='45px'
                                        inputValue={baesongInfo}
                                        onChangeText={baesongChange}
                                        _focus='transparent'
                                        inputStyle={{width:(width-40)*0.6}}
                                    />
                                    <TouchableOpacity style={{width:(width-40)*0.37, height:45, alignItems:'center', justifyContent:'center', borderRadius:10, backgroundColor:'#090A73'}}>
                                        <DefText text='주소찾기' style={{color:'#fff', fontFamily:Font.NotoSansMedium}} />
                                    </TouchableOpacity>
                                </HStack>
                                <Box mt={2.5}>
                           
                                    <DefInput 
                                        placeholderText='상세주소를 입력하세요.'
                                        height='45px'
                                        inputValue={addrText}
                                        onChangeText={addrChange}
                                        _focus='transparent'
                                        
                                    />
                                </Box>
                                <Box mt={2.5}>
          
                                    <DefInput 
                                        placeholderText='추가주소를 입력하세요.'
                                        height='45px'
                                        inputValue={addrText2}
                                        onChangeText={addrTextChange2}
                                        _focus='transparent'
                                        
                                    />
                                </Box>
                            </Box>
                            <Box mt={5}>
                                <DefText text='1순위 예약희망일' style={styles.orderInfoLable} />
                                <HStack justifyContent={'space-between'}> 
                                    <Box width={(width-40)*0.47}>
                                        <HStack>
                                            <DefText text='일자' style={styles.orderInfoSubTitle} />
                                            <DefText text='*' style={{fontSize:18, color:'#FFC400', marginLeft:5}} />
                                        </HStack>

                                        <HStack justifyContent='space-between' alignItems='center' width='100%'  height='45px' py='5px'  backgroundColor='#f1f1f1' borderRadius={10} px={5} >
                                            <DefText text={dateTimeText} style={{fontSize:16, fontFamily:Font.NotoSansMedium}} />
                                            <TouchableOpacity onPress={showDatePicker}>
                                                <Image source={require('../images/carlendarNew.png')} alt='달력' style={{width:20, resizeMode:'contain', marginLeft:10}}  />
                                            </TouchableOpacity>
                                        </HStack>
                                    </Box>
                                    <Box width={(width-40)*0.47}>
                                        <HStack>
                                            <DefText text='시간' style={styles.orderInfoSubTitle} />
                                            <DefText text='*' style={{fontSize:18, color:'#FFC400', marginLeft:5}} />
                                        </HStack>
                                        <HStack justifyContent='space-between' alignItems='center' width='100%'  height='45px' backgroundColor={ timeInput.length > 0 ? '#f1f1f1' : '#fff'} borderRadius={10}  borderColor='#f1f1f1' borderWidth={ timeInput.length > 0 ? 0 : 1} >
                                            <TouchableOpacity style={{width:'100%'}} onPress={showTimePicker}>
                                               <HStack alignItems={'center'} justifyContent='space-between' width='100%'  pl={5} pr='10px'>
                                                    {
                                                        timeInput != '' ?
                                                        <DefText text={timeInput} style={{fontSize:16, fontFamily:Font.NotoSansMedium}} />
                                                        :
                                                        <DefText text={'측정시간'} style={{fontSize:16, color:'#696969'}} />
                                                    }
                                                    <Image source={require('../images/timeIcons.png')} alt='측정시간' style={{width:26, height:26, resizeMode:'contain'}} />
                                                </HStack>
                                            </TouchableOpacity>
                                        </HStack>
                                    </Box>
                                </HStack>
                            </Box>
                            <Box mt={5}>
                                <DefText text='2순위 예약희망일' style={styles.orderInfoLable} />
                                <HStack justifyContent={'space-between'}> 
                                    <Box width={(width-40)*0.47}>
                                        <HStack>
                                            <DefText text='일자' style={styles.orderInfoSubTitle} />
                                            <DefText text='*' style={{fontSize:18, color:'#FFC400', marginLeft:5}} />
                                        </HStack>
                                        <HStack justifyContent='space-between' alignItems='center' width='100%'  height='45px' py='5px'  backgroundColor='#f1f1f1' borderRadius={10} px={5} >
                                            <DefText text={dateTimeText2} style={{fontSize:16, fontFamily:Font.NotoSansMedium}} />
                                            <TouchableOpacity onPress={showDatePicker2}>
                                                <Image source={require('../images/carlendarNew.png')} alt='달력' style={{width:20, resizeMode:'contain', marginLeft:10}}  />
                                            </TouchableOpacity>
                                        </HStack>
                                    </Box>
                                    <Box width={(width-40)*0.47}>
                                        <HStack>
                                            <DefText text='시간' style={styles.orderInfoSubTitle} />
                                            <DefText text='*' style={{fontSize:18, color:'#FFC400', marginLeft:5}} />
                                        </HStack>
                                        <HStack justifyContent='space-between' alignItems='center' width='100%'  height='45px' backgroundColor={ timeInput2.length > 0 ? '#f1f1f1' : '#fff'} borderRadius={10}  borderColor='#f1f1f1' borderWidth={ timeInput2.length > 0 ? 0 : 1}>
                                            <TouchableOpacity style={{width:'100%', height:45, justifyContent:'center'}} onPress={showTimePicker2}>
                                                <HStack alignItems={'center'} justifyContent='space-between' width='100%'  pl={5} pr='10px'>
                                                {
                                                    timeInput2 != '' ?
                                                    <DefText text={timeInput2} style={{fontSize:16, fontFamily:Font.NotoSansMedium}} />
                                                    :
                                                    <DefText text={'측정시간'} style={{fontSize:16, color:'#696969'}} />
                                                }
                                                    <Image source={require('../images/timeIcons.png')} alt='측정시간' style={{width:26, height:26, resizeMode:'contain'}} />
                                                </HStack>
                                            </TouchableOpacity>
                                        </HStack>
                                    </Box>
                                </HStack>
                            </Box>
                            <Box backgroundColor='#f1f1f1' p={5} py='15px' borderRadius={10} mt={'20px'}>
                            
                                <HStack alignItems='center'>
                                    <TouchableOpacity onPress={()=>setAgree1(!agree1)}>
                                        <HStack>
                                            <Box width='20px' height='20px' borderRadius='20px' borderWidth={1} borderColor={ agree1 ? '#f00' : '#666' } alignItems='center' justifyContent='center' mr={2.5}>
                                                <CheckIcon width='10px' color={agree1 ? '#f00' : '#666'} />
                                            </Box>
                                            <DefText text='고유식별정보 처리에 대한 안내' />
                                        </HStack>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={()=>PersonalRecieve('etc')} style={{marginTop:-4}}>
                                        <Box borderBottomWidth={1} borderBottomColor='#888' ml={2.5}>
                                            <DefText text='자세히' style={{fontSize:13,color:'#888'}} />
                                        </Box>
                                    </TouchableOpacity>
                                </HStack>
    
                            </Box>
                            <Box backgroundColor='#f1f1f1' p={5} py='15px' borderRadius={10} mt={'10px'}>
                            
                                <HStack alignItems='center'>
                                    <TouchableOpacity onPress={()=>setAgree2(!agree2)}>
                                        <HStack>
                                            <Box width='20px' height='20px' borderRadius='20px' borderWidth={1} borderColor={ agree2 ? '#f00' : '#666' } alignItems='center' justifyContent='center' mr={2.5}>
                                                <CheckIcon width='10px' color={agree2 ? '#f00' : '#666'} />
                                            </Box>
                                            <DefText text='개인(민감)정보 수집 및 이용약관' />
                                        </HStack>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={()=>PersonalRecieve('personal2')} style={{marginTop:-4}}>
                                        <Box borderBottomWidth={1} borderBottomColor='#888' ml={2.5}>
                                            <DefText text='자세히' style={{fontSize:13,color:'#888'}} />
                                        </Box>
                                    </TouchableOpacity>
                                </HStack>
    
                            </Box>
                            {/* <Box mt={5}>
                                <DefText text='포인트 사용' style={styles.orderInfoLable} />
                                <Box>
                                    <Box>
                                        <DefText text={'사용가능한 포인트 : ' + numberFormat(myPoint) + 'P'} style={{fontSize:14, color:'#696969', fontFamily:Font.NotoSansMedium}} />
                                    </Box>
                                    <HStack justifyContent='space-between' mt={2.5}>

                                        <DefInput 
                                            placeholderText='포인트 입력'
                                            height='45px'
                                            inputValue={pointInput}
                                            onChangeText={pointChange}
                                            _focus='transparent'
                                            inputStyle={{width:(width-40)*0.75}}
                                            keyboardType='number-pad'
                                        />
                                        <TouchableOpacity onPress={()=>setPointInput(myPoint)} style={{width:(width-40)*0.22, height:45, alignItems:'center', justifyContent:'center', borderRadius:10, borderWidth:1,borderColor:'#696969'}}>
                                            <DefText text='전액사용' style={{fontSize:14}} />
                                        </TouchableOpacity>
                                    </HStack>
                                </Box>
                            </Box> */}
                            {/* <Box mt={5}>
                              
                                <DefText text='예약상품' style={styles.orderInfoLable} />
                                {
                                    orderItemName != '' && 
                                    <HStack alignItems='center' justifyContent='space-between'>
                                        <Box>
                                            <DefText text={orderItemName} style={{color:'#000'}} />
                                            {
                                                orderItemOption != '' &&
                                                <DefText text={orderItemOption} style={{color:'#696969', marginTop:10}} />
                                            }
                                           
                                        </Box>
                                        <DefText text={' ('+orderItemCount+'개)'} />
                                    </HStack>
                                }
                                <Box  borderBottomWidth={1} borderBottomColor='#dfdfdf' pb={2.5}>
            
                                    <Box mt={5}>
                                        <HStack justifyContent='space-between'>
                                            <DefText text={'상품금액'} style={styles.priceText} />
                                            <DefText text={numberFormat(params.sellPrice * orderItemCount) + '원'} style={styles.priceText} />
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
                                        <DefText text={ numberFormat(params.allPrice - pointInput) + "원"} style={styles.totalPrice} />
                                    </HStack>
                                </Box>
                            </Box> */}
                            {/* <Box mt={5}>
                                <DefText text='결제수단 선택' style={styles.orderInfoLable} />
                                <VStack>
                                    <TouchableOpacity style={[styles.payButton, {marginTop:5}, payStatus === 'CARD' && {backgroundColor:'#696969'}]} onPress={()=>{setPayStatus('CARD')}}>
                                        <DefText text='신용카드' style={[styles.payButtonText, payStatus === 'CARD' && {color:'#fff'} ]} />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.payButton, {marginTop:15}, payStatus === 'BANK' && {backgroundColor:'#696969'}]} onPress={()=>{setPayStatus('BANK')}}>
                                        <DefText text='실시간 계좌이체' style={[styles.payButtonText, payStatus === 'BANK' && {color:'#fff'}]} />
                                    </TouchableOpacity>
                                </VStack>
                            </Box> */}
                            <Box mt={10}>
                                <TouchableOpacity style={styles.paySubmitButton} onPress={()=>setModalStatus(true)}>
                                    <DefText text='예약하기' style={styles.paySubmitText} />
                                    {/* <DefText text='결제하기' style={styles.paySubmitText} /> */}
                                </TouchableOpacity>
                            </Box>
                        </Box>
                    </Box>
                </ScrollView>
                :
                <Box flex={1} alignItems='center' justifyContent='center'>
                    <ActivityIndicator size='large' color='#333' />
                </Box>
            }
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
            />
            <DateTimePickerModal
                isVisible={isTimePickerVisible}
                mode="time"
                onConfirm={handleConfirmTime}
                onCancel={hideTimePicker}
            />

            <DateTimePickerModal
                isVisible={datePickerVisibility2}
                mode="date"
                onConfirm={handleConfirm2}
                onCancel={hideDatePicker2}
            />
            <DateTimePickerModal
                isVisible={timePickerVisibility2}
                mode="time"
                onConfirm={handleConfirmTime2}
                onCancel={hideTimePicker2}
            />
            <Modal isOpen={modalStatue} onClose={() => setModalStatus(false)}>
            
                <Modal.Content maxWidth={width-40}>
                    <Modal.Body>
                        
                        <DefText text={orderItemName+' 상품을 구매하시겠습니까?'}  />
                        <HStack justifyContent='space-between'>
                            {/* <TouchableOpacity style={[styles.paySubmitButton, {marginTop:20, width:(width-80) * 0.45}]} onPress={()=>{navigation.navigate('OrderComplete', { itemTitle:orderItemName, itemPrice: params.allPrice - pointInput, itemOptionTitle:params.optionTitle, itemOptionName:params.optionselect, itemOptionPrice:params.optionPrice, points:pointInput})}}>
                                <DefText text='네' style={styles.paySubmitText} />
                            </TouchableOpacity> */}
                            <TouchableOpacity style={[styles.paySubmitButton, {marginTop:20, width:(width-80) * 0.45}]} onPress={OrderSubmit}>
                                <DefText text='네' style={styles.paySubmitText} />
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.paySubmitButton, {marginTop:20, width:(width-80) * 0.45}]} onPress={()=>setModalStatus(false)}>
                                <DefText text='아니오' style={styles.paySubmitText} />
                            </TouchableOpacity>
                        </HStack>
                        
                    </Modal.Body>
                </Modal.Content>
            </Modal>

            <Modal isOpen={privacyAgreeModal} onClose={()=>setPrivacyAgreeModal(false)}>
                <Modal.Content maxWidth={width-40} backgroundColor='#fff'>
                    <Modal.Body>
                        <DefText text={personalData.title} />
                        <Box mt={'15px'}>
                            {
                                personalData != '' &&
                                <HTML 
                                    ignoredStyles={[ 'width', 'height', 'margin', 'padding', 'fontFamily', 'lineHeight', 'fontSize', 'br']}
                                    ignoredTags={['head', 'script', 'src']}
                                    imagesMaxWidth={Dimensions.get('window').width - 90}
                                    source={{html: personalData.content}} 
                                    tagsStyles={StyleHtml}
                                    containerStyle={{ flex: 1, }}
                                    contentWidth={Dimensions.get('window').width}  
                                />
                            }
                            
                        </Box>
                        <HStack justifyContent='space-between' mt={2.5}>
                            <TouchableOpacity onPress={()=>setPrivacyAgreeModal(false)} style={{width:width-90, height:45, backgroundColor:'#090A73', justifyContent:'center', alignItems:'center', borderRadius:10}}>
                                <DefText text='확인' style={{color:'#fff'}} />
                            </TouchableOpacity>
                            
                        </HStack>
                    </Modal.Body>
                </Modal.Content>
            </Modal>
        </Box>
    );
};

const styles = StyleSheet.create({
    orderInfoLable: {
        color:'#696969',
        fontWeight:'500',
        fontFamily:Font.NotoSansMedium,
        marginBottom:10
    },
    orderInfoSubTitle: {
        fontSize:14,
        color:'#696969',
        marginBottom:10,
        fontFamily:Font.NotoSansMedium,
    },
    optionText: {
        fontSize:13,
        color:'#666'
    },
    priceText: {
        fontSize:14,
        color:'#000',
        fontFamily:Font.NotoSansMedium
    },
    totalPrice : {
        fontSize:16,
        color:'#000',
        fontWeight:'bold'
    },
    payButton: {
        height:45,
        borderRadius:10,
        borderWidth:1,
        borderColor:'#f1f1f1',
        justifyContent:'center',
        alignItems:'center'
    },
    payButtonText: {
        color:'#000',
        fontFamily:Font.NotoSansMedium
    },
    paySubmitButton : {
        height:45,
        backgroundColor:'#090A73',
        borderRadius:10,
        alignItems:'center',
        justifyContent:'center'
    },
    paySubmitText: {
        color:'#fff',
        fontFamily:Font.NotoSansMedium
    }
})

export default connect(
    ({ User }) => ({
        userInfo: User.userInfo, //회원정보
    }),
    (dispatch) => ({
        member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
        member_info: (user) => dispatch(UserAction.member_info(user)), //회원 정보 조회
        
    })
)(OrderForm);