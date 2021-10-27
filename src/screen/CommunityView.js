import React, {useState, useEffect} from 'react';
import { ScrollView, Dimensions, View, Text, Platform, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, ImageBackground } from 'react-native';
import { Box, HStack, VStack, Image, Input, Modal, CheckIcon } from 'native-base';
import { DefText } from '../common/BOOTSTRAP';
import HeaderCommunity from '../components/HeaderCommunity';
import {schKeyword, healthData, ScrapFolderData} from '../Utils/DummyData';
import ToastMessage from '../components/ToastMessage';

const {width, height} = Dimensions.get('window');

const CommunityView = (props) => {

    const {navigation, route} = props;

    const {params} = route;

    const [modalView, setModalView] = useState(false);
    //console.log(params);

    const [folderData, setFolderData] = useState(ScrapFolderData);
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
        ToastMessage('게시물이 스크랩되었습니다.');
        setScrapModal(false);
        setModalView(false);
    }

    const folderDataR = folderData.map((item, index)=> {
        return(
            <TouchableOpacity activeOpacity={0.9} key={index} style={index != 0 && {marginTop:10}} onPress={()=>folderSelectHandler(index+1)} >
                <ImageBackground 
                    source={require('../images/folderImg.png')}
                    style={{ height:87, width:width-40, justifyContent:'center', paddingLeft:20, paddingRight:20}}
                    resizeMode='contain'
                >
                    <HStack justifyContent='space-between' alignItems='center'>
                        <DefText text={item.folderName} style={{fontSize:18}} />
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

    const scrapHandle = () => {
        setScrapModal(true);
    }

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderCommunity navigation={navigation} headerTitle='건강정보' />
            <ScrollView>
                <Box p={5}>
                    <Box width='90%' mb={10}>
                        <DefText text={params.communityTitle} style={styles.boardViewTitle} />
                    </Box>
                    <HStack alignItems='center' pb={5} borderBottomWidth={1} borderBottomColor='#dfdfdf' justifyContent='space-between' pr={5}>
                        <HStack alignItems='center'>
                            <Image 
                                source={require('../images/hospitalLogo.png')} 
                                alt='hospital logo'
                                style={{marginRight:20, width:64, height:64, resizeMode:'contain'}}
                            />
                            <Box>
                                <DefText text={params.writer} style={styles.boardViewWriter} />
                                <DefText text={params.datetime} style={styles.boardViewDate} />
                            </Box>
                        </HStack>
                        <TouchableOpacity onPress={() => setModalView(true)}>
                            <Image source={require('../images/communituOption.png')} alt='옵션' />
                        </TouchableOpacity>
                    </HStack>
                    <Box py={5} px={2.5}>
                       {/* <Image source={{uri:params.communityContent}} alt={params.communityTitle} width={width-40} height={400} /> */}
                       <DefText text={params.communityTitle} />
                    </Box>
                </Box>
            </ScrollView>
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
                                <DefText text='폴더선택' style={{fontSize:20}} />
                                <DefText text='' style={{width:40}} />
                            </HStack>
                            <Box p={5}>
                                {folderDataR}

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
        color:'#000',
        fontWeight:'bold'
    },
    boardViewWriter: {
        fontSize:15,
        color:'#666'
    },
    boardViewDate: {
        fontSize:15,
        color:'#666',
        marginTop:5
    },
    boardViewContent: {
        fontSize:15,
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
        color:'#fff',
        
    }
})

export default CommunityView;