import React, {useState, useEffect} from 'react';
import { TouchableOpacity, Dimensions, Text, ScrollView, StyleSheet, FlatList } from 'react-native';
import { Box, Image, HStack } from 'native-base';
import { DefText, DefInput } from '../common/BOOTSTRAP';
import HeaderComponents from '../components/HeaderComponents';
import ToastMessage from '../components/ToastMessage';

const InquiryForm = (props) => {

    const {navigation} = props;


    const [inquiryTitle, setInquiryTitle] = useState('');
    const inqTitleChange = (text) => {
        setInquiryTitle(text);
    }

    const [inquiryContent, setInquiryContent] = useState('');
    const inqContentChange = (text) => {
        setInquiryContent(text);
    }

    const inqSubmit = () => {
        if(inquiryTitle.length == 0 ){
            ToastMessage('문의제목을 입력하세요.');
            return false;
        }

        if(inquiryContent.length == 0 ){
            ToastMessage('문의내용을 입력하세요.');
            return false;
        }

        ToastMessage('문의가 등록되었습니다.');
        navigation.goBack();
    }

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderComponents headerTitle='문의하기' navigation={navigation} />
            <ScrollView>
                <Box p={5}>
                    <Box>
                        <HStack>
                            <DefText text='문의제목' style={{fontSize:14}} />
                            <DefText text='*' style={{fontSize:14, color:'#f00', marginLeft:5}} />
                        </HStack>
                        <DefInput 
                            placeholderText='제목을 입력하세요.'
                            inputValue = {inquiryTitle}
                            onChangeText = {inqTitleChange}
                            multiline = {false}
                            inputStyle={{marginTop:15}}
                        />
                    </Box>
                    <Box mt={5}>
                        <HStack>
                            <DefText text='문의내용' style={{fontSize:14}} />
                            <DefText text='*' style={{fontSize:14, color:'#f00', marginLeft:5}} />
                        </HStack>
                        <DefInput 
                            placeholderText='내용을 입력하세요.'
                            inputValue = {inquiryContent}
                            onChangeText = {inqContentChange}
                            multiline={true}
                            inputStyle={{height:200,marginTop:15 }}
                            textAlignVertical='top'
                        />
                    </Box>
                    <Box mt={5}>
                        <TouchableOpacity onPress={inqSubmit} style={[styles.medicineButtons]}>
                            <DefText text='문의하기' style={styles.medicineButtonsText} />
                        </TouchableOpacity>
                    </Box>
                </Box>
            </ScrollView>
        </Box>
    );
};

const styles = StyleSheet.create({
    medicineButtons : {
        backgroundColor:'#666',
        borderRadius:5,
        alignItems:'center',
        justifyContent:'center',
        height: 40,
    },
    medicineButtonsText: {
        fontSize:15,
        color:'#fff',
        
    },
})

export default InquiryForm;