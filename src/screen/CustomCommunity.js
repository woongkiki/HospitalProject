import React, {useState, useEffect} from 'react';
import { ScrollView, Dimensions, View, Text, Platform, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, ImageBackground, SafeAreaView } from 'react-native';
import { Box, HStack, VStack, Image, Input, Modal } from 'native-base';
import { DefText } from '../common/BOOTSTRAP';
import HeaderCommunity from '../components/HeaderCommunity';
import {diseaseDatas1, healthData} from '../Utils/DummyData';
import { connect } from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import ToastMessage from '../components/ToastMessage';
import Api from '../Api';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import Font from '../common/Font';

const {width, height} = Dimensions.get('window');
const HealthInfoWidth = (width - 40) - 100;

const CustomCommunity = (props) => {

    const {navigation, userInfo, member_info} = props;


    //console.log('유저정보', userInfo);

    //맞춤형 커뮤니티 게시글 찾기
    const [communitySearch, setCommunitySerach] = useState('');
    const SearchTextChagne = (text) => {
        setCommunitySerach(text);
    }

    //맟춤설정용 질환검색인풋
    const [customComSearch, setCustomComSearch] = useState('');
    const CustomeSearchChange = ( text ) => {
        setCustomComSearch(text);
    }


    const [diseaseLoading, setDiseaseLoading] = useState(true);
    const [schDisease, setSchDisease] = useState('');

    const DiseaseSearch = async () => {
        if(!customComSearch){
            ToastMessage('검색어를 입력하세요.');
            return false;
        }

        setDiseaseLoading(false);

        await Api.send('disease_list', {'id':userInfo.id, 'token':userInfo.appToken, 'schText':customComSearch}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;

            if(resultItem.result === 'Y' && arrItems) {
               console.log('검색으로 찾은 질환정보: ', arrItems);

               setSchDisease(arrItems);
              
            }else{
                console.log('결과 출력 실패!', resultItem);
               // ToastMessage(resultItem.message);
            }
        });

        setDiseaseLoading(true);

    }


    const [schText, setSchText] = useState('');

    const [diseaseSelected, setDiseaseSelected] = useState([]);

    const diseaseSelectButton = (buttonText) => {
        //setSchText(buttonText);
        //setCustomComSearch(buttonText);
      

        if(diseaseSelected.includes(buttonText)){

            const findIdx = diseaseSelected.find((e) => e === buttonText); // 배열에 같은값이 있으면 출력
            const idxs = diseaseSelected.indexOf(findIdx);

            diseaseSelected.splice(idxs, 1)

            setDiseaseSelected([...diseaseSelected]);
    
        }else{
            
            setDiseaseSelected([...diseaseSelected, buttonText]);

        }


    }

    useEffect(()=>{
        console.log('선택한 질환::::', diseaseSelected);
    }, [diseaseSelected])



    //최신순 인기순
    const [sortCategory, setSortCategory] = useState('최신순');

    //커뮤니티 데이터
    const [comData, setComData] = useState(healthData);

    //설정창 모달
    const [statusModal, setStatusModal] = useState(false);

  
    //최신/인기순 변경
    const sortChangeButton = (sortCategory) => {
        setSortCategory(sortCategory);

        WishDisease();
    }

    //맞춤건강정보 게시판 이동
    const goNavi = () => {
        navigation.navigate('Scrap');
    }

    const ModalSave = () => {

        // if(diseaseSelected.length > 0){
        //     ToastMessage('관심 및 질환을 하나 이상 선택하세요.');
        // }

        Api.send('member_interest', {'id':userInfo.id, 'token':userInfo.appToken, 'disease':diseaseSelected.join('^')}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;

            if(resultItem.result === 'Y' && arrItems) {
               console.log('연령별 주요 질환: ', arrItems);

               //ToastMessage(resultItem.message);
               setStatusModal(false);
               WishDisease();

            }else{
                console.log('결과 출력 실패!', resultItem);
               // ToastMessage(resultItem.message);
            }
        });

        
    }

    //커뮤니티 데이터 컴포넌트
    const _renderItem = ({item, index}) => {

        let categorys = item.tag;

        
        let keywords = categorys.split('^');

        
        const keywordName = keywords.map((keys, idx)=> {

            return(
                <Box key={idx} style={[styles.commnuityKeywordButton, {marginTop:0, marginRight:0}, idx == keywords.length - 1 ? {marginRight:0} : {marginRight:5} ]}>
                    <DefText text={keys} style={[styles.keywordButtonText]} />
                </Box>
            )
        })

        return(
            <Box key={index} px={5}>
                <TouchableOpacity onPress={()=>{navigation.navigate('CommunityView', item)}} style={[{borderBottomWidth:1, paddingVertical:15, borderBottomColor:'#f1f1f1'}, index === 0 && {borderTopColor:'#f1f1f1', borderTopWidth:1} ]}>
                    <HStack>
                        <Image source={{uri:item.upfile1}} alt={item.subject} style={{width:100, height:70, resizeMode:'stretch', borderRadius:10}} />
                        
                        <VStack pl={2.5} width={HealthInfoWidth}  justifyContent='space-around'>
                            <DefText text={item.subject} style={styles.communityTitle} />
                            <HStack justifyContent='space-between' alignItems='center' >
                                <DefText text={'조회 : '+item.count} style={styles.communityView} />
                                <HStack>
                                    {keywordName}
                                </HStack>
                            </HStack>
                        </VStack>
                    </HStack>
                </TouchableOpacity>
            </Box>
        )
    }

    const [diseaseAge, setDiseaseAge] = useState('');
    const [diseaseList, setDiseaseList] = useState('');

    const AgeDiseaseReqeust = () => {

        Api.send('disease_age', {'id':userInfo.id, 'token':userInfo.appToken}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;

            if(resultItem.result === 'Y' && arrItems) {
              // console.log('연령별 주요 질환: ', arrItems);

               setDiseaseAge(arrItems.age);
               setDiseaseList(arrItems.disease);

            }else{
                console.log('결과 출력 실패!', resultItem);
               // ToastMessage(resultItem.message);
            }
        });
    }


    const [interestList, setInterestList] = useState('');

    const member_info_handle = async () => {
        

        const formData = new FormData();
        formData.append('method', 'member_info');
        formData.append('id', userInfo.email);
        formData.append('token', userInfo.appToken);
        const member_info_list = await member_info(formData);

        //console.log('회원정보를 조회1', member_info_list.result.interestDisease);
        
        if(member_info_list.result.interestDisease != null){

            setDiseaseSelected(member_info_list.result.interestDisease.split('^'));

        }else{

            setInterestList([]);
        }

    };


    const [comLoading, setComLoading] = useState(false);
    const [CommuntyList, setCommunityList] = useState([]);


    //관심질환에 맞는 목록 나오기
    const WishDisease = async () => {

        await setComLoading(false);
        await Api.send('bbs_interest', {'id':userInfo.id, 'token':userInfo.appToken, 'schText':communitySearch, 'sort':sortCategory}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;

            if(resultItem.result === 'Y' && arrItems) {
               console.log('내 질환에 맞는 커뮤니티 글: ', arrItems);


               setCommunityList(arrItems);

            }else{
                console.log('결과 출력 실패!', resultItem);
               // ToastMessage(resultItem.message);
            }
        });

        await setComLoading(true);
    }


    useEffect(()=>{
        member_info_handle();
        AgeDiseaseReqeust();

        WishDisease();
    },[])


    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderCommunity navigation={navigation} headerTitle='맞춤건강정보' goScreen={goNavi} />
            {
                comLoading ?
                <FlatList
                    
                    data={CommuntyList}
                    ListHeaderComponent={
                        <>  
                            <Box px={5} pt={5}>
                                <HStack  alignItems='center' height='50px' backgroundColor='#F1F1F1' borderRadius={10}>
                                    <Input
                                        placeholder='검색하실 내용을 적어주세요.'
                                        height='45px'
                                        width={width-80}
                                        backgroundColor='transparent'
                                        borderWidth={0}
                                        value={communitySearch}
                                        onChangeText={SearchTextChagne}
                                        style={{fontSize:16, fontFamily:Font.NotoSansMedium}}
                                    />
                                    <TouchableOpacity >
                                        <Image source={require('../images/schIcons.png')} alt='검색' />
                                    </TouchableOpacity>
                                </HStack>
                            </Box>
                            
                            <Box mb={5} mt={5}>
                                <HStack px={5} alignItems='center' justifyContent='space-between'>
                                    <HStack>
                                        <TouchableOpacity onPress={()=>sortChangeButton('최신순')} style={[styles.commnuityKeywordButton, sortCategory === '최신순' && {backgroundColor:'#696969'}]}>
                                            <DefText text='최신순' style={[styles.keywordButtonText, sortCategory === '최신순' && {color:'#fff'}]} />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={()=>sortChangeButton('인기순')} style={[styles.commnuityKeywordButton, sortCategory === '인기순' && {backgroundColor:'#696969'}]}>
                                            <DefText text='인기순' style={[styles.keywordButtonText, sortCategory === '인기순' && {color:'#fff'}]} />
                                        </TouchableOpacity>
                                    </HStack>
                                    <TouchableOpacity onPress={()=>{setStatusModal(!statusModal)}}>
                                        <Image source={require('../images/customIcons.png')} alt='설정' style={{width:24, height:24}} resizeMode='contain' />
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
                            <DefText text='내 관심질환에 맞는 게시물이 없습니다.' style={{color:'#666'}} />
                        </Box>                
                    }
                    
                    
                />
                :
                <Box flex={1} alignItems='center' justifyContent='center'>
                    <ActivityIndicator size='large' color='#333' />
                </Box>
            }
            
            <Modal isOpen={statusModal} style={{flex:1, backgroundColor:'#fff', width:width}}>
                <SafeAreaView style={{flex:1}}>
                <Box>
                    <HStack justifyContent='space-between' height='50px' alignItems='center' style={{borderBottomWidth:1, borderBottomColor:'#e3e3e3'}} >
                        
                        <DefText text='맞춤형설정' style={{fontSize:20, lineHeight:24, position:'absolute', width:width, textAlign:'center'}} />
                        <TouchableOpacity style={{paddingRight:20}} onPress={()=>{setStatusModal(false)}}>
                            <Image source={require('../images/modalClose.png')} alt='닫기' />
                        </TouchableOpacity>
                    </HStack>
                    <Box height={height-50}>
                        <ScrollView>
                            <Box p={5}>
                                <Box mb={5}>
                                    <DefText text='관심 질환 및 테마' style={styles.labelText} />
                       
                                    {
                                        diseaseSelected.length > 0 ?
                                        <HStack flexWrap='wrap'>
                                            {
                                                diseaseSelected.map((item, index)=> {
                                                    return(
                                                        <Box key={index} style={styles.disButton}>
                                                            <DefText text={item} style={styles.disText}/>
                                                        </Box>
                                                    )
                                                })
                                            }
                                        </HStack>
                                        :
                                        <Box mt={2.5}>
                                            <DefText text='등록된 관심 질환 및 테마가 없습니다.' style={{color:'#666'}} />
                                        </Box>
                                    }
                                    
                                </Box>
                                <HStack  alignItems='center' height='50px' backgroundColor='#F1F1F1' borderRadius={5}>
                                    <Input
                                        placeholder='설정하실 관심질환을 검색하세요'
                                        height='45px'
                                        width={width-80}
                                        backgroundColor='transparent'
                                        borderWidth={0}
                                        value={customComSearch}
                                        onChangeText={CustomeSearchChange}
                                        _focus='transparent'
                                        style={{fontSize:14}}
                                        onSubmitEditing={DiseaseSearch}
                                    />
                                    <TouchableOpacity onPress={DiseaseSearch}>
                                        <Image source={require('../images/schIcons.png')} alt='검색' />
                                    </TouchableOpacity>
                                </HStack>
                                {
                                    
                                    schDisease != '' ?
                                    diseaseLoading ?
                                        <HStack flexWrap='wrap'>
                                            {
                                                    schDisease.map((item, index)=> {
                                                    return(
                                                        <TouchableOpacity key={index} style={[styles.disButton, diseaseSelected.includes(item.name) && {backgroundColor:'#666'} ]} onPress={()=>diseaseSelectButton(item.name)}>
                                                            <DefText text={item.name} style={[styles.disText, diseaseSelected.includes(item.name) && {color:'#fff'}]} />
                                                        </TouchableOpacity>
                                                    )
                                                })
                                            }
                                        </HStack>
                                        :
                                        <Box py={5} alignItems='center'>
                                            <ActivityIndicator size='large' color='#666' />
                                        </Box>
                                    :
                                    <Box>
                                    </Box>
                                }
                                <Box mt={5}>
                                    <HStack alignItems='flex-end'>
                                        <DefText text='연령별 주요질환' />
                                        {
                                            diseaseAge != '' &&
                                            <DefText text={'만'+diseaseAge+'세 기준'} style={{fontSize:13,color:'#999', marginLeft:10}} />
                                        }
                                    </HStack>
                                    {
                                        diseaseList != '' &&
                                        <HStack flexWrap='wrap'>
                                            {
                                                 diseaseList.map((item, index)=> {
                                                    return(
                                                        <TouchableOpacity key={index} style={[styles.disButton, diseaseSelected.includes(item.name) && {backgroundColor:'#696969'} ]} onPress={()=>diseaseSelectButton(item.name)}>
                                                            <DefText text={item.name} style={[styles.disText, diseaseSelected.includes(item.name) && {color:'#fff'}]} />
                                                        </TouchableOpacity>
                                                    )
                                                })
                                            }
                                        </HStack>
                                    }
                                </Box>
                            </Box>
                            <Box height='80px'  alignItems='center' pt='8px'>
                                <TouchableOpacity onPress={ModalSave} style={styles.medicineButtons}>
                                    <DefText text='저장' style={styles.medicineButtonsText} />
                                </TouchableOpacity>
                            </Box>
                        </ScrollView>
                        
                    </Box>
                </Box>

                </SafeAreaView>
               
            </Modal>
            
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
        borderRadius:10,
        marginRight:10,
        marginTop:10,
    },
    keywordButtonText: {
        fontSize: 14,
        color:'#000',
        fontFamily:Font.NotoSansMedium
    },
    communityTitle: {
        fontSize:14,
        color:'#000',
        fontFamily:Font.NotoSansBold,
        fontWeight:'bold'
    },
    communityView : {
        fontSize:14,
        color:'#696969'
    },
    commnuityKeywordButton: {
        height: 25,
        paddingHorizontal:10,
        backgroundColor:'#f1f1f1',
        alignItems:'center',
        justifyContent:'center',
        borderRadius:10,
        marginRight:10,
    },
    labelText: {
        fontSize:14,
        color:'#696969',
        fontFamily:Font.NotoSansMedium
    },
    disButton: {
        paddingVertical:5,
        paddingHorizontal:10,
        borderRadius:10,
        height:30,
        backgroundColor:'#f1f1f1',
        marginRight:10,
        marginTop:10
    },
    disText: {
        fontSize:14,
        color:'#333',
        fontWeight:'500',
        fontFamily:Font.NotoSansMedium
    },
    medicineButtons : {
        backgroundColor:'#090A73',
        borderRadius:10,
        alignItems:'center',
        justifyContent:'center',
        height: 45,
        width:width-40,
    },
    medicineButtonsText: {
        fontSize:15,
        color:'#fff',
    },
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
)(CustomCommunity);