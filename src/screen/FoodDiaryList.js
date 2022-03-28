import React, {useState, useEffect} from 'react';
import { Box, VStack, HStack, Image, Input, Modal } from 'native-base';
import { TouchableOpacity, Dimensions, ScrollView, StyleSheet } from 'react-native';
import {AddButton, DefInput, DefText} from '../common/BOOTSTRAP';
import HeaderComponents from '../components/HeaderComponents';
import { foodCategory, foodLists } from '../Utils/DummyData';
import { connect } from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import Api from '../Api';
import ToastMessage from '../components/ToastMessage';
import Font from '../common/Font';

const {width} = Dimensions.get('window');

const FoodDiaryList = (props) => {

    const {navigation, userInfo} = props;


    //console.log('userInfo', userInfo);


    //let foodTags = userInfo.foodTag;

    const [foodTags, setFoodTags] = useState('');

    //console.log(userInfo);

   //console.log(foodTags);

   const [foodInput, setFoodInput] = useState('');

   const foodInputChange = (text) => {
       setFoodInput(text);
   }

   const [foodCategorys, setFoodCategorys] = useState('');

   const foodCategorySelect = async ( category ) => {
    if(foodCategorys == category) { await setFoodCategorys('');   }
    else                         { await setFoodCategorys(category); }
       //setFoodInput(category);
      
   }
   useEffect(()=>{
    FoodDiaryListChange();
   },[foodCategorys])


   const FoodDiaryCategoryListChange = () => {
        Api.send('food_tagList', {'id':userInfo.id, 'token':userInfo.appToken}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;

            if(resultItem.result === 'Y' && arrItems) {
                console.log('식단 카테고리 정보: ', resultItem);
                //setFoodListData(arrItems);
                setFoodTags(arrItems);
            }else{
                console.log('결과 출력 실패!', resultItem);
            
            }
        });
    }


   const [foodListData, setFoodListData] = useState('');

   const FoodDiaryListChange = () => {
        Api.send('food_schedule2', {'id':userInfo.id, 'token':userInfo.appToken, 'schText':foodInput, 'schTag':foodCategorys}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;

            if(resultItem.result === 'Y' && arrItems) {
                console.log('식단 정보: ', arrItems);
                setFoodListData(arrItems);
            }else{
                console.log('결과 출력 실패!', resultItem);
            
            }
        });
   }


   useEffect(()=>{
        FoodDiaryCategoryListChange();
        FoodDiaryListChange();
   },[])


    const FoodListReceive = () => {

        if(!foodInput){
            ToastMessage('검색어를 입력하세요.');
            return false;
        }

        Api.send('food_schedule2', {'id':userInfo.id, 'token':userInfo.appToken, 'schText':foodInput}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;

            if(resultItem.result === 'Y' && arrItems) {
                console.log('식단 정보: ', resultItem);
                setFoodListData(arrItems);
            }else{
                console.log('결과 출력 실패!', resultItem);
                ToastMessage(resultItem.message);
            }
        });
    }

    // const foodCategoryList = foodTags.map((item, index)=> {
    //     return(
    //         <TouchableOpacity key={index} style={[styles.keywordButton, foodCategorys == item && {backgroundColor:'#666'} ]} onPress={()=>{foodCategorySelect(item)}}>
    //             <DefText text={'#'+item} style={[styles.keywordButtonText, foodCategorys == item && {color:'#fff'}]} />
    //         </TouchableOpacity>
    //     )
    // });
    //메밀

    //foodLists.map

    //삭제모달
    const [deleteIdx, setDeleteIdx] = useState('');
    const [deleteModal, setDeleteModal] = useState(false);

    const DeleteIdx = (idx) => {
        setDeleteIdx(idx);
        setDeleteModal(true);
    }

    const DeleteSubmit = () => {
        //console.log('deleteIdx:::', deleteIdx);

        Api.send('food_delete', {'id':userInfo.id,  'token':userInfo.appToken, idx:deleteIdx}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               // console.log('결과 정보: ', arrItems);
                ToastMessage(resultItem.message);
                setDeleteModal(false);
                FoodDiaryListChange();
            }else{
                console.log('결과 출력 실패!', resultItem);
              // ToastMessage(resultItem.message);
            }
        });
    }


    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderComponents navigation={navigation} headerTitle='식단일기' />
            <ScrollView>
                <Box p={5} mb={'80px'}>
                    <Box>
                        <HStack alignItems='center' height='50px' backgroundColor='#F1F1F1' borderRadius={5}>
                            <Input
                                placeholder='검색하실 태그를 입력하세요.'
                                height='45px'
                                width={width-80}
                                backgroundColor='transparent'
                                borderWidth={0}
                                borderRadius={10}
                                //onSubmitEditing={schButtons}
                                value={foodInput}
                                onChangeText={foodInputChange}
                            />
                            <TouchableOpacity onPress={FoodListReceive}>
                                <Image source={require('../images/schIcons.png')} alt='검색' />
                            </TouchableOpacity>
                        </HStack>
                        {
                            foodTags != '' &&
                            <HStack flexWrap='wrap' mb={2.5}>
                                {
                                    foodTags.map((item, index)=> {
                                        return (
                                            <TouchableOpacity key={index} style={[styles.keywordButton, foodCategorys == item && {backgroundColor:'#696968'} ]}  onPress={()=>{foodCategorySelect(item)}}>
                                                <DefText text={'#'+item} style={[styles.keywordButtonText, foodCategorys == item && {color:'#fff'}]} />
                                            </TouchableOpacity>
                                        )
                                    })
                                }
                            </HStack>
                        }
                    </Box>
                    <VStack>
                        {
                            foodListData != '' ?
                            foodListData.map((item, index)=> {
                                
                                const itemCategorys = item.tag_list.map((category, idx)=>{
                                    if(category != ""){
                                    return(
                                        <Box key={idx} backgroundColor='#696968' py='4px' px='10px' borderRadius={10} ml={ idx != 0 ? '5px' : 0 } mt={'5px'} >
                                            <DefText text={category} style={{fontSize:14,color:'#fff'}} />
                                        </Box>
                                    )}
                                });
                        
                        
                                let starImg;
                        
                                if(item.score == 1){
                                    starImg = <Image source={require('../images/s_star1.png')} alt='별점 1' width={20} resizeMode='contain'/>;
                                }else if(item.score == 2){
                                    starImg = <Image source={require('../images/s_star2.png')} alt='별점 2' width={20} resizeMode='contain' />;
                                }else if(item.score == 3){
                                    starImg = <Image source={require('../images/s_star3.png')} alt='별점 3' width={20} resizeMode='contain' />;
                                }else if(item.score == 4){
                                    starImg = <Image source={require('../images/s_star4.png')} alt='별점 4' width={20} resizeMode='contain' />;
                                }else if(item.score == 5){
                                    starImg = <Image source={require('../images/s_star5.png')} alt='별점 5' width={20} resizeMode='contain' />;
                                }

                                return (
                                    <Box key={index} shadow={8} p={5} py={2.5} backgroundColor='#fff' borderRadius={15} mt={ index != 0 ? 5 : 2.5 }>
                                        <TouchableOpacity onLongPress={()=>DeleteIdx(item.idx)} onPress={()=>navigation.navigate('FoodDiaryView', item)}>
                                            <HStack justifyContent='space-between' alignItems='center'>
                                                <VStack width={(width-80)*0.6} >
                                                    <HStack mb={2}>
                                                        {itemCategorys}
                                                    </HStack>
                                                    <DefText text={item.fname} style={styles.foodTitle} />
                                                    <Box>
                                                        {starImg}
                                                    </Box>
                                                    <Box mt={2.5}>
                                                        <DefText text={item.meal} style={styles.foodComment} />
                                                        <DefText text={item.fdate + ' ' + item.ftime} style={[styles.foodComment, {marginTop:5}]} />
                                                    </Box>
                                                </VStack>
                                                <Box width={(width-80)*0.35} alignItems='flex-end'>
                                                    <Image source={{uri:item.upfile}} alt='이미지' width={(width-80)*0.25} height={(width-80)*0.25} resizeMode='stretch' />
                                                </Box>
                                            </HStack>
                                        </TouchableOpacity>
                                    </Box>
                                )
                            })
                            :
                            <Box mt={5} height='300px' alignItems='center' justifyContent='center'>
                                <DefText text='검색된 식단정보가 없습니다.' />
                            </Box>
                        }
                    </VStack>
                </Box>
            </ScrollView>
            {/* <Box p={2.5} px={5}>
                <TouchableOpacity onPress={()=>{navigation.navigate('FoodDiaryAdd')}} style={[styles.buttonDef]}>
                   <DefText text='식단정보 추가' style={styles.buttonDefText} />
                </TouchableOpacity>
            </Box> */}

            <Box position={'absolute'} right={'30px'} bottom={'30px'}>
                <AddButton onPress={()=>{navigation.navigate('FoodDiaryAdd', {'foods':'', 'foodName':'', 'tagList':''})}} />
            </Box>

            <Modal isOpen={deleteModal} onClose={() => setDeleteModal(false)}>
            
                <Modal.Content maxWidth={width-40}>
                    <Modal.Body>
                        <DefText text='식단기록을 삭제하시겠습니까?' style={{textAlign:'center'}}/>
                        <HStack justifyContent='space-between' mt={5}>
                            <TouchableOpacity style={styles.logoutButton} onPress={DeleteSubmit}>
                                <DefText text='확인' style={styles.logoutButtonText} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.logoutButton} onPress={()=>setDeleteModal(false)}>
                                <DefText text='취소' style={styles.logoutButtonText} />
                            </TouchableOpacity>
                        </HStack>
                    </Modal.Body>
                </Modal.Content>
            </Modal>
        </Box>
    );
};

const styles = StyleSheet.create({
    keywordButton: {
        height:30,
        paddingHorizontal:10,
        backgroundColor:'#f1f1f1',
        alignItems:'center',
        justifyContent:'center',
        borderRadius:10,
        marginRight:10,
        marginTop:10,
    },
    keywordButtonText: {
        lineHeight:30,
        fontFamily:Font.NotoSansMedium,
        color:'#000',
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
    },
    logoutButton : {
        height:40,
        width:(width-80) *0.47,
        borderRadius:10,
        backgroundColor:'#696968',
        alignItems:'center',
        justifyContent:'center'
    },
    logoutButtonText: {
        fontSize:15,
        color:'#fff'
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
)(FoodDiaryList);