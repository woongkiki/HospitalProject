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
import { WebView } from 'react-native-webview';
import HeaderDefault from '../components/HeaderDefault';
import { BASE_URL } from '../Utils/APIConstant';

const {width} = Dimensions.get('window');

const GraphView = (props) => {

    const {navigation, route} = props;
    const {params} = route;
    const {id, mode, screen} = params;

    console.log('route::::',route);

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderComponents headerTitle='그래프 확인' navigation={navigation} /> 
            <ScrollView>
                <Box p='20px'>
                    {
                        screen == 'bloodsugarReport' &&
                        <HStack justifyContent={'center'}>
                            <HStack alignItems={'center'} mr='20px'>
                                <Box style={{width:7, height:7, borderRadius:10, backgroundColor:'#00f', marginRight:5}} />
                                <DefText text='정상' style={{fontSize:12}} />
                            </HStack>
                            <HStack alignItems={'center'}>
                                <Box style={{width:7, height:7, borderRadius:10, backgroundColor:'#f00', marginRight:5}} />
                                <DefText text='비정상' style={{fontSize:12}} />
                            </HStack>
                        </HStack>
                    }

                    {
                        screen == 'bloodpressureReport' &&
                        <HStack justifyContent={'center'}>
                            <HStack alignItems={'center'} mr='20px'>
                                <Box style={{width:7, height:7, borderRadius:10, backgroundColor:'#00f', marginRight:5}} />
                                <DefText text='최저혈압' style={{fontSize:12}} />
                            </HStack>
                            <HStack alignItems={'center'} mr='20px'>
                                <Box style={{width:7, height:7, borderRadius:10, backgroundColor:'#f00', marginRight:5}} />
                                <DefText text='최고혈압' style={{fontSize:12}} />
                            </HStack>
                            <HStack alignItems={'center'}>
                                <Box style={{width:7, height:7, borderRadius:10, backgroundColor:'#FFF732', marginRight:5, borderWidth:1, borderColor:'#ddd'}} />
                                <DefText text='심박수' style={{fontSize:12}} />
                            </HStack>
                        </HStack>
                    }
                    
                    <Box height={'300px'} width={width - 40} >
                        <WebView
                            source={{
                                uri: BASE_URL + '/adm/rn-webview/'+screen+'.php?mode='+mode+'&id=' + id
                            }}
                        />
                    </Box>
                </Box>
            </ScrollView>
        </Box>
    );
};

export default GraphView;