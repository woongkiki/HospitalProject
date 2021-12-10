import React, {useState, useEffect, useCallback} from 'react';
import { TouchableOpacity, Dimensions, Text, ScrollView, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Box, Image, HStack, VStack, Input } from 'native-base';
import { DefText } from '../common/BOOTSTRAP';
import HeaderComponents from '../components/HeaderComponents';
import { connect } from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import Api from '../Api';
import AsyncStorage from '@react-native-community/async-storage';
import ToastMessage from '../components/ToastMessage';
import Font from '../common/Font';
import { useFocusEffect } from '@react-navigation/native';

const {width} = Dimensions.get('window');

const HospitalAdd = (props) => {

    const {navigation, userInfo} = props;


    //병원코드 입력
    const [hospitalCode, setHospitalCode] = useState('');
    const hospitalChange = (text) => {
        setHospitalCode(text);
    }


    //병원코드 입력완료 버튼
    const hospitalAdds = () => {
        if(!hospitalCode){
            ToastMessage('병원코드를 입력하세요.');
            return false;
        }

        Api.send('member_membership', {'id':userInfo.id, 'token':userInfo.token, 'joinCode':hospitalCode}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                //console.log('병원 정보: ', arrItems);

                //console.log(resultItem);
                ToastMessage(resultItem.message);
                navigation.navigate('AcountInfo');
    
            }else{
                console.log('결과 출력 실패!', resultItem);
                ToastMessage(resultItem.message);
            }
        });
    }

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderComponents navigation={navigation} headerTitle='병원추가' />
            <ScrollView>
                <Box p={5}>
                    <Box>
                        <HStack>
                            <DefText text='병원코드' style={{fontSize:14}} />
                            <DefText text='*' style={{fontSize:14, color:'#f00', marginLeft:5}} />
                        </HStack>
                        <Input 
                            placeholder='추가하실 병원코드를 입력하세요.'
                            inputValue = {hospitalCode}
                            onChangeText = {hospitalChange}
                            multiline = {false}
                            style={{marginTop:15, fontSize:14}}
                            _focus='transparent'
                            height='45px'
                        />
                    </Box>

                    <Box mt={5}>
                        <TouchableOpacity onPress={hospitalAdds} style={styles.buttonDef}>
                            <DefText text='병원 추가' style={styles.buttonDefText} />
                        </TouchableOpacity>
                    </Box>
                </Box>
            </ScrollView>
        </Box>
    );
};

const styles = StyleSheet.create(({
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
    }
}))

export default connect(
    ({ User }) => ({
        userInfo: User.userInfo, //회원정보
    }),
    (dispatch) => ({
        member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
        member_info: (user) => dispatch(UserAction.member_info(user)), //회원 정보 조회
        
    })
  )(HospitalAdd);