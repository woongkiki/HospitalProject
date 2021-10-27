import React, {useState, useEffect} from 'react';
import { TouchableOpacity, Dimensions, Text, ScrollView, StyleSheet, FlatList } from 'react-native';
import { Box, Image, HStack } from 'native-base';
import { DefText } from '../common/BOOTSTRAP';
import HeaderComponents from '../components/HeaderComponents';
import { NoticeData } from '../Utils/DummyData';

const Notice = (props) => {

    const {navigation} = props;

    const _renderItem = ({item, index}) => {
        return(
            <TouchableOpacity 
                key={index} 
                style={{ paddingVertical:20, borderBottomWidth:1, borderBottomColor:'#707070'}}
                onPress={()=>{navigation.navigate('NoticeView', item)}}
            >
                <DefText text={item.title} style={styles.noticeTitle} />
                <DefText text={item.dates} style={styles.noticeDates} />
            </TouchableOpacity>
        )
    }

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderComponents headerTitle='공지사항' navigation={navigation} />
            <Box px={5}>
                <FlatList
                    nestedScrollEnabled
                    data={NoticeData}
                    renderItem={_renderItem}
                    keyExtractor={(item, index)=>index.toString()}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <Box py={10} alignItems='center'>
                            <DefText text='등록된 공지사항이 없습니다.' style={{color:'#666'}} />
                        </Box>                
                    }
                />
            </Box>
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

export default Notice;