import React, {useState, useEffect} from 'react';
import { ScrollView, Dimensions, View, Text, Platform, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Box, HStack, VStack, Image } from 'native-base';
import { DefText } from '../common/BOOTSTRAP';
import HeaderComponents from '../components/HeaderComponents';
import { boardDatas } from '../Utils/DummyData';
import { StackActions } from '@react-navigation/native';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import Api from '../Api';

const Board = (props) => {

    const {navigation, userInfo} = props;

    console.log('회원정보:::::', userInfo.m_hcode);

    const [membershipCode, setMembershipCode] = useState(userInfo.membership[0].hcode);

    const [boardList, setBoardList] = useState('');

    const HospitalBoardReceive = () => {
        Api.send('hospital_bbs', {'id':userInfo.id, 'hcode':userInfo.m_hcode, 'page':1}, (args2)=>{

            let resultItemHospital = args2.resultItem;
            let arrItemsHospital = args2.arrItems;

            if(resultItemHospital.result === 'Y' && arrItemsHospital){

                console.log('성공', arrItemsHospital);
                setBoardList(arrItemsHospital);

            }else{
                console.log('실패123', resultItemHospital)
            }

        });
    }

    useEffect(()=>{
        HospitalBoardReceive();
    }, [])

    const _renderItem = ({item, index})=>{
        return(
            <Box px={5} >
                <TouchableOpacity onPress={()=>navigation.navigate('BoardView', item)} style={{borderBottomWidth:1, borderBottomColor:'#dfdfdf', paddingVertical:10}}>
                    <VStack>
                        <HStack flexWrap='wrap' width='95%'>
                            <DefText text={ "[" + item.category + "] " + item.title} style={styles.boardTitle} />
                        </HStack>
                        <DefText text={item.date} style={styles.boardDate}  />
                    </VStack>
                </TouchableOpacity>
            </Box>
        )
    }

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderComponents headerTitle='병원게시판' navigation={navigation} />
           {
               boardList != '' && 
               boardList.length > 0 ? 
               <ScrollView>
                   {
                        boardList.map((item, index)=> {
                            return(
                                <Box px={5} key={index}>
                                    <TouchableOpacity onPress={()=>navigation.navigate('BoardView', item)} style={{borderBottomWidth:1, borderBottomColor:'#dfdfdf', paddingVertical:10}}>
                                        <VStack>
                                            <HStack flexWrap='wrap' width='95%'>
                                                <DefText text={item.subject} style={styles.boardTitle} />
                                            </HStack>
                                            <DefText text={item.wdate} style={styles.boardDate}  />
                                        </VStack>
                                    </TouchableOpacity>
                                </Box>
                            )
                        })
                    }
               </ScrollView>
               :
               <Box flex={1} alignItems='center' justifyContent='center'>
                   <DefText text='등록된 게시글이 없습니다.' style={{color:'#666'}} />
               </Box>
           }
        </Box>
    );
};

const styles = StyleSheet.create({
    boardTitle: {
        fontSize:14,
        color:'#000',
        fontWeight:'bold'
    },
    boardDate: {
        fontSize:12,
        color:'#999',
        marginTop:20
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
)(Board);