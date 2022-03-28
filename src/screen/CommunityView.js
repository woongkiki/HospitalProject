import React, {useState, useEffect} from 'react';
import { ScrollView, Dimensions, View, Text, Platform, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, ImageBackground, Alert, ActivityIndicator } from 'react-native';
import { Box, HStack, VStack, Image, Input, Modal, CheckIcon } from 'native-base';
import { DefText } from '../common/BOOTSTRAP';
import HeaderCommunity from '../components/HeaderCommunity';
import {schKeyword, healthData, ScrapFolderData} from '../Utils/DummyData';
import ToastMessage from '../components/ToastMessage';
import RenderHtml from 'react-native-render-html';
import StyleHtml from '../common/StyleHtml';
import { StackActions } from '@react-navigation/native';
import { connect } from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import Api from '../Api';
import AsyncStorage from '@react-native-community/async-storage';
import Font from '../common/Font';
import { WebView } from 'react-native-webview';
import { BASE_URL } from '../Utils/APIConstant';

const {width, height} = Dimensions.get('window');

const CommunityView = (props) => {

    const {navigation, route, userInfo} = props;

    const {params} = route;

    const [modalView, setModalView] = useState(false);
    //console.log(params);

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
               // console.log('스크랩 폴더 정보: ', arrItems);

               ToastMessage(resultItem.message);
               setScrapModal(false);
               setModalView(false);
               BBSDetail();

               loadings();

            }else{
                console.log('결과 출력 실패!', resultItem);
               //Alert.alert(resultItem.message);
            }
        });
        // ToastMessage('게시물이 스크랩되었습니다.');
        // setScrapModal(false);
        // setModalView(false);
    }

   

    const scrapHandle = () => {
        setScrapModal(true);
    }

    const scrapDelete = () => {
        //scrapCompleteHandler();

        Api.send('bbs_scrapDelete', {'id':userInfo.id, 'token':userInfo.appToken, 'bidx':params.idx}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               // console.log('스크랩 폴더 정보: ', arrItems);

               ToastMessage(resultItem.message);
              // setScrapModal(false);
               setModalView(false);
               BBSDetail();

               loadings();

            }else{
                console.log('결과 출력 실패!', resultItem);
               //Alert.alert(resultItem.message);
            }
        });
    }

    const [myScrapFolder, setMyScrapFolder] = useState([]);

    const myScrapFolderList = () => {
        Api.send('scrap_folder', {'id':userInfo.id, 'token':userInfo.appToken}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                //console.log('스크랩 폴더 정보: ', arrItems);
             
                setMyScrapFolder(arrItems);

            }else{
                console.log('결과 출력 실패!', resultItem);
               //ToastMessage(resultItem.message);
            }
        });
    }

    const [detailLoading , setDetailLoading] = useState(false);
    const [detailSet, setDetail] = useState('');

    const BBSDetail = async () => {
        
        await setDetailLoading(false);

        await Api.send('bbs_detail', {'id':userInfo.id, 'token':userInfo.appToken, 'idx':params.idx}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                console.log('디테일 정보: ', arrItems);
             
                setDetail(arrItems);

            }else{
                console.log('결과 출력 실패!', resultItem);
               //ToastMessage(resultItem.message);
            }
        });

        await setDetailLoading(true);
    }



    useEffect(()=>{
        myScrapFolderList();

        BBSDetail();

        
    }, [])

    useEffect(()=>{
        console.log(myScrapFolder)
    }, [myScrapFolder]);


    const [webViewLoading, setWebViewLoading] = useState(false);

    const ScrapMove = () => {
        navigation.navigate('Scrap');
    }


    const loadings = async () => {
        await setWebViewLoading(true);
        await setWebViewLoading(false);
    }

    useEffect( ()=>{
        loadings();
    }, [])

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderCommunity navigation={navigation} headerTitle='건강정보' />
            {
                webViewLoading ?
                <Box flex={1} justifyContent='center' alignItems={'center'}>
                    <ActivityIndicator size={'large'} color='#333' />
                </Box>
                :
                <Box flex={1} p='12px'>
                    <WebView
                        source={{
                            uri: BASE_URL + '/adm/rn-webview/bbs.php?idx='+params.idx+'&id=' + userInfo.id
                        }}
                        style={{
                            opacity:0.99,
                            minHeight:1
                        }}
                        onMessage={e => setModalView(true)}
                        originWhitelist={['*']}
                    />
                </Box>
            }
            
            
            <Modal isOpen={modalView} onClose={() => setModalView(false)}>
            
                <Modal.Content maxWidth={width} width={width} borderRadius={0} position='absolute' bottom={0}>
                    <Modal.Body>
                    {
                        detailSet.scrapChk ?
                        <TouchableOpacity onPress={scrapDelete}>
                            <DefText text={ '스크랩 삭제하기'} />
                        </TouchableOpacity>
                        :
                        <TouchableOpacity onPress={scrapHandle}>
                            <DefText text={ '스크랩하기'} />
                        </TouchableOpacity>
                    }
                        
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

                                <TouchableOpacity onPress={scrapCompleteHandler} disabled={selectButton} style={[styles.medicineButtons, !selectButton && {backgroundColor:'#090A73'}]} >
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
        fontSize:22,
        lineHeight:30,
        color:'#000',
        fontWeight:'bold',
        fontFamily:Font.NotoSansBold
    },
    boardViewWriter: {
        fontSize:16,
        color:'#696969'
    },
    boardViewDate: {
        color:'#696969',
        marginTop:5
    },
    boardViewContent: {
        fontSize:16,
        color:'#000'
    },
    medicineButtons : {
        backgroundColor:'#090A73',
        borderRadius:10,
        alignItems:'center',
        justifyContent:'center',
        height: 45,
        marginTop:20
    },
    medicineButtonsText: {
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
)(CommunityView);