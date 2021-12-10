import React, {useState, useEffect} from 'react';
import { TouchableOpacity, Dimensions, Text, ScrollView, StyleSheet, FlatList } from 'react-native';
import { Box, Image, HStack } from 'native-base';
import { DefText } from '../common/BOOTSTRAP';
import HeaderComponents from '../components/HeaderComponents';
import { QaListData } from '../Utils/DummyData';
import { connect } from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import Api from '../Api';
import AsyncStorage from '@react-native-community/async-storage';
import HTML from 'react-native-render-html';
import StyleHtml from '../common/StyleHtml';

const QaList = (props) => {

    const {navigation, userInfo, member_info} = props;

    const [qaSelect, setQaSelect] = useState('');


    const QaSelectHandle = (index) => {
        if(index == qaSelect){
            setQaSelect(123);
        }else{
            setQaSelect(index);
        }
        
    }

    const [faqData, setFaqData] = useState('');

    //커뮤니티 데이터 가져오기
    const inquiryHandler = async () => {
        
        await Api.send('bbs_list', { 'code':'faq', 'schText':'', 'sort':'최신순' }, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;

            if(resultItem.result === 'Y' && arrItems) {
                //console.log('결과 출력 ㅇㅇ : ', arrItems);
                setFaqData(arrItems);
            }else{
                console.log('결과 출력 실패! 333');
            }
        });

    }

    useEffect(()=>{
        inquiryHandler();
    },[])

    const QaListDataR = QaListData.map((item, index)=>{
        return(
            <Box key={index}>
                <TouchableOpacity activeOpacity={0.9} onPress={()=>{QaSelectHandle(index)}} style={{paddingVertical:15, paddingHorizontal: 20, borderBottomWidth:1, borderBottomColor:'#eee'}}>
                    <HStack alignItems='center' justifyContent='space-between'>
                        <DefText text={'Q. '+item.qa} style={styles.qaText} />
                        {
                            qaSelect === index ?
                            <Image source={require('../images/faqArrUp.png')} alt='열기' />
                            :
                            <Image source={require('../images/faqArrDown.png')} alt='열기' />
                        }
                        
                    </HStack>
                </TouchableOpacity>
                {
                    qaSelect === index &&
                    <Box style={{paddingVertical:20, paddingHorizontal:20, borderBottomWidth:1, borderBottomColor:'#eee'}}>
                        <DefText text={item.answer} style={styles.answerText} />
                    </Box>
                }
            </Box>
        )
    })
    

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderComponents navigation={navigation} headerTitle='자주하는 질문' />
            {
                faqData.length > 0 ? 
                <ScrollView>
                    {
                        faqData.map((item, index)=>{
                            return(
                                <Box key={index}>
                                    <TouchableOpacity activeOpacity={0.9} onPress={()=>{QaSelectHandle(index)}} style={{paddingVertical:15, paddingHorizontal: 20, borderBottomWidth:1, borderBottomColor:'#eee', borderTopWidth:1, borderTopColor:'#eee'}}>
                                        <HStack alignItems='center' justifyContent='space-between' >
                                            <Box width='80%'>
                                                <HStack>
                                                    <DefText text='Q.' style={[styles.qaText, {marginRight:10}]}/>
                                                    <DefText text={item.subject} style={styles.qaText} />
                                                </HStack>
                                            </Box>
                                            {
                                                qaSelect === index ?
                                                <Image source={require('../images/faqArrUp.png')} alt='열기' />
                                                :
                                                <Image source={require('../images/faqArrDown.png')} alt='열기' />
                                            }
                                            
                                        </HStack>
                                    </TouchableOpacity>
                                    {
                                        qaSelect === index &&
                                        <Box p={5} borderBottomColor='#eee' borderBottomWidth={1}>
                                            <HTML 
                                                ignoredStyles={[ 'width', 'height', 'margin', 'padding', 'fontFamily', 'lineHeight', 'fontSize', 'br']}
                                                ignoredTags={['head', 'script', 'src']}
                                                imagesMaxWidth={Dimensions.get('window').width - 40}
                                                source={{html: item.content}} 
                                                tagsStyles={StyleHtml}
                                                containerStyle={{ flex: 1, }}
                                                contentWidth={Dimensions.get('window').width}  
                                            />
                                        </Box>
                                    }
                                </Box>
                            )
                        })
                 
                    }
                </ScrollView>
                :
                <Box py={10} alignItems='center' justifyContent='center' flex={1}>
                    <DefText text='등록된 자주하는질문이 없습니다.' />
                </Box>
            }
            
        </Box>
    );
};

const styles = StyleSheet.create({
    qaText: {
        fontSize:15,
        color:'#000',
        fontWeight:'bold'
    },
    answerText:{
        fontSize:14,
        color:'#333'
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
)(QaList);