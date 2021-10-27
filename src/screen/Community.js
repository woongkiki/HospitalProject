import React, {useState, useEffect} from 'react';
import { ScrollView, Dimensions, View, Text, Platform, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, ImageBackground } from 'react-native';
import { Box, HStack, VStack, Image, Input } from 'native-base';
import { DefText } from '../common/BOOTSTRAP';
import HeaderDefault from '../components/HeaderDefault';
import {schKeyword, healthData} from '../Utils/DummyData';

const {width} = Dimensions.get('window');
const HealthInfoWidth = (width - 40) - 100;

const Community = (props) => {

    const {navigation} = props;

    const [communitySearch, setCommunitySerach] = useState('');
    const SearchTextChagne = (text) => {
        setCommunitySerach(text);
    }

    //검색키워드 관리
    const [isKeyword, setIsKeyword] = useState('');

    //최신순 인기순
    const [sortCategory, setSortCategory] = useState('최신순');

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

    //검색 키워드
    const schKeywordData = schKeyword.map((keyword, index)=>{
        return(
            <TouchableOpacity key={index} style={[styles.keywordButton, keyword.keyword === isKeyword && {backgroundColor:'#666'} ]} onPress={()=>keywrodChange(keyword.keyword)}>
                <DefText text={'#' + keyword.keyword} style={[styles.keywordButtonText, keyword.keyword === isKeyword && {color:'#fff'}]} />
            </TouchableOpacity>
        )
    })

    //커뮤니티 데이터 컴포넌트
    const _renderItem = ({item, index}) => {

        let categorys = item.keyword;

        
        let keywords = categorys.split(',');

        
        const keywordName = keywords.map((keys, idx)=> {

            return(
                <Box key={idx} style={[styles.commnuityKeywordButton, {marginTop:0},idx != 0 && {marginRight:0} ]}>
                    <DefText text={keys} style={[styles.keywordButtonText]} />
                </Box>
            )
        })

        return(
            <Box px={5} style={[ {marginBottom:20} ]}>
                <TouchableOpacity onPress={()=>{navigation.navigate('CommunityView', item)}}>
                    <HStack>
                        <Image source={{uri:item.imgUrl}} alt={item.communityTitle} style={{width:100, height:100, resizeMode:'contain'}} />
                        <VStack pl={2.5} width={HealthInfoWidth}  justifyContent='space-around'>
                            <DefText text={item.communityTitle} style={styles.communityTitle} />
                            <HStack justifyContent='space-between' alignItems='center' >
                                <DefText text={item.commnuityView + ' reading'} style={styles.communityView} />
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
   
    //맞춤건강정보 게시판 이동
    const goNavi = () => {
        navigation.navigate('CustomCommunity');
    }

    return (
        <Box flex={1} backgroundColor='#fff' >
            <HeaderDefault  headerTitle='건강정보' />
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
                                />
                                <TouchableOpacity>
                                    <Image source={require('../images/schIcons.png')} alt='검색' />
                                </TouchableOpacity>
                            </HStack>
                            <HStack flexWrap='wrap'>
                                {schKeywordData}
                            </HStack>
                        </Box>
                        <Box px={5}>            
                            <Box mt={5}>
                                <TouchableOpacity style={{width:width-40, height:110, backgroundColor:'#fff', borderRadius:10}}>
                                    <ImageBackground 
                                        source={require('../images/diabetesBg.png')}
                                        style={{ height:140, width:width-10, marginLeft:-10, marginTop:-15, alignItems:'center', justifyContent:'center'}}
                                        resizeMode='contain'
                                    >
                                        <Box
                                            width={width-40}
                                            height={100}
                                            //backgroundColor='#ff0'
                                            alignItems='center'
                                            justifyContent='center'
                                            mt={-2.5}
                                        >
                                            <HStack alignItems='center' justifyContent='space-between' width={width-40} >
                                                
                                                <VStack position='absolute' right={5} backgroundColor='#fff' py={2.5} pl={2.5}>
                                                    <DefText text='똑똑한 당뇨관리' style={{fontSize:18, fontWeight:'bold', textAlign:'right'}} />
                                                    <DefText text='이제 연속혈당측정기로 확인하세요' style={{fontSize:15, marginTop:10}} />
                                                </VStack>
                                            </HStack>
                                        </Box>
                                    </ImageBackground>
                                </TouchableOpacity>
                            </Box>
                        </Box>
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
                        <DefText text='채팅내역이 없습니다.' style={{color:'#666'}} />
                    </Box>                
                }
                
            />
     
          
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
        marginRight:10,
    }
})

export default Community;