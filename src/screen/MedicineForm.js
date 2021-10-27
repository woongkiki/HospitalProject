import React, { useEffect, useState } from 'react';
import { Box, VStack, HStack, Image, Modal, CheckIcon } from 'native-base';
import { TouchableOpacity, ScrollView, StyleSheet, Dimensions, ImageBackground, Text, View, TouchableWithoutFeedback } from 'react-native';
import { DefText, DefInput } from '../common/BOOTSTRAP';
import HeaderMedicine from '../components/HeaderMedicine';
import HeaderComponents from '../components/HeaderComponents';
import ImagePicker from 'react-native-image-crop-picker';

const MedicineForm = (props) => {

    const {navigation} = props;

    const [medicineName, setMedicineName] = useState('');
    const medicineChange = ( medicine ) => {
        setMedicineName(medicine);
    }

    const [profileImgs, setProfileImgs] = useState('');
    const _changeProfileImg = () =>{
        console.log('이미지 변경');
        ImagePicker.openPicker({
            width: 110,
            height: 100,
            cropping: true,
            cropperCircleOverlay: true
          }).then(image => {
            //console.log(image);

            const my_photo = {
                idx : 1,
                uri : image.path,
                type : image.mime,
                data : image.data,
                name : 'profile_img.jpg'
            }

            setProfileImgs(my_photo);
          });
    }

    const [medicineEat, setMedicineEat] = useState('');
    const medicineEatChange = (eat) => {
        setMedicineEat(eat);
    }

    const [medicineSchedule, setMedicineSchedule] = useState('');
    const scheduleChange = (schedule) => {
        setMedicineSchedule(schedule);
    }

    const [scheduleAdd, setScheduleAdd] = useState('');
    const scheduleAddChange = (schedule) => {
        setScheduleAdd(schedule)
    }

    const [smsPush, setSmsPush] = useState(false);
    const [usePush, setUsePush] = useState(false);

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderComponents headerTitle='복약관리' navigation={navigation} />
            <ScrollView>
                <Box py={5} px={12}>
                    <Box>
                        <Box>
                            <DefText text='대표이미지를 등록해주세요.' style={{fontSize:14}} />
                        </Box>
                        <Box justifyContent='center' alignItems='center'>
                            <TouchableOpacity style={{width:70, height:70, borderRadius:35, marginTop:15}} onPress={_changeProfileImg}>
                                <Box alignItems='center'>
                                    {
                                        profileImgs ?
                                        <Image source={{uri:profileImgs.uri}} alt='이미지 선택' style={{width:70, height:70, borderRadius:35}} resizeMode='contain' />
                                        :
                                        <Image source={require('../images/noImage.png')} alt='이미지 선택' />
                                    }
                                    
                                </Box>
                            </TouchableOpacity>
                        </Box>
                    </Box>
                    <Box mt={5}>
                        <HStack>
                            <DefText text='약 이름' style={{fontSize:14}} />
                            <DefText text='*' style={{fontSize:14, color:'#f00', marginLeft:5}} />
                        </HStack>
                        <DefInput 
                            placeholderText='약 이름을 입력해주세요.'
                            inputValue = {medicineName}
                            onChangeText = {medicineChange}
                            multiline = {false}
                            inputStyle={{marginTop:15}}
                        />
                    </Box>
                    <Box mt={5}>
                        <HStack>
                            <DefText text='섭취량' style={{fontSize:14}} />
                            <DefText text='*' style={{fontSize:14, color:'#f00', marginLeft:5}} />
                        </HStack>
                        <DefInput 
                            placeholderText='섭취량을 입력해주세요.'
                            inputValue = {medicineEat}
                            onChangeText = {medicineEatChange}
                            multiline = {false}
                            inputStyle={{marginTop:15}}
                        />
                    </Box>
                    <Box mt={5}>
                        <HStack>
                            <DefText text='복약스케줄' style={{fontSize:14}} />
                            <DefText text='*' style={{fontSize:14, color:'#f00', marginLeft:5}} />
                        </HStack>
                        <DefInput 
                            placeholderText='복약주기를 입력하세요. (매일, 하루3회, 3일간)'
                            inputValue = {medicineSchedule}
                            onChangeText = {scheduleChange}
                            multiline = {false}
                            inputStyle={{marginTop:15}}
                        />
                        <DefInput 
                            placeholderText='복약주기를 입력하세요. (기상직후, 저녁식후)'
                            inputValue = {scheduleAdd}
                            onChangeText = {scheduleAddChange}
                            multiline = {false}
                            inputStyle={{marginTop:10}}
                        />
                    </Box>
                    <Box mt={5}>
                        <DefText text='알림설정' style={{fontSize:14}} />
                        <HStack mt={2.5}>
                            <HStack alignItems='center' mr={10}>
                                <TouchableOpacity 

                                    style={{width:24, height:24, borderWidth:1, borderColor:'#aaa', borderRadius:5, alignItems:'center', justifyContent:'center', marginRight:10}}
                                    onPress={()=>{setSmsPush(!smsPush)}}
                                >
                                    {
                                        smsPush &&
                                        <CheckIcon width={14} color='#f00' />
                                    }
                                </TouchableOpacity>
                                <TouchableWithoutFeedback onPress={()=>{setSmsPush(!smsPush)}}>
                                    <View>
                                        <DefText text='문자알림' style={{fontSize:14}} />
                                    </View>
                                </TouchableWithoutFeedback>
                            </HStack>
                            <HStack alignItems='center'>
                                <TouchableOpacity 
                                    
                                    style={{width:24, height:24, borderWidth:1, borderColor:'#aaa', borderRadius:5, alignItems:'center', justifyContent:'center', marginRight:10}}
                                    onPress={()=>{setUsePush(!usePush)}}
                                >
                                    {
                                        usePush &&
                                        <CheckIcon width={14} color='#f00' />
                                    }
                                </TouchableOpacity>
                                <TouchableWithoutFeedback onPress={()=>{setUsePush(!usePush)}}>
                                    <View>
                                        <DefText text='푸시알림' style={{fontSize:14}} />
                                    </View>
                                </TouchableWithoutFeedback>
                            </HStack>
                        </HStack>
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
        
    }
})

export default MedicineForm;