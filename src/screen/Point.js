import React, {useState, useEffect} from 'react';
import { TouchableOpacity, Dimensions, View, Text, ScrollView, StyleSheet, FlatList, ImageBackground, Alert } from 'react-native';
import { Box, Image, HStack, Input, Modal, VStack } from 'native-base';
import { DefText } from '../common/BOOTSTRAP';
import HeaderComponents from '../components/HeaderComponents';
import { pointData } from '../Utils/DummyData';
import { numberFormat } from '../common/dataFunction';
import { connect } from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import Api from '../Api';
import ToastMessage from '../components/ToastMessage';

const {width, height} = Dimensions.get('window');
const CateWidh = (width - 40) * 0.31;

const Point = (props) => {

    const {navigation, userInfo} = props;

    const [pointCategory, setPointCategory] = useState('');

    const [pointAll, setPointAll] = useState('');
    const [pointLists, setPointLists] = useState('');

    const PointListData = () => {
        Api.send('point_list', {'id':userInfo.id, 'token':userInfo.appToken, 'month':pointCategory}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;

            if(resultItem.result === 'Y' && arrItems) {
               console.log('포인트 내역 리스트::::: ', arrItems);
                
               setPointAll(arrItems.total);
               setPointLists(arrItems.list);

            }else{
                console.log('결과 출력 실패!', resultItem);
                //ToastMessage(resultItem.message);
            }
        });
    }

    useEffect(()=>{
        PointListData();
    },[])


    const CategoryChange = async (number) => {
        await setPointCategory(number);
        await PointListData()
    }


    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderComponents headerTitle='포인트내역' navigation={navigation} />
            <ScrollView>
                <Box p={5}>
                    <Box>
                        <HStack pb={2.5} mb={2.5} borderBottomWidth={1} borderBottomColor='#999' justifyContent='space-between'>
                            <DefText text='잔여포인트' style={styles.pointTitle} />
                            {
                                pointAll != '' && 
                                <DefText text={numberFormat(pointAll)+' P'} style={styles.pointTitle} />
                            }
                           
                        </HStack>
                        <HStack justifyContent='space-between'>
                            <TouchableOpacity onPress={()=>{CategoryChange('')}} style={[{width:CateWidh}, styles.cateButton, pointCategory === '' && {backgroundColor:'#707070'} ]}>
                                <DefText text='전체' style={[styles.cateButtonText, pointCategory === '' && {color:'#fff'}]} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>{CategoryChange('1')}} style={[{width:CateWidh}, styles.cateButton, pointCategory === '1' && {backgroundColor:'#707070'}]}>
                                <DefText text='1개월' style={[styles.cateButtonText, pointCategory === '1' && {color:'#fff'}]} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>{CategoryChange('6')}} style={[{width:CateWidh}, styles.cateButton, pointCategory === '6' && {backgroundColor:'#707070'}]}>
                                <DefText text='6개월' style={[styles.cateButtonText, pointCategory === '6' && {color:'#fff'}]} />
                            </TouchableOpacity>
                        </HStack>
                    </Box>
                    <Box mt={5}>
                        {
                            pointLists != '' && 
                            pointLists.length > 0 ? 
                            pointLists.map((item, index)=> {
                                return(
                                    <Box key={index} py={2.5} borderBottomWidth={1} borderBottomColor='#999'>
                                        <DefText text={item.title} style={styles.pointDataTitle} />
                                        <HStack justifyContent='space-between' alignItems='center'>
                                            <DefText text={item.wdate} style={{fontSize:14,color:'#a2a2a2'}} />
                                            <HStack alignItems='center' justifyContent='space-between' width='23%' >
                                                {
                                                    item.point > 0 ?
                                                    <Image source={require('../images/pointPlus.png')} alt='+' style={{width:20, height:20}} />
                                                    :
                                                    <Image source={require('../images/pointMinus.png')} alt='-' style={{width:20, height:20}} />
                                                }
                                                <Box >
                                                    <DefText text={numberFormat(item.point) + ' P'} style={{fontSize:14, color:'#696968'}} />
                                                </Box>
                                            </HStack>
                                        </HStack>
                                    </Box>
                                )
                            })
                            :
                            <Box alignItems='center' justifyContent='center' height={height-250}>
                                <DefText text='포인트 내역이 없습니다.' style={{color:'#666'}} />
                            </Box>
                        }
                    </Box>
                </Box>
            </ScrollView>
        </Box>
    );
};

const styles = StyleSheet.create({
    cateButton: {
        height:30,
        backgroundColor:'#fff',
        borderWidth:1,
        borderRadius:5,
        borderColor:'#999',
        alignItems:'center',
        justifyContent:'center'
    },
    cateButtonText:{
        fontSize:14,
        color:'#666'
    },
    pointTitle:{
        fontSize:16,
        color:'#000',
        fontWeight:'bold'
    },
    pointDataTitle:{
        fontSize:16,
        fontWeight:'bold'
    }

})

export default connect(
    ({ User }) => ({
        userInfo: User.userInfo, //회원정보
    }),
    (dispatch) => ({
        member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
        member_info: (user) => dispatch(UserAction.member_info(user)), //회원 정보 조회
        member_logout: (user) => dispatch(UserAction.member_logout(user)), //로그아웃
    })
)(Point);