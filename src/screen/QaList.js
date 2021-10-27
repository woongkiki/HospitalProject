import React, {useState, useEffect} from 'react';
import { TouchableOpacity, Dimensions, Text, ScrollView, StyleSheet, FlatList } from 'react-native';
import { Box, Image, HStack } from 'native-base';
import { DefText } from '../common/BOOTSTRAP';
import HeaderComponents from '../components/HeaderComponents';
import { QaListData } from '../Utils/DummyData';

const QaList = (props) => {

    const {navigation} = props;

    const [qaSelect, setQaSelect] = useState('');


    const QaSelectHandle = (index) => {
        if(index == qaSelect){
            setQaSelect(123);
        }else{
            setQaSelect(index);
        }
        
    }    

    const QaListDataR = QaListData.map((item, index)=>{
        return(
            <Box key={index}>
                <TouchableOpacity activeOpacity={0.9} onPress={()=>{QaSelectHandle(index)}} style={{paddingVertical:15, paddingHorizontal: 20, borderBottomWidth:1, borderBottomColor:'#eee'}}>
                    <HStack alignItems='center' justifyContent='space-between'>
                        <DefText text={'Q. '+item.qa} style={styles.qaText} />
                        {
                            qaSelect === index ?
                            <Image source={require('../images/faqArrUp.png')} alt='열기' />
                            :
                            <Image source={require('../images/faqArrDown.png')} alt='열기' />
                        }
                        
                    </HStack>
                </TouchableOpacity>
                {
                    qaSelect === index &&
                    <Box style={{paddingVertical:20, paddingHorizontal:20, borderBottomWidth:1, borderBottomColor:'#eee'}}>
                        <DefText text={item.answer} style={styles.answerText} />
                    </Box>
                }
            </Box>
        )
    })
    

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderComponents navigation={navigation} headerTitle='자주하는 질문' />
            <ScrollView>
                <Box>
                    {QaListDataR}
                </Box>
            </ScrollView>
        </Box>
    );
};

const styles = StyleSheet.create({
    qaText: {
        fontSize:15,
        color:'#000',
        fontWeight:'bold'
    },
    answerText:{
        fontSize:14,
        color:'#333'
    }
})

export default QaList;