import React, {useState, useEffect} from 'react';
import { ScrollView, Dimensions, View, Text, Platform, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Box, HStack, VStack, Image, Input } from 'native-base';
import { DefText } from '../common/BOOTSTRAP';
import HeaderComponents from '../components/HeaderComponents';
import Swiper from 'react-native-swiper';
import {numberFormat , textLengthOverCut} from '../common/dataFunction';
import {clinicSearchCategory, clinicData} from '../Utils/DummyData';
import Api from '../Api';
import ToastMessage from '../components/ToastMessage';
import { connect } from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import Font from '../common/Font';

const {width} = Dimensions.get('window');

const Clinic = ( props ) => {

    const {navigation, userInfo} = props;
    

    //console.log(userInfo);

    const [clinicSearch, setClinicSearch] = useState('');
    const clinicChange = (text) => {
        setClinicSearch(text);
    }

    const [clinicSelect, setClinicSelect] = useState('');
    const _clinickSelect = (category) => {
        setClinicSelect(category);
        setClinicSearch(category);
    }

    //상품
    const [clinicLoading, setClinicLoading] = useState(false);
    const [clinicBanner, setClinicBanner] = useState([]);
    const [clinicList, setClinicList] = useState([]);

    const ClinicListRequest = async () => {

        await setClinicLoading(false);

        await Api.send('product_slide', {'id':userInfo.id, 'token':userInfo.appToken, 'hcode':userInfo.m_hcode}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                //console.log('상품 배너 정보: ', arrItems);

                //setClinicList(arrItems);
                setClinicBanner(arrItems);
    
            }else{
                console.log('결과 출력 실패!', resultItem);
                //ToastMessage(resultItem.message);
            }
        });

        await Api.send('product_list', {'id':userInfo.id, 'token':userInfo.appToken, 'hcode':userInfo.m_hcode, 'schText':clinicSearch, 'tag':keywordData}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                console.log('상품 정보: ', arrItems);

                setClinicList(arrItems);
    
            }else{
                console.log('결과 출력 실패!', resultItem);
                //ToastMessage(resultItem.message);
            }
        });

        await setClinicLoading(true);
    }

    useEffect(()=>{
        ClinicListRequest();
    }, [])


    const ClincSearch = () => {
        ClinicListRequest();
    }


    

    const [keywordData, setKeywordData] = useState('');
    const keywordChangeList =  (keywords) => {

       
        if(keywords == keywordData){
            setKeywordData('');
        }else{
            setKeywordData(keywords);
        }

       

    }

    const [taglist, setTagList] = useState([]);

    useEffect( async ()=>{
        console.log('키워드 변화 감지::', keywordData);

        await setClinicLoading(true);


        await Api.send('product_list', {'id':userInfo.id, 'token':userInfo.appToken, 'hcode':userInfo.m_hcode, 'schText':clinicSearch, 'tag':keywordData}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                console.log('상품 정보: ', arrItems);

                setClinicList(arrItems);
    
            }else{
                console.log('결과 출력 실패!', resultItem);
                //ToastMessage(resultItem.message);
            }
        });

        await Api.send('product_tagList', {'id':userInfo.id, 'token':userInfo.appToken, 'hcode':userInfo.m_hcode}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               // console.log('태그 정보: ', arrItems);
                setTagList(arrItems);
            }else{
                console.log('결과 출력 실패!', resultItem);
                //ToastMessage(resultItem.message);
            }
        });        

        await setClinicLoading(true);
    },[keywordData])


    const clinicSearchCategoryBtn = taglist.map((item, index)=>{
        return(
            <TouchableOpacity key={index} style={[styles.keywordButton, keywordData == item && {backgroundColor:'#696969'} ]} onPress={()=>keywordChangeList(item)}>
                <DefText text={item} style={[styles.keywordButtonText, keywordData == item && {color:'#fff'}]} />
                {/* onPress={()=>{_clinickSelect(item.category)}} */}
            </TouchableOpacity>
        )
    })

    const _renderItem = ({item, index}) => {
        return(
            <Box key={index} px={5} mb={5}>
                <Box shadow={5} backgroundColor='#fff' borderRadius={10} px={ item.upfile && item.isBanner ? 0 : 5}>
                    <TouchableOpacity style={[{borderRadius:10, paddingTop:item.conprice != 0 ? 10 : 20, paddingBottom:20}, item.upfile && item.isBanner && {paddingTop:0, paddingBottom:0} ]} onPress={()=>navigation.navigate('ClinicViews', item)}>
                        {
                            item.upfile && item.isBanner ?
                            <Image source={{uri:item.upfile}} alt={item.prdcode} style={{width:width, height:110, resizeMode:'cover'}} />
                            :
                            <Box>
                                <HStack justifyContent='space-between' alignItems='flex-end'>
                                    <DefText text={textLengthOverCut(item.prdname, 20)} style={styles.itemTitle} />
                                    <VStack justifyContent='flex-end' alignItems='flex-end'>
                                        {
                                            item.conprice != 0 &&
                                            <Box>
                                                <DefText text={'정가 ' + numberFormat(item.conprice) + '원'} style={[styles.itemPriceOr, {textDecorationLine: 'line-through', textDecorationStyle: 'solid'}]} />
                                            </Box>
                                        }
                                       {
                                           item.sellprice != 0 &&
                                           <DefText text={'회원가 ' + numberFormat(item.sellprice) + '원'} style={styles.itemTitle} />
                                       }
                                        
                                    </VStack>
                                    
                                </HStack>
                                {
                                    item.intro != '' &&
                                    <DefText text={item.intro} style={styles.itemContent} />
                                }
                            </Box>
                        }
                    </TouchableOpacity>
                </Box>
            </Box>
        )
    }

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderComponents headerTitle='클리닉 소개' navigation={navigation} />
            {
                clinicLoading ? 
                <FlatList
                    ListHeaderComponent={
                        <>
                            {
                                clinicBanner.length > 0 &&
                                <Swiper loop={true}
                                    height={width/1.78}
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
                                        clinicBanner &&
                                        clinicBanner.length > 0 &&
                                        clinicBanner.map((item, index)=> {
                                            return (
                                                <TouchableOpacity key={index} onPress={()=>navigation.navigate('ClinicViews', item)}>
                                                    <Image source={{uri:item.upfile}} style={{width:width, height:width/1.78, resizeMode:'stretch'}} alt={'슬라이드 번호' + item.prdcode} />
                                                </TouchableOpacity>
                                            )
                                        })
                                    }
                                </Swiper>
                            }
                            
                            <Box px={5} py={5} pt={2.5} pb={0}>
                                <HStack  alignItems='center' height='45px' backgroundColor='#F1F1F1' borderRadius={10}>
                                    <Input
                                        placeholder='검색하실 내용을 적어주세요.'
                                        height='45px'
                                        width={width-80}
                                        backgroundColor='transparent'
                                        borderWidth={0}
                                        value={clinicSearch}
                                        onChangeText={clinicChange}
                                        onSubmitEditing={ClincSearch}
                                    />
                                    <TouchableOpacity onPress={ClincSearch}>
                                        <Image source={require('../images/schIcons.png')} alt='검색' />
                                    </TouchableOpacity>
                                </HStack>
                            </Box>
                            <Box mb={2.5}>
                                <ScrollView 
                                    horizontal={true}
                                    showsHorizontalScrollIndicator={false}
                                >
                                    <HStack px={5} flexWrap='wrap' mb={2.5}>
                                        {clinicSearchCategoryBtn}
                                    </HStack>
                                </ScrollView>
                            </Box>
                        </>
                    }
                    data={clinicList}
                    renderItem={_renderItem}
                    keyExtractor={(item, index)=>index.toString()}
                    showsVerticalScrollIndicator={false}
                    
                    ListEmptyComponent={
                        <Box py={10} alignItems='center'>
                            <DefText text='등록된 클리닉이 없습니다.' style={{color:'#696969'}} />
                        </Box>                
                    }
                />
                :
                <Box flex={1} alignItems='center' justifyContent='center'>
                    <ActivityIndicator size='large' color='#333' />
                </Box>
            }
            
        </Box>
    );
};

const styles = StyleSheet.create({
    keywordButton: {
        height:30,
        paddingHorizontal:10,
        backgroundColor:'#f1f1f1',
        alignItems:'center',
        justifyContent:'center',
        borderRadius:10,
        marginRight:10,
        marginTop:10,
    },
    keywordButtonText: {
        fontSize: 14,
        color:'#000',
        fontWeight:'500',
        fontFamily:Font.NotoSansMedium
    },
    itemTitle: {
        fontSize:15,
        color:'#000',
        fontWeight:'bold'
    },
    itemContent: {
        fontSize:14,
        color:'#696969',
        marginTop:10,
        fontFamily:Font.NotoSansMedium
    },
    itemPriceOr: {
        fontSize:13,
        color:'#666'
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
)(Clinic);