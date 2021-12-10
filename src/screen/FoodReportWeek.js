import React, {useState, useEffect} from 'react';
import { Box, VStack, HStack, Image } from 'native-base';
import { TouchableOpacity, Dimensions, ScrollView, StyleSheet } from 'react-native';
import {DefInput, DefText} from '../common/BOOTSTRAP';
import HeaderComponents from '../components/HeaderComponents';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { connect } from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import Api from '../Api';
import {LineChart, ProgressChart} from 'react-native-chart-kit';

const {width} = Dimensions.get('window');

const FoodReportWeek = (props) => {

    const {navigation, userInfo} = props;

    const [sugarGraphKey, setSugarGraphKey] = useState([]);
    const [sugarGraph, setSugarGraph] = useState([]);

    const [foodDiary, setFoodDiary] = useState('');

    const reportWeek = () => {
        Api.send('report_weekFood', {'id':userInfo.id, 'token':userInfo.appToken}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {

               //console.log('음식 리포트 내역...',arrItems);

               let graph_keys = Object.keys(arrItems.sugar_graph);
               let graphKeysDatas = [];
               graph_keys.map((e, i)=> {
                   graphKeysDatas[i] = graph_keys[i].split('_')[0].substring(5,10) + ' ' + graph_keys[i].split('_')[1]+'시';
               })
               setSugarGraphKey(graphKeysDatas);

               let graph_values = Object.values(arrItems.sugar_graph);
               setSugarGraph(graph_values);

               
               //식단일기
               setFoodDiary(arrItems.food_diary)
               
            }
        });
    }

    useEffect(()=>{
        reportWeek();
    },[]);


    useEffect(()=>{
        console.log('음식일기',foodDiary);
    },[foodDiary])


    const data = {
        labels: sugarGraphKey,
        datasets: [
        
        {
            data: sugarGraph,
            color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`, // optional
            strokeWidth: 2 // optional
        }
        ],
        //legend: ["당뇨인"], // optional
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
    

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderComponents headerTitle='음식과 혈당' navigation={navigation} />
            <ScrollView>
                <Box p={5}>
                    <Box>
                        <DefText text='일주일간 혈당 수치 변화' style={[styles.reportLabel, {marginBottom:10}]} />
                        <Box mt={2.5}>
                            <ScrollView
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                            >
                                <LineChart
                                    data={data}
                                    width={width + 3000}
                                    height={235}
                                    chartConfig={chartConfig}
                                    bezier
                                    fromZero={true} //0 부터시작 기본 false
                                    withShadow={false} // 선그림자 여부 기본 true
                                    yLabelsOffset={20} //y축 그래프 사이 여백
                                    segments={5} //y축 수치 세그먼트 기본 4
                                    style={{marginLeft:-20}}
                                />
                            </ScrollView>
                        </Box>
                    </Box>
                    <Box mt={5}>
                        <DefText text='식단목록' style={[styles.reportLabel, {marginBottom:10}]} />
                        {
                            foodDiary != '' ?
                            foodDiary.map((item, index)=> {
                                const itemCategorys = item.tag_list.map((category, idx)=>{
                                    return(
                                        <Box key={idx} backgroundColor='#666' py='4px' px='10px' borderRadius={15} ml={ idx != 0 ? 2.5 : 0 } >
                                            <DefText text={category} style={{fontSize:13,color:'#fff'}} />
                                        </Box>
                                    )
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
                                        <TouchableOpacity onPress={()=>navigation.navigate('FoodDiaryView', item)}>
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
                            <Box justifyContent='center' alignItems='center'>
                                <DefText text='작성된 식단일기가 없습니다.' />
                            </Box>
                        }
                    </Box>
                </Box>
            </ScrollView>
        </Box>
    );
};


const styles = StyleSheet.create({
    tabButton:{
        
        width:width*0.43,
        height: 30,
        borderWidth:1,
        borderColor:'#f2f2f2',
        backgroundColor:'#dfdfdf',
        //alignItems:'center',
        alignItems:'center',
        justifyContent:'center',
        borderRadius:5
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
    tableText: {
        fontSize:14,
        color:'#333',
        textAlign:'center'
    },
    progerssChartText: {
        fontSize:14,
        color:'#333'
    },
    progerssChartNumber : {
        fontSize:18,
        color:'#333',
        fontWeight:'bold',
        marginVertical:2.5
    },
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
)(FoodReportWeek);