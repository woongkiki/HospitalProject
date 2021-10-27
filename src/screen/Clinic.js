import React, {useState, useEffect} from 'react';
import { ScrollView, Dimensions, View, Text, Platform, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Box, HStack, VStack, Image, Input } from 'native-base';
import { DefText } from '../common/BOOTSTRAP';
import HeaderComponents from '../components/HeaderComponents';
import Swiper from 'react-native-swiper';
import {numberFormat , textLengthOverCut} from '../common/dataFunction';
import {clinicSearchCategory, clinicData} from '../Utils/DummyData';

const {width} = Dimensions.get('window');

const Clinic = ( props ) => {

    const {navigation} = props;

    const [clinicSearch, setClinicSearch] = useState('');
    const clinicChange = (text) => {
        setClinicSearch(text);
    }

    const [clinicSelect, setClinicSelect] = useState('');
    const _clinickSelect = (category) => {
        setClinicSelect(category);
        setClinicSearch(category);
    }

    const clinicSearchCategoryBtn = clinicSearchCategory.map((item, index)=>{
        return(
            <TouchableOpacity key={index} style={[styles.keywordButton, clinicSelect == item.category && {backgroundColor:'#666'} ]} onPress={()=>{_clinickSelect(item.category)}}>
                <DefText text={item.category} style={[styles.keywordButtonText, clinicSelect == item.category && {color:'#fff'}]} />
            </TouchableOpacity>
        )
    })

    const _renderItem = ({item, index}) => {
        return(
            <Box px={5} mb={5}>
                <Box shadow={5} backgroundColor='#fff' borderRadius={10} px={5}>
                    <TouchableOpacity style={{borderRadius:10, paddingTop:10, paddingBottom:20}} onPress={()=>navigation.navigate('ClinicView', item)}>
                        <Box>
                            <HStack justifyContent='space-between' alignItems='flex-end'>
                                <DefText text={textLengthOverCut(item.itemTitle, 12)} style={styles.itemTitle} />
                                <VStack justifyContent='flex-end' alignItems='flex-end'>
                                    <Box>
                                        <DefText text={'정가 ' + numberFormat(item.orPrice) + '원'} style={styles.itemPriceOr} />
                                    </Box>
                                    <DefText text={'회원가 ' + numberFormat(item.price) + '원'} style={styles.itemTitle} />
                                </VStack>
                                
                            </HStack>
                            <DefText text={textLengthOverCut(item.commentOne, 25)} style={styles.itemContent} />
                        </Box>
                    </TouchableOpacity>
                </Box>
            </Box>
        )
    }

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderComponents headerTitle='클리닉 소개' navigation={navigation} />
            <FlatList
                ListHeaderComponent={
                    <>
                        <Swiper loop={true}
                            height={150}
                            dot={
                                <View
                                style={{
                                    backgroundColor: '#C1C1C1',
                                    width: 5,
                                    height: 5,
                                    borderRadius: 5,
                                    marginLeft: 10,
                                }}
                                />
                            }
                            activeDot={
                            <View
                                style={{
                                backgroundColor: '#333',
                                width: 5,
                                height: 5,
                                borderRadius: 5,
                                marginLeft: 10,
                                }}
                            />
                            }
                            paginationStyle={{
                                bottom: '10%',
                                
                            }}
                        >
                            <TouchableOpacity>
                                <Image source={require('../images/clinicSlide.png')} alt='슬라이드 1' />
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Image source={require('../images/clinicSlide.png')} alt='슬라이드 1' />
                            </TouchableOpacity>
                        </Swiper>
                        <Box px={5} py={2.5} pb={0}>
                            <HStack  alignItems='center' height='50px' backgroundColor='#F1F1F1' borderRadius={5}>
                                <Input
                                    placeholder='검색하실 내용을 적어주세요.'
                                    height='45px'
                                    width={width-80}
                                    backgroundColor='transparent'
                                    borderWidth={0}
                                    value={clinicSearch}
                                    onChangeText={clinicChange}
                                />
                                <TouchableOpacity>
                                    <Image source={require('../images/schIcons.png')} alt='검색' />
                                </TouchableOpacity>
                            </HStack>
                        </Box>
                        <HStack px={5} flexWrap='wrap' mb={2.5}>
                            {clinicSearchCategoryBtn}
                        </HStack>
                    </>
                }
                data={clinicData}
                renderItem={_renderItem}
                keyExtractor={(item, index)=>index.toString()}
                showsVerticalScrollIndicator={false}
                
                ListEmptyComponent={
                    <Box py={10} alignItems='center'>
                        <DefText text='채팅내역이 없습니다.' style={{color:'#666'}} />
                    </Box>                
                }
            />
        </Box>
    );
};

const styles = StyleSheet.create({
    keywordButton: {
        height:30,
        paddingHorizontal:10,
        backgroundColor:'#ddd',
        alignItems:'center',
        justifyContent:'center',
        borderRadius:35,
        marginRight:10,
        marginTop:10,
    },
    keywordButtonText: {
        fontSize: 14,
        color:'#333',
    },
    itemTitle: {
        fontSize:15,
        color:'#000',
        fontWeight:'bold'
    },
    itemContent: {
        fontSize:14,
        color:'#333',
        marginTop:10,
    },
    itemPriceOr: {
        fontSize:13,
        color:'#666'
    }
})

export default Clinic;