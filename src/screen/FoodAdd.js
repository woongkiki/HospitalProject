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

const FoodAdd = (props) => {

    const {navigation, route, userInfo} = props;

    const {params} = route;

    console.log(params);

    const isFocused = useIsFocused();


    const [foodSendIdx, setFoodSendIdx] = useState([]);

    useEffect(()=>{
        if(isFocused){
            console.log(params.foodsIdxSend);
            setFoodSendIdx(params.foodsIdxSend);
        }
    }, [isFocused]);


    useEffect(()=>{
        console.log('파라미터 값 저장 ::::: ', foodSendIdx);
    }, [foodSendIdx])

    //음식 검색
    const [foodSearch, setFoodSearch] = useState('');
    const foodSearchChange = (food) => {
        setFoodSearch(food);
    }


    //음식데이터 전달
    const [foodDatas, setFoodDatas] = useState([]);

    const foodSearchBtn = () => {
        if(!foodSearch){
            ToastMessage('검색어를 입력하세요.');
            return false;
        }

        Api.send('food_list', {'id':userInfo.id,  'token':userInfo.appToken, 'schText':foodSearch, 'page':1}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                console.log('등록된 태그 정보: ', arrItems);
                
                setFoodDatas(arrItems);
                //console.log(arrItems);
            }else{
                console.log('결과 출력 실패!', resultItem);
               
            }
        });
    }


    const [selectFood, setSelectFood] = useState('');
    const [selectFoodName, setSelectFoodName] = useState('');
    const [selectFoodKcal, setSelectFoodKcal] = useState('');
    const [selectFoodInfo, setSelectFoodInfo] = useState('');

    const [selectFoodCost, setSelectFoodCost] = useState('');
    const [selectFoodQty, setSelectFoodQty] = useState('');
    const [selectFoodStd, setSelectFoodStd] = useState('');


    //음식 추가하기 메밀
    const foodSelectBtn = (foodInfo) => {
       // setSelectFood(foodInfo);

       if(foodSendIdx == ""){
            setSelectFood(foodInfo.idx);
        }else{

            if(foodSendIdx.includes(foodInfo.idx)){
                ToastMessage('이미 선택된 음식입니다.');
            }else{
                setSelectFood(foodInfo.idx);
            }
        }
       setSelectFoodName(foodInfo.name);
       setSelectFoodKcal(foodInfo.kcal);

       setSelectFoodInfo(foodInfo.subinfo);


       setSelectFoodCost(foodInfo.cost);
       setSelectFoodQty(foodInfo.qty);
       setSelectFoodStd(foodInfo.std);
       //console.log(foodInfo);

       
       
    }
//메밀
    useEffect(()=>{
        console.log('123',selectFood, selectFoodStd);
    }, [selectFood, selectFoodStd])

    const foodSaveButton = () => {
       // console.log(selectFood);
        console.log(selectFood);
        if(!selectFood){
            ToastMessage('음식을 선택하세요.');
            return false;
        }

        //console.log('완료', selectFood)

        navigation.navigate('FoodDiaryAdd', {'foods':selectFood, 'foodName':{'fidx':selectFood,'fname':selectFoodName, 'fkcal':selectFoodKcal, 'fsubInfo':selectFoodInfo, 'fcost':selectFoodCost, 'fqty':selectFoodQty, 'fstd':selectFoodStd, 'kcalReal':selectFoodKcal, 'costReal':selectFoodCost}, 'tagList':params.tagList});
    }

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderComponents headerTitle='음식추가' navigation={navigation} />
            <ScrollView>
                <Box p={5}>
                    <HStack alignItems='center' height='50px' backgroundColor='#F1F1F1' borderRadius={5}>
                        <Input
                            placeholder='음식 이름을 입력하세요.'
                            height='45px'
                            width={width-80}
                            backgroundColor='transparent'
                            borderWidth={0}
                            onSubmitEditing={foodSearchBtn}
                            value={foodSearch}
                            onChangeText={foodSearchChange}
                        />
                        <TouchableOpacity onPress={foodSearchBtn}>
                            <Image source={require('../images/schIcons.png')} alt='검색' />
                        </TouchableOpacity>
                    </HStack>
                    <Box mt={5}>
                        {
                            foodDatas != "" ?
                            foodDatas.map((item, index)=>{
                                return (
                                    <TouchableOpacity onPress={()=>foodSelectBtn(item)} key={index} style={[ index != 0 && {marginTop:10} ]}>
                                        <HStack style={[{height:40, backgroundColor:'#f1f1f1', borderRadius:15}, selectFood == item.idx && {backgroundColor:'#aaa'} ]} justifyContent='space-between' alignItems='center' px={5}>
                                            <DefText text={item.name} style={[{fontSize:14, color:'#333', fontWeight:'bold'}, selectFood == item.idx && {color:'#fff'}]} />
                                            <DefText text={item.kcal + 'kcal, ' + item.subinfo} style={[{fontSize:13,color:'#666'}, selectFood == item.idx && {color:'#fff'}]}/>
                                        </HStack>
                                    </TouchableOpacity>
                                )
                            })
                            :
                            <Box justifyContent='center' alignItems='center' height={'130px'}>
                                <DefText text='검색된 음식 목록이 없습니다.' style={{fontSize:14, color:'#666'}} />
                            </Box>
                        }
                    </Box>
                    
                </Box>
            </ScrollView>
            <Box p={2.5} px={5}>
                <TouchableOpacity onPress={foodSaveButton} style={[styles.buttonDef]}>
                    <DefText text='음식 추가' style={styles.buttonDefText} />
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
)(FoodAdd);