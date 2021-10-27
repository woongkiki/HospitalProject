import React, {useState, useEffect} from 'react';
import { TouchableOpacity, Dimensions, Text, ScrollView, StyleSheet, FlatList } from 'react-native';
import { Box, Image, HStack } from 'native-base';
import { DefText } from '../common/BOOTSTRAP';
import HeaderComponents from '../components/HeaderComponents';

const Privacy = (props) => {

    const {navigation} = props;


    return (
        <Box flex={1} backgroundColor='#fff'>
             <HeaderComponents headerTitle='개인정보 처리방침' navigation={navigation} />
             <ScrollView>
                 <Box p={5}>
                    <DefText text='개인정보 처리방침을 입력하세요.' style={styles.titles} />
                 </Box>
             </ScrollView>
        </Box>

    );
};


const styles = StyleSheet.create({
    titles: {
        fontSize:14,
        color:'#000',
        
    },

})


export default Privacy;