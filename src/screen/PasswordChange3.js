import React, { useEffect, useState } from 'react';
import {Box, VStack, HStack, Image, Modal} from 'native-base';
import { ScrollView, Dimensions, Alert, TouchableOpacity} from 'react-native';
import {DefText, DefInput, Button} from '../common/BOOTSTRAP';
import ToastMessage from '../components/ToastMessage';
import HeaderRegister from '../components/HeaderRegister';
import HeaderComponents from '../components/HeaderComponents';
import {email_check, phoneFormat} from '../common/dataFunction';
import Api from '../Api';
import messaging from '@react-native-firebase/messaging';
import { connect } from 'react-redux';
import { StackActions } from '@react-navigation/native';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';

const PasswordChange3 = (props) => {

    const { navigation, route, member_logout } = props;

    const { params } = route;

    //console.log(params);

    const {width} = Dimensions.get('window');

    //비밀번호 입력
    const [passwordInput, setPasswordInput] = useState('');
    const passwordChange = (password) => {
        setPasswordInput(password);
    }

    //비밀번호 재입력
    const [rePasswordInput, setRePasswordInput] = useState('');
    const rePasswordChange = (password) => {
        setRePasswordInput(password);
    }

    const [passwordChangeModal, setPasswordChangeModal] = useState(false);

    const _PasswordChangeSubmit = () => {
        if(!passwordInput){
            ToastMessage('간편비밀번호를 입력하세요.');
            return false;
        }

        if(!rePasswordInput){
            ToastMessage('간편비밀번호를 다시한번 입력하세요.');
            return false;
        }

        if(passwordInput != rePasswordInput){
            ToastMessage('간편비밀번호가 일치하지 않습니다.');
            return false;
        }

        Api.send('member_chgPassword2', {'id':params.id, 'password':passwordInput, 'password2':rePasswordInput}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;

            if(resultItem.result === 'Y' && arrItems) {

               console.log('출력확인..',arrItems);
               //ToastMessage(resultItem.message);
               setPasswordChangeModal(true);

            }else{
                console.log('결과 출력 실패!', resultItem);
                ToastMessage(resultItem.message);
            }
        })

        
    }

    const LogOut = async () => {
        const formData = new FormData();
        formData.append('method', 'member_logout');
       // formData.append('id', userInfo.email);

        const logout =  await member_logout(formData);

       // console.log(logout.state);

        //ToastMessage('로그아웃 합니다.');
        //navigation.replace('Login');
        navigation.dispatch(StackActions.replace('Login'));
    }

    const _PasswordSubmits = async () => {
        await setPasswordChangeModal(false);
        navigation.replace('AcountInfo');

    //    navigation.reset({
    //         routes: [{ name: 'Tab_Navigation', screen: 'Home' }],
    //     });
        //await LogOut();
    }

    return (
        <Box flex={1} backgroundColor='#fff'>
            <ScrollView>
                <HeaderComponents navigation={navigation} headerTitle='간편비밀번호 변경' />
                <Box p={5}>
                    <VStack>
                        <DefText text='변경하실 간편비밀번호를 입력하세요.' style={{textAlign:'center'}} />
                    </VStack>
               
                    <VStack mt={5}>
                        <Box>
                            <HStack>
                                <DefText text='간편비밀번호' style={{fontSize:14}} />
                                <DefText text='*' style={{fontSize:14, color:'#f00', marginLeft:5}} />
                            </HStack>
                            <Box mt='15px'>
                                <DefInput 
                                    placeholderText='간편비밀번호를 입력해주세요. (최대 6자리)'
                                    inputValue = {passwordInput}
                                    onChangeText = {passwordChange}
                                    multiline = {false}
                                    secureTextEntry={true}
                                    keyboardType={'number-pad'}
                                    maxLength={6}
                                />
                                <Box style={{height:48, position:'absolute', top:0, right:15, justifyContent:'center'}}>
                                    <Image 
                                        source={require('../images/eyes.png')} 
                                        alt='암호화'
                                    />
                                </Box>
                            </Box>
                        </Box>
                        <Box mt={5}>
                            <HStack>
                                <DefText text='간편비밀번호 확인' style={{fontSize:14}} />
                                <DefText text='*' style={{fontSize:14, color:'#f00', marginLeft:5}} />
                            </HStack>
                            <Box mt='15px'>
                                <DefInput 
                                    placeholderText='간편비밀번호를 다시 입력해주세요. (최대 6자리)'
                                    inputValue = {rePasswordInput}
                                    onChangeText = {rePasswordChange}
                                    multiline = {false}
                                    secureTextEntry={true}
                                    keyboardType={'number-pad'}
                                    maxLength={6}
                                />
                                <Box style={{height:48, position:'absolute', top:0, right:15, justifyContent:'center'}}>
                                    <Image 
                                        source={require('../images/eyes.png')} 
                                        alt='암호화'
                                    />
                                </Box>
                            </Box>
                        </Box>
                        <Box mt='60px'>
                            <Button onPress={_PasswordChangeSubmit} text='간편비밀번호 변경' buttonStyle={{borderRadius:8}} textStyle={{fontSize:14}}  />
                        </Box>
                    </VStack>
                </Box>
            </ScrollView>
            <Modal isOpen={passwordChangeModal} >
                <Modal.Content maxWidth={width-100}>
                    <Modal.Body>
                        <Box>
                            <DefText text='간편비밀번호가 변경되었습니다.' style={{color:'#333'}} />
                            <Box alignItems='center'>
                                <Button onPress={_PasswordSubmits} text='확인' buttonStyle={{borderRadius:8, height:40, marginTop:20, width:width*0.3}} textStyle={{fontSize:14}}  />
                            </Box>
                        </Box>
                    </Modal.Body>
                </Modal.Content>
            </Modal>
        </Box>
    );
};

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
)(PasswordChange3);