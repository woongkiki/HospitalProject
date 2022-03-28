import React, {useState, useEffect} from 'react';
import { Box, VStack, HStack, Image, Input } from 'native-base';
import { TouchableOpacity, Dimensions, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import {DefInput, DefText} from '../common/BOOTSTRAP';
import HeaderFood from '../components/HeaderFood';
import { foodCategory, foodLists } from '../Utils/DummyData';
import HeaderComponents from '../components/HeaderComponents';
import { connect } from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import Api from '../Api';
import ToastMessage from '../components/ToastMessage';

const {width} = Dimensions.get('window');

const imgBannerHeight = width / 1.45;

const FoodDiaryView = (props) => {

    const {navigation, route, userInfo} = props;

    const {params} = route;

   // console.log('paramsparams',params);

    let starImg;

    if(params.score == 1){
        starImg = <Image source={require('../images/s_star1.png')} alt='별점 1' style={{width:100, resizeMode:'contain'}} />;
    }else if(params.score == 2){
        starImg = <Image source={require('../images/s_star2.png')} alt='별점 2' style={{width:100, resizeMode:'contain'}} />;
    }else if(params.score == 3){
        starImg = <Image source={require('../images/s_star3.png')} alt='별점 3' style={{width:100, resizeMode:'contain'}} />;
    }else if(params.score == 4){
        starImg = <Image source={require('../images/s_star4.png')} alt='별점 4' style={{width:100, resizeMode:'contain'}} />;
    }else if(params.score == 5){
        starImg = <Image source={require('../images/s_star5.png')} alt='별점 5' style={{width:100, resizeMode:'contain'}} />;
    }

    // const Categorys = params.category.split(',');

    const categoryList = params.tag_list.map((item, index)=>{
        return(
            <Box key={index} backgroundColor='#696968'  px='10px' borderRadius={15} mr={ 2.5 } mt={2.5}>
                <DefText text={item} style={{color:'#fff', lineHeight:30}} />
            </Box>
        )
    })
    //console.log(Categorys);

    const [loading, setLoading] = useState(false);

    const [foodDetail, setFoodDetail] = useState('');

    const FoodDetailRequest = async () => {

        await setLoading(false);

        await Api.send('food_detail', {'id':userInfo.id, 'token':userInfo.appToken, 'idx':params.idx}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;

            if(resultItem.result === 'Y' && arrItems) {
                console.log('식단 정보: ', arrItems);
                //setFoodListData(arrItems);

                setFoodDetail(arrItems);

            }else{
                console.log('결과 출력 실패!', resultItem);
            
            }
        });

        await setLoading(true);
    }

    useEffect(()=>{
        FoodDetailRequest();
    }, [])

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderComponents headerTitle='식단일기' navigation={navigation} />
            {
                loading ?
                <ScrollView>
                    <Box>
                        <Image source={{uri:foodDetail.upfile}} alt={params.fname} style={{width:width, height:width / 1.45, resizeMode:'cover'}} />
                    </Box>
                    <Box p={5}>
                        <DefText text={foodDetail.fname + ' (' + foodDetail.kcal + 'kcal)'} style={{fontSize:18, lineHeight:21, color:'#000', fontWeight:'bold'}} />
                        <DefText text={foodDetail.meal} style={{marginTop:5}} />
                        <Box mt={2.5}>
                            {starImg}
                        </Box>
                        <DefText text={foodDetail.memo} style={{fontSize:14,marginTop:10}} />
                        <DefText text={'섭취장소 : '+foodDetail.place} style={{marginTop:10}}/>
                        <DefText text={foodDetail.fdate + ' ' + foodDetail.ftime} style={{fontSize:13, color:'#666', marginTop:10}} />
                        {
                            params.tag_list != '' && 
                            <HStack  flexWrap='wrap'>
                                {categoryList}
                            </HStack>
                        }
                        
                    </Box>
                </ScrollView>
                :
                <Box flex={1} alignItems='center' justifyContent='center'>
                    <ActivityIndicator size='large' color='#333' />
                </Box>
            }
            
           
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
)(FoodDiaryView);