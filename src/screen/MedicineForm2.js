import React, { useEffect, useState } from 'react';
import { Box, VStack, HStack, Image, Modal, CheckIcon, Input } from 'native-base';
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
    const [diseaseChange, setDiseaseChange] = useState('');

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


    const [selectCategory, setSelectCategory] = useState([]);

    useEffect(()=>{
        if(params != undefined){
            
                setDisease(params.diseaseDatas);
                //console.log('123123123',disease);
         

            if(params.scheduleText) {
                setMedicineSchedule(params.scheduleText);
            }

            if(params.isMedicineDate){
                setScheduleAdd(params.isMedicineDate);
            }

            if(params.selectCategory){
                setSelectCategory(params.selectCategory);
            }
        }
    },[])

    useEffect(()=>{
        setDiseaseChange(disease);
    },[disease])

    const medicineTimesData = selectCategory.map((item, index)=> {

        let comma;
        if(index != 0 ){
            comma = ',';
        }else{
            comma = '';
        }
        
        return(
            <Box key={index}>
                <DefText text={comma + item} style={{fontSize:14, color:'#333'}}  />
            </Box>
        )
    })

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderComponents headerTitle='복약관리' navigation={navigation} />
            <ScrollView>
                <Box p={5} >
                    <Box>
                        <HStack>
                            <DefText text='질병' style={styles.reportLabel} />
                            <DefText text='*' style={{fontSize:14, color:'#f00', marginLeft:5}} />
                        </HStack>
  
                        <Box mt={2.5} height='45px' borderWidth={1} borderColor='#ddd' borderRadius={5}>
                            <TouchableOpacity onPress={()=>{navigation.navigate('DiseaseSelect', {scheduleText:medicineSchedule, isMedicineDate:scheduleAdd, selectCategory})}} style={{paddingLeft:15, width:'100%',  height:45, justifyContent:'center'}}>
                                {
                                    diseaseChange.length > 0 ?
                                    <DefText text={diseaseChange} style={{fontSize:14, color:'#333'}} />
                                    :
                                    <DefText text='질병을 입력하세요.' style={{fontSize:14, color:'#aaa'}} />
                                }
                            </TouchableOpacity>
                        </Box>
                    </Box>
                    <Box mt={5}>
                        <HStack>
                            <DefText text='복약스케줄' style={styles.reportLabel} />
                            <DefText text='*' style={{fontSize:14, color:'#f00', marginLeft:5}} />
                        </HStack>
                        <DefText text='복약주기' style={[styles.reportLabelSmall, {marginTop:10}]} />
                        <Box mt={2.5} height='45px' borderWidth={1} borderColor='#ddd' borderRadius={5}>
                            <HStack height='45px' alignItems='center'>
                                <TouchableOpacity style={{paddingLeft:15, width:'100%',  height:45, justifyContent:'center'}} onPress={()=>{navigation.navigate('DiseaseSchedule', {diseaseDatas:disease})}}>
                                    {
                                        medicineSchedule.length > 0 ?
                                        <DefText text={medicineSchedule} style={{fontSize:14, color:'#333'}} />
                                        :
                                        <DefText text='복약주기를 입력하세요.' style={{fontSize:14, color:'#aaa'}} />
                                    }
                                   
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.medicineAdds]} onPress={()=>{navigation.navigate('DiseaseSchedule', {diseaseDatas:disease})}}>
                                    
                                    <Image source={require('../images/medicineAdd.png')} alt='의약품 추가' />
                                </TouchableOpacity>
                            </HStack>
                        </Box>
                        <DefText text='복약일수' style={[styles.reportLabelSmall, {marginTop:10}]} />
                        <Box mt={2.5} height='45px' borderWidth={1} borderColor='#ddd' borderRadius={5}>

                            <HStack>
                                <TouchableOpacity style={{paddingLeft:15, width:'100%',  height:45, justifyContent:'center'}} onPress={()=>{navigation.navigate('DiseaseSchedule', {diseaseDatas:disease})}}>
                                    {
                                        scheduleAdd.length > 0 ?
                                        <DefText text={scheduleAdd} style={{fontSize:14, color:'#333'}} />
                                        :
                                        
                                        <DefText text='복약일수를 입력하세요.' style={{fontSize:14, color:'#aaa'}} />
                                    }
                                   
                                </TouchableOpacity>
                                {/* <TouchableOpacity style={[styles.medicineAdds]}>
                                    <Image source={require('../images/medicineAdd.png')} alt='의약품 추가' />
                                </TouchableOpacity> */}
                            </HStack>
                            
                        </Box>
                        <DefText text='복약시간' style={[styles.reportLabelSmall, {marginTop:10}]} />
                        <Box mt={2.5} height='45px' borderWidth={1} borderColor='#ddd' borderRadius={5}>
                            <HStack height='45px' alignItems='center' pl='15px' >
                                {
                                    selectCategory.length > 0 && 
                                    medicineTimesData
                                }
                                {/* <TouchableOpacity style={[styles.medicineAdds]} onPress={()=>{navigation.navigate('DiseaseSchedule', {diseaseDatas:disease})}}>
                                    
                                    <Image source={require('../images/medicineAdd.png')} alt='의약품 추가' />
                                </TouchableOpacity> */}
                            </HStack>
                        </Box>
                    </Box>
                    <Box mt={5}>
                        <HStack>
                            <DefText text='약' style={styles.reportLabel} />
                            <DefText text='*' style={{fontSize:14, color:'#f00', marginLeft:5}} />
                        </HStack>
                        <Box>
                            <HStack mt={2.5}>
                                {/* <DefInput 
                                    placeholderText='의약품 추가'
                                    inputValue = {medicineName}
                                    onChangeText = {medicineChange}
                                    multiline = {false}
                                    inputStyle={{marginTop:15}}
                                /> */}
                                <Input 
                                    placeholder='의약품 추가'
                                    value={medicineName}
                                    onChangeText={medicineChange}
                                    _focus='transparent'
                                    style={{fontSize:14}}
                                    height='45px'
                                    width={width-40}
                                />
                                <TouchableOpacity onPress={()=>{navigation.navigate('MedicineAdd')}} style={styles.medicineAdds}>
                                    <Image source={require('../images/medicineAdd.png')} alt='의약품 추가' />
                                </TouchableOpacity>
                            </HStack>
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
    },
    reportLabel : {
        fontSize:15,
        color:'#666',
        fontWeight:'bold'
    },
    reportLabelSmall : {
        fontSize:13,
        color:'#666'
    },
})

export default MedicineForm2;