import React from 'react';
import { TouchableOpacity, Dimensions, View, Text, ScrollView, StyleSheet, FlatList, ImageBackground, Alert } from 'react-native';
import { Box, Image, HStack, Input, Modal, VStack } from 'native-base';
import { DefText } from '../common/BOOTSTRAP';
import HeaderComponents from '../components/HeaderComponents';
import { ScrapFolderData } from '../Utils/DummyData';


const ScrapView = (props) => {


    const {navigation, route} = props;

    const { params } = route;

    const { board } = params;

    //console.log(board.length);

    const boardData = board.map((item, index)=>{
        return (
            <TouchableOpacity key={index} onPress={()=>{navigation.navigate('InquiryList')}} style={[styles.scrapListBUtton, index!=0 && {marginTop:10}]}>
                <HStack justifyContent='space-between'>
                    <Box width='17%'>
                        <DefText text={item.boardName} style={styles.scrapListCateTitle} />
                    </Box>
                    <VStack width='75%'>
                        <DefText text={item.boardTitle} style={styles.scrapListTitles} />
                        <HStack  mt={2.5} mt={2.5}>
                            <HStack style={{marginRight:10}}>
                                <DefText text={item.boardName} style={[styles.scrapListTitles, {marginRight:5}]} />
                                <DefText text={item.boardTime} style={styles.scrapListTitles} />
                            </HStack>
                            <HStack>
                                <DefText text='조회' style={[styles.scrapListTitles, {marginRight:5}]} />
                                <DefText text={item.boardView} style={styles.scrapListTitles} />
                            </HStack>
                        </HStack>
                    </VStack>
                </HStack>
            </TouchableOpacity>
        )
    })

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderComponents headerTitle='스크랩' navigation={navigation} />
            <ScrollView>
                <HStack p={5}>
                    <View style={styles.folderBox}>
                        <DefText text={params.folderName} style={[styles.folderBoxText]} />
                    </View>
                </HStack>
                <Box px={5}>
                    {
                        board.length > 0 ?
                        boardData
                        :
                        <Box py={5} justifyContent='center' alignItems='center'>
                            <DefText text='등록된 스크랩 목록이 없습니다.' style={{fontSize:15}} />
                        </Box>
                    }
                </Box>
            </ScrollView>
        </Box>
    );
};

const styles = StyleSheet.create({
    folderBox: {
        paddingHorizontal:10,
        paddingVertical:5,
        backgroundColor:'#696968',
        borderRadius:10
    },
    folderBoxText: {
        fontSize:14,
        color:'#fff'
    },
    scrapListBUtton: {
        paddingVertical:10,
        paddingHorizontal:20,
        backgroundColor:'#F1F1F1',
        borderRadius:12
    },
    scrapListCateTitle: {
        fontSize:16,
        fontWeight:'bold'
    },
    scrapListTitles:{
        fontSize:15,
        color:'#000'
    }
})

export default ScrapView;