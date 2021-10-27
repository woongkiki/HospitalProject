import React, { useEffect, useState } from 'react';
import { Box, VStack, HStack, Image, Modal, CheckIcon } from 'native-base';
import { TouchableOpacity, ScrollView, StyleSheet, Dimensions, ImageBackground, Text, View, TouchableWithoutFeedback } from 'react-native';
import { DefText, DefInput } from '../common/BOOTSTRAP';
import HeaderMedicine from '../components/HeaderMedicine';
import HeaderComponents from '../components/HeaderComponents';
import ImagePicker from 'react-native-image-crop-picker';

const {width} = Dimensions.get('window');

const MedicineForm2 = ( props ) => {

    const {navigation, route} = props;
    const {params} = route;

    console.log(params);

    const [disease, setDisease] = useState('');
    const diseaseChange = (diseaseName) => {
        setDisease(diseaseName)
    }

    useEffect(()=>{
        if(params != undefined){
            if(params.diseaseDatas){
                setDisease(params.diseaseDatas);
            }

            if(params.scheduleText) {
                setMedicineSchedule(params.scheduleText);
            }

            if(params.isMedicineDate){
                setScheduleAdd(params.isMedicineDate);
            }
        }
    },[])

    const [medicineSchedule, setMedicineSchedule] = useState('');
    const scheduleChange = (schedule) => {
        setMedicineSchedule(schedule);
    }

    const [scheduleAdd, setScheduleAdd] = useState('');
    const scheduleAddChange = (schedule) => {
        setScheduleAdd(schedule)
    }

    const [medicineName, setMedicineName] = useState('');
    const medicineChange = ( medicine ) => {
        setMedicineName(medicine);
    }

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderComponents headerTitle='복약관리' navigation={navigation} />
            <ScrollView>
                <Box py={5} px={12}>
                    <Box>
                        <HStack>
                            <DefText text='질병' style={{fontSize:14}} />
                            <DefText text='*' style={{fontSize:14, color:'#f00', marginLeft:5}} />
                        </HStack>
                        {/* <DefInput 
                            placeholderText='질병을 입력하세요.'
                            inputValue = {disease}
                            onChangeText = {diseaseChange}
                            multiline = {false}
                            inputStyle={{marginTop:15}}
                            onPressOut={()=>{navigation.navigate('DiseaseSelect', {scheduleText:medicineSchedule, isMedicineDate:scheduleAdd})}}
                            
                        /> */}
                        <Box mt={2.5} height='45px' borderWidth={1} borderColor='#ddd' borderRadius={5}>
                            <TouchableOpacity onPress={()=>{navigation.navigate('DiseaseSelect', {scheduleText:medicineSchedule, isMedicineDate:scheduleAdd})}} style={{paddingLeft:15, width:'100%',  height:45, justifyContent:'center'}}>
                                {
                                    disease.length > 0 ?
                                    <DefText text={disease} style={{fontSize:14, color:'#333'}} />
                                    :
                                    <DefText text='질병을 입력하세요.' style={{fontSize:14, color:'#aaa'}} />
                                }
                            </TouchableOpacity>
                        </Box>
                    </Box>
                    <Box mt={5}>
                        <HStack>
                            <DefText text='복약스케줄' style={{fontSize:14}} />
                            <DefText text='*' style={{fontSize:14, color:'#f00', marginLeft:5}} />
                        </HStack>
                        <Box mt={2.5} height='45px' borderWidth={1} borderColor='#ddd' borderRadius={5}>
                            {/* <DefInput 
                                placeholderText='복약주기를 입력하세요.'
                                inputValue = {medicineSchedule}
                                onChangeText = {scheduleChange}
                                multiline = {false}
                                inputStyle={{marginTop:15}}
                                onPressOut={()=>{navigation.navigate('DiseaseSchedule')}}
                            /> */}
                            
                            <HStack height='45px' alignItems='center'>
                                <TouchableOpacity style={{paddingLeft:15, width:'100%',  height:45, justifyContent:'center'}} onPress={()=>{navigation.navigate('DiseaseSchedule', {diseaseDatas:disease})}}>
                                    {
                                        medicineSchedule.length > 0 ?
                                        <DefText text='복약주기를 입력하세요.' style={{fontSize:14, color:'#aaa'}} />
                                        :
                                        <DefText text={medicineSchedule} style={{fontSize:14, color:'#333'}} />
                                    }
                                   
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.medicineAdds]} onPress={()=>{navigation.navigate('DiseaseSchedule', {diseaseDatas:disease})}}>
                                    
                                    <Image source={require('../images/medicineAdd.png')} alt='의약품 추가' />
                                </TouchableOpacity>
                            </HStack>
                        </Box>
                        <Box mt={2.5} height='45px' borderWidth={1} borderColor='#ddd' borderRadius={5}>
                            {/* <DefInput 
                                placeholderText='복약주기를 입력하세요.'
                                inputValue = {scheduleAdd}
                                onChangeText = {scheduleAddChange}
                                multiline = {false}
                                inputStyle={{marginTop:10}}
                            /> */}
                            <HStack>
                                <TouchableOpacity style={{paddingLeft:15, width:'100%',  height:45, justifyContent:'center'}} onPress={()=>{navigation.navigate('DiseaseSchedule', {diseaseDatas:disease})}}>
                                    {
                                        scheduleAdd.length > 0 ?
                                        <DefText text='복약주기를 입력하세요.' style={{fontSize:14, color:'#aaa'}} />
                                        :
                                        <DefText text={scheduleAdd} style={{fontSize:14, color:'#333'}} />
                                    }
                                   
                                </TouchableOpacity>
                                {/* <TouchableOpacity style={[styles.medicineAdds]}>
                                    <Image source={require('../images/medicineAdd.png')} alt='의약품 추가' />
                                </TouchableOpacity> */}
                            </HStack>
                            
                        </Box>
                    </Box>
                    <Box mt={5}>
                        <HStack>
                            <DefText text='약' style={{fontSize:14}} />
                            <DefText text='*' style={{fontSize:14, color:'#f00', marginLeft:5}} />
                        </HStack>
                        <Box>
                            <DefInput 
                                placeholderText='의약품 추가'
                                inputValue = {medicineName}
                                onChangeText = {medicineChange}
                                multiline = {false}
                                inputStyle={{marginTop:15}}
                            />
                            <TouchableOpacity style={styles.medicineAdds}>
                                <Image source={require('../images/medicineAdd.png')} alt='의약품 추가' />
                            </TouchableOpacity>
                        </Box>
                       
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
    medicineAdds : {
        position: 'absolute',
        top:'50%',
        marginTop:-16,
        right:10
    }
})

export default MedicineForm2;