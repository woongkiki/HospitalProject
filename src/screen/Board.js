import React, {useState, useEffect} from 'react';
import { ScrollView, Dimensions, View, Text, Platform, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Box, HStack, VStack, Image } from 'native-base';
import { DefText } from '../common/BOOTSTRAP';
import HeaderComponents from '../components/HeaderComponents';
import { boardDatas } from '../Utils/DummyData';

const Board = (props) => {

    const {navigation} = props;

    const _renderItem = ({item, index})=>{
        return(
            <Box px={5} >
                <TouchableOpacity onPress={()=>navigation.navigate('BoardView', item)} style={{borderBottomWidth:1, borderBottomColor:'#dfdfdf', paddingVertical:10}}>
                    <VStack>
                        <HStack flexWrap='wrap' width='95%'>
                            <DefText text={ "[" + item.category + "] " + item.title} style={styles.boardTitle} />
                        </HStack>
                        <DefText text={item.date} style={styles.boardDate}  />
                    </VStack>
                </TouchableOpacity>
            </Box>
        )
    }

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderComponents headerTitle='병원게시판' navigation={navigation} />
           
            <FlatList
                nestedScrollEnabled
                data={boardDatas}
                renderItem={_renderItem}
                keyExtractor={(item, index)=>index.toString()}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <Box py={10} alignItems='center'>
                        <DefText text='등록된 게시글이 없습니다.' style={{color:'#666'}} />
                    </Box>                
                }
                style={{paddingVertical:10}}
            />
        </Box>
    );
};

const styles = StyleSheet.create({
    boardTitle: {
        fontSize:14,
        color:'#000',
        fontWeight:'bold'
    },
    boardDate: {
        fontSize:12,
        color:'#999',
        marginTop:20
    }
})

export default Board;