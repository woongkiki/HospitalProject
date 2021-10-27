import React, {useState, useEffect} from 'react';
import { TouchableOpacity, Dimensions, Text, ScrollView, StyleSheet, FlatList } from 'react-native';
import { Box, Image, HStack } from 'native-base';
import { DefText } from '../common/BOOTSTRAP';
import HeaderComponents from '../components/HeaderComponents';

const ServiceTerm = (props) => {

    const {navigation} = props;


    return (
        <Box flex={1} backgroundColor='#fff'>
             <HeaderComponents headerTitle='서비스 이용약관' navigation={navigation} />
             <ScrollView>
                 <Box p={5}>
                    <DefText text='서비스 이용약관을 입력하세요.' style={styles.titles} />
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


export default ServiceTerm;