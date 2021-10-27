import React, {useState, useEffect} from 'react';
import { TouchableOpacity, Dimensions, Text, ScrollView, StyleSheet, FlatList } from 'react-native';
import { Box, Image, HStack } from 'native-base';
import { DefText } from '../common/BOOTSTRAP';
import HeaderComponents from '../components/HeaderComponents';
import { NoticeData } from '../Utils/DummyData';

const Content = ( props ) => {

    const {navigation} = props;

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderComponents headerTitle='약관 및 정책보기' navigation={navigation} />
            <ScrollView>
                <Box p={5}>
                    <TouchableOpacity style={[styles.mypageButton, {marginTop:0}]} onPress={()=>{navigation.navigate('ServiceTerm')}}>
                        <HStack alignItems='center' height='43px' justifyContent='space-between'>
                            <DefText text='서비스이용약관' style={styles.mypageButtonText} />
                            <Image source={require('../images/buttonArrRight.png')} alt='바로가기' />
                        </HStack>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.mypageButton]} onPress={()=>{navigation.navigate('Privacy')}}>
                        <HStack alignItems='center' height='43px' justifyContent='space-between'>
                            <DefText text='개인정보처리방침' style={styles.mypageButtonText} />
                            <Image source={require('../images/buttonArrRight.png')} alt='바로가기' />
                        </HStack>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.mypageButton]} onPress={()=>{navigation.navigate('LocationContent')}}> 
                        <HStack alignItems='center' height='43px' justifyContent='space-between'>
                            <DefText text='위치기반서비스 이용약관' style={styles.mypageButtonText} />
                            <Image source={require('../images/buttonArrRight.png')} alt='바로가기' />
                        </HStack>
                    </TouchableOpacity>
                </Box>
                
            </ScrollView>
        </Box>
    );
};

const styles = StyleSheet.create({
    mypageButton: {
        height:43,
        backgroundColor:'#F1F1F1',
        borderRadius:43,
        paddingLeft:20,
        paddingRight:10,
        marginTop:10
    },
    mypageButtonText: {
        fontSize:16,
        color:'#000'
    }
})

export default Content;