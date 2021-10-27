import React, {useState, useEffect} from 'react';
import { Box, VStack, HStack, Image } from 'native-base';
import { TouchableOpacity, Dimensions, ScrollView, StyleSheet } from 'react-native';
import {DefInput, DefText} from '../common/BOOTSTRAP';
import HeaderFood from '../components/HeaderFood';

const {width} = Dimensions.get('window');

const FoodDiary = (props) => {

    const {navigation} = props;

    const beforeWeekKcal = 1720;
      const nowWeekKcal = 2450;
      const recommendKcal = 1998;



    const FoodDiaryListBtn = () => {
        navigation.navigate('FoodDiaryList');
    }      

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderFood headerTitle='식단일기' navigation={navigation} diaryButton={FoodDiaryListBtn} />
            <ScrollView>
                <Box p={5}>
                    <HStack height='140px' justifyContent='space-between' px={4} backgroundColor='#F1F1F1' borderRadius='30px' alignItems='center'>
                        <Box>
                            <DefText text='비만이야기' style={{fontSize:16, fontWeight:'bold'}} />
                            <DefText text='약을 잘먹으면 큰병을 예방할 수 있습니다.' style={{fontSize:14, }} />
                            <TouchableOpacity
                                style={{
                                    width:100,
                                    height:30,
                                    backgroundColor:'#696968',
                                    borderRadius:10,
                                    alignItems:'center',
                                    justifyContent:'center',
                                    marginTop:10 
                                }}
                                onPress={()=>{navigation.navigate('Tab_Navigation', {'screenNumber':2})}}
                            >
                                <DefText text='알아보기' style={{color:'#fff', fontSize:15}} />
                            </TouchableOpacity>
                        </Box>
                        <Image source={require('../images/checkIcons.png')} alt='체크이미지' />
                    </HStack>
                   
                    <Box px={5} py={2.5} backgroundColor='#f1f1f1' borderRadius={10} mt={5}>
                        <HStack justifyContent='space-around'>
                            <VStack>
                                <DefText text='전주평균' style={[styles.kcalAvgText]} />
                                <DefText text={beforeWeekKcal + 'kcal'} style={[styles.kcalAvgNumber]} />
                            </VStack>
                            <VStack>
                                <DefText text='주간평균' style={[styles.kcalAvgText]}  />
                                <DefText text={nowWeekKcal + 'kcal'} style={[styles.kcalAvgNumber, {fontSize:18}]}  />
                            </VStack>
                            <VStack>
                                <DefText text='권장' style={[styles.kcalAvgText]}  />
                                <DefText text={recommendKcal + 'kcal'} style={[styles.kcalAvgNumber]} />
                            </VStack>
                        </HStack>
                    </Box>

                    <Box mt={5} backgroundColor='#F1F1F1' borderRadius={10} p={5}>
                        <DefText text='영양소 섭취가이드(일)' style={[styles.reportLabel], {marginBottom:10}} />
                        <Box>
                            <HStack justifyContent='space-between' borderBottomWidth={1} borderBottomColor='#999'>
                                <Box width={(width - 40) *0.2} />
                                <Box width={(width - 40 )*0.7} borderLeftWidth={1} borderLeftColor="#999">
                                    <HStack justifyContent='space-between' py={2.5}>
                                        <Box width='33.3%' >
                                            <DefText text='탄수화물(g)' style={[styles.tableText]} />
                                        </Box>
                                        <Box width='33.3%' >
                                            <DefText text='단백질(g)' style={[styles.tableText]} />
                                        </Box>
                                        <Box width='33.3%' >
                                            <DefText text='지방(g)' style={[styles.tableText]} />
                                        </Box>
                                    </HStack>
                                </Box>
                            </HStack>
                            
                            <HStack borderBottomWidth={1} borderBottomColor='#999' >
                                <Box width={(width - 40) *0.2} >
                                    <HStack alignItems='center'>
                                        <Box width='50%' height={60} justifyContent='center' py={1.5}>
                                            <DefText text='섭취량' style={[styles.tableText, {fontSize:13}]}  />
                                        </Box>
                                        <VStack width='50%' height={60} justifyContent='space-between' py={1.5}>
                                            <Box >
                                                <DefText text='현재' style={[styles.tableText]}  />
                                            </Box>
                                            <Box >
                                                <DefText text='추천' style={[styles.tableText]}  />
                                            </Box>
                                        </VStack>
                                    </HStack>
                                </Box>
                                <Box width={(width - 40 )*0.7} borderLeftWidth={1} borderLeftColor="#999">
                                    <HStack justifyContent='space-between' alignItems='center' >
                                        <VStack width='33.3%' height={60} justifyContent='space-between' py={1.5}>
                                            <Box >
                                                <DefText text={360} style={[styles.tableText]}  />
                                            </Box>
                                            <Box >
                                                <DefText text={360} style={[styles.tableText]}  />
                                            </Box>
                                        </VStack>
                                        <VStack width='33.3%' height={60} justifyContent='space-between' py={1.5}>
                                            <Box >
                                                <DefText text={90} style={[styles.tableText]}  />
                                            </Box>
                                            <Box >
                                                <DefText text={90} style={[styles.tableText]}  />
                                            </Box>
                                        </VStack>
                                        <VStack width='33.3%' height={60} justifyContent='space-between' alignItems='center' py={1.5}>
                                            <Box >
                                                <DefText text={67} style={[styles.tableText]}  />
                                            </Box>
                                            <Box >
                                                <DefText text={67} style={[styles.tableText]}  />
                                            </Box>
                                        </VStack>
                                    </HStack>
                                    
                                </Box>
                            </HStack>
   
                        </Box>
                        <Box mt={5}>
                            <HStack justifyContent='space-between' borderBottomWidth={1} borderBottomColor='#999'>
                                <Box width={(width - 40) *0.2} />
                                <Box width={(width - 40 )*0.7} borderLeftWidth={1} borderLeftColor="#999">
                                    <HStack justifyContent='space-between' py={2.5}>
                                        <Box width='20%' >
                                            
                                        </Box>
                                        <Box width='40%' >
                                            <DefText text='포화지방산(g)' style={[styles.tableText]} />
                                        </Box>
                                        <Box width='40%' >
                                            <DefText text='트랜스지방산(g)' style={[styles.tableText]} />
                                        </Box>
                                    </HStack>
                                </Box>
                            </HStack>
                            
                            <HStack borderBottomWidth={1} borderBottomColor='#999' >
                                <Box width={(width - 40) *0.2} >
                                    <HStack alignItems='center'>
                                        <Box width='50%' height={60} justifyContent='center' py={1.5}>
                                            <DefText text='섭취량' style={[styles.tableText, {fontSize:13}]}  />
                                        </Box>
                                        <VStack width='50%' height={60} justifyContent='space-between' py={1.5}>
                                            <Box >
                                                <DefText text='현재' style={[styles.tableText]}  />
                                            </Box>
                                            <Box >
                                                <DefText text='추천' style={[styles.tableText]}  />
                                            </Box>
                                        </VStack>
                                    </HStack>
                                </Box>
                                <Box width={(width - 40 )*0.7} borderLeftWidth={1} borderLeftColor="#999">
                                    <HStack justifyContent='space-between' alignItems='center' >
                                        <VStack width='20%' height={60} justifyContent='space-between' py={1.5}>
                                            <Box >
                                            </Box>
                                            <Box >
                                            </Box>
                                        </VStack>
                                        <VStack width='40%' height={60} justifyContent='space-between' py={1.5}>
                                            <Box >
                                                <DefText text={90} style={[styles.tableText]}  />
                                            </Box>
                                            <Box >
                                                <DefText text={90} style={[styles.tableText]}  />
                                            </Box>
                                        </VStack>
                                        <VStack width='40%' height={60} justifyContent='space-between' alignItems='center' py={1.5}>
                                            <Box >
                                                <DefText text={67} style={[styles.tableText]}  />
                                            </Box>
                                            <Box >
                                                <DefText text={67} style={[styles.tableText]}  />
                                            </Box>
                                        </VStack>
                                    </HStack>
                                    
                                </Box>
                            </HStack>
   
                        </Box>
                    </Box>
                    
                    <Box mt={5} backgroundColor='#F1F1F1' borderRadius={10} p={5}>
                        <DefText text='만성질환 위험감소 섭취안내(일)' style={[styles.reportLabel], {marginBottom:10}} />
                        <Box>
                            <HStack justifyContent='space-between' borderBottomWidth={1} borderBottomColor='#999'>
                                <Box width={(width - 40) *0.2} />
                                <Box width={(width - 40 )*0.7} borderLeftWidth={1} borderLeftColor="#999">
                                    <HStack justifyContent='space-between' py={2.5}>
                                        <Box width='33.3%' >
                                            <DefText text='당류(g)' style={[styles.tableText]} />
                                        </Box>
                                        <Box width='33.3%' >
                                            <DefText text='콜레스테롤(g)' style={[styles.tableText]} />
                                        </Box>
                                        <Box width='33.3%' >
                                            <DefText text='나트륨(g)' style={[styles.tableText]} />
                                        </Box>
                                    </HStack>
                                </Box>
                            </HStack>
                            
                            <HStack borderBottomWidth={1} borderBottomColor='#999' >
                                <Box width={(width - 40) *0.2} >
                                    <HStack alignItems='center'>
                                        <Box width='50%' height={60} justifyContent='center' py={1.5}>
                                            <DefText text='비율' style={[styles.tableText, {fontSize:13}]}  />
                                        </Box>
                                        <VStack width='50%' height={60} justifyContent='space-between' py={1.5}>
                                            <Box >
                                                <DefText text='현재' style={[styles.tableText]}  />
                                            </Box>
                                            <Box >
                                                <DefText text='추천' style={[styles.tableText]}  />
                                            </Box>
                                        </VStack>
                                    </HStack>
                                </Box>
                                <Box width={(width - 40 )*0.7} borderLeftWidth={1} borderLeftColor="#999">
                                    <HStack justifyContent='space-between' alignItems='center' >
                                        <VStack width='33.3%' height={60} justifyContent='space-between' py={1.5}>
                                            <Box >
                                                <DefText text={72} style={[styles.tableText]}  />
                                            </Box>
                                            <Box >
                                                <DefText text={100} style={[styles.tableText]}  />
                                            </Box>
                                        </VStack>
                                        <VStack width='33.3%' height={60} justifyContent='space-between' py={1.5}>
                                            <Box >
                                                <DefText text={312} style={[styles.tableText]}  />
                                            </Box>
                                            <Box >
                                                <DefText text={300} style={[styles.tableText]}  />
                                            </Box>
                                        </VStack>
                                        <VStack width='33.3%' height={60} justifyContent='space-between' alignItems='center' py={1.5}>
                                            <Box >
                                                <DefText text={1900} style={[styles.tableText]}  />
                                            </Box>
                                            <Box >
                                                <DefText text={2300} style={[styles.tableText]}  />
                                            </Box>
                                        </VStack>
                                    </HStack>
                                    
                                </Box>
                            </HStack>
   
                        </Box>
                        
                    </Box>
                    <Box py={2.5} px={5} backgroundColor='#f1f1f1' borderRadius={10} mt={3}>
                        <HStack alignItems='center'>
                            <DefText text='식사일기 작성이 주는 가치 알아보세요.' style={{fontSize:14,color:'#999'}} />
                            <TouchableOpacity >
                
                                <Box borderBottomWidth={1} borderBottomColor='#999' ml={1}>
                                    <DefText text='더보기' style={{fontSize:14,color:'#999'}} />
                                </Box>
        
                            </TouchableOpacity>
                        </HStack>
                    </Box>
                    <Box py={2.5} px={5} backgroundColor='#f1f1f1' borderRadius={10} mt={3}>
                        <HStack alignItems='center'>
                            <DefText text='! 식사를 거를 경우 당뇨발생 위험률이 높아집니다.' style={{fontSize:14,color:'#999'}} />
                            <TouchableOpacity >
                
                                <Box borderBottomWidth={1} borderBottomColor='#999' ml={1}>
                                    <DefText text='더보기' style={{fontSize:14,color:'#999'}} />
                                </Box>
        
                            </TouchableOpacity>
                        </HStack>
                    </Box>
                    <Box py={2.5} px={5} backgroundColor='#f1f1f1' borderRadius={10} mt={3}>
                        <HStack alignItems='center'>
                            <DefText text='! 식사시간은 4~5시간 간격을 지키면 건강에 ...' style={{fontSize:14,color:'#999'}} />
                            <TouchableOpacity >
                
                                <Box borderBottomWidth={1} borderBottomColor='#999' ml={1}>
                                    <DefText text='더보기' style={{fontSize:14,color:'#999'}} />
                                </Box>
        
                            </TouchableOpacity>
                        </HStack>
                    </Box>
                    <VStack mt={8}>
                        <Box> 
                            <HStack>
                                <Box width='20%' p={2.5} marginRight='15px' alignItems='center'>
                                    <DefText text='8:00 AM' style={{fontSize:12, color:'#77838F'}} />
                                </Box>
                                <Box width='75%'>
                                    <Box p={2.5} backgroundColor='#fff' borderRadius={20} shadow={8} >
                                        <HStack alignItems='center'>
                                            <Image source={require('../images/foodThumb01.png')} alt='약 복용' />
                                            <Box style={{marginLeft:15}}>
                                                <DefText text='아침식사' style={{fontSize:14}} />
                                                <DefText text='콘푸라이트 (포스트), 우유' style={{fontSize:14, color:'#77838F'}} />
                                            </Box>
                                        </HStack>
                                        
                                    </Box>
                                    
                                </Box>
                            </HStack>
                            <HStack>
                                <Box width='20%' p={2.5} marginRight='15px' alignItems='center'>
                                    <DefText text='11:20 AM' style={{fontSize:12, color:'#77838F'}} />
                                </Box>
                                <Box width='75%'>
                                     <Box p={2.5} backgroundColor='#fff' borderRadius={20} shadow={8} mt={4}>
                                        <HStack alignItems='center'>
                                            <Image source={require('../images/foodThumb02.png')} alt='약 복용' />
                                            <Box style={{marginLeft:15}}>
                                                <DefText text='점심식사' style={{fontSize:14}} />
                                                <DefText text='돈까스, 쌀밥, 깍두기' style={{fontSize:14, color:'#77838F'}} />
                                            </Box>
                                        </HStack>
                                        
                                    </Box>
                                </Box>
                            </HStack>

                            <HStack mt={5} paddingBottom={5}>
                                <Box width='20%' p={2.5} marginRight='15px' alignItems='center'>
                                    <DefText text='12:30 PM' style={{fontSize:12, color:'#77838F'}} />
                                </Box>
                                <Box width='75%'>
                                    <Box p={2.5} backgroundColor='#fff' borderRadius={20} shadow={8} >
                                        <HStack alignItems='center'>
                                            <Image source={require('../images/foodThumb03.png')} alt='약 복용' />
                                            <Box style={{marginLeft:15}}>
                                                <DefText text='저녁식사' style={{fontSize:14}} />
                                                <DefText text='가정식 일반' style={{fontSize:14, color:'#77838F'}} />
                                            </Box>
                                        </HStack>
                                        
                                    </Box>
                                    <Box p={2.5} backgroundColor='#fff' borderRadius={20} shadow={8} mt={4}>
                                        <HStack alignItems='center'>
                                            <Image source={require('../images/foodThumb04.png')} alt='약 복용' />
                                            <Box style={{marginLeft:15}}>
                                                <DefText text='샐러드' style={{fontSize:14}} />
                                                <DefText text='인싸라따' style={{fontSize:14, color:'#77838F'}} />
                                            </Box>
                                        </HStack>
                                        
                                    </Box>
                                </Box>
                            </HStack>
                        </Box>
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
    kcalAvgText: {
        fontSize:15,
        color:'#666',
        marginBottom:10,
        fontWeight:'bold',
        textAlign:'center'
    },
    kcalAvgNumber : {
        fontSize:15,
        color:'#666',
        textAlign:'center'

    },
    tableText: {
        fontSize:14,
        color:'#333',
        textAlign:'center'
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

export default FoodDiary;