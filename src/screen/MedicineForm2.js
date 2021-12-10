import React, { useEffect, useState } from 'react';
import { Box, VStack, HStack, Image, Modal, CheckIcon, Input } from 'native-base';
import { TouchableOpacity, ScrollView, StyleSheet, Dimensions, ImageBackground, Text, View, TouchableWithoutFeedback, SafeAreaView } from 'react-native';
import { DefText, DefInput } from '../common/BOOTSTRAP';
import HeaderMedicine from '../components/HeaderMedicine';
import HeaderComponents from '../components/HeaderComponents';
import ImagePicker from 'react-native-image-crop-picker';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { connect } from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import Api from '../Api';
import ToastMessage from '../components/ToastMessage';
import DiseaseSchedule from './DiseaseSchedule';

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
    const schTextChange = (text) => {
        setSchTextInput(text);
    }

    const [schDisLoading, setSchDisLoading] = useState(false);
    const [schDisData, setSchDisData] = useState([]);

    //질병 검색 버튼 클릭시
    const schButtons = async () => {
        if(schTextInput.length==0){
            ToastMessage('검색어를 입력하세요.');
            return false;
        }

        await setSchDisLoading(false);
        await Api.send('disease_list', {'id':userInfo.id,  'token':userInfo.appToken, 'schText':schTextInput}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                console.log('복약 스케줄 정보: ', arrItems);
               // console.log(arrItems);
                setSchDisData(arrItems);
                //setReserveList(arrItems)
            }else{
                //console.log('결과 출력 실패!', resultItem);
                ToastMessage(resultItem.message);
            }
        });
        await setSchDisLoading(true);
        //ToastMessage(schText);
    }

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





    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderComponents headerTitle='복약관리' navigation={navigation} />
            <ScrollView>
                <Box p={5} >
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
                            <DefText text='*' style={{fontSize:14, color:'#f00', marginLeft:5}} />
                        </HStack>
                        <Box mt={2.5}>
                            <Input
                                placeholder='약을 처방받은 병원명을 입력하세요.'
                                height='45px'
                                width={width-40}
                                backgroundColor='transparent'
                                _focus='transparent'
                                borderWidth={1}
                                style={{fontSize:14}}
                                value={hospitalNames}
                                onChangeText={hospitalChanges}
                            />
                        </Box>
                    </Box>
                    <Box mt={5}>
                        <HStack>
                            <DefText text='질병' style={styles.reportLabel} />
                            <DefText text='*' style={{fontSize:14, color:'#f00', marginLeft:5}} />
                        </HStack>
  
                        <Box mt={2.5} height='45px' borderWidth={1} borderColor='#ddd' borderRadius={5}>
                            <TouchableOpacity onPress={()=>{setDiseaseModal(!diseaseModal)}} style={{paddingLeft:15, width:'100%',  height:45, justifyContent:'center'}}>
                                {
                                    disease != '' ?
                                    <DefText text={disease} style={{fontSize:14, color:'#333'}} />
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
                        <DefText text='복약 시작일' style={[styles.reportLabelSmall, {marginTop:10}]} />
                        <Box mt={2.5} height='45px' borderWidth={1} borderColor='#ddd' borderRadius={5}>
                            <TouchableOpacity onPress={()=>{navigation.navigate('DiseaseSchedule', {'dateTimeText':medicineStartDate, 'scheduleText':medicineSchedule, 'isMedicineDate':medicineTimes, 'selectCategory':medicineCheck, 'selectIdxCategory':medicineCheckIdx, 'medicineArray':medicineName, 'medicineIdxArray':medicineIdx})}} style={{paddingLeft:15, width:'100%',  height:45, justifyContent:'center'}}>
                                {
                                    medicineStartDate ?
                                    <DefText text={medicineStartDate} style={{fontSize:14, color:'#333'}} />
                                    :
                                    <DefText text='복약 시작일을 입력하세요.' style={{fontSize:14, color:'#aaa'}} />
                                }
                            </TouchableOpacity>
                        </Box>

                        <DefText text='복약주기' style={[styles.reportLabelSmall, {marginTop:10}]} />
                        <Box mt={2.5} height='45px' borderWidth={1} borderColor='#ddd' borderRadius={5}>
                            <Box style={{paddingLeft:15, width:'100%',  height:45, justifyContent:'center'}}>
                                {
                                    medicineSchedule != '' ?
                                    <DefText text={medicineSchedule == '0' ? '매일' : medicineSchedule} style={{fontSize:14, color:'#333'}} />
                                    :
                                    <DefText text='복약주기를 입력하세요.' style={{fontSize:14, color:'#aaa'}} />
                                }
                            </Box>
                        </Box>
                        <DefText text='복약일수' style={[styles.reportLabelSmall, {marginTop:10}]} />
                        <Box mt={2.5} height='45px' borderWidth={1} borderColor='#ddd' borderRadius={5}>
                            <Box style={{paddingLeft:15, width:'100%',  height:45, justifyContent:'center'}}>
                                {
                                    medicineTimes != '' ?
                                    <DefText text={medicineTimes == '0' ? '계속' : medicineTimes} style={{fontSize:14, color:'#333'}} />
                                    :
                                    <DefText text='복약일수를 입력하세요.' style={{fontSize:14, color:'#aaa'}} />
                                }
                            </Box>
                        </Box>
                        <DefText text='복약시간' style={[styles.reportLabelSmall, {marginTop:10}]} />
                        <Box mt={2.5} height='45px' borderWidth={1} borderColor='#ddd' borderRadius={5}>
                            <Box style={{paddingLeft:15, width:'100%',  height:45, justifyContent:'center'}}>
                                <HStack>
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
                                                <DefText text={comma + item} />
                                            </Box>
                                        )
                                    })
                                    :
                                    <DefText text='언제 복약예정인지 입력하세요.' style={{fontSize:14, color:'#aaa'}} />
                                }
                                </HStack>
                            </Box>
                        </Box>
                        <Box mt={5}>
                            <HStack>
                                <DefText text='약' style={styles.reportLabel} />
                                <DefText text='*' style={{fontSize:14, color:'#f00', marginLeft:5}} />
                            </HStack>
                            <TouchableOpacity style={{ width:'100%', marginTop:10, justifyContent:'center'}} onPress={()=>{navigation.navigate('MedicineAdd', {'dateTimeText':medicineStartDate, 'scheduleText':medicineSchedule, 'isMedicineDate':medicineTimes, 'selectCategory':medicineCheck, 'selectIdxCategory':medicineCheckIdx,'medicine':medicineName, 'medicineIdx':medicineIdx})}}>
                                <HStack alignItems='center' p={2.5} height='45px' borderWidth={1} borderColor='#ddd' borderRadius={5} >
                                    <Image source={require( '../images/medicineAdd.png')} alt='의약품 추가' style={{marginRight:10}} />
                                    <DefText text='의약품 추가' style={{color:'#333'}} />
                                </HStack>
                            </TouchableOpacity>
                            {
                                medicineName != '' &&
                                medicineName.map((item, index)=>{
                                    return(
                                        <Box key={index} height='45px' px={4} justifyContent='center' borderWidth={1} borderColor='#ddd' borderRadius={5} mt={2.5}>
                                            <HStack alignItems='center' justifyContent='space-between'>
                                                <DefText text={item} style={{fontSize:14, color:'#333'}} />
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
                                <DefText text='선택한 질환' />
                                {
                                    disease ?
                                    <HStack mt={2.5}>
                                        <Box py={1} px={4} backgroundColor='#696968' borderRadius={4}>
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
                                {   //콜레라
                                    schDisData.length > 0 && 
                                    <Box mt={5}>
                                        <HStack alignItems='flex-end'>
                                            <DefText text={schTextInput + '의 질병 검색결과'}/>
                                        </HStack>
                                        <HStack flexWrap='wrap'>
                                            {
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
                                }
                                {
                                    schDisData.length == 0 && 
                                    <Box mt={5}>
                                        <HStack alignItems='flex-end'>
                                            <DefText text='연령별 주요질환' />
                                            <DefText text={diseaseAge + '세 기준'} style={{fontSize:13,color:'#999', marginLeft:10}} />
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
                                }
                               
                                <Box mt={5} >
                                    <TouchableOpacity onPress={diseaseDatasSave} style={styles.medicineButtons}>
                                        <DefText text='저장' style={styles.medicineButtonsText} />
                                    </TouchableOpacity>
                                </Box>
                            </Box>
                            
                        </ScrollView>
                       
                    </Box>
                </SafeAreaView>
            </Modal>


            <Box p={2.5}>
                <TouchableOpacity onPress={medicineAdds} style={styles.medicineButtons}>
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