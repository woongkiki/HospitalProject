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
import Font from '../common/Font';
import { WebView } from 'react-native-webview';
import { BASE_URL } from '../Utils/APIConstant';

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
            <Box flex={1} px='12px'>
                <WebView
                    source={{
                        uri: BASE_URL + '/adm/rn-webview/hospital_bbs.php?idx='+params.idx
                    }}
                    style={{
                        opacity:0.99,
                        minHeight:1
                    }}
                    originWhitelist={['*']}
                />
            </Box>
            
        </Box>
    );
};

const styles = StyleSheet.create({
    boardViewTitle: {
        fontSize:25,
        lineHeight:30,
        color:'#000',
        fontWeight:'bold',
        fontFamily:Font.NotoSansBold
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