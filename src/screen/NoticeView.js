import React, {useState, useEffect} from 'react';
import { TouchableOpacity, Dimensions, Text, ScrollView, StyleSheet, FlatList } from 'react-native';
import { Box, Image, HStack } from 'native-base';
import { DefText } from '../common/BOOTSTRAP';
import HeaderComponents from '../components/HeaderComponents';
import { NoticeData } from '../Utils/DummyData';

const NoticeView = (props) => {

    const {navigation, route} = props;

    const { params } = route;

    //console.log('넘어온값::::',props)

    return (
        <Box flex={1} backgroundColor='#fff'>
             <HeaderComponents headerTitle='공지사항' navigation={navigation} />
             <ScrollView>
                 <Box p={5}>
                     <Box style={{paddingBottom:20, borderBottomWidth:1, borderBottomColor:'#707070'}}>
                        <DefText text={params.title} style={styles.noticeTitle} />
                        <DefText text={params.dates} style={styles.noticeDates} />
                     </Box>
                     <Text style={{paddingVertical:20, fontSize:14}}>
                         {params.content}
                     </Text>
                 </Box>
             </ScrollView>
        </Box>

    );
};


const styles = StyleSheet.create({
    noticeTitle: {
        fontSize:14,
        color:'#000',
        fontWeight:'bold',
        marginBottom:15
    },
    noticeDates:{
        fontSize:12,
        color:'#696968'
    }
})


export default NoticeView;