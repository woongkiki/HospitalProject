import React, {useState, useEffect, useCallback} from 'react';
import { TouchableOpacity, Dimensions, Text, ScrollView, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Box, Image, HStack, VStack, Input, Modal } from 'native-base';
import { AddButton, DefText } from '../common/BOOTSTRAP';
import HeaderComponents from '../components/HeaderComponents';
import { connect } from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import Api from '../Api';
import AsyncStorage from '@react-native-community/async-storage';
import ToastMessage from '../components/ToastMessage';
import Font from '../common/Font';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';

const {width} = Dimensions.get('window');

const HospitalList = (props) => {

    const {navigation, userInfo, member_info} = props;

    const [hospitalLoading ,setHospitalLoading] = useState(false);
    const [hospitalList, setHospitalList] = useState('');

    const [deleteModal, setDeleteModal] = useState(false);

    const hospitalListRecieve = async () => {
        await setHospitalLoading(false);
        Api.send('membership_list', {'id':userInfo.id, 'token':userInfo.appToken}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                //console.log('병원 정보: ', arrItems);

               console.log('회원권 리스트::', arrItems);
               setHospitalList(arrItems);
    
            }else{
                console.log('회원권리스트 출력 실패!', resultItem);
                //ToastMessage(resultItem.message);
            }
        });
        await setHospitalLoading(true);
    }


    const isFocused = useIsFocused();
 
    useEffect(() => {
      
      if (isFocused){
        //console.log('포커스온ㅇㅇㅇㅇㅇ::::::::',props.route.params);
        hospitalListRecieve()
      } 
        
    }, [isFocused]);


    useEffect(()=>{
        hospitalListRecieve();
    }, []);

    const [hospitalSelectIdx, setHospitalSelectIdx] = useState('');

    const HospitalDeleteModal = (idx) => {
        //console.log('삭제할 idx:::',idx)

        setHospitalSelectIdx(idx);
        setDeleteModal(true);
    }

    const HospitalDel = () => {

        if(hospitalSelectIdx==''){
            ToastMessage('삭제하실 회원권을 선택하세요.');
            return false;
        }

        Api.send('membership_delete', {'id':userInfo.id, 'token':userInfo.appToken, 'idx':hospitalSelectIdx}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                //console.log('병원 정보: ', arrItems);

                console.log('삭제 후 남은 값:::',arrItems);
               //console.log('회원권 리스트::', arrItems);
               setDeleteModal(false);
               ToastMessage(resultItem.message);
               hospitalListRecieve();

               const formData = new FormData();
               formData.append('id', userInfo.email);
                formData.append('token', userInfo.appToken);
                 member_info(formData)
              // setHospitalList(arrItems);
    
            }else{
                console.log('회원권리스트 삭제 실패!', resultItem);
                //ToastMessage(resultItem.message);

                ToastMessage(resultItem.message);
                setDeleteModal(false);
            }
        });
    }

    return (
        <Box flex={1} backgroundColor={'#fff'}>
            <HeaderComponents navigation={navigation} headerTitle='회원권 조회' />
            
            {
                hospitalList != '' ?
                <>
                {
                    hospitalLoading ?
                    <>
                        <ScrollView>
                            <Box p={5}>
                                {
                                    hospitalList.map((item, index)=> {
                                        return(
                                            <TouchableOpacity key={index} onLongPress={()=>HospitalDeleteModal(item.idx)}>
                                                <Box py={5} px={5} shadow={8} backgroundColor='#fff'  borderRadius={10} mt={ index ==0 ? 0 : 5}>
                                                    <DefText text={item.serial_number} style={{fontWeight:'500', fontFamily:Font.NotoSansMedium}} />

                                                    {/* <HStack alignItems={'center'} justifyContent={'space-between'}>
                                                    
                                                        <TouchableOpacity onPress={()=>HospitalDeleteModal(item.idx)} style={{backgroundColor:'#333', paddingHorizontal:10, paddingVertical:5, borderRadius:10}}>
                                                            <DefText text='삭제' style={{color:'#fff', fontSize:14, fontFamily:Font.NotoSansMedium}} />
                                                        </TouchableOpacity>
                                                    </HStack> */}
                                                    <HStack justifyContent={'space-between'} mt={3} alignItems='center'>
                                                        <DefText text={item.hname} style={{color:'#696969', fontFamily:Font.NotoSansMedium}} />
                                                        <DefText text={item.wdate.substr(0,10)} style={{color:'#696969', fontSize:14}} />
                                                    </HStack>
                                                
                                                </Box>
                                            </TouchableOpacity>
                                        )
                                    })
                                }
                            </Box>
                        </ScrollView>
                        <Box position={'absolute'} right={'30px'} bottom={'30px'}>
                            <AddButton onPress={()=>navigation.navigate('HospitalAdd')} />
                        </Box>
                    </>
                    :
                    <Box flex={1} alignItems={'center'} justifyContent={'center'}>
                        <ActivityIndicator size='large' color='#333' />
                    </Box>
                }
                
                </>
                :
                <Box flex={1} alignItems={'center'} justifyContent={'center'}>
                    <DefText text={'등록된 회원권이 없습니다.'} />
                </Box>
            }
             <Modal isOpen={deleteModal} onClose={() => setDeleteModal(false)}>
            
                <Modal.Content maxWidth={width-40}>
                    <Modal.Body>
                        <DefText text='정말 회원권을 삭제 하시겠습니까?' style={{textAlign:'center'}}/>
                        <HStack justifyContent='space-between' mt={5}>
                            <TouchableOpacity style={styles.logoutButton} onPress={HospitalDel}>
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
        backgroundColor:'#090A73',
        alignItems:'center',
        justifyContent:'center'
    },
    logoutButtonText: {
        fontSize:14,
        color:'#fff',
        fontFamily:Font.NotoSansBold
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
)(HospitalList);