import React, {useState, useEffect, useCallback} from 'react';
import { TouchableOpacity, Dimensions, Text, ScrollView, StyleSheet, FlatList } from 'react-native';
import { Box, Image, HStack } from 'native-base';
import { DefText } from '../common/BOOTSTRAP';
import HeaderComponents from '../components/HeaderComponents';
import { InquiryListData } from '../Utils/DummyData';
import { connect } from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import Api from '../Api';
import AsyncStorage from '@react-native-community/async-storage';
import ToastMessage from '../components/ToastMessage';
import HTML from 'react-native-render-html';
import StyleHtml from '../common/StyleHtml';
import { useFocusEffect } from '@react-navigation/native';

const InquiryList = (props) => {

    const {navigation, userInfo, member_info} = props;

    //console.log(userInfo);

    const [inquirySelect, setInquirySelect] = useState('');

    const InqSelectHandle = (index) => {
        if(index == inquirySelect){
            setInquirySelect(123);
        }else{
            setInquirySelect(index);
        }
        
    }

    const [inqData, setInqData] = useState([]);

    //커뮤니티 데이터 가져오기
    const inquiryHandler = async () => {
        
        await Api.send('qna_list', { 'id':userInfo.id, 'token':userInfo.appToken }, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;

            if(resultItem.result === 'Y' && arrItems) {
                console.log('결과 출력 ㅇㅇ : ', arrItems);
                setInqData(arrItems);
            }else{
                console.log('결과 출력 실패! 333');
            }
        });

    }

    useEffect(()=>{
        inquiryHandler();
    },[])


    useFocusEffect(
        React.useCallback(()=>{
            // screen is focused
            inquiryHandler();

            return () => {
                // screen is unfocused
                console.log('포커스 nono');
            };
        },[])
    );

    const InqList = inqData.map((item, index)=>{
        return (
            <Box key={index}>
                <TouchableOpacity activeOpacity={0.9} onPress={()=>{InqSelectHandle(index)}} style={{paddingVertical:15, paddingHorizontal: 20, borderBottomWidth:1, borderBottomColor:'#eee'}}>
                    <HStack>
                        <HStack>
                            <DefText text='Q' style={[item.status == 'Y' ? {color:'#5EB5E0'} : {color:'#f00'}, {fontWeight:'bold', marginRight:10}]} />
                            <DefText text={item.subject} style={{fontSize:16, fontWeight:'bold'}} />
                        </HStack>
                        <Box style={{position:'absolute', right:0, bottom:-10}}>
                            <DefText text={item.status == 'Y' ? '답변완료' : '답변대기'} style={[{fontSize:12, fontWeight:'bold'}, item.status === 'Y' ? {color:'#5EB5E0'} : {color:'#f00'} ]} />
                        </Box>
                    </HStack>
                </TouchableOpacity>
                {
                    inquirySelect === index &&
                    <Box px={5} borderBottomWidth={1} borderBottomColor='#eee'>
                        <Box borderBottomWidth={1} borderBottomColor='#eee' py={5}>
                            <DefText text={item.wdate} style={{fontSize:12, color:'#a2a2a2'}} />
                            <DefText text={item.subject} style={{fontSize:16, color:'#000', fontWeight:'bold', marginTop:10}}/>
                            <DefText text={item.content} style={{fontSize:14, color:'#333', marginTop:10}} />
                        </Box>
                        {
                            item.status == 'Y' ?
                            <Box py={5}>
                                {/* <DefText text={item.datetimes} style={{fontSize:12, color:'#a2a2a2', textAlign:'right'}} /> */}
                                {/* <DefText text={item.reply} style={{fontSize:14, color:'#333', marginTop:10}}/> */}
                                <Box mt={2.5}>
                                <HTML 
                                    ignoredStyles={[ 'width', 'height', 'margin', 'padding', 'fontFamily', 'lineHeight']}
                                    ignoredTags={['head', 'script', 'src']}
                                    imagesMaxWidth={Dimensions.get('window').width - 40}
                                    source={{html: item.reply}} 
                                    tagsStyles={StyleHtml}
                                    containerStyle={{ flex: 1, }}
                                    contentWidth={Dimensions.get('window').width}  
                                />
                                </Box>
                            </Box>
                            :
                            <Box py={5}>
                                <DefText text='등록된 답변이 없습니다.' style={{fontSize:14,textAlign:'center'}} />
                            </Box>
                        }
                        
                    </Box>
                }
                
            </Box>
        )
    })

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderComponents headerTitle='문의내역' navigation={navigation} />
            {
                inqData.length > 0 ?
                <ScrollView>
                    {InqList}
                </ScrollView>
                :
                <Box py={10} alignItems='center' justifyContent='center' flex={1}>
                    <DefText text='등록된 문의내역이 없습니다.' />
                </Box>
            }
            <Box p={2.5} px={5}>
                <TouchableOpacity onPress={()=>{navigation.navigate('InquiryForm')}} style={[styles.buttonDef]}>
                    <DefText text='문의하기' style={styles.buttonDefText} />
                </TouchableOpacity>
            </Box>
        </Box>
    );
};

const styles = StyleSheet.create({
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
)(InquiryList);