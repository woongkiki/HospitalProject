import React, {useState, useEffect} from 'react';
import { Box, VStack, HStack, Image, Input, Select, Modal } from 'native-base';
import { TouchableOpacity, Dimensions, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import ToastMessage from '../components/ToastMessage';
import HeaderComponents from '../components/HeaderComponents';
import { connect } from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import Api from '../Api';
import { DefText } from '../common/BOOTSTRAP';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';

const {width} = Dimensions.get('window');

const FoodDiaryTag = (props) => {

    const {navigation, userInfo, route} = props;

    const {params} = route;


    console.log('파라미터...',params);

    //선택한 태그
    const [selectTag, setSelectTag] = useState([]);

    //내가 등록한 태그
    const [foodTagList, setFoodTagList] = useState([]);

    //내가 등록한 태그 가져오기
    const foodTagSubmitList = () => {
        Api.send('food_tagList', {'id':userInfo.id,  'token':userInfo.appToken}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                //console.log('등록된 태그 정보: ', arrItems);
                
                setFoodTagList(arrItems);
                //console.log(arrItems);
            }else{
                console.log('결과 출력 실패!', resultItem);
               
            }
        });
    }

    //태그 선택시 배열로 저장..
    const diseaseSelectButton = (tag) => {
        
        if(selectTag.includes(tag)){
            
            const findIdx = selectTag.find((e) => e === tag); // 배열에 같은값이 있으면 출력
             const idxs = selectTag.indexOf(findIdx);
            
             //console.log('1',diseaseDatas);
             selectTag.splice(idxs, 1)
             //const disNew = diseaseDatas.splice(idxs, 1);
             setSelectTag([...selectTag]);

        }else{
            setSelectTag([...selectTag, tag]);
        }

       
    }

    // useEffect(()=>{
    //     console.log(selectTag);
    // }, [selectTag])

    //태그 input
    const [tagInsert, setTagInsert] = useState('');
    const tagTextChange = (tag) => {
        setTagInsert(tag);
    }

    //태그등록시 동작
    const tagSubmitButton = () => {
        if(!tagInsert){
            ToastMessage('등록하실 태그를 입력하세요.');
            return false;
        }

        Api.send('food_tagSet', {'id':userInfo.id,  'token':userInfo.appToken, 'tag':tagInsert}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                //console.log('등록된 태그 정보: ', arrItems);
                
                ToastMessage(resultItem.message);
                foodTagSubmitList();

            }else{
                ToastMessage(resultItem.message);
               
            }
        });
    }

    //태그 추가 완료 버튼
    const tagSavedButton = () => {
        if(selectTag == ''){
            ToastMessage('태그를 선택하세요.');
            return false;
        }

        //console.log(selectTag);
        navigation.navigate('FoodDiaryAdd', {'tagList':selectTag, 'foorNameOr':params.foorNameOr, 'foodName':params.foodName, 'foods':params.foods});
    }


    //페이지 들어오자마자 한번 실행
    useEffect(()=>{
        foodTagSubmitList();
    }, [])


    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderComponents headerTitle='태그추가' navigation={navigation} />
            <ScrollView>
                <Box p={5}>
                    <Box>
                        <DefText text='선택한 태그' />
                        {
                            selectTag != '' ?
                            <HStack flexWrap='wrap'>
                                {
                                    selectTag.map((item, index)=>{
                                        return (
                                            <Box key={index} style={[styles.disButton]} >
                                                <DefText text={'#' + item} style={{fontSize:14,color:'#333'}} />
                                            </Box>
                                        )
                                    })
                                }
                            </HStack>
                            :
                            <Box py={5} alignItems='center' justifyContent='center'>
                                <DefText text='선택된 태그가 없습니다.' style={{fontSize:14,color:'#666'}} />
                            </Box>
                        
                        }
                        
                    </Box>
                    <Box mt={5}>
                        <DefText text='등록태그' />

                        {
                                foodTagList != "" ?
                                <HStack flexWrap='wrap'>
                                    {
                                        foodTagList.map((item, index)=>{
                                        return(
                                            <TouchableOpacity key={index} style={[styles.disButton, selectTag.includes(item) && {backgroundColor:'#666'} ]} onPress={()=>diseaseSelectButton(item)}>
                                                <DefText text={'#'+item} style={[styles.disText, selectTag.includes(item) && {color:'#fff'}]} />
                                            </TouchableOpacity>
                                        )
                                        })
                                    }
                                </HStack>
                                :
                                <Box py={5} alignItems='center' justifyContent='center'>
                                    <DefText text='등록된 태그가 없습니다.' style={{fontSize:14,color:'#666'}} />
                                </Box>
                        }
                        
                    </Box>
                    <Box mt={5}>
                        <Input 
                            placeholder='등록하실 태그명을 입력하세요.'
                            height='40px'
                            width={width-40}
                            backgroundColor='transparent'
                            _focus='transparent'
                            borderWidth={1}
                            style={{fontSize:14}}
                            value={tagInsert}
                            onChangeText={tagTextChange}
                        />
                        <TouchableOpacity onPress={tagSubmitButton} style={[styles.inputEnters]}>
                            <DefText text='태그등록' style={{color:'#fff'}} />
                        </TouchableOpacity>
                    </Box>
                </Box>
            </ScrollView>
            <Box p={2.5} px={5}>
                <TouchableOpacity onPress={tagSavedButton} style={[styles.buttonDef]}>
                <DefText text='태그 추가' style={styles.buttonDefText} />
                </TouchableOpacity>
            </Box>
        </Box>
    );
};

const styles = StyleSheet.create({
    reportLabel : {
        fontSize:15,
        color:'#666',
        fontWeight:'bold'
    },
    reportDataText: {
        fontSize:15,
        color:'#333'
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
    inputEnters:{
        height:35,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#70A86E',
        borderRadius:10,
        marginTop:10
    },
    disButton: {
        paddingVertical:5,
        paddingHorizontal:10,
        borderRadius:10,
        height:30,
        backgroundColor:'#f1f1f1',
        marginRight:10,
        marginTop:10
    },
    disText: {
        fontSize:14,
        color:'#333',
        fontWeight:'bold'
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
)(FoodDiaryTag);