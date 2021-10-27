import React, {useState, useEffect} from 'react';
import { ScrollView, Dimensions, View, Text, Platform, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, ImageBackground, SafeAreaView } from 'react-native';
import { Box, HStack, VStack, Image, Input, Modal } from 'native-base';
import { DefText } from '../common/BOOTSTRAP';
import HeaderCommunity from '../components/HeaderCommunity';
import {diseaseDatas1, healthData} from '../Utils/DummyData';

const {width, height} = Dimensions.get('window');
const HealthInfoWidth = (width - 40) - 100;

const CustomCommunity = (props) => {

    const {navigation} = props;

    const [communitySearch, setCommunitySerach] = useState('');
    const SearchTextChagne = (text) => {
        setCommunitySerach(text);
    }

    //맟춤설정용 검색인풋
    const [customComSearch, setCustomComSearch] = useState('');
    const CustomeSearchChange = ( text ) => {
        setCustomComSearch(text);
    }

    const [schText, setSchText] = useState('');


    const diseaseSelectButton = (buttonText) => {
        setSchText(buttonText);
        setCustomComSearch(buttonText);
    }

    //연령대별 증상
    const diseaseDataList1 = diseaseDatas1.map((item, index)=>{
        return(
            <TouchableOpacity key={index} style={[styles.disButton, schText === item.diseaseName && {backgroundColor:'#666'} ]} onPress={()=>diseaseSelectButton(item.diseaseName)}>
                <DefText text={item.diseaseName} style={[styles.disText, schText === item.diseaseName && {color:'#fff'}]} />
            </TouchableOpacity>
        )
    })

    //최신순 인기순
    const [sortCategory, setSortCategory] = useState('최신순');

    //커뮤니티 데이터
    const [comData, setComData] = useState(healthData);

    //설정창 모달
    const [statusModal, setStatusModal] = useState(false);

  
    //최신/인기순 변경
    const sortChangeButton = (sortCategory) => {
        setSortCategory(sortCategory);
    }

    //맞춤건강정보 게시판 이동
    const goNavi = () => {
        navigation.goBack();
    }

    const ModalSave = () => {
        setStatusModal(!statusModal);
    }

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
                <TouchableOpacity>
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

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderCommunity navigation={navigation} headerTitle='맞춤건강정보' goScreen={goNavi} />
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
                        </Box>
                        
                        <Box mt={2.5} mb={5} mt={5}>
                            <HStack px={5} alignItems='center' justifyContent='space-between'>
                                <HStack>
                                    <TouchableOpacity onPress={()=>sortChangeButton('최신순')} style={[styles.commnuityKeywordButton, sortCategory === '최신순' && {backgroundColor:'#666'}]}>
                                        <DefText text='최신순' style={[styles.keywordButtonText, sortCategory === '최신순' && {color:'#fff'}]} />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={()=>sortChangeButton('인기순')} style={[styles.commnuityKeywordButton, sortCategory === '인기순' && {backgroundColor:'#666'}]}>
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
                        <DefText text='채팅내역이 없습니다.' style={{color:'#666'}} />
                    </Box>                
                }
                
            />
            <Modal isOpen={statusModal} style={{flex:1, backgroundColor:'#fff'}}>
                <SafeAreaView style={{width:'100%', flex:1}}>
                <Box >
                    <HStack justifyContent='space-between' height='50px' alignItems='center' style={{borderBottomWidth:1, borderBottomColor:'#e3e3e3'}} >
                        
                        <DefText text='맞춤형설정' style={{fontSize:20, position:'absolute', left:'50%', marginLeft:-40}} />
                        <TouchableOpacity style={{paddingRight:20}} onPress={()=>{setStatusModal(false)}}>
                            <Image source={require('../images/modalClose.png')} alt='닫기' />
                        </TouchableOpacity>
                    </HStack>
                    <Box height={height-50}>
                        <ScrollView>
                            <Box p={5}>
                                <Box>
                                    <DefText text='관심 질환 및 테마' style={styles.labelText} />
                                    <Box py={5} alignItems='center'>
                                        <DefText text='등록된 관심질환 및 테마가 없습니다.' style={{fontSize:15,color:'#666'}} />
                                    </Box>
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
                                    />
                                    <TouchableOpacity>
                                        <Image source={require('../images/schIcons.png')} alt='검색' />
                                    </TouchableOpacity>
                                </HStack>
                                <Box mt={5}>
                                    <HStack alignItems='flex-end'>
                                        <DefText text='연령별 주요질환' />
                                        <DefText text='만65세 기준' style={{fontSize:13,color:'#999', marginLeft:10}} />
                                    </HStack>
                                    
                                    <HStack flexWrap='wrap'>
                                    {
                                        diseaseDataList1.length>0 && 
                                        diseaseDataList1
                                    }
                                    </HStack>
                                </Box>
                            </Box>
                        </ScrollView>
                    </Box>
                </Box>
       
                </SafeAreaView>
             
                <Box px={5} py={2.5}>
                    <TouchableOpacity onPress={ModalSave} style={styles.medicineButtons}>
                        <DefText text='저장' style={styles.medicineButtonsText} />
                    </TouchableOpacity>
                </Box>
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
    },
    labelText: {
        fontSize:14,
        color:'#696968'
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
        fontWeight:'bold'
    },
    medicineButtons : {
        backgroundColor:'#999',
        borderRadius:5,
        alignItems:'center',
        justifyContent:'center',
        height: 40,
        width:width-40
    },
    medicineButtonsText: {
        fontSize:15,
        color:'#fff',
    },
})

export default CustomCommunity;