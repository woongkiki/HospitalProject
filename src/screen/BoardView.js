import React, {useState, useEffect} from 'react';
import { ScrollView, Dimensions, View, Text, Platform, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Box, HStack, VStack, Image } from 'native-base';
import { DefText } from '../common/BOOTSTRAP';
import HeaderComponents from '../components/HeaderComponents';

const BoardView = (props) => {

    const {navigation, route} = props;

    const {params} = route;

    //console.log('게시판상세::::',route);

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderComponents headerTitle='병원게시판' navigation={navigation} />
            <ScrollView>
                <Box p={5}>
                    <Box width='90%' mb={10}>
                        <DefText text={params.title} style={styles.boardViewTitle} />
                    </Box>
                    <HStack alignItems='center' pb={5} borderBottomWidth={1} borderBottomColor='#dfdfdf'>
                        <Image 
                            source={require('../images/hospitalLogo.png')} 
                            alt='hospital logo'
                            style={{marginRight:20, width:64, height:64, resizeMode:'contain'}}
                        />
                        <Box>
                            <DefText text='힐링' style={styles.boardViewWriter} />
                            <DefText text={params.date} style={styles.boardViewDate} />
                        </Box>
                    </HStack>
                    <Box py={5} px={2.5}>
                        <Text style={styles.boardViewContent}>
                            {params.content}
                        </Text>
                    </Box>
                </Box>
            </ScrollView>
        </Box>
    );
};

const styles = StyleSheet.create({
    boardViewTitle: {
        fontSize:20,
        color:'#000',
        fontWeight:'bold'
    },
    boardViewWriter: {
        fontSize:15,
        color:'#666'
    },
    boardViewDate: {
        fontSize:15,
        color:'#666',
        marginTop:5
    },
    boardViewContent: {
        fontSize:15,
        color:'#333'
    }
})

export default BoardView;