import React, {useState, useEffect} from 'react';
import { TouchableOpacity, Dimensions, Text, ScrollView, StyleSheet, FlatList } from 'react-native';
import { Box, Image, HStack } from 'native-base';
import { DefText } from '../common/BOOTSTRAP';
import HeaderComponents from '../components/HeaderComponents';
import { InquiryListData } from '../Utils/DummyData';

const InquiryList = (props) => {

    const {navigation} = props;

    const [inquirySelect, setInquirySelect] = useState('');

    const InqSelectHandle = (index) => {
        if(index == inquirySelect){
            setInquirySelect(123);
        }else{
            setInquirySelect(index);
        }
        
    }

    const InqList = InquiryListData.map((item, index)=>{
        return (
            <Box key={index}>
                <TouchableOpacity activeOpacity={0.9} onPress={()=>{InqSelectHandle(index)}} style={{paddingVertical:15, paddingHorizontal: 20, borderBottomWidth:1, borderBottomColor:'#eee'}}>
                    <HStack>
                        <HStack>
                            <DefText text='Q' style={[item.answerStatus === '답변완료' ? {color:'#5EB5E0'} : {color:'#f00'}, {fontWeight:'bold', marginRight:10}]} />
                            <DefText text={item.qaTitle} style={{fontSize:16, fontWeight:'bold'}} />
                        </HStack>
                        <Box style={{position:'absolute', right:0, bottom:-10}}>
                            <DefText text={item.answerStatus} style={[{fontSize:12, fontWeight:'bold'}, item.answerStatus === '답변완료' ? {color:'#5EB5E0'} : {color:'#f00'} ]} />
                        </Box>
                    </HStack>
                </TouchableOpacity>
                {
                    inquirySelect === index &&
                    <Box px={5} borderBottomWidth={1} borderBottomColor='#eee'>
                        <Box borderBottomWidth={1} borderBottomColor='#eee' py={5}>
                            <DefText text={item.qaDate} style={{fontSize:12, color:'#a2a2a2'}} />
                            <DefText text={item.qaTitle} style={{fontSize:16, color:'#000', fontWeight:'bold', marginTop:10}}/>
                            <DefText text={item.qaContent} style={{fontSize:14, color:'#333', marginTop:10}} />
                        </Box>
                        {
                            item.answerDate != '' ?
                            <Box py={5}>
                                <DefText text={item.answerDate} style={{fontSize:12, color:'#a2a2a2', textAlign:'right'}} />
                                <DefText text={item.answerContent} style={{fontSize:14, color:'#333', marginTop:10}}/>
                            </Box>
                            :
                            <Box py={5}>
                                <DefText text='등록된 답변이 없습니다.' style={{fontSize:14,textAlign:'center'}} />
                            </Box>
                        }
                        
                    </Box>
                }
                
            </Box>
        )
    })

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderComponents headerTitle='문의내역' navigation={navigation} />
            <ScrollView>
                <Box>
                    {InqList}
                </Box>
            </ScrollView>
            <Box style={{position:'absolute', bottom:20, right:20}}>
                <TouchableOpacity onPress={()=>{navigation.navigate('InquiryForm')}}>
                    <Image source={require('../images/medicinePlus.png')} alt='문의하기' />
                </TouchableOpacity>
            </Box>
        </Box>
    );
};

export default InquiryList;