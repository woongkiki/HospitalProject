import React, { useEffect, useState } from 'react';
import { Box, VStack, HStack, Image, Modal, CheckIcon, Input } from 'native-base';
import { TouchableOpacity, ScrollView, StyleSheet, Dimensions, ImageBackground, Text, View, TouchableWithoutFeedback } from 'react-native';
import { DefText, DefInput, SaveButton } from '../common/BOOTSTRAP';
import HeaderMedicine from '../components/HeaderMedicine';
import HeaderComponents from '../components/HeaderComponents';
import ImagePicker from 'react-native-image-crop-picker';
import { connect } from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import Api from '../Api';
import ToastMessage from '../components/ToastMessage';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import Font from '../common/Font';

const {width} = Dimensions.get('window');

const MedicineForm = (props) => {

    const {navigation, userInfo, route} = props;

    const {params} = route;


    const isFocused = useIsFocused();
    //console.log('회원정보::::', userInfo);

    const [medicineName, setMedicineName] = useState('');
    const medicineChange = ( medicine ) => {
        setMedicineName(medicine);
    }

    const [profileImgs, setProfileImgs] = useState('');
    const [profileImgAll, setProfileImgAll] = useState('');
    const _changeProfileImg = () =>{
        console.log('이미지 변경');
        ImagePicker.openPicker({
            width: 400,
            height: 400,
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

            setProfileImgs(my_photo.uri);
            setProfileImgAll(my_photo);
          });
    }

    const [medicineEat, setMedicineEat] = useState('');
    const medicineEatChange = (eat) => {
        setMedicineEat(eat);
    }

 
    const scheduleChange = (schedule) => {
        setMedicineSchedule(schedule);
    }

    const [scheduleAdd, setScheduleAdd] = useState('');
    const scheduleAddChange = (schedule) => {
        setScheduleAdd(schedule)
    }

    const [smsPush, setSmsPush] = useState(false);
    const [usePush, setUsePush] = useState(false);


   


    const [medicineStartDate, setMedicineStartDate] = useState('');
    const [medicineSchedule, setMedicineSchedule] = useState('');
    const [medicineTimes, setMedicineTimes] = useState('');
    const [medicineCheck, setMedicineCheck] = useState([]);
    const [medicineCheckIdx, setMedicineCheckIdx] = useState([]);

    useEffect(()=>{
        if(isFocused){
            setMedicineStartDate(params.dateTimeText); //시작날짜 저장
            mdScheduleData(params.scheduleText); //복약주기 저장
            mdTimesData(params.isMedicineDate); // 복약일수 저장
            setMedicineCheck(params.selectCategory); //복약시간 저장 (아침식사전, 아침식사후 등..)
            setMedicineCheckIdx(params.selectIdxCategory); //복약시간 저장 (아침식사전, 아침식사후 등..)

           
        } 
    }, [isFocused])


    const mdScheduleData = (paramMe) => {
        if(paramMe == '매일'){
            setMedicineSchedule('0');
        }else{
            setMedicineSchedule(paramMe);
        }
    }

    const mdTimesData = (paramsMe) => {
        if(paramsMe == '계속'){
            setMedicineTimes('0');
        }else{
            setMedicineTimes(paramsMe)
        }
    }

    const MedicineAdds = () => {

        //console.log(profileImgAll);

        if(!medicineName){
            ToastMessage('약 이름을 입력하세요.');
            return false;
        }
        
        if(!medicineEat){
            ToastMessage('섭취량을 입력하세요.');
            return false;
        }

        if(!medicineStartDate){
            ToastMessage('복약시작날짜를 입력하세요.');
            return false;
        }
        

        if(!medicineSchedule){
            ToastMessage('복약주기를 입력하세요.');
            return false;
        }

        if(!medicineTimes){
            ToastMessage('복약일수를 입력하세요.');
            return false;
        }

        if(medicineCheckIdx.length == 0){
            ToastMessage('복약시간을 입력하세요.');
        }

        let timer = medicineCheckIdx.join('^');

        Api.send('drug_insert', { 'id':userInfo.id, 'token':userInfo.appToken, 'dtype':'N', 'name':medicineName, 'qty':medicineEat, 'sdate': medicineStartDate, 'timer':timer, 'term':medicineSchedule, 'days':medicineTimes, 'upfile':profileImgAll }, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                console.log(resultItem);

                ToastMessage(resultItem.message);
                navigation.navigate('Medicine');
               
            }else{
                console.log('결과 출력 실패!', resultItem);
                ToastMessage(resultItem.message);
            }
        });
    }

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderComponents headerTitle='복약관리' navigation={navigation} />
            <ScrollView>
                <Box p={5} paddingBottom='100px'>
                    <Box>
                        <Box>
                            <DefText text='대표이미지를 등록해주세요.' style={[styles.reportLabel]} />
                        </Box>
                        <Box justifyContent='center' alignItems='center'>
                            <TouchableOpacity style={{width:100, height:100, borderRadius:100, marginTop:15}} onPress={_changeProfileImg}>
                                <Box alignItems='center'>
                                    {
                                        profileImgs ?
                                        <Image source={{uri:profileImgAll.uri}} alt='이미지 선택' style={{width:100, height:100, borderRadius:50}} resizeMode='stretch' />
                                        :
                                        <Image source={require('../images/noImage.png')} alt='이미지 선택' />
                                    }
                                    
                                </Box>
                            </TouchableOpacity>
                        </Box>
                    </Box>
                    <Box mt={5}>
                        <HStack>
                            <DefText text='약 이름' style={[styles.reportLabel]} />
                            <DefText text='*' style={{fontSize:18, color:'#FFC400', marginLeft:5, fontFamily:Font.NotoSansBold}} />
                        </HStack>
                        {/* <DefInput 
                            placeholderText='약 이름을 입력해주세요.'
                            inputValue = {medicineName}
                            onChangeText = {medicineChange}
                            multiline = {false}
                            inputStyle={{marginTop:15}}
                        /> */}
                        <Box mt={2.5}>
                            <Input
                                placeholder='약 이름을 입력해주세요.'
                                placeholderTextColor={'#a3a3a3'}
                                height='45px'
                                width={width-40}
                                backgroundColor='transparent'
                                borderRadius={10}
                                _focus='transparent'
                                borderWidth={1}
                                borderColor='#f1f1f1'
                                value={medicineName}
                                onChangeText={medicineChange}
                                style={[{fontSize:16, fontFamily:Font.NotoSansMedium}, medicineName.length > 0 && {backgroundColor:'#f1f1f1', color:'#000'}]}
                               
                            />
                        </Box>
                    </Box>
                    <Box mt={5}>
                        <HStack>
                            <DefText text='섭취량' style={[styles.reportLabel]} />
                            <DefText text='*' style={{fontSize:18, color:'#FFC400', marginLeft:5, fontFamily:Font.NotoSansBold}} />
                        </HStack>
                        {/* <DefInput 
                            placeholderText='섭취량을 입력해주세요.'
                            inputValue = {medicineEat}
                            onChangeText = {medicineEatChange}
                            multiline = {false}
                            inputStyle={{marginTop:15}}
                        /> */}

                        <Box mt={2.5}>
                            <Input
                                placeholder='섭취량을 입력해주세요.'
                                placeholderTextColor={'#a3a3a3'}
                                height='45px'
                                width={width-40}
                                backgroundColor='transparent'
                                borderRadius={10}
                                _focus='transparent'
                                borderWidth={1}
                                borderColor='#f1f1f1'
                                value={medicineEat}
                                onChangeText={medicineEatChange}
                                style={[{fontSize:16, fontFamily:Font.NotoSansMedium}, medicineEat.length > 0 && {backgroundColor:'#f1f1f1', color:'#000'}]}
                               
                            />
                        </Box>
                    </Box>
                    <Box mt={5}>
                        <HStack>
                            <DefText text='복약스케줄' style={[styles.reportLabel]} />
                            <DefText text='*' style={{fontSize:18, color:'#FFC400', marginLeft:5, fontFamily:Font.NotoSansBold}} />
                        </HStack>
                        <DefText text='복약 시작일' style={[styles.reportLabelSmall, {marginTop:10}]} />
                        <Box mt={2.5} height='45px' borderWidth={1} borderColor='#f1f1f1' borderRadius={10}>
                            <TouchableOpacity onPress={()=>{navigation.navigate('DiseaseSchedule2', {'dateTimeText':medicineStartDate, 'scheduleText':medicineSchedule, 'isMedicineDate':medicineTimes, 'selectCategory':medicineCheck, 'selectIdxCategory':medicineCheckIdx, 'm_page':1})}} style={{paddingLeft:15, width:'100%',  height:45, justifyContent:'center'}}>
                                {
                                    medicineStartDate ?
                                    <DefText text={medicineStartDate} style={{fontSize:16, color:'#000', fontFamily:Font.NotoSansMedium}} />
                                    :
                                    <DefText text='복약 시작일을 입력하세요.' style={{fontSize:16, color:'#a3a3a3', fontFamily:Font.NotoSansMedium}} />
                                }
                            </TouchableOpacity>
                        </Box>

                        <DefText text='복약주기' style={[styles.reportLabelSmall, {marginTop:10}]} />
                        <Box mt={2.5} height='45px' borderWidth={1} borderColor='#f1f1f1' borderRadius={10}>
                            <TouchableOpacity onPress={()=>{navigation.navigate('DiseaseSchedule2', {'dateTimeText':medicineStartDate, 'scheduleText':medicineSchedule, 'isMedicineDate':medicineTimes, 'selectCategory':medicineCheck, 'selectIdxCategory':medicineCheckIdx, 'm_page':1})}} style={{paddingLeft:15, width:'100%',  height:45, justifyContent:'center'}}>
                                {
                                    medicineSchedule != '' ?
                                    <DefText text={medicineSchedule == '0' ? '매일' : medicineSchedule} style={{fontSize:16, color:'#000', fontFamily:Font.NotoSansMedium}} />
                                    :
                                    <DefText text='복약주기를 입력하세요.' style={{fontSize:16, color:'#a3a3a3', fontFamily:Font.NotoSansMedium}} />
                                }
                            </TouchableOpacity>
                        </Box>
                        <DefText text='복약일수' style={[styles.reportLabelSmall, {marginTop:10}]} />
                        <Box mt={2.5} height='45px' borderWidth={1} borderColor='#f1f1f1' borderRadius={10}>

                            <TouchableOpacity onPress={()=>{navigation.navigate('DiseaseSchedule2', {'dateTimeText':medicineStartDate, 'scheduleText':medicineSchedule, 'isMedicineDate':medicineTimes, 'selectCategory':medicineCheck, 'selectIdxCategory':medicineCheckIdx, 'm_page':1})}} style={{paddingLeft:15, width:'100%',  height:45, justifyContent:'center'}}>
                            {
                                    medicineTimes != '' ?
                                    <DefText text={medicineTimes == '0' ? '계속' : medicineTimes} style={{fontSize:16, color:'#000', fontFamily:Font.NotoSansMedium}} />
                                    :
                                    <DefText text='복약일수를 입력하세요.' style={{fontSize:16, color:'#a3a3a3', fontFamily:Font.NotoSansMedium}} />
                                }
                            </TouchableOpacity>
                        </Box>
                        <DefText text='복약시간' style={[styles.reportLabelSmall, {marginTop:10}]} />
                        <Box mt={2.5} borderWidth={1} borderColor='#f1f1f1' borderRadius={10}>
                            <TouchableOpacity onPress={()=>{navigation.navigate('DiseaseSchedule2', {'dateTimeText':medicineStartDate, 'scheduleText':medicineSchedule, 'isMedicineDate':medicineTimes, 'selectCategory':medicineCheck, 'selectIdxCategory':medicineCheckIdx, 'm_page':2})}} style={{paddingLeft:15, width:'100%',  paddingVertical:12, justifyContent:'center'}}>
                                <HStack flexWrap={'wrap'}>
                                {
                                    medicineCheck != '' ?
                                    medicineCheck.map((item, index)=> {

                                        let comma;
                                        if(index != 0 ){
                                            comma = ',';
                                        }else{
                                            comma = '';
                                        }

                                        return(
                                            <Box key={index}>
                                                <DefText text={comma + item} style={{fontSize:16, color:'#000', fontFamily:Font.NotoSansMedium}} />
                                            </Box>
                                        )
                                    })
                                    :
                                    <DefText text='언제 복약예정인지 입력하세요.' style={{fontSize:16, color:'#a3a3a3', fontFamily:Font.NotoSansMedium}}  />
                                }
                                </HStack>
                            </TouchableOpacity>
                            
                        </Box>
                    </Box>
                    {/* <Box mt={5}>
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
                    </Box> */}
                </Box>
            </ScrollView>
            <Box position={'absolute'} bottom={"30px"} right={"30px"}>
                <SaveButton onPress={MedicineAdds} />
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
    reportLabel : {
        color:'#696968',
        fontWeight:'500',
        fontFamily:Font.NotoSansMedium
    },
    reportLabelSmall : {
        fontSize:14,
        color:'#696968'
    },
})

export default connect(
    ({ User }) => ({
        userInfo: User.userInfo, //회원정보
    }),
    (dispatch) => ({
        member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
        member_info: (user) => dispatch(UserAction.member_info(user)), //회원 정보 조회
        
    })
)(MedicineForm);