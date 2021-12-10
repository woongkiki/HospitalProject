import React, {useState, useEffect} from 'react';
import { ScrollView, Dimensions, View, Text, Platform, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, ImageBackground, Alert, ActivityIndicator } from 'react-native';
import { Box, HStack, VStack, Image, Input, Modal, CheckIcon } from 'native-base';
import { DefText } from '../common/BOOTSTRAP';
import HeaderCommunity from '../components/HeaderCommunity';
import {schKeyword, healthData, ScrapFolderData} from '../Utils/DummyData';
import ToastMessage from '../components/ToastMessage';
import HTML from 'react-native-render-html';
import StyleHtml from '../common/StyleHtml';
import { StackActions } from '@react-navigation/native';
import { connect } from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import Api from '../Api';
import AsyncStorage from '@react-native-community/async-storage';

const {width, height} = Dimensions.get('window');

const CommunityView = (props) => {

    const {navigation, route, userInfo} = props;

    const {params} = route;

    const [modalView, setModalView] = useState(false);
    console.log(params);

    const [scrapModal, setScrapModal] = useState(false);

    const [folderSelect, setFolderSelect] = useState('');
    const [selectButton, setSelectButton] = useState(true);

    const folderSelectHandler = (idx) => {
        if(folderSelect == idx){
            setFolderSelect('');
            setSelectButton(true);
        }else{
            setFolderSelect(idx);
            setSelectButton(false);
        }
    }

    const scrapCompleteHandler = () => {

        console.log('폴더 idx::::', folderSelect);
        console.log('게시판 idx:::::', params.idx);

        Api.send('bbs_scrap', {'id':userInfo.id, 'token':userInfo.appToken, 'fidx':folderSelect, 'bidx':params.idx}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                console.log('스크랩 폴더 정보: ', resultItem);

               ToastMessage(resultItem.message);
               setScrapModal(false);
               setModalView(false);

            }else{
                console.log('결과 출력 실패!', resultItem);
               Alert.alert(resultItem.message);
            }
        });
        // ToastMessage('게시물이 스크랩되었습니다.');
        // setScrapModal(false);
        // setModalView(false);
    }

   

    const scrapHandle = () => {
        setScrapModal(true);
    }

    const [myScrapFolder, setMyScrapFolder] = useState([]);

    const myScrapFolderList = () => {
        Api.send('scrap_folder', {'id':userInfo.id, 'token':userInfo.appToken}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                console.log('스크랩 폴더 정보: ', arrItems);
             
                setMyScrapFolder(arrItems);

            }else{
                console.log('결과 출력 실패!', resultItem);
               ToastMessage(resultItem.message);
            }
        });
    }

    const [detailSet, setDetail] = useState('');

    const BBSDetail = () => {
        Api.send('bbs_detail', {'id':userInfo.id, 'token':userInfo.appToken, 'idx':params.idx}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                console.log('디테일 정보: ', arrItems);
             
                setDetail(arrItems);

            }else{
                console.log('결과 출력 실패!', resultItem);
               ToastMessage(resultItem.message);
            }
        });
    }

    useEffect(()=>{
        myScrapFolderList();

        BBSDetail();
    }, [])

    useEffect(()=>{
        console.log(myScrapFolder)
    }, [myScrapFolder]);


    
    

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderCommunity navigation={navigation} headerTitle='건강정보' />
            {
                detailSet != '' ?
                <ScrollView>
                    <Box p={5}>
                        <Box width='90%' mb={10}>
                            <DefText text={detailSet.subject} style={styles.boardViewTitle} />
                        </Box>
                        <HStack alignItems='center' pb={5} borderBottomWidth={1} borderBottomColor='#dfdfdf' justifyContent='space-between' pr={5}>
                            <HStack alignItems='center'>
                                <Image 
                                    source={require('../images/hospitalLogo.png')} 
                                    alt='hospital logo'
                                    style={{marginRight:20, width:64, height:64, resizeMode:'contain'}}
                                />
                                <Box>
                                    <DefText text={detailSet.name} style={styles.boardViewWriter} />
                                    <DefText text={detailSet.datetimes} style={styles.boardViewDate} />
                                </Box>
                            </HStack>
                            <TouchableOpacity onPress={() => setModalView(true)}>
                                <Image source={require('../images/communituOption.png')} alt='옵션' />
                            </TouchableOpacity>
                        </HStack>
                        <Box py={5} px={2.5}>
                        {/* <Image source={{uri:params.communityContent}} alt={params.communityTitle} width={width-40} height={400} /> */}
                        {/* <DefText text={params.content} /> */}
                        <HTML 
                                ignoredStyles={[ 'width', 'height', 'margin', 'padding', 'fontFamily', 'lineHeight', 'fontSize', 'br']}
                                ignoredTags={['head', 'script', 'src']}
                                imagesMaxWidth={Dimensions.get('window').width - 40}
                                source={{html: detailSet.content}} 
                                tagsStyles={StyleHtml}
                                containerStyle={{ flex: 1, }}
                                contentWidth={Dimensions.get('window').width}  
                            />
                        </Box>
                    </Box>
                </ScrollView>
                :
                <Box flex={1} alignItems='center' justifyContent='center'>
                    <ActivityIndicator size='large' color='#333' />
                </Box>
            }
            
            <Modal isOpen={modalView} onClose={() => setModalView(false)}>
            
                <Modal.Content maxWidth={width} width={width} borderRadius={0} position='absolute' bottom={0}>
                    <Modal.Body>
                        <TouchableOpacity onPress={scrapHandle}>
                            <DefText text='스크랩하기' />
                        </TouchableOpacity>
                    </Modal.Body>
                </Modal.Content>
            </Modal>

            <Modal isOpen={scrapModal} style={{flex:1, backgroundColor:'#fff'}}>
                <SafeAreaView style={{width:'100%', flex:1}}>
                    <ScrollView>
                        <Box>
                            <HStack justifyContent='space-between' height='50px' alignItems='center' style={{borderBottomWidth:1, borderBottomColor:'#e3e3e3'}} >
                                <TouchableOpacity style={{paddingLeft:20}} onPress={()=>{setScrapModal(false)}}>
                                    <Image source={require('../images/map_close.png')} alt='닫기' />
                                </TouchableOpacity>
                                <DefText text='폴더선택' style={{fontSize:20, lineHeight:25}} />
                                <DefText text='' style={{width:40}} />
                            </HStack>
                            <Box p={5}>
                                {
                                    myScrapFolder.length != '0' ?
                                    myScrapFolder.map((item, index)=> {
                                        return(
                                            <TouchableOpacity activeOpacity={0.9} key={index} style={index != 0 && {marginTop:10}} onPress={()=>folderSelectHandler(item.idx)} >
                                                <ImageBackground 
                                                    source={require('../images/folderImg.png')}
                                                    style={{ height:87, width:width-40, justifyContent:'center', paddingLeft:20, paddingRight:20}}
                                                    resizeMode='contain'
                                                >
                                                    <HStack justifyContent='space-between' alignItems='center'>
                                                        <DefText text={item.fname} style={{fontSize:18}} />
                                                        <Box width='20px' height='20px' borderWidth={1} borderColor='#666' alignItems='center' justifyContent='center'>
                                                            {
                                                                folderSelect == item.idx &&
                                                                <CheckIcon color='#f00' width='12px' />
                                                            }
                                                        </Box>
                                                    </HStack>
                                                </ImageBackground>
                                            </TouchableOpacity>
                                        )
                                    })
                                    
                                    :
                                    <DefText text='스크랩용 폴더를 먼저 생성하세요.' />
                                }

                                <TouchableOpacity onPress={scrapCompleteHandler} disabled={selectButton} style={[styles.medicineButtons, !selectButton && {backgroundColor:'#666'}]} >
                                    <DefText text='폴더선택완료' style={styles.medicineButtonsText} />
                                </TouchableOpacity>
                            </Box>
                            
                        </Box>
                    </ScrollView>
                </SafeAreaView>
            </Modal>
        </Box>
    );
};

const styles = StyleSheet.create({
    boardViewTitle: {
        fontSize:20,
        lineHeight:23,
        color:'#000',
        fontWeight:'bold'
    },
    boardViewWriter: {
        fontSize:15,
        lineHeight:21,
        color:'#666'
    },
    boardViewDate: {
        fontSize:15,
        lineHeight:21,
        color:'#666',
        marginTop:5
    },
    boardViewContent: {
        fontSize:15,
        lineHeight:21,
        color:'#333'
    },
    medicineButtons : {
        backgroundColor:'#999',
        borderRadius:5,
        alignItems:'center',
        justifyContent:'center',
        height: 40,
        marginTop:20
    },
    medicineButtonsText: {
        fontSize:15,
        lineHeight:21,
        color:'#fff',
        
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
)(CommunityView);