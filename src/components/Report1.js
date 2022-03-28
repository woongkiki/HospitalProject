import React, {useState, useEffect} from 'react';
import { Box, HStack, VStack, Image } from 'native-base';
import { TouchableOpacity, ScrollView, Dimensions, Animated, StyleSheet, Text, Platform, ActivityIndicator, Linking } from 'react-native';
import { DefText } from '../common/BOOTSTRAP';
import HeaderDefault from '../components/HeaderDefault';
import { WebView } from 'react-native-webview';

const Report1 = (props) => {

    const { id } = props;

    //console.log('id::::', id)

    return (
        <Box height='300px' backgroundColor={'#f00'}>
           
            <WebView
                source={{
                    uri:'https://khict0107.cafe24.com/adm/rn-webview/bloodsugarReport.php?mode=week&id='+id
                }}

               
            />
        </Box>
    );
};

export default Report1;