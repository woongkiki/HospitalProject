import React, {useState, useEffect} from 'react';
import { ScrollView, Dimensions, View, Text, Platform, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, ImageBackground } from 'react-native';
import { Box, HStack, VStack, Image, Input } from 'native-base';
import { DefText } from '../common/BOOTSTRAP';
import HeaderDefault from '../components/HeaderDefault';
import {schKeyword, healthData} from '../Utils/DummyData';
import Api from '../Api';
import ToastMessage from '../components/ToastMessage';
import Font from '../common/Font';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { connect } from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';

const {width} = Dimensions.get('window');
const HealthInfoWidth = (width - 40) - 100;
const boxWidths = width - 20;
const boxHeights = boxWidths / 3.5;
const Community = (props) => {

    const {navigation, route, userInfo} = props;
    const {section} = props.route.params;


    //console.log(userInfo);


    const [hospitalBanners, setHospitalBanners] = useState('');

    const HospitalBannerReceive = () => {


        Api.send('member_info', {'id':userInfo.email, 'token':userInfo.appToken}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {

                let hcodes = arrItems.m_hcode;

                //병원 홈 배너 가져오기...
                Api.send('bbs_banner', {'id':userInfo.id, 'token':userInfo.appToken, 'hcode':hcodes}, (args)=>{
                    let resultItem = args.resultItem;
                    let arrItems = args.arrItems;

                    if(resultItem.result === 'Y' && arrItems) {
                    // console.log('병원 정보: ', arrItems);

                        
                     //   console.log('홈 화면 배너정보:::', arrItems);
                        //console.log(resultItem.message);
                        setHospitalBanners(arrItems);

                    }else{
                        console.log('결과 출력 실패123123!', resultItem);
                    //ToastMessage(resultItem.message);
                    }
                });
            }
        });

        
    }

    useEffect(()=>{
        HospitalBannerReceive();
    }, [])

   

    const [communitySearch, setCommunitySerach] = useState('');
    const SearchTextChagne = (text) => {
        setCommunitySerach(text);
    }

    const [schTexts, setSchTexts] = useState('')
    const schButtons = async () => {
        // if(communitySearch.length == 0){
        //     ToastMessage('검색어를 입력하세요.');
        //     return false;
        // }

        await setSchTexts(communitySearch);
        //await communityDataReceive();
       // console.log('schTexts:::',schTexts)
    }

   // console.log('검색어..', schTexts)


    //검색키워드 관리
    const [isKeyword, setIsKeyword] = useState('');

    //최신순 인기순
    const [sortCategory, setSortCategory] = useState('최신순');

    useEffect(()=>{
        communityDataReceive();
    },[sortCategory, schTexts])

    //커뮤니티 데이터
    const [comData, setComData] = useState(healthData);

    //console.log(comData);

    //키워드 버튼 변경이벤트
    const keywrodChange = (keyword) => {
        setIsKeyword(keyword);
        setCommunitySerach(keyword)
    }

    //최신/인기순 변경
    const sortChangeButton = (sortCategory) => {
        setSortCategory(sortCategory);
    }

    const [commnuityLoading, setCommunityLoading] = useState(true);
    const [communityApi, setCommunityApi] = useState('');

    //커뮤니티 데이터 가져오기
    const communityDataReceive = async () => {

        let parameeters = {'schText':schTexts, 'sort':sortCategory};

        if(paramsData != ''){
            parameeters = {'schText':schTexts, 'sort':sortCategory, 'code':paramsData};
        }

        await setCommunityLoading(true);
        await Api.send('bbs_list', parameeters, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;

            if(resultItem.result === 'Y' && arrItems) {
             //   console.log('결과 출력 파라미터..: ', resultItem);
                setCommunityApi(arrItems);
            }else{
                console.log('결과 출력 실패!');
            }
        });

        await setCommunityLoading(false);
    }



    const [tagList, setTagList] = useState([]);
    const [tagLists, setTagLists] = useState(schKeyword);

    const bbsTags = () => {
        Api.send('tag_list', {}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;

            if(resultItem.result === 'Y' && arrItems) {
                //console.log('태그 리스트 : ', arrItems);
                setTagList(arrItems);
                //setCommunityApi(arrItems);
            }else{
                console.log('결과 출력 실패!');
            }
        });
    }

    useEffect(()=>{
        bbsTags();

        
    },[])


    const [paramsData, setParamsData] = useState('');

    const isFocused = useIsFocused();
 
    useEffect(() => {
      
      if (isFocused){
        //console.log('포커스온ㅇㅇㅇㅇㅇ::::::::',props.route.params);
        setParamsData(props.route.params);
      } 
        
    }, [isFocused]);


    useEffect(()=>{
        //console.log('파라미터 변화 감지!!!!', paramsData);

        communityDataReceive();
    }, [paramsData])



    useEffect(()=>{
        setComData(communityApi);
    },[communityApi]);


    useEffect(()=>{
        setTagLists(tagList);
    },[tagList])


    const [keywordData, setKeywordData] = useState('');

    const keywordChangeList =  (keywords) => {

       
        if(keywords == keywordData){
            setKeywordData('');
        }else{
            setKeywordData(keywords);
        }

       

    }


    useEffect( async ()=>{
        console.log('키워드 변화 감지::', keywordData);

        await setCommunityLoading(true);


        await Api.send('bbs_list', {'schText':keywordData, 'sort':sortCategory}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;

            if(resultItem.result === 'Y' && arrItems) {
                //console.log('결과 출력 파라미터..: ', arrItems);
                setCommunityApi(arrItems);
            }else{
                console.log('결과 출력 실패!');
            }
        });

        await setCommunityLoading(false);
    },[keywordData])
   

    //검색 키워드
    const schKeywordData = tagLists.map((keyword, index)=>{
        return(
            <TouchableOpacity key={index} style={[styles.keywordButton, keywordData == keyword.name && {backgroundColor:'#666'}]} onPress={()=>keywordChangeList(keyword.name)}>
                <DefText text={'#' + keyword.name} style={[styles.keywordButtonText, keywordData == keyword.name && {color:'#fff'}]} />
            </TouchableOpacity>
        )
    })

    //커뮤니티 데이터 컴포넌트
    const _renderItem = ({item, index}) => {

        let categorys = item.keyword;

        
        //console.log('태그리스트', item.taglist);

         let keywords = item.tag.split('^');

            keywords.shift(); 

            keywords.pop();

//         console.log(keywords)

        
        const keywordName = keywords.map((keys, idx)=> {

            return(
                <Box key={idx} style={[styles.commnuityKeywordButton, {marginTop:0},idx === 0 && {marginLeft:0} ]}>
                    <DefText text={keys} style={[styles.keywordButtonText]} />
                </Box>
            )
        })

        return(
            <Box px={5} style={[ {marginBottom:20} ]}>
                <TouchableOpacity onPress={()=>{navigation.navigate('CommunityView', item)}}>
                    <HStack>
                        <Image source={{uri:item.upfile1}} alt={item.subject} style={{width:100, height:100, resizeMode:'contain'}} />
                        <VStack pl={2.5} width={HealthInfoWidth}  justifyContent='space-around'>
                            <DefText text={item.subject} style={styles.communityTitle} />
                            <HStack justifyContent='space-between' alignItems='center' flexWrap={'wrap'}>
                                <DefText text={item.count + ' reading'} style={styles.communityView} />
                                
                                {
                                    item.taglist.length > 0 &&
                                    <HStack>
                                        {
                                            item.taglist.map((tag, idx)=> {
                                                return(
                                                    <Box key={idx} style={[styles.commnuityKeywordButton, {marginTop:0},idx === 0 && {marginLeft:0} ]}>
                                                        <DefText text={tag} style={[styles.keywordButtonText]} />
                                                    </Box>
                                                )
                                            })
                                        }
                                    </HStack>
                                }
                                
                            </HStack>
                        </VStack>
                    </HStack>
                </TouchableOpacity>
            </Box>
        )
    }
   
    //맞춤건강정보 게시판 이동
    const goNavi = () => {
        navigation.navigate('CustomCommunity');
    }

    return (
        <Box flex={1} backgroundColor='#fff' >
            <HeaderDefault  headerTitle='건강정보' navigation={navigation} />
            {
                commnuityLoading ?
                <Box flex={1} justifyContent='center'>
                    <ActivityIndicator size='large' color='#000' />
                </Box>
                :
                <FlatList
                    data={comData}
                    ListHeaderComponent={
                        <>  
                            <Box px={5} pt={5}>
                                <HStack  alignItems='center' height='50px' backgroundColor='#F1F1F1' borderRadius={5}>
                                    <Input
                                        placeholder='검색하실 내용을 적어주세요.'
                                        height='45px'
                                        width={width-80}
                                        backgroundColor='transparent'
                                        borderWidth={0}
                                        value={communitySearch}
                                        onChangeText={SearchTextChagne}
                                        onSubmitEditing={schButtons}
                                    />
                                    <TouchableOpacity onPress={schButtons}>
                                        <Image source={require('../images/schIcons.png')} alt='검색' />
                                    </TouchableOpacity>
                                </HStack>
                                <HStack flexWrap='wrap'>
                                    {schKeywordData}
                                </HStack>
                            </Box>
                            {/* 당뇨 관리 */}
                            {
                                hospitalBanners != '' && 
                                <Box px={5} mt={5}>
                                    <TouchableOpacity onPress={()=>{navigation.navigate('ClinicViews', hospitalBanners)}} style={{width:width-40, height:110, backgroundColor:'#fff', borderRadius:10}}>
                                        <Image source={{uri:hospitalBanners.upfile}} alt={hospitalBanners.prdcode} style={{width:width-40, height:110, resizeMode:'contain'}} />
                                    </TouchableOpacity>
                                </Box>
                            }
                            
                            {/* 당뇨 관리 */}
                            <Box px={5} mt={2.5} mb={5}>
                                <HStack>
                                    <TouchableOpacity onPress={()=>sortChangeButton('최신순')} style={[styles.keywordButton, sortCategory === '최신순' && {backgroundColor:'#666'}]}>
                                        <DefText text='최신순' style={[styles.keywordButtonText, sortCategory === '최신순' && {color:'#fff'}]} />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={()=>sortChangeButton('인기순')} style={[styles.keywordButton, sortCategory === '인기순' && {backgroundColor:'#666'}]}>
                                        <DefText text='인기순' style={[styles.keywordButtonText, sortCategory === '인기순' && {color:'#fff'}]} />
                                    </TouchableOpacity>
                                </HStack>
                            </Box>
                        </>
                    }
                    renderItem={_renderItem}
                    keyExtractor={(item, index)=>index.toString()}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <Box py={10} alignItems='center'>
                            <DefText text='커뮤니티 내역이 없습니다.' style={{color:'#666'}} />
                        </Box>                
                    }
                    
                />
            }
            
     
          
        </Box>
    );
};

const styles = StyleSheet.create({
    keywordButton: {
        height:30,
        paddingHorizontal:10,
        backgroundColor:'#ddd',
        alignItems:'center',
        justifyContent:'center',
        borderRadius:35,
        marginRight:10,
        marginTop:10,
    },
    keywordButtonText: {
        fontSize: 14,
        color:'#333',
    },
    communityTitle: {
        fontSize:14,
        lineHeight:24,
        color:'#000'
    },
    communityView : {
        fontSize:13,
        color:'#FF004E'
    },
    commnuityKeywordButton: {
        height: 25,
        paddingHorizontal:10,
        backgroundColor:'#ddd',
        alignItems:'center',
        justifyContent:'center',
        borderRadius:25,
        marginLeft:10,
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
)(Community);