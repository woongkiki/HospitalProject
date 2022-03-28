import React, {useState, useEffect} from 'react';
import { Box, VStack, HStack, Image, Modal, CheckIcon } from 'native-base';
import { TouchableOpacity, Dimensions, View, ScrollView, StyleSheet } from 'react-native';
import HeaderComponents from '../components/HeaderComponents';
import { DefText } from '../common/BOOTSTRAP';
import { numberFormat } from '../common/dataFunction';
import ToastMessage from '../components/ToastMessage';

const {width} = Dimensions.get('window');

const ClinicView = (props) => {

    const {navigation, route} = props;

    const {params} = route;

    //console.log(params);

    const [viewCates, setViewCates] = useState('');

    //가격정보
    const [isPrice, setIsPrice] = useState(0);
    const [isPriceFix, setIsPriceFix] = useState(0);

    useEffect(()=>{
        if(params != undefined){
            //setViewCates(params.category.split(','))
            setIsPrice(params.conprice);
            setIsPriceFix(params.sellprice);
        }
    },[])

   const [sellModal, setSellModal] = useState(false);

   const [checkbox, setCheckBox] = useState('');

   //카운트
   const [sellCount, setSellCount] = useState(1);

  const [selectOptionPrice, setSelectOptionPrice] = useState(0);

   const countPlus = () => {
        setSellCount(sellCount + 1);
        setIsPrice(isPrice + isPriceFix);
   }

   const countMinus = () => {
       if(sellCount == 1){
            ToastMessage('수량은 1개 이상만 가능합니다.')
            return false;
       }

        setSellCount(sellCount - 1);
        setIsPrice(isPrice - isPriceFix);
       
   }

   


    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderComponents headerTitle='클리닉 소개' navigation={navigation} />
            <ScrollView>
                
                <Box>
                    <Image source={{uri:params.thumnailImgae}} alt='클리닉 썸네일..' style={{width:width, height:175, resizeMode:'contain'}} />
                </Box>
                <Box p={5}>
                    <DefText text={params.itemTitle} style={{fontSize:16, fontWeight:'bold'}} />
                    <Box mt={2.5} alignItems='flex-end'>
                        <DefText text={'정가 ' + numberFormat(params.orPrice) + '원'} style={styles.orPrice} />
                    </Box>
                    <Box mt='5px' alignItems='flex-end'>
                        <DefText text={'회원가 ' + numberFormat(params.price) + '원'} style={styles.price} />
                    </Box>
                    {/* {
                        params.category != '' &&
                        <HStack>
                            {viewCateList}
                        </HStack>
                    } */}
                    
                    <Box mt={2.5}>
                        <DefText text={params.commentOne} style={styles.clinicViewText} />
                    </Box>
                </Box>
                <Box>
                    <Image source={{uri:params.viewImage}} alt='상세페이지 이미지' style={{width:width, height:2100}} />
                </Box>
            </ScrollView>
            <Box p={2.5}>
                <TouchableOpacity style={styles.medicineButtons} onPress={()=>setSellModal(true)}>
                    <DefText text='구매하기' style={styles.medicineButtonsText} />
                </TouchableOpacity>
            </Box>

            <Modal isOpen={sellModal} onClose={() => setSellModal(false)}>
            
                <Modal.Content maxWidth={width-40}>
                    <Modal.Body>
                        {/* {
                            params.option.length > 0 && 
                            <Box mb={5}>
                                <DefText text='옵션 추가' style={{fontSize:16, marginBottom:20, color:'#000', fontWeight:'bold'}} />
                                <VStack>
                                    {optionList}
                                </VStack>
                            </Box>
                        } */}
                        
                        <Box >
                            <HStack justifyContent='space-between'>
                                <Box width={(width-80)*0.7} >
                                    <DefText text={params.itemTitle} style={{fontSize:15}}  />
                                </Box>
                                <HStack width={(width-80)*0.25}  justifyContent='flex-end' alignItems='center'>
                                    <TouchableOpacity onPress={countMinus} activeOpacity={0.9}>
                                        <Image source={require('../images/minusButton.png')} alt='감소' />
                                    </TouchableOpacity>
                                    <Box style={{marginHorizontal:10}}>
                                        <DefText text={sellCount} style={{fontSize:13}} />
                                    </Box> 
                                    <TouchableOpacity onPress={countPlus} activeOpacity={0.9}>
                                        <Image source={require('../images/plusButton.png')} alt='증가' />
                                    </TouchableOpacity>
                                </HStack>
                            </HStack>
                        </Box>
                        <Box mt={5} >
                            <HStack justifyContent='space-between' alignItems='center'>
                                <DefText text='총 결제금액' />
                                <DefText text={numberFormat(isPrice) + '원'} style={{fontSize:18, color:'#000', fontWeight:'bold'}} />
                            </HStack>
                        </Box>
                        <TouchableOpacity onPress={()=>{navigation.navigate('OrderForm', {'par':params, 'priceFix':isPrice, 'counts':sellCount, 'optionChk':checkbox, 'optionPrice':selectOptionPrice} )}} style={{height:45, backgroundColor:'#090A73', alignItems:'center', justifyContent:'center', borderRadius:10, marginTop:20}}>
                            <DefText text='구매하기' style={{fontSize:14, color:'#fff'}} />
                        </TouchableOpacity>
                    </Modal.Body>
                </Modal.Content>
            </Modal>
        </Box>
    );
};

const styles = StyleSheet.create({
    orPrice: {
        fontSize:13,
        color:'#666',
    },
    price: {
        fontSize:15,
        color:'#000',
        fontWeight:'bold'
    },
    clinicCate : {
        height:30,
        paddingHorizontal:10,
        backgroundColor:'#666',
        alignItems:'center',
        justifyContent:'center',
        borderRadius:35,
        marginRight:10,
        marginTop:10,
    },
    clinicCateText: {
        fontSize: 14,
        color:'#fff',
    },
    clinicViewText :{
        fontSize:14,
        color:'#333'
    },
    medicineButtons : {
        backgroundColor:'#999',
        borderRadius:5,
        alignItems:'center',
        justifyContent:'center',
        height: 40,
    },
    medicineButtonsText: {
        fontSize:15,
        color:'#fff',
        
    },
    countingButton : {
        width:20,
        height:20,
        borderWidth:1,
        borderColor:'#999',
        alignItems:'center',
        justifyContent:'center'
    }
})

export default ClinicView;