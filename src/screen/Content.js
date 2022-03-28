import React, {useState, useEffect} from 'react';
import { TouchableOpacity, Dimensions, Text, ScrollView, StyleSheet, FlatList } from 'react-native';
import { Box, Image, HStack } from 'native-base';
import { DefText } from '../common/BOOTSTRAP';
import HeaderComponents from '../components/HeaderComponents';
import { NoticeData } from '../Utils/DummyData';
import Api from '../Api';
import Font from '../common/Font';

const Content = ( props ) => {

    const {navigation} = props;

    const [contentPrivacyData, setContentPrivacyData] = useState([]);

    const contentPrivacy = () => {
        Api.send('service_list', {}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                //console.log('복약 스케줄 정보: ', arrItems);
                setContentPrivacyData(arrItems);
               
            }else{
                console.log('결과 출력 실패!', resultItem);
               
            }
        });
    }

    useEffect(()=>{
        contentPrivacy();
    }, [])

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderComponents headerTitle='약관 및 정책보기' navigation={navigation} />
            <ScrollView>
                <Box p={5}>
                    {
                        contentPrivacyData &&
                        contentPrivacyData.map((item, index)=>{
                            return(
                                <TouchableOpacity key={index} style={[styles.mypageButton, index != 0 && {marginTop:10}]} onPress={()=>{navigation.navigate('ServiceTerm', item)}}>
                                    <HStack alignItems='center' height='43px' justifyContent='space-between'>
                                        <DefText text={item.title} style={styles.mypageButtonText} />
                                        <Image source={require('../images/mypageArrs.png')} alt='바로가기' style={{width:28, height:28}} />
                                    </HStack>
                                </TouchableOpacity>
                            )
                        })
                    }
                </Box>
                
            </ScrollView>
        </Box>
    );
};

const styles = StyleSheet.create({
    mypageButton: {
        height:43,
        backgroundColor:'#F1F1F1',
        borderRadius:10,
        paddingLeft:20,
        paddingRight:10,
        
    },
    mypageButtonText: {
        color:'#000',
        fontFamily:Font.NotoSansMedium,
        fontWeight:'500'
    }
})

export default Content;