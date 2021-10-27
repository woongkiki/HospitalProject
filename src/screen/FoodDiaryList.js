import React, {useState, useEffect} from 'react';
import { Box, VStack, HStack, Image, Input } from 'native-base';
import { TouchableOpacity, Dimensions, ScrollView, StyleSheet } from 'react-native';
import {DefInput, DefText} from '../common/BOOTSTRAP';
import HeaderFood from '../components/HeaderFood';
import { foodCategory, foodLists } from '../Utils/DummyData';

const {width} = Dimensions.get('window');

const FoodDiaryList = (props) => {

    const {navigation} = props;

    const [foodInput, setFoodInput] = useState('');

    const foodInputChange = (text) => {
        setFoodInput(text);
    }

    const [foodCategorys, setFoodCategorys] = useState('');

    const foodCategorySelect = ( category ) => {
        setFoodCategorys(category);
        setFoodInput(category);
    }

    const foodCategoryList = foodCategory.map((item, index)=> {
        return(
            <TouchableOpacity key={index} style={[styles.keywordButton, foodCategorys == item.category && {backgroundColor:'#666'} ]} onPress={()=>{foodCategorySelect(item.category)}}>
                <DefText text={'#'+item.category} style={[styles.keywordButtonText, foodCategorys == item.category && {color:'#fff'}]} />
            </TouchableOpacity>
        )
    });

    const foodListsItems = foodLists.map((item, index)=> {

    
        let itemCategoryArr = item.category.split(',');

        const itemCategorys = itemCategoryArr.map((category, idx)=>{
            return(
                <Box key={idx} backgroundColor='#666' py='4px' px='10px' borderRadius={15} ml={ idx != 0 ? 2.5 : 0 } >
                    <DefText text={category} style={{fontSize:13,color:'#fff'}} />
                </Box>
            )
        });


        let starImg;

        if(item.star == 1){
            starImg = <Image source={require('../images/s_star1.png')} alt='별점 1' width={20} />;
        }else if(item.star == 2){
            starImg = <Image source={require('../images/s_star2.png')} alt='별점 2' />;
        }else if(item.star == 3){
            starImg = <Image source={require('../images/s_star3.png')} alt='별점 3' />;
        }else if(item.star == 4){
            starImg = <Image source={require('../images/s_star4.png')} alt='별점 4' width={20} resizeMode='contain' />;
        }else if(item.star == 5){
            starImg = <Image source={require('../images/s_star5.png')} alt='별점 5' />;
        }

        return(
            <Box key={index} shadow={8} p={5} py={2.5} backgroundColor='#fff' borderRadius={15} mt={ index != 0 ? 5 : 2.5 }>
                <TouchableOpacity onPress={()=>navigation.navigate('FoodDiaryView', item)}>
                    <HStack justifyContent='space-between' alignItems='center'>
                        <VStack width={(width-80)*0.6} >
                            <HStack mb={2}>
                                {itemCategorys}
                            </HStack>
                            <DefText text={item.foodName + " (" + item.kcal + "kcal)"} style={styles.foodTitle} />
                            <Box>
                                {starImg}
                            </Box>
                            <Box mt={2.5}>
                                <DefText text={item.comment} style={styles.foodComment} />
                                <DefText text={item.datetime} style={[styles.foodComment, {marginTop:5}]} />
                            </Box>
                        </VStack>
                        <Box width={(width-80)*0.35} alignItems='flex-end'>
                            <Image source={{uri:item.imgUrl}} alt='이미지' width={(width-80)*0.3} height={(width-80)*0.30} resizeMode='contain' />
                        </Box>
                    </HStack>
                </TouchableOpacity>
            </Box>
        )
    })

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderFood navigation={navigation} headerTitle='식단일기' />
            <ScrollView>
                <Box p={5}>
                    <Box>
                        <HStack alignItems='center' height='50px' backgroundColor='#F1F1F1' borderRadius={5}>
                            <Input
                                placeholder='검색하실 태그를 입력하세요.'
                                height='45px'
                                width={width-80}
                                backgroundColor='transparent'
                                borderWidth={0}
                                //onSubmitEditing={schButtons}
                                value={foodInput}
                                onChangeText={foodInputChange}
                            />
                            <TouchableOpacity >
                                <Image source={require('../images/schIcons.png')} alt='검색' />
                            </TouchableOpacity>
                        </HStack>
                        <HStack flexWrap='wrap' mb={2.5}>
                            {foodCategoryList}
                        </HStack>
                    </Box>
                    <VStack>
                        {foodListsItems}
                    </VStack>
                </Box>
            </ScrollView>
            <Box p={2.5} px={5}>
                <TouchableOpacity onPress={()=>{navigation.navigate('FoodDiaryAdd')}} style={[styles.buttonDef]}>
                   <DefText text='식단정보 추가' style={styles.buttonDefText} />
                </TouchableOpacity>
            </Box>
        </Box>
    );
};

const styles = StyleSheet.create({
    keywordButton: {
        height:30,
        paddingHorizontal:10,
        backgroundColor:'#ddd',
        alignItems:'center',
        justifyContent:'center',
        borderRadius:35,
        marginRight:10,
        marginTop:10,
    },
    keywordButtonText: {
        fontSize: 14,
        color:'#333',
    },
    itemTitle: {
        fontSize:15,
        color:'#000',
        fontWeight:'bold'
    },
    itemContent: {
        fontSize:14,
        color:'#333',
        marginTop:10,
    },
    itemPriceOr: {
        fontSize:13,
        color:'#666'
    },

    foodTitle : {
        fontSize:15,
        color:'#333',
        fontWeight:'bold'
    },
    foodComment : {
        fontSize:14,
        color:'#666'
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
    }
})

export default FoodDiaryList;