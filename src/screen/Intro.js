import React, {useEffect, useState} from 'react';
import { Box, VStack, Image } from 'native-base';
import { ActivityIndicator } from 'react-native';
import { DefText } from '../common/BOOTSTRAP';
import AsyncStorage from '@react-native-community/async-storage';
import messaging from '@react-native-firebase/messaging';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import ToastMessage from '../components/ToastMessage';

const Intro = (props) => {

    const {navigation, member_login, member_info} = props;

    //console.log(navigation);

    //  setTimeout(() => {

    //      navigation.replace('Tab_Navigation');
    
    //  }, 2000);

    useEffect(()=>{
        AsyncStorage.getItem('save_id').then(async (response) => {
            
            if (response === null) {

                console.log('세션 없음');
                
                setTimeout(() => {

                    navigation.replace('Login');
            
                }, 2000);

            }

            const token = await messaging().getToken();
           // console.log(":::::::",response);
            //console.log('tokens', token);

            const formData = new FormData();
            formData.append('method', 'member_info');
            formData.append('id', response);
            formData.append('token', token);
            
            const member_info_list = await member_info(formData);

            if(member_info_list.state){

                console.log('자동로그인 완료...');

                // console.log(member_info_list);
                setTimeout(() => {

                    navigation.replace('Tab_Navigation', {
                        screen: 'Home',
                        params: {
                            msg : member_info_list.msg
                        }
                    });
            
                }, 2000);

            }else{
                setTimeout(() => {

                    navigation.replace('Login');
            
                }, 2000);
            }
        });
    }, []);

    return (
        <Box flex={1} backgroundColor='#fff' justifyContent='center' alignItems='center'>
            <VStack  alignItems='center'>
                <Image source={require('../images/introLogo0216.png')} alt='logo' style={{width:140, height:140, resizeMode:'contain'}}  />
                <ActivityIndicator size={'large'} color="#333" style={{marginTop:50}} />
                <DefText text='회원 정보를 확인 중입니다...' style={{fontSize:15, color:'#111', marginTop:40}} />
            </VStack>
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
        
    })
)(Intro);