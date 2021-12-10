import React, {useState, useEffect} from 'react';
import { TouchableOpacity, Dimensions, Text, ScrollView, StyleSheet, FlatList, ImageBackground, Alert } from 'react-native';
import { Box, Image, HStack, Input, Modal, VStack } from 'native-base';
import { DefText } from '../common/BOOTSTRAP';
import HeaderComponents from '../components/HeaderComponents';
import { ScrapFolderData } from '../Utils/DummyData';
import { connect } from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import Api from '../Api';
import ToastMessage from '../components/ToastMessage';

const {width} = Dimensions.get('window');

const Scrap = ( props ) => {

    const { navigation, userInfo } = props;

    const [folderAddModal, setFolderAddModal] = useState(false);

    const [folderName, setFolderName] = useState('');

    const folderNameChange = (text) => {
        setFolderName(text);
    }

    const [folderData, setFolderData] = useState(ScrapFolderData);

    const ScrapFolderAdds = () => {
        if(!folderName){
            ToastMessage('폴더명을 입력하세요.');
            return false;
        }

        Api.send('scrap_set', {'id':userInfo.id, 'token':userInfo.appToken, 'fname':folderName}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                console.log('스크랩 폴더 정보: ', arrItems);
             
                //setScrapFolders(arrItems);
                ToastMessage(resultItem.message);
                setFolderAddModal(false);
                scrapFolderList();

            }else{
                console.log('결과 출력 실패!', resultItem);
               ToastMessage(resultItem.message);
            }
        });
        // setFolderData([...folderData, {idx:2, folderName:folderName, board :[]}]);
        // setFolderAddModal(false);
        // setFolderName('');

        //직박구리
    }

    useEffect(()=>{
        console.log(folderData);
    },[folderData]);




    const [scrapFolders, setScrapFolders] = useState('');

    const scrapFolderList = () => {

        Api.send('scrap_folder', {'id':userInfo.id, 'token':userInfo.appToken}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                console.log('스크랩 폴더 정보: ', arrItems);
             
                setScrapFolders(arrItems);

            }else{
                console.log('결과 출력 실패!', resultItem);
               ToastMessage(resultItem.message);
            }
        });
        
    }

    useEffect(()=>{
        scrapFolderList()
    }, [])


    const [closeStatus, setCloseStatus] = useState('');
    
    const [folderModal, setFolderModal] = useState(false);
    const folderRemoveModal = () => {
        setFolderModal(true);
    }

    const folderRemoves = () => {
        console.log('삭제할 폴더 idx값::::', closeStatus);


        Api.send('scrap_delete', {'id':userInfo.id, 'token':userInfo.appToken, 'idx':closeStatus}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               // console.log('스크랩 폴더 정보: ', arrItems);
                ToastMessage(resultItem.message);
                setFolderModal(false);
                scrapFolderList();

            }else{
               // console.log('결과 출력 실패!', resultItem);
               ToastMessage(resultItem.message);
            }
        });
    }
    

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderComponents headerTitle='스크랩' navigation={navigation} />
            <ScrollView>
                <Box px={5} py={5}>
                    {
                        scrapFolders != '' ?
                        scrapFolders.map((item, index)=>{
                            return(
                                <TouchableOpacity onPress={()=>{navigation.navigate('ScrapView', item)}} onLongPress={()=>setCloseStatus(item.idx)} activeOpacity={0.9} key={index} style={index != 0 && {marginTop:10}} >
                                    <ImageBackground 
                                        source={require('../images/folderImg.png')}
                                        style={{ height:87, width:width-40, justifyContent:'center', paddingLeft:20}}
                                        resizeMode='contain'
                                    >
                                        <DefText text={item.fname + "(" + item.cnt + ")"} style={{fontSize:18, lineHeight:25}} />
                                        {
                                            closeStatus == item.idx &&
                                            <Box position='absolute' right='15px' top='50%' marginTop={-4} zIndex='9'>
                                                <TouchableOpacity onPress={()=>folderRemoveModal()} style={{width:40, height:40, backgroundColor:'#f1f1f1', borderRadius:20, alignItems:'center', justifyContent:'center'}}>
                                                    <Image source={require('../images/folderDel.png')} alt='폴더삭제' />
                                                </TouchableOpacity>
                                            </Box>
                                        }
                                        
                                    </ImageBackground>
                                </TouchableOpacity>
                            )
                        })
                        :
                        <Box justifyContent='center' alignItems='center' height='150px'>
                            <DefText text='생성된 폴더가 없습니다.' />
                        </Box>
                    }
                </Box>
            </ScrollView>
            <Box p={2.5} px={5}>
                <TouchableOpacity onPress={()=>{setFolderAddModal(!folderAddModal)}} style={[styles.buttonDef]}>
                   <DefText text='폴더 생성' style={styles.buttonDefText} />
                </TouchableOpacity>
            </Box>

            <Modal isOpen={folderAddModal} onClose={() => setFolderAddModal(false)}>
            
                <Modal.Content maxWidth={width-40}>
                    <Modal.Body>
                        <DefText text='폴더추가' style={{textAlign:'center'}}/>
                        <Input
                            _focus='transparent'
                            height={46}
                            backgroundColor='#fff'
                            placeholder='폴더명을 입력해주세요.'
                            mt={3}
                            value={folderName}
                            onChangeText={folderNameChange}
                        />
                        <HStack justifyContent='space-between' mt={2.5}>
                            <TouchableOpacity style={styles.folderAddButtons} onPress={ScrapFolderAdds}>
                                <DefText text='확인' style={styles.folderButtonText} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.folderAddButtons} onPress={()=>setFolderAddModal(false)}>
                                <DefText text='취소' style={styles.folderButtonText} />
                            </TouchableOpacity>
                        </HStack>
                    </Modal.Body>
                </Modal.Content>
            </Modal>

            <Modal isOpen={folderModal} onClose={() => setFolderModal(false)}>
            
                <Modal.Content maxWidth={width-40}>
                    <Modal.Body>
                        <DefText text='스크랩 폴더를 삭제하시겠습니까?' style={{textAlign:'center'}}/>
                        <DefText text='해당 폴더에 저장된 스크랩목록도 삭제됩니다.' style={{textAlign:'center', marginTop:10}} />
                        
                        <HStack justifyContent='space-between' mt={5}>
                            <TouchableOpacity style={styles.folderAddButtons} onPress={folderRemoves}>
                                <DefText text='확인' style={styles.folderButtonText} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.folderAddButtons} onPress={()=>setFolderModal(false)}>
                                <DefText text='취소' style={styles.folderButtonText} />
                            </TouchableOpacity>
                        </HStack>
                    </Modal.Body>
                </Modal.Content>
            </Modal>
        </Box>
    );
};

const styles = StyleSheet.create({
    folderAddButtons : {
        height:45,
        width:(width-80) *0.47,
        borderRadius:10,
        backgroundColor:'#696968',
        alignItems:'center',
        justifyContent:'center'
    },
    folderButtonText: {
        fontSize:15,
        color:'#fff'
    },
    buttonDef:{
        height:40,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#666',
        borderRadius:5
    },
    buttonDefText:{
        fontSize:14,
        color:'#fff'
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
)(Scrap);