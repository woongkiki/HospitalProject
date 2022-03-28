import React, { useEffect, useState } from 'react';
import { Box, VStack, HStack, Image, Modal, CheckIcon, Input } from 'native-base';
import { TouchableOpacity, ScrollView, StyleSheet, Dimensions, ImageBackground, Text, View, TouchableWithoutFeedback, SafeAreaView, ActivityIndicator } from 'react-native';
import { DefText, DefInput, SaveButton } from '../common/BOOTSTRAP';
import HeaderMedicine from '../components/HeaderMedicine';
import HeaderComponents from '../components/HeaderComponents';
import ImagePicker from 'react-native-image-crop-picker';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { connect } from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import Api from '../Api';
import ToastMessage from '../components/ToastMessage';
import DiseaseSchedule from './DiseaseSchedule';
import Font from '../common/Font';

const {width} = Dimensions.get('window');

const MedicineForm2 = ( props ) => {

    const {navigation, route, userInfo} = props;
    const {params} = route;

   // console.log('파라미터..',params);


   const isFocused = useIsFocused();


    const [profileImgs, setProfileImgs] = useState('');
    const [profileImgAll, setProfileImgAll] = useState('');
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

            setProfileImgs(my_photo.uri);
            setProfileImgAll(my_photo);
          });
    }

    //질병 선택
    //질병정보 모달띄우기
    const [diseaseModal, setDiseaseModal] = useState(false);

    //질병정보
    const [disease, setDisease] = useState('');
   
    //질병검색 인풋창
    const [schTextInput, setSchTextInput] = useState('');
    const [schTextInput2, setSchTextInput2] = useState('');
    const schTextChange = (text) => {
        setSchTextInput(text);
    }

    const [schDisLoading, setSchDisLoading] = useState(false);
    const [schDisData, setSchDisData] = useState([]);

    const [emptyState, setEmptyState] = useState(false);

    //질병 검색 버튼 클릭시
    //콜레라
    const schButtons = async () => {
        await setSchDisData([]);
        await setSchDisLoading(true);
        setEmptyState(false);
        setSchTextInput2(schTextInput)
        await Api.send('disease_list', {'id':userInfo.id,  'token':userInfo.appToken, 'schText':schTextInput}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            
            if(resultItem.result === 'Y' && arrItems) {
               
                console.log(arrItems);
                if(arrItems?.empty === true) {
                    setEmptyState(true);
                } else {
                    setSchDisData(arrItems);
                    setEmptyState(false);
                }
                
                 setSchDisLoading(false);
                //setReserveList(arrItems)
            }else{
                //console.log('결과 출력 실패!', resultItem);
                ToastMessage(resultItem.message);

                setSchDisLoading(false);
            }
        });

        //ToastMessage(schText);
    }

    useEffect(()=>{
        console.log('하하하하::::', schDisData);
        console.log('상태::', schDisLoading);
    }, [])

    //질병 검색 및 나이..
    const [diseaseData, setDiseaseData] = useState('');
    const [diseaseAge, setDiseaseAge] = useState('');

    const diseaseAgeHandler = () => {
        Api.send('disease_age', {'id':userInfo.id,  'token':userInfo.appToken}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                //console.log('복약 스케줄 정보: ', arrItems.disease);
                //console.log(arrItems.disease);
                setDiseaseData(arrItems.disease);
                setDiseaseAge(arrItems.age);
                //setReserveList(arrItems)
            }else{
                //console.log('결과 출력 실패!', resultItem);
                ToastMessage(resultItem.message);
            }
        });
    }

    useEffect(()=>{
        diseaseAgeHandler();
    },[])


    const [diseaseIdx, setDiseaseIdx] = useState('');

    const diseaseSelectButton = (item, idx) => {
        setDisease(item);
        setDiseaseIdx(idx);
    }

    const diseaseDatasSave = () => {
       // console.log('선택한 질병:::::',disease + '/' +diseaseIdx);
        setDiseaseModal(false)
    }
    
    
    //질병 선택

    //복약 스케줄 관리
    
    const [medicineStartDate, setMedicineStartDate] = useState('');
    const [medicineSchedule, setMedicineSchedule] = useState('');
    const [medicineTimes, setMedicineTimes] = useState('');
    const [medicineCheck, setMedicineCheck] = useState([]);
    const [medicineCheckIdx, setMedicineCheckIdx] = useState([]);


    const [medicineNameSelect, setMedicineNameSelect] = useState('');
    const [medicineName, setMedicineName] = useState([]);
    const [medicineIdx, setMedicineIdx] = useState([]);

    const [selectCategory, setSelectCategory] = useState([]);
    //도

    useEffect(()=>{
        if(isFocused){
            setMedicineStartDate(params.dateTimeText); //시작날짜 저장
            mdScheduleData(params.scheduleText); //복약주기 저장
            mdTimesData(params.isMedicineDate); // 복약일수 저장
            setMedicineCheck(params.selectCategory); //복약시간 저장 (아침식사전, 아침식사후 등..)
            setMedicineCheckIdx(params.selectIdxCategory); //복약시간 저장 (아침식사전, 아침식사후 등..)

            //console.log('1234',params.medicine, params.medicineIdx);
            
            if(params.medicine != ""){
                medicineDataAdds(params.medicine, params.medicineIdx)
            }

            if(params.medicineArray){
                setMedicineName(params.medicineArray)
                setMedicineIdx(params.medicineIdxArray);
            }
            //setMedicineName(params.medicine); // 약 이름
         
            //console.log(diseaseIdx);
        } 
    }, [isFocused])
    //더힐링병원


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
    //콜레라

    const medicineDataAdds = (medicine,idx) => {


      //  setMedicineNameSelect(medicine);
        if(medicineName.includes(medicine)){


        }else{
            console.log('없음', medicine);

            setMedicineName([...medicineName, medicine]);
            setMedicineIdx([...medicineIdx, idx]);
            //console.log('sadasdas',medicineName)
        }
    }

    
    const medicineDataRemoves = (medicine) => {
       
        let medicineDataStatus = medicineName.includes(medicine);

        //console.log(medicineStatus);

        if(!medicineDataStatus){
            console.log('동일한 상품이 존재하지 않음');
            //selectCategory.push(category);
        }else{
            const findIdx = medicineName.find((e) => e === medicine);
            const idxs = medicineName.indexOf(findIdx);

            medicineName.splice(idxs, 1)
            medicineIdx.splice(idxs, 1)
            //console.log(findIdx);

        }

        setMedicineName([...medicineName]);
        setMedicineIdx([...medicineIdx]);
    }

    useEffect(()=>{

        console.log('약정보 :::::::: ', medicineCheckIdx);

    },[medicineStartDate, medicineSchedule, medicineTimes, medicineCheck, medicineCheckIdx, medicineName, medicineIdx, diseaseIdx ])


    const [hospitalNames, setHospitalNames] = useState('');
    const hospitalChanges = (text) => {
        setHospitalNames(text);
    }



    //복약관리 추가하기 버튼
    const medicineAdds = () => {

        if(!hospitalNames){
            ToastMessage('처방받은 병원명을 입력하세요');
            return false;
        }

        if(!disease){
            ToastMessage('질병명을 입력하세요.');
            return false;
        }

        if(!medicineStartDate){
            ToastMessage('복약시작 날짜를 입력하세요.');
            return false;
        }

        if(medicineCheck.length == 0){
            ToastMessage('복약시간을 입력하세요.');
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
//도

        if(medicineName.length == 0){
            ToastMessage('약을 입력하세요');
            return false;
        }

       //도
       
        let timer = medicineCheckIdx.join('^');

        let medicineIdxs = medicineIdx.join('^');

        console.log(timer);

        Api.send('drug_insert', { 'id':userInfo.id, 'token':userInfo.appToken, 
        'dtype':'P', 'name':hospitalNames, 'dname':disease, 'didx':diseaseIdx, 'sdate':medicineStartDate,  'term':medicineSchedule, 'drgidx':medicineIdxs, 'days':medicineTimes, 'qty':'', 'timer':timer }, (args)=>{
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
        

        //console.log('아이디', userInfo.appToken)
    }


    const [chrinicData, setChrinicData] = useState('');

    const mansungDisease = () => {
        Api.send('disease_chronic', { 'id':userInfo.id, 'token':userInfo.appToken }, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                console.log('만성질환', arrItems);

                setChrinicData(arrItems.disease);

            }else{
                console.log('만성질환 출력 실패!', resultItem);
                ToastMessage(resultItem.message);
            }
        });
    }

    useEffect(()=>{
        mansungDisease();
    }, [])


    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderComponents headerTitle='복약관리' navigation={navigation} />
            <ScrollView>
                <Box p={5} paddingBottom='100px'>
                    {/* <Box>
                        <Box>
                            <DefText text='대표이미지를 등록해주세요.' style={{fontSize:14}} />
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
                    </Box> */}
                    <Box>
                        <HStack>
                            <DefText text='병원이름' style={styles.reportLabel} />
                            <DefText text='*' style={{fontSize:18, color:'#FFC400', marginLeft:5, fontFamily:Font.NotoSansBold}} />
                        </HStack>
                        <Box mt={2.5}>
                            <Input
                                placeholder='약을 처방받은 병원명을 입력하세요.'
                                placeholderTextColor={'#a3a3a3'}
                                height='45px'
                                width={width-40}
                                backgroundColor='transparent'
                                borderRadius={10}
                                _focus='transparent'
                                borderWidth={1}
                                borderColor='#f1f1f1'
                                style={[{fontSize:16, fontFamily:Font.NotoSansMedium}, hospitalNames.length > 0 && {backgroundColor:'#f1f1f1', color:'#000'}]}
                                value={hospitalNames}
                                onChangeText={hospitalChanges}
                            />
                        </Box>
                    </Box>
                    <Box mt={5}>
                        <HStack>
                            <DefText text='질병' style={styles.reportLabel} />
                            <DefText text='*' style={{fontSize:18, color:'#FFC400', marginLeft:5, fontFamily:Font.NotoSansBold}} />
                        </HStack>
  
                        <Box mt={2.5} height='45px' borderWidth={1} borderColor='#f1f1f1' borderRadius={10} backgroundColor={ disease.length > 0 && {backgroundColor:'#f1f1f1'}}>
                            <TouchableOpacity onPress={()=>{setDiseaseModal(!diseaseModal)}} style={{paddingLeft:15, width:'100%',  height:45, justifyContent:'center'}}>
                                {
                                    disease != '' ?
                                    <DefText text={disease} style={{fontSize:16, color:'#333', fontFamily:Font.NotoSansMedium}} />
                                    :
                                    <DefText text='질병을 입력하세요.' style={{fontSize:16, color:'#a3a3a3', fontFamily:Font.NotoSansMedium}} />
                                }
                            </TouchableOpacity>
                        </Box>
                    </Box>
                    
                    <Box mt={5}>
                        <HStack>
                            <DefText text='복약스케줄' style={styles.reportLabel} />
                            <DefText text='*' style={{fontSize:18, color:'#FFC400', marginLeft:5, fontFamily:Font.NotoSansBold}} />
                        </HStack>
                        <DefText text='복약 시작일' style={[styles.reportLabelSmall, {marginTop:10}]} />
                        <Box mt={2.5} height='45px' borderWidth={1} borderColor='#f1f1f1' borderRadius={10} backgroundColor={ medicineStartDate && '#f1f1f1'}>
                            <TouchableOpacity onPress={()=>{navigation.navigate('DiseaseSchedule', {'dateTimeText':medicineStartDate, 'scheduleText':medicineSchedule, 'isMedicineDate':medicineTimes, 'selectCategory':medicineCheck, 'selectIdxCategory':medicineCheckIdx, 'medicineArray':medicineName, 'medicineIdxArray':medicineIdx, 'm_page':1})}} style={{paddingLeft:15, width:'100%',  height:45, justifyContent:'center'}}>
                                {
                                    medicineStartDate ?
                                    <DefText text={medicineStartDate} style={{fontSize:16, color:'#000', fontFamily:Font.NotoSansMedium}} />
                                    :
                                    <DefText text='복약 시작일을 입력하세요.' style={{fontSize:16, color:'#a3a3a3', fontFamily:Font.NotoSansMedium}} />
                                }
                            </TouchableOpacity>
                        </Box>

                        <DefText text='복약주기' style={[styles.reportLabelSmall, {marginTop:10}]} />
                        <Box mt={2.5} height='45px' borderWidth={1} borderColor='#f1f1f1' borderRadius={10} backgroundColor={ medicineSchedule && '#f1f1f1'}>
                            <TouchableOpacity onPress={()=>{navigation.navigate('DiseaseSchedule', {'dateTimeText':medicineStartDate, 'scheduleText':medicineSchedule, 'isMedicineDate':medicineTimes, 'selectCategory':medicineCheck, 'selectIdxCategory':medicineCheckIdx, 'medicineArray':medicineName, 'medicineIdxArray':medicineIdx, 'm_page':1})}} style={{paddingLeft:15, width:'100%',  height:45, justifyContent:'center'}}>
                            {
                                    medicineSchedule != '' ?
                                    <DefText text={medicineSchedule == '0' ? '매일' : medicineSchedule} style={{fontSize:16, color:'#000', fontFamily:Font.NotoSansMedium}} />
                                    :
                                    <DefText text='복약주기를 입력하세요.' style={{fontSize:16, color:'#a3a3a3', fontFamily:Font.NotoSansMedium}} />
                                }
                            </TouchableOpacity>
                        </Box>
                        <DefText text='복약일수' style={[styles.reportLabelSmall, {marginTop:10}]} />
                        <Box mt={2.5} height='45px' borderWidth={1} borderColor='#f1f1f1' borderRadius={10} backgroundColor={ medicineTimes && '#f1f1f1'}>
                            <TouchableOpacity onPress={()=>{navigation.navigate('DiseaseSchedule', {'dateTimeText':medicineStartDate, 'scheduleText':medicineSchedule, 'isMedicineDate':medicineTimes, 'selectCategory':medicineCheck, 'selectIdxCategory':medicineCheckIdx, 'medicineArray':medicineName, 'medicineIdxArray':medicineIdx, 'm_page':1})}} style={{paddingLeft:15, width:'100%',  height:45, justifyContent:'center'}}>
                                {
                                    medicineTimes != '' ?
                                    <DefText text={medicineTimes == '0' ? '계속' : medicineTimes} style={{fontSize:16, color:'#000', fontFamily:Font.NotoSansMedium}} />
                                    :
                                    <DefText text='복약일수를 입력하세요.' style={{fontSize:16, color:'#a3a3a3', fontFamily:Font.NotoSansMedium}} />
                                }
                            </TouchableOpacity>
                        </Box>
                        <DefText text='복약시간' style={[styles.reportLabelSmall, {marginTop:10}]} />
                        <Box mt={2.5} borderWidth={1} borderColor='#f1f1f1' borderRadius={10} backgroundColor={ medicineCheck && '#f1f1f1'}>
                            <TouchableOpacity onPress={()=>{navigation.navigate('DiseaseSchedule', {'dateTimeText':medicineStartDate, 'scheduleText':medicineSchedule, 'isMedicineDate':medicineTimes, 'selectCategory':medicineCheck, 'selectIdxCategory':medicineCheckIdx, 'medicineArray':medicineName, 'medicineIdxArray':medicineIdx, 'm_page':2})}} style={{paddingLeft:15, width:'100%',  justifyContent:'center', paddingVertical:10}}>
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
                                                    <DefText text={comma + item} style={{fontSize:16, color:'#000', fontFamily:Font.NotoSansMedium}}/>
                                                </Box>
                                            )
                                        })
                                        :
                                        <DefText text='언제 복약예정인지 입력하세요.' style={{fontSize:16, color:'#a3a3a3', fontFamily:Font.NotoSansMedium}} />
                                    }
                                </HStack>
                            </TouchableOpacity>
                           
                        </Box>
                        <Box mt={5}>
                            <HStack>
                                <DefText text='약' style={styles.reportLabel} />
                                <DefText text='*' style={{fontSize:18, color:'#FFC400', marginLeft:5, fontFamily:Font.NotoSansBold}} />
                            </HStack>
                            <TouchableOpacity style={{ width:'100%', marginTop:10, justifyContent:'center'}} onPress={()=>{navigation.navigate('MedicineAdd', {'dateTimeText':medicineStartDate, 'scheduleText':medicineSchedule, 'isMedicineDate':medicineTimes, 'selectCategory':medicineCheck, 'selectIdxCategory':medicineCheckIdx,'medicine':medicineName, 'medicineIdx':medicineIdx})}}>
                                <HStack alignItems='center' p={2.5} height='45px' borderWidth={1} borderColor='#f1f1f1' borderRadius={10} >
                                    <Image source={require( '../images/medicineAdd.png')} alt='의약품 추가' style={{marginRight:10}} />
                                    <DefText text='의약품 추가' style={{fontSize:16, color:'#a3a3a3', fontFamily:Font.NotoSansMedium}} />
                                </HStack>
                            </TouchableOpacity>
                            {
                                medicineName != '' &&
                                medicineName.map((item, index)=>{
                                    return(
                                        <Box key={index} height='45px' px={4} justifyContent='center' borderWidth={1} borderColor='#f1f1f1' borderRadius={10} mt={2.5} backgroundColor='#f1f1f1'>
                                            <HStack alignItems='center' justifyContent='space-between'>
                                                <DefText text={item} style={{fontSize:16, color:'#000', fontFamily:Font.NotoSansMedium}} />
                                                <TouchableOpacity onPress={ () => { medicineDataRemoves(item) }}>
                                                    <Image source={require('../images/categoryDelButton.png')} alt='항목삭제' />
                                                </TouchableOpacity>
                                            </HStack>
                                        </Box>
                                    )
                                })
                                
                            }
                           
                        </Box>
                    </Box>
                </Box>
               
            </ScrollView>
            {/* 질병추가 */}
            <Modal isOpen={diseaseModal} style={{flex:1, backgroundColor:'#fff'}}>
                <SafeAreaView style={{width:'100%', flex:1, paddingBottom:50}}>
                    <Box>
                        <HStack height='50px' alignItems='center' style={{borderBottomWidth:1, borderBottomColor:'#e3e3e3'}} >
                            <Box width={width} height={50} alignItems='center' justifyContent='center' position='absolute' top={0} left={0} >
                                <DefText text='질병 추가' style={{fontSize:20, lineHeight:24}} />
                            </Box>
                            <TouchableOpacity style={{paddingLeft:20}} onPress={()=>{setDiseaseModal(false)}}>
                                <Image source={require('../images/map_close.png')} alt='닫기' />
                            </TouchableOpacity>
                        </HStack>
                        <ScrollView>
                            <Box p={5}>
                                <DefText text='선택한 질환' style={{fontSize:16, fontFamily:Font.NotoSansMedium, color:'#696969'}} />
                                {
                                    disease ?
                                    <HStack mt={2.5}>
                                        <Box py={1} px={4} backgroundColor='#696969' borderRadius={10}>
                                            <DefText text={disease} style={{fontSize:14, color:'#fff'}} />
                                            
                                        </Box>
                                    </HStack>
                                    :
                                    <DefText text='질환을 선택하세요.' style={{fontSize:14, color:'#666', marginTop:10}} />
                                }
                                 <Box mt={5}>
                                    <HStack alignItems='center' height='50px' backgroundColor='#F1F1F1' borderRadius={5}>
                                        
                                        <Input
                                            placeholder='질병명으로 검색하세요.'
                                            height='45px'
                                            width={width-80}
                                            backgroundColor='transparent'
                                            borderWidth={0}
                                            onSubmitEditing={schButtons}
                                            value={schTextInput}
                                            onChangeText={schTextChange}
                                        />
                       
                                        <TouchableOpacity onPress={schButtons}>
                                            <Image source={require('../images/schIcons.png')} alt='검색' />
                                        </TouchableOpacity>
                                    </HStack>
                                </Box>
                                
                                    
                                {
                                    !schDisLoading ?
                                    <Box mt={ schTextInput2 && 5}>
                                        <HStack alignItems='flex-end'>
                                            <DefText text={schTextInput2 ? `${schTextInput2}의 검색결과` : ""}/>
                                        </HStack>
                                        <HStack flexWrap='wrap'>
                                            {
                                                schDisData != '' &&
                                                schDisData.map((item, index)=>{
                                                    return(
                                                        <TouchableOpacity key={index} style={[styles.disButton, disease === item.name && {backgroundColor:'#666'} ]} onPress={()=>diseaseSelectButton(item.name, item.idx)}>
                                                            <DefText text={item.name} style={[styles.disText, disease === item.name && {color:'#fff'}]} />
                                                        </TouchableOpacity>
                                                    )
                                                })
                                            }
                                        </HStack>
                                    </Box>
                                    :
                                    <Box py={5}>
                                        <ActivityIndicator size='large' color='#333' marginTop={20} marginBottom={20} />
                                    </Box>
                                }
                                    
                                
                                {
                                    emptyState &&
                                    <Box py={'40px'} alignItems={'center'} >
                                        <DefText  text='검색하신 질병정보가 없습니다.' style={{color:'#666'}}/>
                                    </Box>
                                }

                                {
                                    chrinicData != '' && 
                                    <Box mb={5}>
                                        <DefText text='만성질환' style={{fontSize:16, fontFamily:Font.NotoSansMedium, color:'#696969'}} />
                                        {
                                            chrinicData.length > 0 &&
                                            <HStack flexWrap={'wrap'}>
                                                {
                                                     chrinicData.map((item, index)=> {
                                                        return(
                                                            <TouchableOpacity key={index} style={[styles.disButton, disease == item.name && {backgroundColor:'#666'}]} onPress={()=>diseaseSelectButton(item.name, item.idx)}>
                                                                <DefText text={item.name} style={[styles.disText, disease == item.name && {color:'#fff'}]} />
                                                            </TouchableOpacity>       
                                                        )
                                                    })
                                                }
                                            </HStack>
                                        }
                                    </Box>
                                }
                                <Box mb='80px'>
                                    <HStack alignItems='flex-end'>
                                        <DefText text='연령별 주요질환' style={{fontSize:16, fontFamily:Font.NotoSansMedium, color:'#696969'}} />
                                        <DefText text={diseaseAge + '세 기준'} style={{color:'#000', marginLeft:10, fontFamily:Font.NotoSansMedium}} />
                                    </HStack>
                                    <HStack flexWrap='wrap'>
                                    {
                                        diseaseData.length>0 && 
                                        diseaseData.map((item, index)=>{
                                            return (
                                                <TouchableOpacity key={index} style={[styles.disButton, disease == item.name && {backgroundColor:'#666'}]} onPress={()=>diseaseSelectButton(item.name, item.idx)}>
                                                    <DefText text={item.name} style={[styles.disText, disease == item.name && {color:'#fff'}]} />
                                                </TouchableOpacity>
                                            )
                                        })
                                    }
                                    </HStack>
                                </Box>
                          
                               
                                
                            </Box>
                            
                        </ScrollView>
                        <Box position={'absolute'} bottom={"30px"} right={"30px"}>
                            <SaveButton onPress={diseaseDatasSave} />
                        </Box>
                    </Box>
                </SafeAreaView>
            </Modal>


            <Box position={'absolute'} bottom={"30px"} right={"30px"}>
                <SaveButton onPress={medicineAdds} />
            </Box>
        </Box>
    );
};

const styles = StyleSheet.create({
    medicineButtons : {
        backgroundColor:'#090A73',
        borderRadius:5,
        alignItems:'center',
        justifyContent:'center',
        height: 45,
    },
    medicineButtonsText: {

        color:'#fff',
        fontFamily:Font.NotoSansMedium
    },
    medicineAdds : {
        position: 'absolute',
        top:'50%',
        marginTop:-16,
        right:10
    },
    reportLabel : {
        color:'#696968',
        fontWeight:'500',
        fontFamily:Font.NotoSansMedium,
    },
    reportLabelSmall : {
        fontSize:14,
        color:'#696968'
    },
    disButton: {
        paddingVertical:5,
        paddingHorizontal:10,
        borderRadius:10,
        height:30,
        backgroundColor:'#f1f1f1',
        marginRight:5,
        marginTop:10
    },
    disText: {
        fontSize:14,
        color:'#333',
        fontWeight:'bold'
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
)(MedicineForm2);