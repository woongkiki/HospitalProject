import React, {useState, useEffect} from 'react';
import { Box, VStack, HStack, Image } from 'native-base';
import { TouchableOpacity, Dimensions, ScrollView, StyleSheet } from 'react-native';
import {DefInput, DefText} from '../common/BOOTSTRAP';
import HeaderComponents from '../components/HeaderComponents';
import LinearGradient from 'react-native-linear-gradient';

const {width} = Dimensions.get('window');

const Inbody = (props) => {

    const {navigation} = props;

    const fatDis = 25.5;
    const fatpercent = 18;
    const fatSto = 0.7;

    const fatStoSum = fatSto * 10;

    const navigationMove = () => {
        navigation.navigate('Tab_Navigation', {
            screen: 'Community',
            
        });
    }

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderComponents headerTitle='체성분' navigation={navigation} />
            <ScrollView>
                <Box p={5}>
                    <HStack height='140px' justifyContent='space-between' px={4} backgroundColor='#F1F1F1' borderRadius='30px' alignItems='center'>
                        <Box width={(width * 0.65) + 'px'}>
                            <DefText text='체성분 이야기' style={{fontSize:16, fontWeight:'bold'}} />
                            <DefText text='중요한 건강지표 "체성분"에 관해 알아보세요.' style={{fontSize:14, }} />
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
                                onPress={navigationMove}
                            >
                                <DefText text='알아보기' style={{color:'#fff', fontSize:15}} />
                            </TouchableOpacity>
                        </Box>
                        <Image source={require('../images/checkIcons.png')} alt='체크이미지' />
                    </HStack>
                    <Box mt={5}>
                        <DefText text='식습관 통계' style={[styles.reportLabel, {marginBottom:10}]} />
                        <Box p={5}  backgroundColor='#f1f1f1' borderRadius={10}>
                            <HStack justifyContent='space-between' mb={5}>
                                <DefText text='비만 동반질환 위험도' style={[styles.graphText]} />
                                <DefText text='약간 높음' style={[styles.graphText]} />
                            </HStack>
                            <LinearGradient height={30} start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#34EB00', '#967A00', '#FF0000']} style={[{borderRadius:5, marginTop:10}]}>
                                <Box style={[{position:'absolute', bottom:20, left:fatDis+'%'}]}>
                                    <Image source={require('../images/fatPosition.png')} alt='수치' />
                                </Box> 
                            </LinearGradient>
                        </Box>
                    </Box>
                    <Box mt={5} p={5} backgroundColor='#f1f1f1' borderRadius={10}>
                        <HStack justifyContent='space-between'>
                            <DefText text='유형분석' style={[styles.graphText]}  />
                            <DefText text='표준체중 강인형' style={[styles.graphText]}  />
                        </HStack>
                        <DefText text='근육이 발달한 단단한 건강체질입니다.' style={{fontSize:14, marginTop:10 }} />
                        <VStack mt={2.5}>
                            <HStack py={2.5} borderBottomWidth={1} borderBottomColor='#999'>
                                <Box width={(width-80)*0.25}></Box>
                                <Box width={(width-80)*0.25}>
                                    <DefText text='표준이하' style={[styles.tableThText]} />
                                </Box>
                                <Box width={(width-80)*0.25}>
                                    <DefText text='표준' style={[styles.tableThText]} />
                                </Box>
                                <Box width={(width-80)*0.25}>
                                    <DefText text='표준이상' style={[styles.tableThText]} />
                                </Box>
                            </HStack>
                            <HStack alignItems='center' py={2.5} borderBottomWidth={1} borderBottomColor='#999' >
                                <Box width={(width-80)*0.25}>
                                    <DefText text='체중' style={[styles.tableTdText]} />
                                </Box>
                                <Box width={(width-80)*0.7}  px={2.5}>
                                    <Box width={ ((width-80)*0.75) * 0.6 } height='20px' backgroundColor='#696968' /> 
                                </Box>
                            </HStack>
                            <HStack alignItems='center' py={2.5} borderBottomWidth={1} borderBottomColor='#999'>
                                <Box width={(width-80)*0.25}>
                                    <DefText text='골격근량' style={[styles.tableTdText]} />
                                </Box>
                                <Box width={(width-80)*0.75} px={2.5} >
                                    <Box width={ ((width-80)*0.75) * 0.7 } height='20px' backgroundColor='#696968' /> 
                                </Box>
                            </HStack>
                            <HStack alignItems='center' py={2.5} borderBottomWidth={1} borderBottomColor='#999'>
                                <Box width={(width-80)*0.25}>
                                    <DefText text='체지방량' style={[styles.tableTdText]} />
                                </Box>
                                <Box width={(width-80)*0.75} px={2.5}  >
                                    <Box width={ ((width-80)*0.75) * 0.35 } height='20px' backgroundColor='#696968' /> 
                                </Box>
                            </HStack>
                        </VStack>
                    </Box>
                    <Box  mt={5} p={5} backgroundColor='#f1f1f1' borderRadius={10}>
                        <HStack justifyContent='space-between' alignItems='center'>
                            <DefText text='체중' style={[styles.graphText]}  />
                            <DefText text='76.0kg' style={[styles.graphText, {fontSize:18}]}  />
                        </HStack>
                        <HStack justifyContent='space-between' alignItems='center' mt={2.5}>
                            <DefText text='골격근량' style={[styles.graphText]}  />
                            <DefText text='37.4kg' style={[styles.graphText, {fontSize:18}]}  />
                        </HStack>
                        <HStack justifyContent='space-between' alignItems='center' mt={2.5}>
                            <DefText text='체지방량' style={[styles.graphText]}  />
                            <DefText text='9.3kg' style={[styles.graphText, {fontSize:18}]}  />
                        </HStack>
                    </Box>
                    <Box  mt={5} p={5} backgroundColor='#f1f1f1' borderRadius={10}>
                        <Box>
                            <HStack justifyContent='space-between' alignItems='center'>
                                <DefText text='BMI' style={[styles.graphText]}  />
                                <DefText text={fatDis} style={[styles.graphText, {fontSize:18}]}  />
                            </HStack>
                            <HStack justifyContent='space-between' mt={'20px'}>
                                <Box style={[styles.graphBox, {backgroundColor:'#E5E587'}]}>
                                    <DefText text='저체중' style={styles.graphBoxText} />
                                </Box>
                                <Box style={[styles.graphBox, {backgroundColor:'#11FF00'}]}>
                                    <DefText text='정상' style={styles.graphBoxText} />
                                </Box>
                                <Box style={[styles.graphBox, {backgroundColor:'#FFA7A7'}]}>
                                    <DefText text='비만전' style={styles.graphBoxText} />
                                </Box>
                                <Box style={[styles.graphBox, {backgroundColor:'#FF8686'}]}>
                                    <DefText text='1단계' style={styles.graphBoxText} />
                                </Box>
                                <Box style={[styles.graphBox, {backgroundColor:'#FF5656'}]}>
                                    <DefText text='2단계' style={styles.graphBoxText} />
                                </Box>
                                <Box style={[styles.graphBox, {backgroundColor:'#FF0000'}]}>
                                    <DefText text='3단계' style={styles.graphBoxText} />
                                </Box>
                                <Box style={[{position:'absolute', bottom:20, left:fatDis+'%'}]}>
                                    <Image source={require('../images/fatPosition.png')} alt='수치' />
                                </Box> 
                            </HStack>
                        </Box>   
                        <Box mt={5}>
                            <HStack justifyContent='space-between' alignItems='center'>
                                <DefText text='체지방률' style={[styles.graphText]}  />
                                <DefText text={fatpercent + '%'} style={[styles.graphText, {fontSize:18}]}  />
                                
                            </HStack>
                            <HStack justifyContent='space-between' mt={'20px'}>
                                <Box style={[styles.graphBox, styles.graphBoxFive, {backgroundColor:'#E5E587'}]}>
                                    <DefText text='저체중' style={styles.graphBoxText} />
                                </Box>
                                <Box style={[styles.graphBox, styles.graphBoxFive, {backgroundColor:'#11FF00'}]}>
                                    <DefText text='정상' style={styles.graphBoxText} />
                                </Box>
                                <Box style={[styles.graphBox, styles.graphBoxFive, {backgroundColor:'#FFA7A7'}]}>
                                    <DefText text='경비만' style={styles.graphBoxText} />
                                </Box>
                                <Box style={[styles.graphBox, styles.graphBoxFive, {backgroundColor:'#FF8686'}]}>
                                    <DefText text='중비만' style={styles.graphBoxText} />
                                </Box>
                                <Box style={[styles.graphBox, styles.graphBoxFive, {backgroundColor:'#FF5656'}]}>
                                    <DefText text='과비만' style={styles.graphBoxText} />
                                </Box>
                                <Box style={[{position:'absolute', bottom:20, left:fatpercent+'%'}]}>
                                    <Image source={require('../images/fatPosition.png')} alt='수치' />
                                </Box> 
                            </HStack>
                        </Box>    
                        <Box mt={5}>
                            <HStack justifyContent='space-between' alignItems='center'>
                                <DefText text='복부지방수치' style={[styles.graphText]}  />
                                <DefText text={fatSto} style={[styles.graphText, {fontSize:18}]}  />
                            </HStack>
                            <HStack justifyContent='space-between' mt={'20px'}>
                                <Box style={[styles.graphBox, styles.graphBoxFive, {backgroundColor:'#E5E587'}]}>
                                    <DefText text='저체중' style={styles.graphBoxText} />
                                </Box>
                                <Box style={[styles.graphBox, styles.graphBoxFive, {backgroundColor:'#11FF00'}]}>
                                    <DefText text='정상' style={styles.graphBoxText} />
                                </Box>
                                <Box style={[styles.graphBox, styles.graphBoxFive, {backgroundColor:'#FFA7A7'}]}>
                                    <DefText text='경비만' style={styles.graphBoxText} />
                                </Box>
                                <Box style={[styles.graphBox, styles.graphBoxFive, {backgroundColor:'#FF8686'}]}>
                                    <DefText text='중도비만' style={styles.graphBoxText} />
                                </Box>
                                <Box style={[styles.graphBox, styles.graphBoxFive, {backgroundColor:'#FF5656'}]}>
                                    <DefText text='고도비만' style={styles.graphBoxText} />
                                </Box>
                                <Box style={[{position:'absolute', bottom:20, left:fatStoSum+'%'}]}>
                                    <Image source={require('../images/fatPosition.png')} alt='수치' />
                                </Box> 
                            </HStack>
                        </Box>
                    </Box>
                </Box>
            </ScrollView>
            <Box p={2.5} px={5}>
                <TouchableOpacity onPress={()=>{navigation.navigate('InbodyAdd')}} style={[styles.buttonDef]}>
                   <DefText text='체성분 정보 추가' style={styles.buttonDefText} />
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
    reportLabel : {
        fontSize:15,
        color:'#666',
        fontWeight:'bold'
    },
    reportLabelSmall : {
        fontSize:13,
        color:'#666'
    },
    reportChartText: {
        fontSize:14,
        color:'#fff'
    },
    graphText:{
        fontSize:15,
        color:'#333',
        fontWeight:'bold'
    },
    tableThText: {
        fontSize:14,
        color:'#333',
        fontWeight:'bold',
        textAlign:'center'
    },
    tableTdText: {
        fontSize:14,
        color:'#333',

        textAlign:'center'
    },
    graphBox:{
        width: (width - 80) * 0.15,
        height: 30,
        backgroundColor:'#333',
        justifyContent:'center',
        alignItems:'center'
    },
    graphBoxFive:{
        width: (width - 80) * 0.185,
    },
    graphBoxText: {
        fontSize:13,
        color:'#000',
        fontWeight:'bold'
    }
})

export default Inbody;