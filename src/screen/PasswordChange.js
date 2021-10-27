import React, { useEffect, useState } from 'react';
import {Box, VStack, HStack, Image, Modal} from 'native-base';
import { ScrollView, Dimensions, Alert, TouchableOpacity} from 'react-native';
import {DefText, DefInput, Button} from '../common/BOOTSTRAP';
import ToastMessage from '../components/ToastMessage';
import HeaderRegister from '../components/HeaderRegister';
import HeaderComponents from '../components/HeaderComponents';
import {email_check, phoneFormat} from '../common/dataFunction';

const PasswordChange = (props) => {

    const { navigation } = props;

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
            ToastMessage('비밀번호를 입력하세요.');
            return false;
        }

        if(!rePasswordInput){
            ToastMessage('비밀번호를 다시한번 입력하세요.');
            return false;
        }

        if(passwordInput != rePasswordInput){
            ToastMessage('비밀번호가 일치하지 않습니다.');
            return false;
        }

        setPasswordChangeModal(true);
    }

    const _PasswordSubmits = async () => {
        await setPasswordChangeModal(false);
        await navigation.navigate('Login');
    }

    return (
        <Box flex={1} backgroundColor='#fff'>
            <ScrollView>
                <HeaderComponents navigation={navigation} headerTitle='비밀번호 변경' />
                <Box py={8}>
                    <VStack>
                        <DefText text='변경하실 비밀번호를 입력하세요.' style={{textAlign:'center'}} />
                    </VStack>
                </Box>
                <VStack px={12}>
                    <Box>
                        <HStack>
                            <DefText text='비밀번호' style={{fontSize:14}} />
                            <DefText text='*' style={{fontSize:14, color:'#f00', marginLeft:5}} />
                        </HStack>
                        <Box mt='15px'>
                            <DefInput 
                                placeholderText='비밀번호를 입력해주세요.'
                                inputValue = {passwordInput}
                                onChangeText = {passwordChange}
                                multiline = {false}
                                secureTextEntry={true}
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
                            <DefText text='비밀번호 확인' style={{fontSize:14}} />
                            <DefText text='*' style={{fontSize:14, color:'#f00', marginLeft:5}} />
                        </HStack>
                        <Box mt='15px'>
                            <DefInput 
                                placeholderText='비밀번호를 다시 입력해주세요.'
                                inputValue = {rePasswordInput}
                                onChangeText = {rePasswordChange}
                                multiline = {false}
                                secureTextEntry={true}
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
                        <Button onPress={_PasswordChangeSubmit} text='비밀번호 변경' buttonStyle={{borderRadius:8}} textStyle={{fontSize:14}}  />
                    </Box>
                </VStack>
            </ScrollView>
            <Modal isOpen={passwordChangeModal} >
                <Modal.Content maxWidth={width-100}>
                    <Modal.Body>
                        <Box>
                            <DefText text='비밀번호가 변경되었습니다.' style={{color:'#333'}} />
                            <DefText text='변경된 비밀번호로 로그인해주세요.' style={{marginTop:10, color:'#333'}} />
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

export default PasswordChange;