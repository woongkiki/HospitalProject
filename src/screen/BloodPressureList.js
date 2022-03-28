import React, { useEffect, useState } from 'react';
import { ScrollView, Dimensions, TouchableOpacity, Platform, FlatList, StyleSheet, Linking, ActivityIndicator } from 'react-native';
import { Box, VStack, HStack, Image, Center, Modal } from 'native-base';
import HeaderComponents from '../components/HeaderComponents';
import { AddButton, DefText } from '../common/BOOTSTRAP';
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import Api from '../Api';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import Font from '../common/Font';
import ToastMessage from '../components/ToastMessage';

const {width} = Dimensions.get('window');

const BloodPressureList = (props) => {

    const {navigation, userInfo} = props;

    const [bpLoading, setbpLoading] = useState(false);

    const [deleteIdx, setDeleteIdx] = useState('');
    const [bloodpresData, setBloodpresData] = useState('');

    const BloodPresReceive = async () => {
        await setbpLoading(false)
        await Api.send('bloodPressure_list', {'id':userInfo.id,  'token':userInfo.appToken}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               console.log('결과 정보: ', arrItems);
                setBloodpresData(arrItems);
            }else{
                console.log('결과 출력 실패!', resultItem);
              // ToastMessage(resultItem.message);
            }
        });
        await setbpLoading(true);
    }

    useEffect(()=>{
        BloodPresReceive();
    }, []);


    const bloodSugarSubmit = () => {
        navigation.navigate('BloodPressure')
    }

    //삭제모달
    const [deleteModal, setDeleteModal] = useState(false);

    const DeleteIdx = (idx) => {
        setDeleteIdx(idx);
        setDeleteModal(true);
    }

    const DeleteSubmit = () => {
        //console.log('deleteIdx:::', deleteIdx);

        Api.send('bloodPressure_delete', {'id':userInfo.id,  'token':userInfo.appToken, idx:deleteIdx}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               // console.log('결과 정보: ', arrItems);
                ToastMessage(resultItem.message);
                setDeleteModal(false);
                BloodPresReceive();
            }else{
                console.log('결과 출력 실패!', resultItem);
              // ToastMessage(resultItem.message);
            }
        });
    }

    return (
        <Box flex={1} backgroundColor={'#fff'}>
            <HeaderComponents navigation={navigation} headerTitle='혈압' bloodSugar={bloodSugarSubmit} />
            {
                bpLoading ?
                <ScrollView>
                    <Box p={5} mb={'60px'}>
                        {
                            bloodpresData != '' &&
                            bloodpresData.map((item, index)=> {
                                return(
                                    <Box  shadow={8} backgroundColor={'#fff'} borderRadius={'10px'} mb='20px' p='20px' key={index} >
                                        <TouchableOpacity onLongPress={()=>DeleteIdx(item.idx)}>
                                            <HStack justifyContent={'space-between'} alignItems={'center'}>
                                                <DefText text={item.bdate} style={{fontSize:13}}/>
                                                {/* <TouchableOpacity style={{padding:5, paddingVertical:2.5, borderRadius:5, backgroundColor:'#696968'}} onPress={()=>DeleteIdx(item.idx)} >
                                                    <DefText text='삭제'  style={{color:'#fff', fontSize:12}}/>
                                                </TouchableOpacity> */}
                                            </HStack>
                        
                                        
                                            <HStack justifyContent={'space-between'} mt={2.5}>
                                                <HStack>
                                                    <DefText text={item.high} style={{fontSize:16}}  />
                                                    <DefText text='/' style={{fontSize:16}}  />
                                                    <DefText text={item.low + 'mmHg'} style={{fontSize:16}}  />
                                                </HStack>
                                                <DefText text={item.heartRate + 'bpm'} style={{fontSize:16}}  />
                                            </HStack>
                                            <DefText text={item.alert} style={{marginTop:10, color:'#f00'}}  />
                                        </TouchableOpacity>
                                    </Box>
                                )
                            })
                        }
                    </Box>
                </ScrollView>
                :
                <Box flex={1} alignItems={'center'} justifyContent={'center'}>
                    <ActivityIndicator size='large' color='#333'/>
                </Box>
            }
            <Box position={'absolute'} right={'30px'} bottom={'30px'}>
                <AddButton onPress={()=>{navigation.navigate('BloodPressureAdd')}} />
            </Box>
            <Modal isOpen={deleteModal} onClose={() => setDeleteModal(false)}>
            
                <Modal.Content maxWidth={width-40}>
                    <Modal.Body>
                        <DefText text='혈압기록을 삭제하시겠습니까?' style={{textAlign:'center'}}/>
                        <HStack justifyContent='space-between' mt={5}>
                            <TouchableOpacity style={styles.logoutButton} onPress={DeleteSubmit}>
                                <DefText text='확인' style={styles.logoutButtonText} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.logoutButton} onPress={()=>setDeleteModal(false)}>
                                <DefText text='취소' style={styles.logoutButtonText} />
                            </TouchableOpacity>
                        </HStack>
                    </Modal.Body>
                </Modal.Content>
            </Modal>
        </Box>
    );
};

const styles = StyleSheet.create({
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
)(BloodPressureList);