import React, {useState, useEffect} from 'react';
import { TouchableOpacity, Dimensions, Text, ScrollView, StyleSheet, FlatList } from 'react-native';
import { Box, Image, HStack } from 'native-base';
import { DefText, DefInput } from '../common/BOOTSTRAP';
import HeaderComponents from '../components/HeaderComponents';
import ToastMessage from '../components/ToastMessage';
import { connect } from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import Api from '../Api';
import AsyncStorage from '@react-native-community/async-storage';

const InquiryForm = (props) => {

    const {navigation, userInfo, member_info} = props;


    //console.log(userInfo);

    const [memberId, setMemberId] = useState('');
    const [token, setToken] = useState('');


    const [inquiryTitle, setInquiryTitle] = useState('');
    const inqTitleChange = (text) => {
        setInquiryTitle(text);
    }

    const [inquiryContent, setInquiryContent] = useState('');
    const inqContentChange = (text) => {
        setInquiryContent(text);
    }

    //회원정보 조회 후 예약내역 가져오기..
    const inqSubmit = () => {
        
        AsyncStorage.getItem('flex_id').then(async (response) => {

            const formData = new FormData();
            formData.append('method', 'member_info');
            formData.append('id', response);
            formData.append('token', userInfo.appToken);
            const member_info_list = await member_info(formData);

            //console.log(member_info_list.result.membership[0].hname);

            //console.log(member_info_list.result)
            if(inquiryTitle.length == 0 ){
                ToastMessage('문의제목을 입력하세요.');
                return false;
            }
    
            if(inquiryContent.length == 0 ){
                ToastMessage('문의내용을 입력하세요.');
                return false;
            }
    

            if(member_info_list){

                await Api.send('qna_insert', {'id':userInfo.id,  'token':userInfo.appToken, 'subject':inquiryTitle, 'content':inquiryContent}, (args)=>{
                    let resultItem = args.resultItem;
                    let arrItems = args.arrItems;
            
                    if(resultItem.result === 'Y' && arrItems) {
                        console.log('1:1문의 작성 정보: ', resultItem);
                        
                        ToastMessage('1:1문의가 작성되었습니다.');
                        navigation.goBack();
                    }else{
                        //console.log('결과 출력 실패!', resultItem);
                        ToastMessage(resultItem.message);
                    }
                });
  
            }
        });
    };

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderComponents headerTitle='문의하기' navigation={navigation} />
            <ScrollView>
                <Box p={5}>
                    <Box>
                        <HStack>
                            <DefText text='문의제목' style={{fontSize:14}} />
                            <DefText text='*' style={{fontSize:14, color:'#f00', marginLeft:5}} />
                        </HStack>
                        <DefInput 
                            placeholderText='제목을 입력하세요.'
                            inputValue = {inquiryTitle}
                            onChangeText = {inqTitleChange}
                            multiline = {false}
                            inputStyle={{marginTop:15}}
                        />
                    </Box>
                    <Box mt={5}>
                        <HStack>
                            <DefText text='문의내용' style={{fontSize:14}} />
                            <DefText text='*' style={{fontSize:14, color:'#f00', marginLeft:5}} />
                        </HStack>
                        <DefInput 
                            placeholderText='내용을 입력하세요.'
                            inputValue = {inquiryContent}
                            onChangeText = {inqContentChange}
                            multiline={true}
                            inputStyle={{height:200,marginTop:15 }}
                            textAlignVertical='top'
                        />
                    </Box>
                  
                    
                </Box>
            </ScrollView>
            <Box p={2.5} px={5}>
                <TouchableOpacity onPress={inqSubmit} style={[styles.buttonDef]}>
                    <DefText text='문의하기' style={styles.buttonDefText} />
                </TouchableOpacity>
            </Box>
        </Box>
    );
};

const styles = StyleSheet.create({
    medicineButtons : {
        backgroundColor:'#666',
        borderRadius:5,
        alignItems:'center',
        justifyContent:'center',
        height: 40,
    },
    medicineButtonsText: {
        fontSize:15,
        color:'#fff',
        
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
})


export default connect(
    ({ User }) => ({
        userInfo: User.userInfo, //회원정보
    }),
    (dispatch) => ({
        member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
        member_info: (user) => dispatch(UserAction.member_info(user)), //회원 정보 조회
        
    })
)(InquiryForm);