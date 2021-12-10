import React, {useState, useEffect} from 'react';
import { TouchableOpacity, Dimensions, Text, ScrollView, StyleSheet, FlatList } from 'react-native';
import { Box, Image, HStack } from 'native-base';
import { DefText } from '../common/BOOTSTRAP';
import HeaderComponents from '../components/HeaderComponents';
import HTML from 'react-native-render-html';
import StyleHtml from '../common/StyleHtml';

const NoticeView = (props) => {

    const {navigation, route} = props;

    const { params } = route;

    console.log('넘어온값::::',params)

    return (
        <Box flex={1} backgroundColor='#fff'>
             <HeaderComponents headerTitle='공지사항' navigation={navigation} />
             <ScrollView>
                 <Box p={5}>
                     <Box style={{paddingBottom:20, borderBottomWidth:1, borderBottomColor:'#707070'}}>
                        <DefText text={params.subject} style={styles.noticeTitle} />
                        <DefText text={params.wdate} style={styles.noticeDates} />
                     </Box>
                    
                    <Box py={5} px={2.5}>
                        <HTML 
                            ignoredStyles={[ 'width', 'height', 'margin', 'padding', 'fontFamily', 'lineHeight', 'fontSize', 'br']}
                            ignoredTags={['head', 'script', 'src']}
                            imagesMaxWidth={Dimensions.get('window').width - 40}
                            source={{html: params.content}} 
                            tagsStyles={StyleHtml}
                            containerStyle={{ flex: 1, }}
                            contentWidth={Dimensions.get('window').width}  
                        />
                    </Box>
            
                 </Box>
             </ScrollView>
        </Box>

    );
};


const styles = StyleSheet.create({
    noticeTitle: {
        fontSize:14,
        color:'#000',
        fontWeight:'bold',
        marginBottom:15
    },
    noticeDates:{
        fontSize:12,
        color:'#696968'
    }
})


export default NoticeView;