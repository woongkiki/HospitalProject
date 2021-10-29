import React, {useState, useEffect} from 'react';
import { TouchableOpacity, Dimensions, Text, ScrollView, StyleSheet, FlatList } from 'react-native';
import { Box, Image, HStack, VStack, Input, Modal } from 'native-base';
import { DefText } from '../common/BOOTSTRAP';
import HeaderComponents from '../components/HeaderComponents';
import {dnaDataList, dnaReport} from '../Utils/DummyData';
import ToastMessage from '../components/ToastMessage';

const {width} = Dimensions.get('window');

const DnaSelect = (props) => {

    const {navigation} = props;


    const [dnaDatas, setDnaDatas] = useState(dnaReport);

    // const dnaParentButton = (disNames) => {

    //     const disNameInfo = disNames;
    //     disNames.diseaseParent =  0;
        
    //     console.log(disNameInfo);
    //     console.log(disNames.diseaseParent);
    // }

    const dnaReportData = dnaDataList.map((item, index)=> {

        return(
            <Box key={index} mt={2.5}>
                <HStack justifyContent='space-between' alignItems='center' px={2.5} pl={4} style={styles.dnaDisName}>
                    <DefText text={item.diseaseName} style={styles.dnaTitle} />
                    <HStack>
                        <TouchableOpacity style={[styles.dnaSelectButton, {marginRight:5}, item.disParent === 1 && {backgroundColor:'#666'}]}>
                            <DefText text='부모' style={[styles.dnaSelectButtonText]} />
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.dnaSelectButton, item.disFamily === 1 && {backgroundColor:'#666'}]}>
                            <DefText text='형제자매' style={[styles.dnaSelectButtonText]}  />
                        </TouchableOpacity>
                    </HStack>
                </HStack>
            </Box>
        )       
    })

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderComponents headerTitle='가족력질환' navigation={navigation} />
            <ScrollView>
                <Box p={5}>
                    <HStack height='115px' justifyContent='space-between' px={4} backgroundColor='#F1F1F1' borderRadius='30px' alignItems='center'>
                        <Box width={(width * 0.65) + 'px'}>
                            <DefText text='질환 중 가족력 여부를 체크해주세요.' style={{fontSize:16, fontWeight:'bold'}} />
                            <DefText text='건강은 가족력과 밀접한 관련이 있습니다.' style={{fontSize:14, marginTop:10}} />
                        </Box>
                        <Image source={require('../images/checkIcons.png')} alt='체크이미지' />
                    </HStack>
                    <Box mt={5}>
                        <DefText text='가족력 질환기록' style={styles.reportDataText} />
                        <VStack>
                            {dnaReportData}
                        </VStack>
                    </Box>
                </Box>
            </ScrollView>
            <Box p={2.5}>
                <TouchableOpacity style={styles.medicineButtons}>
                    <DefText text='저장' style={styles.medicineButtonsText} />
                </TouchableOpacity>
            </Box>
        </Box>
    );
};

const styles = StyleSheet.create({
    reportLabel : {
        fontSize:15,
        color:'#666',
        fontWeight:'bold'
    },
    reportDataText: {
        fontSize:15,
        color:'#333'
    },
    dnaDisName:{
        height:40,
        backgroundColor:'#f1f1f1',
        borderRadius:10
    },
    dnaTitle:{
        fontSize:14,
        color:'#333',
        fontWeight:'bold'
    },
    dnaSelectButton:{
        height:30,
        backgroundColor:'#D2D2D2',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:10,
        paddingHorizontal:10
    },
    dnaSelectButtonText: {
        fontSize:13,
        color:'#fff',
    },
    medicineButtons : {
        backgroundColor:'#999',
        borderRadius:5,
        alignItems:'center',
        justifyContent:'center',
        height: 40,
    },
    medicineButtonsText: {
        fontSize:15,
        color:'#fff',
        
    },
});

export default DnaSelect;