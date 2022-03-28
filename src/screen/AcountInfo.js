import React, {useState, useEffect} from 'react';
import { TouchableOpacity, Dimensions, Text, ScrollView, StyleSheet, FlatList, ImageBackground, Alert } from 'react-native';
import { Box, Image, HStack, Input, Modal, VStack } from 'native-base';
import { DefInput, DefText } from '../common/BOOTSTRAP';
import HeaderComponents from '../components/HeaderComponents';
import { ScrapFolderData } from '../Utils/DummyData';
import { connect } from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import ToastMessage from '../components/ToastMessage';
import { StackActions } from '@react-navigation/native';
import Api from '../Api';
import Font from '../common/Font';

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
        //navigation.replace('Login');

        //navigation.dispatch(StackActions.replace('Login'));

        navigation.reset({
            routes: [{ name: 'Login' }],
        });

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


    const [memberChangeModal, setMemberChangeModal] = useState(false);

    const [pwdNumber, setPwdNumber] = useState('');
    const pwdNumberChange = (text) => {
        setPwdNumber(text)
    }

    const AcountChanges = () => {

        //navigation.navigate('AcountInfoChange', {'userInfo':userInfo})
        navigation.navigate('EasyPwdCh');
        setMemberChangeModal(false);
    }

    const Acounts = () =>{
        Api.send('member_password2', {'id':userInfo.id,  'token':userInfo.appToken, password:pwdNumber}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                console.log('결과 정보: ', arrItems);
               navigation.navigate('AcountInfoChange', {'userInfo':userInfo})
               setMemberChangeModal(false);
            }else{
                console.log('결과 출력 실패!', resultItem);
               ToastMessage(resultItem.message);
            }
        });
    }
    

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderComponents headerTitle='계정설정' navigation={navigation} />
            <ScrollView>
                <Box p={5}>
                    <TouchableOpacity style={[styles.mypageButton, {marginTop:0}]} onPress={()=>setMemberChangeModal(!memberChangeModal)}>
                        <HStack alignItems='center' height='43px' justifyContent='space-between'>
                            <DefText text='회원정보 변경' style={styles.mypageButtonText} />
                            <Image source={require('../images/mypageArrs.png')} alt='바로가기' style={{width:28, height:28}} />
                        </HStack>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.mypageButton]} onPress={()=>navigation.navigate('PasswordCh')}>
                        <HStack alignItems='center' height='43px' justifyContent='space-between'>
                            <DefText text='비밀번호 변경' style={styles.mypageButtonText} />
                            <Image source={require('../images/mypageArrs.png')} alt='바로가기' style={{width:28, height:28}} />
                        </HStack>
                    </TouchableOpacity>

                    {/* <TouchableOpacity style={[styles.mypageButton]} onPress={()=>navigation.navigate('EasyPwdCh')}>
                        <HStack alignItems='center' height='43px' justifyContent='space-between'>
                            <DefText text='간편비밀번호 변경' style={styles.mypageButtonText} />
                            <Image source={require('../images/buttonArrRight.png')} alt='바로가기' />
                        </HStack>
                    </TouchableOpacity> */}

                    <TouchableOpacity style={[styles.mypageButton]} onPress={()=>navigation.navigate('HospitalList')}>
                        <HStack alignItems='center' height='43px' justifyContent='space-between'>
                            <DefText text='회원권 조회' style={styles.mypageButtonText} />
                            <Image source={require('../images/mypageArrs.png')} alt='바로가기' style={{width:28, height:28}} />
                        </HStack>
                    </TouchableOpacity>
                   
                    <TouchableOpacity style={[styles.mypageButton]} onPress={()=>setLogOutModal(true)}>
                        <HStack alignItems='center' height='43px' justifyContent='space-between'>
                            <DefText text='로그아웃' style={styles.mypageButtonText} />
                            <Image source={require('../images/mypageArrs.png')} alt='바로가기' style={{width:28, height:28}} />
                        </HStack>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.mypageButton]} onPress={()=>setMemberLeave(true)}>
                        <HStack alignItems='center' height='43px' justifyContent='space-between'>
                            <DefText text='탈퇴하기' style={styles.mypageButtonText} />
                            <Image source={require('../images/mypageArrs.png')} alt='바로가기' style={{width:28, height:28}} />
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
            <Modal isOpen={memberChangeModal} onClose={() => setMemberChangeModal(false)}>
            
                <Modal.Content maxWidth={width-40} backgroundColor='#fff'>
                    <Modal.Body>
                        <DefText text={'회원정보 변경을 위해'+'\n'+'간편 비밀번호를 입력해주세요.'} style={{textAlign:'center', fontFamily:Font.NotoSansMedium, marginBottom:20}}/>
                        <Box>
                            
                            <Input 
                                value={pwdNumber}
                                onChangeText={pwdNumberChange}
                                secureTextEntry={true}
                                height='45px'
                                placeholder='간편 비밀번호를 입력하세요.'
                                keyboardType='number-pad'
                                maxLength={6}
                                borderWidth={1}
                                borderColor='#f1f1f1'
                                borderRadius={10}
                                _focus='transparent'
                                style={[{fontFamily:Font.NotoSansMedium}, pwdNumber.length > 0 && {backgroundColor:'#f1f1f1'}]}
                            />
                        </Box>
                        <HStack justifyContent='space-between' mt={5}>
                            <TouchableOpacity style={styles.logoutButton} onPress={Acounts}>
                                <DefText text='확인' style={styles.logoutButtonText} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.logoutButton} onPress={()=>setMemberChangeModal(false)}>
                                <DefText text='취소' style={styles.logoutButtonText} />
                            </TouchableOpacity>
                        </HStack>
                        <HStack justifyContent={'flex-end'} mt={5}>
                            <TouchableOpacity onPress={()=>AcountChanges()}>
                                <DefText text='간편비밀번호 찾기' style={{color:'#696969', fontFamily:Font.NotoSansMedium}} />
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
        borderRadius:10,
        paddingLeft:20,
        paddingRight:10,
        marginTop:10
    },
    mypageButtonText: {
        color:'#000',
        fontFamily:Font.NotoSansMedium,
        fontWeight:'500'
    },
    logoutButton : {
        height:45,
        width:(width-80) *0.47,
        borderRadius:10,
        backgroundColor:'#090A73',
        alignItems:'center',
        justifyContent:'center'
    },
    logoutButtonText: {
        fontSize:16,
        color:'#fff',
        fontFamily:Font.NotoSansMedium
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