import React, {useState, useEffect, useCallback} from 'react';
import { TouchableOpacity, Dimensions, Text, ScrollView, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Box, Image, HStack, VStack, Modal } from 'native-base';
import { DefText } from '../common/BOOTSTRAP';
import HeaderHospital from '../components/HeaderHospital';
import { connect } from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import Api from '../Api';
import AsyncStorage from '@react-native-community/async-storage';
import ToastMessage from '../components/ToastMessage';
import Font from '../common/Font';
import { useFocusEffect } from '@react-navigation/native';

const {width} = Dimensions.get('window');

const Reservation = (props) => {

    const {navigation, userInfo, member_info} = props;

   // console.log(userInfo);

    //const [memberInfoList, setMemberInfoList] = useState('');
    //김취소

    const [reserveLoading, setReserveLoading] = useState(false);

    const [hospitalName, setHospitalName] = useState('');
    const [reserveList, setReserveList] = useState([]);

    const reserveDataReceive = () => {

         member_info_handle();

    }

    useEffect(()=>{
        reserveDataReceive();
    }, [])

    //회원정보 조회 후 예약내역 가져오기..
    const member_info_handle = async () => {


        await setReserveLoading(false);

        await Api.send('hospital_reserveList', {'id':userInfo.id,  'token':userInfo.appToken, 'hcode':userInfo.m_hcode}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                 console.log('예약 정보: ', arrItems);
                
                setReserveList(arrItems)
            }else{
                console.log('결과 출력 실패!', resultItem);
                //ToastMessage(resultItem.message);
            }
        });


        await Api.send('hospital_info', {'id':userInfo.id, 'hcode':userInfo.m_hcode}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                //console.log('병원 정보: ', arrItems);

                setHospitalName(arrItems.name);
                // ToastMessage(resultItem.message);
                // navigation.goBack();
                //setMemberInfos(arrItems);
    
            }else{
                console.log('결과 출력 실패!', resultItem);
                ToastMessage(resultItem.message);
            }
        });

        await setReserveLoading(true)

    };


    useFocusEffect(
        React.useCallback(()=>{
            // screen is focused
            reserveDataReceive();

            return () => {
                // screen is unfocused
                console.log('포커스 nono');
            };
        },[])
    );


    useEffect(()=>{
        console.log(reserveList.length);
    }, [reserveList])


    const [idxSave, setIdxSave] = useState('');

    const [reservationCancleModal, setReservationCancleModal] = useState(false);

    const idxSaveHandler = (idx) => {
        setIdxSave(idx);

        setReservationCancleModal(true);
    }

    const ReservationRemove = () => {
        Api.send('hospital_reserveCancel', {'id':userInfo.id, 'hcode':userInfo.m_hcode, 'idx':idxSave}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                console.log('병원 예약취소: ', arrItems);

                ToastMessage(resultItem.message);
                setReservationCancleModal(false);
                reserveDataReceive();

                
            }else{
                console.log('결과 출력 실패!', resultItem);
                ToastMessage(resultItem.message);
            }
        });
    }


   

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderHospital navigation={navigation} headerTitle='예약상담목록' />
         
                {
                    !reserveLoading ?
                    <Box alignItems='center' justifyContent='center' flex={1}>
                        <ActivityIndicator size='large' color='#000' />
                    </Box>
                    :
                    <>
                    {
                        reserveList.length != 0 ?
                        <ScrollView>
                            <Box p={5}>
                                <VStack>
                                {
                                    reserveList.map((item, index)=> {
                                        return(
                                            <HStack key={index} justifyContent='space-between' alignItems='center' backgroundColor='#F1F1F1' borderRadius='30px' p={5} mt={ index != 0 ? 5 : 0 }>
                                                <Box>
                                                    <Box>
                                                        {
                                                            hospitalName != '' && 
                                                            <DefText text={hospitalName} style={{fontSize:16, lineHeight:20, fontFamily:Font.NotoSansMedium,color:'#000'}} />
                                                        }
                                                        
                                                        {
                                                            item.doctor == null || item.doctor == '' ?
                                                            <DefText text={'담당의사가 배정중입니다.'}  style={{fontSize:14,color:'#000', marginTop:10}} />
                                                            :
                                                            <DefText text={item.doctor + ' 원장님'}  style={{fontSize:14,color:'#000', marginTop:10}} />
                                                        }
                                                        
                                                    </Box>
                                                    <HStack alignItems='center' mt={2.5}>
                                                        <DefText text={item.rdate + ' ' + item.rtime} style={{fontSize:13,color:'#666'}} />
                                                        <DefText text={item.category} style={{fontSize:13,color:'#666', fontWeight:'bold', marginLeft:10}} />
                                                    </HStack>
                                                </Box>
                                                <Box>
                                                    {
                                                        item.status == 'W' ?
                                                        <Box px={5} backgroundColor='#999' height='30px' alignItems='center' justifyContent='center' borderRadius='30px'>
                                                            <DefText text='처리중' style={{fontSize:14,color:'#fff'}} />
                                                        </Box>
                                                        :
                                                        <HStack>
                                                            <TouchableOpacity onPress={()=>{navigation.navigate('ReservationAdd', {item,'reserveStatus':'u'})}} style={[styles.changeButton]}>
                                                                <DefText text='변경' style={{fontSize:14,color:'#fff'}} />
                                                            </TouchableOpacity>
                                                            <TouchableOpacity onPress={() => idxSaveHandler(item.idx)} style={[styles.changeButton, {marginLeft:10}]}>
                                                                <DefText text='취소' style={{fontSize:14,color:'#fff'}} />
                                                            </TouchableOpacity>
                                                        </HStack>
                                                    }
                                                </Box>
                                            </HStack>
                                        )
                                    })
                                }
                                </VStack>
                            </Box>
                        </ScrollView>
                        :
                        <Box justifyContent='center' alignItems='center' flex={1}>
                            <DefText text='예약상담목록이 없습니다.' />
                        </Box>
                    }
                    </>
                }
                
            <Modal isOpen={reservationCancleModal} onClose={() => setReservationCancleModal(false)}>
            
                <Modal.Content maxWidth={width-40}>
                    <Modal.Body>
                        <DefText text={'해당 예약일정을 취소하시겠습니까?'} style={{textAlign:'center'}}/>
   
                        <HStack justifyContent='space-between' mt={5}>
                            <TouchableOpacity  style={styles.logoutButton} onPress={() => ReservationRemove()}>
                                <DefText text='확인' style={styles.logoutButtonText} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.logoutButton} onPress={()=>setReservationCancleModal(false)}>
                                <DefText text='취소' style={styles.logoutButtonText} />
                            </TouchableOpacity>
                        </HStack>
                    </Modal.Body>
                </Modal.Content>
            </Modal>
            <Box p={2.5} px={5}>
                <TouchableOpacity onPress={()=>{navigation.navigate('ReservationAdd')}} style={[styles.buttonDef]}>
                   <DefText text='예약추가' style={styles.buttonDefText} />
                </TouchableOpacity>
            </Box>
        </Box>
    );
};

const styles = StyleSheet.create({
    changeButton: {
        paddingHorizontal:10,
        height:30,
        backgroundColor:'#666',
        borderRadius:30,
        alignContent:'center',
        justifyContent:'center'
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
    },
    logoutButton : {
        height:40,
        width:(width-80) *0.47,
        borderRadius:10,
        backgroundColor:'#696968',
        alignItems:'center',
        justifyContent:'center'
    },
    logoutButtonText: {
        fontSize:15,
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
)(Reservation);