import React, {useState, useEffect} from 'react';
import { Box, VStack, HStack, Image, Input } from 'native-base';
import { TouchableOpacity, Dimensions, ScrollView, StyleSheet } from 'react-native';
import {DefInput, DefText} from '../common/BOOTSTRAP';
import HeaderFood from '../components/HeaderFood';
import { foodCategory, foodLists } from '../Utils/DummyData';
import HeaderComponents from '../components/HeaderComponents';

const {width} = Dimensions.get('window');

const FoodDiaryView = (props) => {

    const {navigation, route} = props;

    const {params} = route;

    let starImg;

    if(params.star == 1){
        starImg = <Image source={require('../images/s_star1.png')} alt='별점 1' style={{width:100, resizeMode:'contain'}} />;
    }else if(params.star == 2){
        starImg = <Image source={require('../images/s_star2.png')} alt='별점 2' style={{width:100, resizeMode:'contain'}} />;
    }else if(params.star == 3){
        starImg = <Image source={require('../images/s_star3.png')} alt='별점 3' style={{width:100, resizeMode:'contain'}} />;
    }else if(params.star == 4){
        starImg = <Image source={require('../images/s_star4.png')} alt='별점 4' style={{width:100, resizeMode:'contain'}} />;
    }else if(params.star == 5){
        starImg = <Image source={require('../images/s_star5.png')} alt='별점 5' style={{width:100, resizeMode:'contain'}} />;
    }

    const Categorys = params.category.split(',');

    const categoryList = Categorys.map((item, index)=>{
        return(
            <Box key={index} backgroundColor='#666' py='4px' px='10px' borderRadius={15} ml={ index != 0 ? 2.5 : 0 } >
                <DefText text={item} style={{fontSize:13,color:'#fff'}} />
            </Box>
        )
    })
    //console.log(Categorys);

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderComponents headerTitle='식단일기' navigation={navigation} />
            <ScrollView>
                <Box>
                    <Image source={{uri:params.viewThumb}} alt={params.foodName} style={{width:width, height:290, resizeMode:'contain'}} />
                </Box>
                <Box p={5}>
                    <DefText text={params.foodName + " (" + params.kcal + "kcal)"} style={{fontSize:18, color:'#000', fontWeight:'bold'}} />
                    <Box mt={2.5}>
                        {starImg}
                    </Box>
                    <DefText text={params.comment} style={{fontSize:14,marginTop:10}} />
                    <DefText text={params.datetime} style={{fontSize:13, color:'#666', marginTop:10}} />
                    <HStack mt={2.5}>
                        {categoryList}
                    </HStack>
                </Box>
            </ScrollView>
           
        </Box>
    );
};

export default FoodDiaryView;