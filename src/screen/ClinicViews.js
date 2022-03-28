import React, {useState, useEffect} from 'react';
import { Box, VStack, HStack, Image, Modal, CheckIcon, Select } from 'native-base';
import { TouchableOpacity, Dimensions, View, ScrollView, StyleSheet, Alert } from 'react-native';
import HeaderComponents from '../components/HeaderComponents';
import { DefText } from '../common/BOOTSTRAP';
import { numberFormat } from '../common/dataFunction';
import ToastMessage from '../components/ToastMessage';
import Api from '../Api';
import { connect } from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import Swiper from 'react-native-swiper';
import HTML from 'react-native-render-html';
import StyleHtml from '../common/StyleHtml';
import { ActivityIndicator } from 'react-native-paper';

const {width} = Dimensions.get('window');

const ClinicViews = (props) => {

    const {navigation, route, userInfo} = props;

    const {params} = route;

    //console.log('params', params);

    const [productOptions, setProductOptions] = useState([]);

    const [productDetal, setProductDetail] = useState('');

    const [productOptionAll, setProductOptionAll] = useState([]);
    const [productOption1, setProductOption1] = useState([]);
    const [productOption2, setProductOption2] = useState([]);
    const [productOption3, setProductOption3] = useState([]);
    const [allPrice, setAllPrice] = useState(0); 
    const [orgPrice, setOrgPrice] = useState(0); 


    const [pageLoading, setLoading] = useState(false);

    const ClinicView = async () => {

        await setLoading(false);

        await Api.send('product_detail', {'id':userInfo.id, 'token':userInfo.appToken, 'hcode':userInfo.m_hcode, 'prdcode':params.prdcode}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
             
                //setClinicList(arrItems);
                setAllPrice(arrItems.sellprice);
                setOrgPrice(arrItems.sellprice);
                console.log('상품 정보123123: ',  arrItems.intro);

                setProductDetail(arrItems);

                if(arrItems.option != undefined){
                    setProductOptions(Object.keys(arrItems.option));
                    setProductOptionAll(Object.values(arrItems.option));
                }


                setAllPrice(parseInt(arrItems.sellprice));
                setOrgPrice(parseInt(arrItems.sellprice));

    
            }else{
                console.log('결과 출력 실패!', resultItem);
                //ToastMessage(resultItem.message);
            }
        });

        await setLoading(true);
    }

    useEffect(()=>{
        ClinicView();
    }, []);

    //가격정보

    const [optionSelect, setOptionNamesSelect] = useState('');

    const [isPrice, setIsPrice] = useState(0);
    const [isPriceFix, setIsPriceFix] = useState(0);

    const [sellModal, setSellModal] = useState(false);

    const [sellCount, setSellCount] = useState(1);


    const [prdcode,setPrdcode] = useState(params.prdcode);  // 제품코드
    const [amount,setAmount]    = useState(1);              // 제품수량
    const [optnum,setOptnum]    = useState('');             // 옵션구분값(1~7)
    const [opttitle,setOpttitle]    = useState('');         // 옵션구분명(색상이냐, 사이즈냐)
    const [optname,setOptname]    = useState('');           // 옵션값(빨간색,파란색,노란색 등)
    const [optprice,setOptprice]    = useState(0);          // 옵션추가금액(+1,000)
    const [optreserve,setOptreserve]    = useState(0);      // 옵션추가적립금(0)


    const [optInfoArr, setOptInfoArr] = useState('');

    const selectValues = (a) => {
        //console.log(a.split('|'));


        setSellCount(1);
        let prdSelect = a.split('|');

        setOptionNamesSelect(prdSelect[1]);

        setOpttitle(prdSelect[0]); //옵션구분명..
        setOptname(prdSelect[1]); // 옵션값
        setOptprice(prdSelect[2]); // 옵션추가금액
        setOptnum(prdSelect[3]); // 옵션구분넘버
        setOptreserve(prdSelect[4]); // 옵션추가적립금


        let optInfoArrData = {'optTitle':'', 'optName':'', 'optPrice':'', 'optNum':'', 'optReserve':'', 'allPrcie':'', 'orPrice':''};

        optInfoArrData.optTitle = prdSelect[0];
        optInfoArrData.optName = prdSelect[1];
        optInfoArrData.optPrice = prdSelect[2];
        optInfoArrData.optNum = prdSelect[3];
        optInfoArrData.optReserve = prdSelect[4];

        optInfoArrData.allPrcie = parseInt(prdSelect[2]) + parseInt(productDetal.sellprice);
        optInfoArrData.orPrice = parseInt(prdSelect[2]) + parseInt(productDetal.sellprice);
        setAllPrice(parseInt(prdSelect[2]) + parseInt(productDetal.sellprice));
        setOrgPrice(parseInt(prdSelect[2]) + parseInt(productDetal.sellprice));

        setOptInfoArr(optInfoArrData);

    }


    //음식 카운트 +
    const handleFoodQty = async () => {


        console.log(sellCount);

        let counts = sellCount;
        
        await setAllPrice(orgPrice * (sellCount + 1));
        await setSellCount(counts + 1);

     
    }

    const countMinus =  async () => {
        if(sellCount == 1){
            Alert.alert('주문 최소수량은 1개까지 가능합니다.')
            return false;
        }

        await setAllPrice(orgPrice * (sellCount - 1));
        await setSellCount(sellCount - 1);
    
    }


    // useEffect(()=>{
    //     console.log('선택 값:::' ,allPrice);
    // }, [allPrice])

    const ItemSell = () => {
        if(productOptions.length > 0){
            if(!optInfoArr){
                Alert.alert('옵션을 선택하세요.');
                return false;
            }
        }

        let paramsData = {'id':userInfo.id, 'token':userInfo.appToken, 'prdcode':productDetal.prdcode, 'hcode':userInfo.m_hcode, 'optnum':optnum, 'optprice':optprice, 'optname':optname, 'opttitle':opttitle, 'optcode': optname, 'optreserve':optreserve, 'amount':sellCount};


        Api.send('product_cartInsert', paramsData, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               
       
                console.log('상품 장바구니 넣기: ',  arrItems);

                setSellModal(false);
                
                navigation.replace('OrderForm', {'id':userInfo.id, 'allPrice':allPrice, 'sellPrice':productDetal.sellprice, 'optionTitle':opttitle,'optionselect':optname, 'optionPrice':optprice});

    
            }else{
                console.log('상품 장바구니 실패!', resultItem);
                //ToastMessage(resultItem.message);
            }
        });

    }

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderComponents headerTitle='클리닉 소개' navigation={navigation} />
            {
                pageLoading ?
                <ScrollView>
                    <Box p={5}>
                        {
                            productDetal != '' &&

                            productDetal.photo &&
                            <>
                            <Box height={width / 2.44}>
                                <Swiper loop={true}
                                    height={width / 2.44}
                                    dot={
                                        <View
                                        style={{
                                            backgroundColor: 'transparent',
                                            width: 5,
                                            height: 5,
                                            borderRadius: 5,
                                            marginLeft: 10,
                                        }}
                                        />
                                    }
                                    activeDot={
                                    <View
                                        style={{
                                        backgroundColor: 'transparent',
                                        width: 5,
                                        height: 5,
                                        borderRadius: 5,
                                        marginLeft: 10,
                                        }}
                                    />
                                    }
                                    paginationStyle={{
                                        bottom: '10%',
                                        
                                    }}
                                >
                                    {
                                        productDetal.photo.map((item, index)=> {
                                            return (
                                                <Box key={index}>
                                                    <Image source={{uri:item}} style={{width:width, height: width / 2.44 , resizeMode:'stretch'}} alt={productDetal.prdname} />
                                                </Box>
                                            )
                                        })
                                    }
                                    
                                </Swiper>
                            </Box>
                            <Box mt='15px'>
                                <DefText text={params.prdname} style={{fontSize:16, fontWeight:'bold'}} />
                                {
                                    productDetal.conprice != 0 &&
                                    <Box mt={2.5} alignItems='flex-end'>
                                        <DefText text={'정가 ' + numberFormat(productDetal.conprice) + '원'} style={[styles.orPrice, {textDecorationLine: 'line-through', textDecorationStyle: 'solid'}]} />
                                    </Box>
                                }
                                {
                                    productDetal.sellprice != 0 &&
                                    <Box mt='5px' alignItems='flex-end' mb='15px'>
                                        <DefText text={'회원가 ' + numberFormat(productDetal.sellprice) + '원'} style={styles.price} />
                                    </Box>
                                }
                                <Box>
                                    <DefText text={productDetal.intro} />
                                </Box>
                            </Box>
                            {
                                productDetal.content ?
                                <Box mt='15px'>
                                    <HTML 
                                        iignoredStyles={[ 'width', 'height', 'margin', 'padding']}
                                        ignoredTags={['head', 'script', 'src', 'br']}
                                        imagesMaxWidth={Dimensions.get('window').width - 40}
                                        source={{html: productDetal.content}} 
                                        tagsStyles={StyleHtml}
                                        containerStyle={{ flex: 1, }}
                                        contentWidth={Dimensions.get('window').width}  
                                    />
                                </Box>
                                :
                                <DefText text='123123' />
                            }
                            </>
                        }

                    </Box>
                </ScrollView>
                :
                <Box flex={1} alignItems='center' justifyContent='center'>
                    <ActivityIndicator size='large' color='#333' />
                </Box>
            }
            
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
                        {
                            productDetal != '' && 
                            productOptions.length > 0 &&
                            <>
                            <DefText text='옵션 추가' style={{fontSize:14, marginBottom:10, color:'#000', fontWeight:'bold'}} />
                            {
                                productOptions.map((item, index)=>{

                                    //console.log('122312312', Object.values(productDetal.option)[index] );

                                    return(
                                        <Box key={index} style={{marginBottom:10}}>
                                            <DefText text={item} style={{marginBottom:10}} />
                                            <Select
                                                selectedValue={optionSelect} 
                                                width={width-80}
                                                height={45}
                                                backgroundColor='#fff'
                                                placeholder='옵션을 선택하세요.'
                                                onValueChange={(itemValue) => selectValues(itemValue)}
                                                style={{fontSize:14}}
                                            >
                                            {
                                                Object.values(productDetal.option)[index].map((items, idx)=> {
                                                    return(
                                                        <Select.Item 
                                                            label={
                                                                <HStack justifyContent='space-between' width={width-60}>
                                                                    <Box><DefText text={items.name} /></Box>
                                                                    <Box><DefText text={'+ '+items.optprice+ '원'} /></Box>
                                                                </HStack>
                                                            }
                                                            value={item+'|'+items.name+'|'+items.optprice+'|'+items.optnum+'|'+items.optreserve}
                                                        />
                                                    )
                                                })
                                            }
                                            </Select>
                                        </Box>
                                    )
                                })
                            }
                            </>
                        }

                        {
                            productDetal != '' &&
                            productDetal.option != null ?
                            <>
                            {
                                optInfoArr != '' &&
                                <Box mt={2.5}>
                                    <HStack justifyContent='space-between'>
                                        <Box width={(width-80)*0.7} >
                                            <DefText text={productDetal.prdname} style={{fontSize:15}}  />
                                            <DefText text={'옵션명 : ' + optInfoArr.optTitle + '(' + optInfoArr.optName + ') +' + optInfoArr.optPrice + '원'} style={{color:'#999', marginTop:5}} />
                                        </Box>
                                        <HStack width={(width-80)*0.25}  justifyContent='flex-end' alignItems='center'>
                                            <TouchableOpacity onPress={countMinus} activeOpacity={0.9}>
                                                <Image source={require('../images/minusButton.png')} alt='감소' />
                                            </TouchableOpacity>
                                            <Box style={{marginHorizontal:10}}>
                                                <DefText text={sellCount} style={{fontSize:13}} />
                                            </Box> 
                                            <TouchableOpacity onPress={handleFoodQty} activeOpacity={0.9}>
                                                <Image source={require('../images/plusButton.png')} alt='증가' />
                                            </TouchableOpacity>
                                        </HStack>
                                    </HStack>
                                </Box>
                            }
                            </>
                            :
                            <Box>
                                <HStack justifyContent='space-between'>
                                    <Box width={(width-80)*0.7} >
                                        <DefText text={productDetal.prdname} style={{fontSize:15}}  />
                                    </Box>
                                    <HStack width={(width-80)*0.25}  justifyContent='flex-end' alignItems='center'>
                                        <TouchableOpacity onPress={countMinus} activeOpacity={0.9}>
                                            <Image source={require('../images/minusButton.png')} alt='감소' />
                                        </TouchableOpacity>
                                        <Box style={{marginHorizontal:10}}>
                                            <DefText text={sellCount} style={{fontSize:13}} />
                                        </Box> 
                                        <TouchableOpacity onPress={handleFoodQty} activeOpacity={0.9}>
                                            <Image source={require('../images/plusButton.png')} alt='증가' />
                                        </TouchableOpacity>
                                    </HStack>
                                </HStack>
                            </Box>
                        }
                        
                        
                       {
                           productDetal != '' &&
                           
                            <Box mt={5} >
                                <HStack justifyContent='space-between' alignItems='center'>
                                    <DefText text='총 결제금액' />
                                    <DefText text={numberFormat(allPrice) + '원'} style={{fontSize:18, color:'#000', fontWeight:'bold'}} />
                                </HStack>
                            </Box>
                       }
                       
                        <TouchableOpacity onPress={()=>ItemSell()} style={{height:45, backgroundColor:'#090A73', alignItems:'center', justifyContent:'center', borderRadius:10, marginTop:20}}>
                            <DefText text='예약하기' style={{fontSize:14, color:'#fff'}} />
                        </TouchableOpacity>
                    </Modal.Body>
                </Modal.Content>
            </Modal>
            <Box p={2.5}>
                <TouchableOpacity style={styles.medicineButtons} onPress={()=>setSellModal(true)}>
                    <DefText text='예약하기' style={styles.medicineButtonsText} />
                </TouchableOpacity>
            </Box>
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
        backgroundColor:'#090A73',
        borderRadius:10,
        alignItems:'center',
        justifyContent:'center',
        height: 45,
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


export default connect(
    ({ User }) => ({
        userInfo: User.userInfo, //회원정보
    }),
    (dispatch) => ({
        member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
        member_info: (user) => dispatch(UserAction.member_info(user)), //회원 정보 조회
        
    })
)(ClinicViews);