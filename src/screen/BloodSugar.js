import React from 'react';
import { ScrollView, Dimensions, TouchableOpacity, Platform, FlatList, StyleSheet } from 'react-native';
import { Box, VStack, HStack, Image } from 'native-base';
import HeaderComponents from '../components/HeaderComponents';
import { DefText } from '../common/BOOTSTRAP';
import LinearGradient from 'react-native-linear-gradient';
import {LineChart, ProgressChart} from 'react-native-chart-kit';

const {width} = Dimensions.get('window');

const BloodSugar = (props) => {

    const {navigation} = props;

    //공복혈당
    const bloodNumber = 45;
    const totalNumber = 200;
    const bloodPercent = bloodNumber / totalNumber * 100; //퍼센트값 계산

    //식후혈당
    const foodBloodNumber = 70;
    const foodBloodPer = foodBloodNumber / totalNumber * 100;

    const data = {
        labels: ["10시", "11시", "12시", "13시", "14시", "15시", "16시", "17시", "18시", "19시"],
        datasets: [
          {
            data: [100, 80,90, 80, 90, 80, 90, 80, 70, 120],
            color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`, // optional
            strokeWidth: 2, // optional
           
          },
          {
            data: [60, 50, 60, 70, 60, 70, 60, 70, 50, 55],
            color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`, // optional
            strokeWidth: 2 // optional
          }
        ],
        legend: ["당뇨인","정상인"], // optional
        fromZero : false
    };

    const chartConfig = {
        backgroundGradientFrom: "#fff",
        backgroundGradientFromOpacity: 0,
        backgroundGradientTo: "#fff",
        backgroundGradientToOpacity: 0,
        color: (opacity = 1) => `rgba(51, 51, 51, ${opacity})`,
        strokeWidth: 2, // optional, default 3
        barPercentage: 0.5,
        useShadowColorFromDataset: false, // optional
        decimalPlaces: 0 
    };


    const bloodNumberSelect1 = 120;
    const bloodNumberSelect2 = 55;

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderComponents headerTitle='혈당' navigation={navigation} />
            <ScrollView>
                <Box p={5}>
                    <HStack height='140px' justifyContent='space-between' px={4} backgroundColor='#F1F1F1' borderRadius='30px' alignItems='center'>
                        <Box>
                            <DefText text='혈당이야기' style={{fontSize:16, fontWeight:'bold'}} />
                            <DefText text='중요한 건강지표 "혈당"에 관해 알아보세요.' style={{fontSize:14}} />
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
                        <Image source={require('../images/BloodSugarIcon.png')} alt='체크이미지' style={{resizeMode:'contain'}} />
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
                    <Box mt={2.5}>
                        <LineChart
                            data={data}
                            width={width - 60}
                            height={235}
                            chartConfig={chartConfig}
                            bezier
                            fromZero={true} //0 부터시작 기본 false
                            withShadow={false} // 선그림자 여부 기본 true
                            yLabelsOffset={20} //y축 그래프 사이 여백
                            segments={5} //y축 수치 세그먼트 기본 4
                        />
                    </Box>
                    <VStack mt={2.5}>
                        <DefText text='공복혈당' style={styles.reportLabelSmall} />
                        
                        <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#FFCACA', '#FF9696', '#FF6262']} style={[{borderRadius:5, marginTop:10}]}>
                            <Box style={[{position:'absolute', bottom:1, left:bloodPercent+'%'}]}>
                                <Image source={require('../images/smileIcons.png')} alt='수치' />
                            </Box> 
                            <HStack justifyContent='space-around' height='35px' alignItems='flex-end' pb='5px'>
                                <DefText text='정상' style={[styles.reportChartText]} />
                                <DefText text='당뇨전단계' style={[styles.reportChartText]} />
                                <DefText text='당뇨' style={[styles.reportChartText]} />
                            </HStack>
                        </LinearGradient>
                        <HStack justifyContent='space-around' height='35px' mt={1}>
                            <DefText text='120' style={[styles.reportChartText, {color:'#333'}]} />
                            <DefText text='130' style={[styles.reportChartText, {color:'#333'}]} />
                            <DefText text='140' style={[styles.reportChartText, {color:'#333'}]} />
                            <DefText text='160' style={[styles.reportChartText, {color:'#333'}]} />
                        </HStack>
                    </VStack>
                    <VStack>
                        <DefText text='식후혈당' style={styles.reportLabelSmall} />
                        
                        <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#FFCACA', '#FF9696', '#FF6262']} style={[{borderRadius:5, marginTop:10}]}>
                            <Box style={[{position:'absolute', bottom:1, left:foodBloodPer+'%'}]}>
                                <Image source={require('../images/smileIcons.png')} alt='수치' />
                            </Box>
                            <HStack justifyContent='space-around' height='35px' alignItems='flex-end' pb='5px'>
                                <DefText text='정상' style={[styles.reportChartText]} />
                                <DefText text='당뇨전단계' style={[styles.reportChartText]} />
                                <DefText text='당뇨' style={[styles.reportChartText]} />
                            </HStack>
                        </LinearGradient>
                        <HStack justifyContent='space-around' height='35px' mt={1}>
                            <DefText text='120' style={[styles.reportChartText, {color:'#333'}]} />
                            <DefText text='130' style={[styles.reportChartText, {color:'#333'}]} />
                            <DefText text='140' style={[styles.reportChartText, {color:'#333'}]} />
                            <DefText text='160' style={[styles.reportChartText, {color:'#333'}]} />
                        </HStack>
                    </VStack>
                    <VStack >
                        <HStack py={2.5} px={5} backgroundColor='#f1f1f1' borderRadius={10} justifyContent='space-between'>
                            <DefText text='점심식전 혈당(mg/dL)' />
                            <HStack>
                                <DefText text={bloodNumberSelect1} />
                            
                            </HStack>
                        </HStack>
                        <HStack mt={2.5} py={2.5} px={5} backgroundColor='#f1f1f1' borderRadius={10} justifyContent='space-between'>
                            <DefText text='점심식후 혈당(mg/dL)' />
                            <HStack>
                                <DefText text={bloodNumberSelect2}/>
                            </HStack>
                        </HStack>
                    </VStack>
                </Box>
            </ScrollView>
            <Box p={2.5} px={5}>
                <TouchableOpacity onPress={()=>{navigation.navigate('BloodSugarAdd')}} style={[styles.buttonDef]}>
                   <DefText text='혈당기록 추가' style={styles.buttonDefText} />
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
    reportLabelSmall : {
        fontSize:13,
        color:'#666'
    },
    reportChartText: {
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

export default BloodSugar;