import React, {useState, useEffect} from 'react';
import { TouchableOpacity, Dimensions, View, Text, ScrollView, StyleSheet, FlatList, ImageBackground, Alert } from 'react-native';
import { Box, Image, HStack, Input, Modal, VStack } from 'native-base';
import { DefText } from '../common/BOOTSTRAP';
import HeaderComponents from '../components/HeaderComponents';
import { pointData } from '../Utils/DummyData';
import { numberFormat } from '../common/dataFunction';

const {width} = Dimensions.get('window');
const CateWidh = (width - 40) * 0.31;

const Point = (props) => {

    const {navigation} = props;

    const [pointCategory, setPointCategory] = useState('전체');

    const pointDataR = pointData.map((item, index)=>{
        return(
            <Box key={index} py={2.5} borderBottomWidth={1} borderBottomColor='#999'>
                <DefText text={item.pointData} style={styles.pointDataTitle} />
                <HStack justifyContent='space-between' alignItems='center'>
                    <DefText text={item.pointDate} style={{fontSize:14,color:'#a2a2a2'}} />
                    <HStack alignItems='center' justifyContent='space-between' width='23%' >
                        {
                            item.pointAdd > 0 ?
                            <Image source={require('../images/pointPlus.png')} alt='+' style={{width:20, height:20}} />
                            :
                            <Image source={require('../images/pointMinus.png')} alt='-' style={{width:20, height:20}} />
                        }
                        <Box >
                            <DefText text={numberFormat(item.pointAdd) + ' P'} style={{fontSize:14, color:'#696968'}} />
                        </Box>
                    </HStack>
                </HStack>
            </Box>
        )
    })

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderComponents headerTitle='포인트내역' navigation={navigation} />
            <ScrollView>
                <Box p={5}>
                    <Box>
                        <HStack pb={2.5} mb={2.5} borderBottomWidth={1} borderBottomColor='#999' justifyContent='space-between'>
                            <DefText text='잔여포인트' style={styles.pointTitle} />
                            <DefText text={numberFormat(10000)+' P'} style={styles.pointTitle} />
                        </HStack>
                        <HStack justifyContent='space-between'>
                            <TouchableOpacity onPress={()=>{setPointCategory('전체')}} style={[{width:CateWidh}, styles.cateButton, pointCategory === '전체' && {backgroundColor:'#707070'} ]}>
                                <DefText text='전체' style={[styles.cateButtonText, pointCategory === '전체' && {color:'#fff'}]} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>{setPointCategory('1개월')}} style={[{width:CateWidh}, styles.cateButton, pointCategory === '1개월' && {backgroundColor:'#707070'}]}>
                                <DefText text='1개월' style={[styles.cateButtonText, pointCategory === '1개월' && {color:'#fff'}]} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>{setPointCategory('6개월')}} style={[{width:CateWidh}, styles.cateButton, pointCategory === '6개월' && {backgroundColor:'#707070'}]}>
                                <DefText text='6개월' style={[styles.cateButtonText, pointCategory === '6개월' && {color:'#fff'}]} />
                            </TouchableOpacity>
                        </HStack>
                    </Box>
                    <Box mt={5}>
                        {
                            pointCategory === '전체' &&
                            pointDataR
                        }
                        {
                            pointCategory === '1개월' &&
                            <Box py={10} alignItems='center'>
                                <DefText text='1개월이내에 포인트내역이 없습니다.' style={{fontSize:15, color:'#333'}} />
                            </Box>
                        }
                        {
                            pointCategory === '6개월' &&
                            pointDataR
                        }
                    </Box>
                </Box>
            </ScrollView>
        </Box>
    );
};

const styles = StyleSheet.create({
    cateButton: {
        height:30,
        backgroundColor:'#fff',
        borderWidth:1,
        borderRadius:5,
        borderColor:'#999',
        alignItems:'center',
        justifyContent:'center'
    },
    cateButtonText:{
        fontSize:14,
        color:'#666'
    },
    pointTitle:{
        fontSize:16,
        color:'#000',
        fontWeight:'bold'
    },
    pointDataTitle:{
        fontSize:16,
        fontWeight:'bold'
    }

})

export default Point;