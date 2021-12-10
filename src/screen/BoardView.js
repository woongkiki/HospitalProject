import React, {useState, useEffect} from 'react';
import { ScrollView, Dimensions, View, Text, Platform, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Box, HStack, VStack, Image } from 'native-base';
import { DefText } from '../common/BOOTSTRAP';
import HeaderComponents from '../components/HeaderComponents';
import HTML from 'react-native-render-html';
import StyleHtml from '../common/StyleHtml';
import { StackActions } from '@react-navigation/native';
import { connect } from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import Api from '../Api';
import AsyncStorage from '@react-native-community/async-storage';

const BoardView = (props) => {

    const {navigation, route, userInfo} = props;

    const {params} = route;

    //console.log('게시판상세::::',route);

    const [detail, setDetail] = useState('');

    const BBSView = () => {
        Api.send('hospital_bbsView', {'id':userInfo.id, 'token':userInfo.appToken, 'idx':params.idx, 'hcode':userInfo.m_hcode}, (args)=>{
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
        BBSView();
    },[])

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderComponents headerTitle='병원게시판' navigation={navigation} />
            {
                detail != '' ?
                <ScrollView>
                    <Box p={5}>
                        <Box width='90%' mb={10}>
                            <DefText text={detail.subject} style={styles.boardViewTitle} />
                        </Box>
                        <HStack alignItems='center' pb={5} borderBottomWidth={1} borderBottomColor='#dfdfdf'>
                            <Image 
                                source={require('../images/hospitalLogo.png')} 
                                alt='hospital logo'
                                style={{marginRight:20, width:64, height:64, resizeMode:'contain'}}
                            />
                            <Box>
                                <DefText text='힐링' style={styles.boardViewWriter} />
                                <DefText text={detail.wdate} style={styles.boardViewDate} />
                            </Box>
                        </HStack>
                        <Box py={5} px={2.5}>
                            <HTML 
                                ignoredStyles={[ 'width', 'height', 'margin', 'padding', 'fontFamily', 'lineHeight', 'fontFamily', 'br']}
                                ignoredTags={['head', 'script', 'src']}
                                imagesMaxWidth={Dimensions.get('window').width - 40}
                                source={{html: detail.content}} 
                                tagsStyles={StyleHtml}
                                containerStyle={{ flex: 1, }}
                                contentWidth={Dimensions.get('window').width}  
                            />
                        </Box>
                    </Box>
                </ScrollView>
                :
                <Box alignItems='center' justifyContent='center' flex={1}>
                    <ActivityIndicator size='large' color='#333' />
                </Box>
            }
            
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
)(BoardView);