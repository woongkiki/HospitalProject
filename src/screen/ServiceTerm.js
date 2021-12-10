import React, {useState, useEffect} from 'react';
import { TouchableOpacity, Dimensions, Text, ScrollView, StyleSheet, FlatList } from 'react-native';
import { Box, Image, HStack } from 'native-base';
import { DefText } from '../common/BOOTSTRAP';
import HeaderComponents from '../components/HeaderComponents';
import HTML from 'react-native-render-html';
import StyleHtml from '../common/StyleHtml';

const ServiceTerm = (props) => {

    const {navigation, route} = props;

    const {params} = route;


    return (
        <Box flex={1} backgroundColor='#fff'>
             <HeaderComponents headerTitle={params.title} navigation={navigation} />
             <ScrollView>
                 <Box p={5}>
                    <HTML 
                        ignoredStyles={[ 'width', 'height', 'margin', 'padding', 'fontFamily', 'lineHeight', 'fontFamily', 'br']}
                        ignoredTags={['head', 'script', 'src']}
                        imagesMaxWidth={Dimensions.get('window').width - 40}
                        source={{html: params.content}} 
                        tagsStyles={StyleHtml}
                        containerStyle={{ flex: 1, }}
                        contentWidth={Dimensions.get('window').width}  
                    />
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