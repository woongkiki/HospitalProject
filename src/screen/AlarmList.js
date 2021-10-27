import React, {useState, useEffect} from 'react';
import { Box, VStack, HStack, Image } from 'native-base';
import { TouchableOpacity, Dimensions, ScrollView, StyleSheet } from 'react-native';
import {DefInput, DefText} from '../common/BOOTSTRAP';
import HeaderComponents from '../components/HeaderComponents';
import {AlarmListData} from '../Utils/DummyData';

const {width} = Dimensions.get('window');

const AlarmList = (props) => {

    const {navigation} = props;

    const AlarmListCategorys = AlarmListData.map((categorys, index)=> {
        return(
            <TouchableOpacity key={index} style={[styles.disButton ]} >
                <DefText text={categorys.category} style={[styles.disText]} />
            </TouchableOpacity>
        )
    })

    const AlarmListDataR = AlarmListData.map((item, index)=> {
        return(
            <TouchableOpacity key={index} style={[{backgroundColor:'#f1f1f1', borderRadius:10, padding:20}, index != 0 ? {marginTop:20} : {marginTop:10} ]} >
                <HStack justifyContent='space-between' alignItems='center'>
                    <DefText text={item.category} style={styles.noticeTitle} />
                    <DefText text={item.times} style={styles.noticeTimes} />
                </HStack>
                <DefText text={item.title} style={[styles.noticeContent]} />
            </TouchableOpacity>
        )
    })

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderComponents headerTitle='알림목록' navigation={navigation} />
            <ScrollView>
                <Box p={5}>
                    <HStack flexWrap='wrap'>
                        {AlarmListCategorys}
                    </HStack>
                    {
                        AlarmListDataR.length > 0 ?
                        AlarmListDataR
                        :
                        <Box justifyContent='center' alignItems='center' height='100px'>
                            <DefText text='알림목록이 없습니다.' />
                        </Box>
                    }
                </Box>
            </ScrollView>
        </Box>
    );
};

const styles = StyleSheet.create({
    noticeTitle : {
        fontSize:15,
        color:'#333',
        fontWeight:'bold'
    },
    noticeTimes : {
        fontSize:13,
        color:'#666'
    },
    noticeContent: {
        marginTop:20,
        fontSize:15,
        color:'#000'
    },
    disButton: {
        paddingVertical:5,
        paddingHorizontal:10,
        borderRadius:10,
        height:30,
        backgroundColor:'#f1f1f1',
        marginRight:10,
        marginBottom:10,
    },
    disText: {
        fontSize:14,
        color:'#333',
        fontWeight:'bold'
    },
})

export default AlarmList;