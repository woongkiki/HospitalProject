import React from 'react';
import { ScrollView, Dimensions, TouchableOpacity, Platform, FlatList, StyleSheet } from 'react-native';
import { Box, VStack, HStack, Image } from 'native-base';
import HeaderComponents from '../components/HeaderComponents';
import { DefText } from '../common/BOOTSTRAP';
import LinearGradient from 'react-native-linear-gradient';

const {width} = Dimensions.get('window');

const BloodPressure = (props) => {

    const {navigation} = props;

    //최고혈압
    const bloodNumber = 22;
    const totalNumber = 100;
    const bloodPercent = bloodNumber / totalNumber * 100; //퍼센트값 계산

    //최저혈압
    const bloodNumber2 = 0;
    const totalNumber2 = 100;
    const bloodPercent2 = bloodNumber2 / totalNumber2 * 100; //퍼센트값 계산


    const bloodNumberSelect1 = 122;
    const bloodNumberSelect2 = 82;

    const HeartLate = 77;

    const navigationMove = () => {
        navigation.navigate('Tab_Navigation', {
            screen: 'Community',
            
        });
    }

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderComponents headerTitle='혈압' navigation={navigation} />
            <ScrollView>
                <Box p={5}>
                    <HStack height='140px' justifyContent='space-between' px={4} backgroundColor='#F1F1F1' borderRadius='30px' alignItems='center'>
                        <Box width={(width * 0.60) + 'px'}>
                            <DefText text='혈압이야기' style={{fontSize:16, fontWeight:'bold'}} />
                            <DefText text='중요한 건강지표 "혈압"에 관해 알아보세요.' style={{fontSize:14, }} />
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
                        <Image source={require('../images/heartRateIcon.png')} alt='체크이미지' />
                    </HStack>
                    <Box py={2.5} px={5} backgroundColor='#f1f1f1' borderRadius={10} mt={3}>
                        <HStack alignItems='center'>
                            <DefText text='! 고혈압 전 단계로 건강관리가 필요합니다.' style={{fontSize:14,color:'#999'}} />
                            <TouchableOpacity >
                
                                <Box borderBottomWidth={1} borderBottomColor='#999' ml={1}>
                                    <DefText text='더보기' style={{fontSize:14,color:'#999'}} />
                                </Box>
        
                            </TouchableOpacity>
                        </HStack>
                    </Box>
                    <Box py={2.5} px={5} backgroundColor='#f1f1f1' borderRadius={10} mt={3}>
                        <HStack alignItems='center'>
                            <DefText text='! 전문의료진께 한번 상담받기를 권해드립니다.' style={{fontSize:14,color:'#999'}} />
                        </HStack>
                    </Box>
                    <VStack mt={2.5}>
                        <DefText text='최고혈압' style={styles.BloodPreSmallText} />
                        
                        <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#FFCACA', '#FF9696', '#FF6262']} style={[{borderRadius:5, marginTop:10}]}>
                            <Box style={[{position:'absolute', bottom:1, left:bloodPercent+'%'}]}>
                                <Image source={require('../images/smileIcons.png')} alt='수치' />
                            </Box> 
                            <HStack justifyContent='space-around' height='35px' alignItems='flex-end' pb='5px'>
                                <DefText text='정상' style={[styles.BloodPreText, {color:'#333', fontWeight:'bold'}]} />
                                <DefText text='주의' style={[styles.BloodPreText, {color:'#333', fontWeight:'bold'}]} />
                                <DefText text='고혈압전단계' style={[styles.BloodPreText, {color:'#333', fontWeight:'bold'}]} />
                                <DefText text='고혈압1기' style={[styles.BloodPreText, {color:'#333', fontWeight:'bold'}]} />
                                <DefText text='고혈압2기' style={[styles.BloodPreText, {color:'#333', fontWeight:'bold'}]} />
                            </HStack>
                        </LinearGradient>
                        <HStack justifyContent='space-around' height='35px' mt={1}>
                            <DefText text='80' style={[styles.BloodPreText, {color:'#333'}]} />
                            <DefText text='90' style={[styles.BloodPreText, {color:'#333'}]} />
                            <DefText text='100' style={[styles.BloodPreText, {color:'#333'}]} />
                            <DefText text='120' style={[styles.BloodPreText, {color:'#333'}]} />
                        </HStack>
                    </VStack>
                    <VStack>
                        <DefText text='최저혈압' style={styles.BloodPreSmallText} />
                        
                        <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#FFCACA', '#FF9696', '#FF6262']} style={[{borderRadius:5, marginTop:10}]}>
                            <Box style={[{position:'absolute', bottom:1, left:bloodPercent2+'%'}]}>
                                <Image source={require('../images/smileIcons.png')} alt='수치' />
                            </Box> 
                            <HStack justifyContent='space-around' height='35px' alignItems='flex-end' pb='5px'>
                                <DefText text='정상' style={[styles.BloodPreText, {color:'#333', fontWeight:'bold'}]} />
                                <DefText text='주의' style={[styles.BloodPreText, {color:'#333', fontWeight:'bold'}]} />
                                <DefText text='저혈압전단계' style={[styles.BloodPreText, {color:'#333', fontWeight:'bold'}]} />
                                <DefText text='저혈압1기' style={[styles.BloodPreText, {color:'#333', fontWeight:'bold'}]} />
                                <DefText text='저혈압2기' style={[styles.BloodPreText, {color:'#333', fontWeight:'bold'}]} />
                            </HStack>
                        </LinearGradient>
                        <HStack justifyContent='space-around' height='35px' mt={1}>
                            <DefText text='80' style={[styles.BloodPreText, {color:'#333'}]} />
                            <DefText text='90' style={[styles.BloodPreText, {color:'#333'}]} />
                            <DefText text='100' style={[styles.BloodPreText, {color:'#333'}]} />
                            <DefText text='120' style={[styles.BloodPreText, {color:'#333'}]} />
                        </HStack>
                    </VStack>
                    <HStack py={2.5} px={5} backgroundColor='#f1f1f1' borderRadius={10} justifyContent='space-between'>
                        <DefText text='혈압(mmHg)' />
                        <HStack>
                            <DefText text={'수축기 : ' + bloodNumberSelect1} />
                            <DefText text={'이완기 : ' + bloodNumberSelect2} style={{marginLeft:10}} />
                        </HStack>
                    </HStack>
                    <HStack mt={2.5} py={2.5} px={5} backgroundColor='#f1f1f1' borderRadius={10} justifyContent='space-between'>
                        <DefText text='심박수(bpm)' />
                        <HStack>
                            <DefText text={HeartLate} />
                        </HStack>
                    </HStack>
                </Box>
            </ScrollView>

            <Box p={2.5} px={5}>
                <TouchableOpacity onPress={()=>{navigation.navigate('BloodPressureAdd')}} style={[styles.buttonDef]}>
                   <DefText text='혈당기록 추가' style={styles.buttonDefText} />
                </TouchableOpacity>
            </Box>
        </Box>
    );
};

const styles = StyleSheet.create({
    BloodPreSmallText : {
        fontSize:13,
        color:'#666'
    },
    BloodPreText: {
        fontSize:14,
        color:'#fff'
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

export default BloodPressure;