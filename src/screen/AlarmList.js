import React, {useState, useEffect} from 'react';
import { Box, VStack, HStack, Image } from 'native-base';
import { TouchableOpacity, Dimensions, ScrollView, StyleSheet } from 'react-native';
import {DefInput, DefText} from '../common/BOOTSTRAP';
import HeaderComponents from '../components/HeaderComponents';
import {AlarmListData} from '../Utils/DummyData';
import ToastMessage from '../components/ToastMessage';
import Font from '../common/Font';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { connect } from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import Api from '../Api';

const {width} = Dimensions.get('window');

const AlarmList = (props) => {

    const {navigation, userInfo, chg_hcode} = props;

   
    const [alarmCategory, setAlarmCategory] = useState('');

    const AlarmCategoryRequest = () => {
        Api.send('push_category', {'id':userInfo.id, 'token':userInfo.appToken}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {

               console.log('알림카테고리 내역...',arrItems);
               setAlarmCategory(arrItems);

            }
        });
    }

    const [categorySelect, setCategorySelect] = useState('');

    const [alarmList, setAlarmList] = useState('');

    const AlarmListRequest = () => {
        Api.send('push_list', {'id':userInfo.id, 'token':userInfo.appToken,'category':''}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {

               console.log('알림 내역...',arrItems);
               //setAlarmCategory(arrItems);
               setAlarmList(arrItems);

            }else{
                console.log(arrItems);
            }
        });
    }


    useEffect(()=>{
        AlarmCategoryRequest();
        AlarmListRequest();
    }, [])

    const TagButtonHandler = async (tags) => {

        await setCategorySelect(tags);

        await Api.send('push_list', {'id':userInfo.id, token:userInfo.appToken,'category':tags}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {

               console.log('알림 내역...',arrItems);
               console.log(args);
               //setAlarmCategory(arrItems);
               setAlarmList(arrItems);

            }else{
                console.log('실패:::',arrItems);
            }
        });
    }
    
    const ScreenMove = (screen, screenIdx, hcode='') => {
        if(hcode != '') chg_hcode(hcode); 
        let screenName = '';
        if(screen == 'BBS'){
            screenName = 'CommunityView';
        }

        if(screen == 'hospitalBBS'){
            
            screenName = 'BoardView';
        }

        if(screen == 'chat'){
            screenName = 'ChatView';
        }

        if(screen == 'hospitalReserve'){
            screenName = 'Reservation'
        }

        if(screen == null){
            console.log('오류...');
            return false;
        }

        //console.log(screenName);
        if(screen != ''){
            navigation.navigate(screen, {'idx':screenIdx});
            //navigation.navigate(screenName, {'idx':screenIdx});
        }else{
            console.log('screen nonono');
        }

    }

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderComponents headerTitle='알림목록' navigation={navigation} />
            <ScrollView>
                <Box p={5}>
                    {
                        alarmCategory != '' &&
                        
                            alarmCategory.length > 0 ?
                            <HStack flexWrap='wrap'>
                                 <TouchableOpacity onPress={()=>TagButtonHandler('')} style={[styles.disButton, categorySelect == '' && {backgroundColor:'#666'}]} >
                                    <DefText text={'전체'} style={[styles.disText, categorySelect == '' && {color:'#fff'}]} />
                                </TouchableOpacity>
                                {
                                    alarmCategory.map((item, index)=> {
                                        return(
                                        <TouchableOpacity onPress={()=>TagButtonHandler(item)} key={index} style={[styles.disButton, categorySelect == item && {backgroundColor:'#666'}]} >
                                            <DefText text={item} style={[styles.disText, categorySelect == item && {color:'#fff'}]} />
                                        </TouchableOpacity>
                                        )
                                    })
                                }
                            </HStack>
                        :
                        <DefText text={alarmCategory} />
                    }

                    {
                        alarmList != '' ?
                        alarmList.map((item, index)=> {
                            return(
                                <TouchableOpacity onPress={()=>ScreenMove(item.screen, item.screen_idx, item.hcode)} key={index} style={[{backgroundColor: item.new ? '#abd4ff':'#f1f1f1', borderRadius:10, padding:20}, index != 0 ? {marginTop:20} : {marginTop:10}
                                ]} >
                                    <HStack alignItems='flex-start'>
                                        <Box width='30%' >
                                            <DefText text={item.title} style={{color:'#000', fontFamily:Font.NotoSansBold}} />
                                        </Box>
                                        <Box width='70%'>
                                            <DefText text={item.content} style={{color:'#000', fontFamily:Font.NotoSansMedium}}  />
                                            <DefText text={item.wdate} style={{fontSize:14, color:'#696969', fontFamily:Font.NotoSansMedium, marginTop:10}} />
                                            <DefText text={item.hname} style={{fontSize:14, color:'#696969', fontFamily:Font.NotoSansMedium, marginTop:10}} />
                                        </Box>
                                        {/* <DefText text={item.wdate} style={styles.noticeTimes} /> */}
                                    </HStack>
                                </TouchableOpacity>
                            )
                        })
                        :
                        <Box justifyContent='center' alignItems='center' height='300px'>
                            <DefText text='등록된 알림내역이 없습니다.' />
                        </Box>
                    }
                    
                </Box>
            </ScrollView>
        </Box>
    );
};

const styles = StyleSheet.create({
    noticeTitle : {
        fontSize:15,
        color:'#333',
        fontWeight:'bold'
    },
    noticeTimes : {
        fontSize:13,
        color:'#666'
    },
    noticeContent: {
        marginTop:15,
        fontSize:15,
        color:'#000'
    },
    disButton: {
        paddingVertical:5,
        paddingHorizontal:10,
        borderRadius:10,
        height:30,
        backgroundColor:'#f1f1f1',
        marginRight:10,
        marginBottom:10,
    },
    disText: {
        fontSize:14,
        color:'#333',
        fontWeight:'bold'
    },
})

export default connect(
    ({ User }) => ({
        userInfo: User.userInfo, //회원정보
    }),
    (dispatch) => ({
        member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
        member_info: (user) => dispatch(UserAction.member_info(user)), //회원 정보 조회
        chg_hcode   : (hcode) => dispatch({"type":"change_hcode", payload:hcode})
        
    })
)(AlarmList);