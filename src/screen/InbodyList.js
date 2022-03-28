import React, {useState, useEffect} from 'react';
import { Box, VStack, HStack, Image, Modal } from 'native-base';
import { TouchableOpacity, Dimensions, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import {AddButton, DefInput, DefText} from '../common/BOOTSTRAP';
import HeaderComponents from '../components/HeaderComponents';
import LinearGradient from 'react-native-linear-gradient';
import { StackActions } from '@react-navigation/native';
import { connect } from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import Api from '../Api';
import AsyncStorage from '@react-native-community/async-storage';
import ToastMessage from '../components/ToastMessage';
import { useFocusEffect } from '@react-navigation/native';
import Font from '../common/Font';

const {width} = Dimensions.get('window');

const InbodyList = (props) => {

    const {navigation, userInfo} = props;

    const [bpLoading, setbpLoading] = useState(false);

    const [deleteIdx, setDeleteIdx] = useState('');
    const [inBodydata, setinBodydata] = useState('');

    const BloodPresReceive =  async () => {
        await setbpLoading(false);
        await Api.send('bodyProfile_list', {'id':userInfo.id,  'token':userInfo.appToken}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                console.log('결과 정보: ', arrItems);
                setinBodydata(arrItems);
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

    const inBodySubmits = () => {
        navigation.navigate('Inbody');
    }


    //삭제모달
    const [deleteModal, setDeleteModal] = useState(false);

    const DeleteIdx = (idx) => {
        setDeleteIdx(idx);
        setDeleteModal(true);
    }

    const DeleteSubmit = () => {
        //console.log('deleteIdx:::', deleteIdx);

        Api.send('bodyProfile_delete', {'id':userInfo.id,  'token':userInfo.appToken, idx:deleteIdx}, (args)=>{
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
            <HeaderComponents headerTitle='체성분 기록' navigation={navigation} bloodSugar={inBodySubmits} />
            {
                bpLoading ?
                    inBodydata != '' ?
                    <ScrollView>
                        <Box p={5} >
                            {
                                
                                inBodydata.map((item, index)=> {
                                    return(
                                        <Box shadow={8} backgroundColor={'#fff'} key={index} p={5} mb={'20px'} borderRadius={'10px'} >
                                            <TouchableOpacity onLongPress={()=>DeleteIdx(item.idx)} onPress={()=>navigation.navigate('InbodyInfo', item)}  >
                                                <HStack justifyContent={'space-between'} alignItems={'center'} >
                                                    <DefText text={item.bdate} />
                                                    <HStack alignItems={'center'} justifyContent={'space-between'}>
                                                        <DefText text={'체중 ' +item.weight + 'kg'} style={{color:'#666'}} />
                                                        <Image source={require('../images/buttonArrRight.png')} alt='바로가기' style={{marginLeft:10}} />
                                                    </HStack>
                                                
                                                </HStack>

                                            </TouchableOpacity>
                                        </Box>
                                    )
                                })
                                
                            }
                        </Box>
                    </ScrollView>
                    :
                    <Box justifyContent={'center'} alignItems='center' flex={1}>
                        <Image source={require('../images/inbodyIconG.png')} alt={'체성분정보를 관리하세요'} />
                        <DefText text='체성분정보를 추가하여 간편하게 관리하세요.' style={{marginTop:20, color:'#696969', fontFamily:Font.NotoSansMediu, fontWeight:'500'}} />
                    </Box>
                :
                <Box flex={1} alignItems={'center'} justifyContent={'center'}>
                    <ActivityIndicator size='large' color='#333'/>
                </Box>
            }
            <Box position={'absolute'} right={'30px'} bottom={'30px'}>
                <AddButton onPress={()=>{navigation.navigate('InbodyAdd')}} />
            </Box>

            <Modal isOpen={deleteModal} onClose={() => setDeleteModal(false)}>
            
                <Modal.Content maxWidth={width-40}>
                    <Modal.Body>
                        <DefText text='체성분기록을 삭제하시겠습니까?' style={{textAlign:'center'}}/>
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
)(InbodyList);