import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Dimensions, View, Text, ScrollView, StyleSheet, FlatList, ImageBackground, Alert } from 'react-native';
import { Box, Image, HStack, Input, Modal, VStack } from 'native-base';
import { DefText } from '../common/BOOTSTRAP';
import HeaderComponents from '../components/HeaderComponents';
import { ScrapFolderData } from '../Utils/DummyData';
import { connect } from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import Api from '../Api';
import ToastMessage from '../components/ToastMessage';
import Font from '../common/Font';

const ScrapView = (props) => {


    const {navigation, route, userInfo} = props;

    const { params } = route;
    
    console.log(params);

    const [folderList, setFolderList] = useState('');

    const scrapInfoList = () => {
        Api.send('scrap_list', {'id':userInfo.id, 'token':userInfo.appToken, 'idx':params.idx}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                console.log('스크랩 폴더 안 정보: ', arrItems);
                setFolderList(arrItems);
                
            }else{
                console.log('결과 출력 실패!', resultItem);
               ToastMessage(resultItem.message);
            }
        });
    }

    useEffect(()=>{
        scrapInfoList();
    }, []);


    const scrapNavigation = (item) => {
        
            navigation.navigate('CommunityView', item);
        
    }

    //console.log(board.length);

    

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderComponents headerTitle='스크랩' navigation={navigation} />
            <ScrollView>
                <HStack p={5}>
                    <View style={styles.folderBox}>
                        <DefText text={params.fname} style={[styles.folderBoxText]} />
                    </View>
                </HStack>
                <Box px={5}>
                    {
                        folderList != "" ?
                        folderList.map((item, index)=>{
                            return (
                                <TouchableOpacity onPress={ () => scrapNavigation(item)} key={index} style={[styles.scrapListBUtton, index!=0 && {marginTop:10}]}>
                                    <HStack justifyContent='space-between'>
                                        {
                                            item.code == 'qna' &&
                                            <Box width='17%'>
                                                <DefText text={'문의내역'} style={styles.scrapListCateTitle} />
                                            </Box>
                                        }
                                        {
                                            item.code == 'faq' &&
                                            <Box width='17%'>
                                                <DefText text={'자주묻는질문'} style={styles.scrapListCateTitle} />
                                            </Box>
                                        }
                                        {
                                            item.code == 'notice' &&
                                            <Box width='17%'>
                                                <DefText text={'공지사항'} style={styles.scrapListCateTitle} />
                                            </Box>
                                        }
                                        {
                                            item.code == 'food' &&
                                            <Box width='17%'>
                                                <DefText text={'음식'} style={styles.scrapListCateTitle} />
                                            </Box>
                                        }
                                        {
                                            item.code == 'bloodp' &&
                                            <Box width='17%'>
                                                <DefText text={'혈압'} style={styles.scrapListCateTitle} />
                                            </Box>
                                        }
                                        {
                                            item.code == 'bloods' &&
                                            <Box width='17%'>
                                                <DefText text={'혈당'} style={styles.scrapListCateTitle} />
                                            </Box>
                                        }
                                        {
                                            item.code == 'drug' &&
                                            <Box width='17%'>
                                                <DefText text={'약'} style={styles.scrapListCateTitle} />
                                            </Box>
                                        }
                                        {
                                            item.code == 'inbody' &&
                                            <Box width='17%'>
                                                <DefText text={'인바디'} style={styles.scrapListCateTitle} />
                                            </Box>
                                        }
                                       
                                        <VStack width='75%'>
                                            <DefText text={item.subject} style={styles.scrapListTitles} />
                                            <HStack  mt={2.5} mt={2.5}>
                                                <HStack style={{marginRight:10}}>
                                                    <DefText text={item.name} style={[styles.scrapListTitles, {marginRight:5}]} />
                                                    {/* <DefText text={item.boardTime} style={styles.scrapListTitles} /> */}
                                                </HStack>
                                                <HStack>
                                                    <DefText text='조회' style={[styles.scrapListTitles, {marginRight:5}]} />
                                                    <DefText text={item.count} style={styles.scrapListTitles} />
                                                </HStack>
                                            </HStack>
                                        </VStack>
                                    </HStack>
                                </TouchableOpacity>
                            )
                        })
                        :
                        <Box justifyContent='center' alignItems='center' height='150px'>
                            <DefText text='스크랩된 게시물이 없습니다.' />
                        </Box>
                    }
                   
                </Box>
            </ScrollView>
        </Box>
    );
};

const styles = StyleSheet.create({
    folderBox: {
        paddingHorizontal:10,
        paddingVertical:5,
        backgroundColor:'#696969',
        borderRadius:10
    },
    folderBoxText: {
        fontSize:14,
        color:'#fff',
        fontWeight:'500',
        fontFamily:Font.NotoSansMedium
    },
    scrapListBUtton: {
        paddingVertical:10,
        paddingHorizontal:20,
        backgroundColor:'#F1F1F1',
        borderRadius:10
    },
    scrapListCateTitle: {
        fontSize:14,
        fontWeight:'bold',
        fontFamily:Font.NotoSansBold
    },
    scrapListTitles:{
        fontSize:14,
        color:'#000'
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
)(ScrapView);