import React, {useState, useEffect} from 'react';
import {Box, ScrollView, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import HeaderComponents from '../components/HeaderComponents';
import HeaderDefault from '../components/HeaderDefault';

const {width} = Dimensions.get('window');

const Graphs = (props) => {

    const {navigation, route} = props;
    const {params} = route;


    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderComponents headerTitle='그래프' navigation={navigation} />
            <ScrollView>
                <Box p='20px'>
                    <Box height={'300px'} width={width - 40} >
                        {/* <WebView
                            source={{
                                uri: BASE_URL + '/adm/rn-webview/bloodsugarReport.php?mode=week&id=' + userInfo.id
                            }}
                            style={{
                                opacity:0.99,
                                minHeight:1,
                            }}
                        /> */}
                    </Box>
                </Box>
            </ScrollView>
        </Box>
    );
};

export default Graphs;