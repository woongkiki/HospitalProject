import React, {useState, useEffect} from 'react';
import { TouchableOpacity, Dimensions, Text, ScrollView, StyleSheet, FlatList, ImageBackground, Alert } from 'react-native';
import { Box, Image, HStack, Input, Modal, VStack } from 'native-base';
import { DefText } from '../common/BOOTSTRAP';
import HeaderComponents from '../components/HeaderComponents';
import { ScrapFolderData } from '../Utils/DummyData';
import { connect } from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import ToastMessage from '../components/ToastMessage';

const {width} = Dimensions.get('window');

const AcountInfo = ( props ) => {

    const {navigation, userInfo, member_logout, member_out} = props;

    //console.log(userInfo);

    const [logOutModal, setLogOutModal] = useState(false);

    const LogoutHandler = async() => {

        const formData = new FormData();
        formData.append('method', 'member_logout');
       // formData.append('id', userInfo.email);

        const logout =  await member_logout(formData);

       // console.log(logout.state);

        ToastMessage('로그아웃 합니다.');
        navigation.replace('Login');

    }

    const [memberLeave, setMemberLeave] = useState(false);

    const memberLeaveHandler = async () => {


        const formData = new FormData();
        formData.append('id', userInfo.id);
        formData.append('token', userInfo.appToken)
        formData.append('method', 'member_out');

        const leaved =  await member_out(formData);

        setMemberLeave(false);
        ToastMessage('탈퇴처리 되었습니다.');
        navigation.replace('Login');
        
    }

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderComponents headerTitle='계정설정' navigation={navigation} />
            <ScrollView>
                <Box p={5}>
                    <TouchableOpacity style={[styles.mypageButton, {marginTop:0}]} onPress={()=>navigation.navigate('AcountInfoChange', {'userInfo':userInfo})}>
                        <HStack alignItems='center' height='43px' justifyContent='space-between'>
                            <DefText text='회원정보 변경' style={styles.mypageButtonText} />
                            <Image source={require('../images/buttonArrRight.png')} alt='바로가기' />
                        </HStack>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.mypageButton]} onPress={()=>navigation.navigate('HospitalAdd')}>
                        <HStack alignItems='center' height='43px' justifyContent='space-between'>
                            <DefText text='병원추가' style={styles.mypageButtonText} />
                            <Image source={require('../images/buttonArrRight.png')} alt='바로가기' />
                        </HStack>
                    </TouchableOpacity>
                   
                    <TouchableOpacity style={[styles.mypageButton]} onPress={()=>setLogOutModal(true)}>
                        <HStack alignItems='center' height='43px' justifyContent='space-between'>
                            <DefText text='로그아웃' style={styles.mypageButtonText} />
                            <Image source={require('../images/buttonArrRight.png')} alt='바로가기' />
                        </HStack>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.mypageButton]} onPress={()=>setMemberLeave(true)}>
                        <HStack alignItems='center' height='43px' justifyContent='space-between'>
                            <DefText text='탈퇴하기' style={styles.mypageButtonText} />
                            <Image source={require('../images/buttonArrRight.png')} alt='바로가기' />
                        </HStack>
                    </TouchableOpacity>
                </Box>
            </ScrollView>
            <Modal isOpen={logOutModal} onClose={() => setLogOutModal(false)}>
            
                <Modal.Content maxWidth={width-40}>
                    <Modal.Body>
                        <DefText text='정말 로그아웃 하시겠습니까?' style={{textAlign:'center'}}/>
                        <HStack justifyContent='space-between' mt={5}>
                            <TouchableOpacity style={styles.logoutButton} onPress={LogoutHandler}>
                                <DefText text='확인' style={styles.logoutButtonText} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.logoutButton} onPress={()=>setLogOutModal(false)}>
                                <DefText text='취소' style={styles.logoutButtonText} />
                            </TouchableOpacity>
                        </HStack>
                    </Modal.Body>
                </Modal.Content>
            </Modal>
            <Modal isOpen={memberLeave} onClose={() => setMemberLeave(false)}>
            
                <Modal.Content maxWidth={width-40}>
                    <Modal.Body>
                        <DefText text={'회원과 관련된 내용도 즉시'+'\n'+'삭제되며 복구가 불가능합니다.'} style={{textAlign:'center'}}/>
                        <DefText text='정말 회원을 탈퇴하시겠습니까?' style={{textAlign:'center', marginTop:5}}/>
                        
                        <HStack justifyContent='space-between' mt={5}>
                            <TouchableOpacity style={styles.logoutButton} onPress={memberLeaveHandler}>
                                <DefText text='확인' style={styles.logoutButtonText} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.logoutButton} onPress={()=>setMemberLeave(false)}>
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
    mypageButton: {
        height:43,
        backgroundColor:'#F1F1F1',
        borderRadius:43,
        paddingLeft:20,
        paddingRight:10,
        marginTop:10
    },
    mypageButtonText: {
        fontSize:16,
        color:'#000'
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
        member_logout: (user) => dispatch(UserAction.member_logout(user)), //로그아웃

        member_out: (user) => dispatch(UserAction.member_out(user)), //로그아웃

    })
)(AcountInfo);